// UpdateParamsApp.cs — Revit Design Automation add-in
// The addin opens the BIM360/ACC cloud model directly using ConvertCloudGUIDsToCloudPath.
// DA establishes Revit Cloud Model (RCW) auth context via the adsk3LeggedToken workitem
// argument (plain string) — NOT via ADSK_3LEGGED_TOKEN env var injection.
//
// WorkItem arguments:
//   params           → params.json  { "projectGuid": "...", "modelGuid": "...", "changes": [...] }
//   adsk3LeggedToken → 3-legged user token (plain string; DA uses internally for RCW auth context)

using Autodesk.Revit.ApplicationServices;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Events;
using DesignAutomationFramework;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;

namespace UpdateParams
{
    public class ParamChange
    {
        [JsonProperty("elementId")]
        public string revitId   { get; set; }  // mapped from JSON field 'elementId'
        public string paramName { get; set; }
        public string newValue  { get; set; }
    }

    public class ParamInput
    {
        public string projectGuid   { get; set; }
        public string modelGuid     { get; set; }
        public string region        { get; set; }  // "US" or "EU" (EMEA)
        public string token         { get; set; }  // 3-legged token; set as ADSK_3LEGGED_TOKEN
        public string sourceFileName { get; set; } // e.g. "FH_Stavba.rvt" — used to pick the right file from a composite ZIP
        public List<ParamChange> changes { get; set; }
    }

    public class UpdateParamsApp : IExternalDBApplication
    {
        public ExternalDBApplicationResult OnStartup(ControlledApplication app)
        {
            DesignAutomationBridge.DesignAutomationReadyEvent += HandleDesignAutomationReady;
            return ExternalDBApplicationResult.Succeeded;
        }

        public ExternalDBApplicationResult OnShutdown(ControlledApplication app)
            => ExternalDBApplicationResult.Succeeded;

        private void OnFailuresProcessing(object sender, FailuresProcessingEventArgs e)
        {
            var fa = e.GetFailuresAccessor();
            foreach (var msg in fa.GetFailureMessages())
            {
                if (msg.GetSeverity() == FailureSeverity.Warning)
                    fa.DeleteWarning(msg);
                else
                    fa.ResolveFailure(msg);
            }
            e.SetProcessingResult(FailureProcessingResult.Continue);
        }

        private void HandleDesignAutomationReady(object sender, DesignAutomationReadyEventArgs e)
        {

            LogTrace("Design Automation ready — starting parameter update.");
            e.Succeeded = true;
            try
            {
                RunUpdate(e.DesignAutomationData);
            }
            catch (Exception ex)
            {
                LogTrace("FATAL [" + ex.GetType().FullName + "]: " + ex.Message);
                LogTrace("Stack: " + ex.StackTrace);
                if (ex.InnerException != null)
                    LogTrace("Inner: [" + ex.InnerException.GetType().FullName + "] " + ex.InnerException.Message);
                e.Succeeded = false;
            }
        }

        private void RunUpdate(DesignAutomationData data)
        {
            if (data?.RevitApp == null) throw new InvalidOperationException("RevitApp is null.");

            // Read params.json (must contain projectGuid, modelGuid, and changes)
            string paramsJsonPath = Path.Combine(Directory.GetCurrentDirectory(), "params.json");
            if (!File.Exists(paramsJsonPath))
                throw new FileNotFoundException("params.json not found at " + paramsJsonPath);

            var input = JsonConvert.DeserializeObject<ParamInput>(File.ReadAllText(paramsJsonPath));
            if (input?.changes == null || input.changes.Count == 0)
                throw new InvalidOperationException("params.json contains no changes.");
            if (string.IsNullOrEmpty(input.projectGuid))
                throw new InvalidOperationException("params.json missing 'projectGuid'.");
            if (string.IsNullOrEmpty(input.modelGuid))
                throw new InvalidOperationException("params.json missing 'modelGuid'.");

            // Register failure handler before opening the model
            data.RevitApp.FailuresProcessing += OnFailuresProcessing;

            // Detect mode: if input.rvt was provided by DA (single-user cloud model download/upload
            // workflow), open it as a local file.  Otherwise fall back to the cloud model path
            // (workshared C4R model — requires adsk3LeggedToken + projectGuid/modelGuid in params).
            string inputRvtPath = Path.Combine(Directory.GetCurrentDirectory(), "input.rvt");
            bool isLocalFileMode = File.Exists(inputRvtPath);

            Document doc;
            if (isLocalFileMode)
            {
                LogTrace($"Local-file mode — opening input.rvt from: {inputRvtPath}");

                // ACC stores single-user Revit models as ZIP archives in OSS.
                // Detect by magic bytes PK\x03\x04, extract, and find the inner .rvt.
                if (IsZipFile(inputRvtPath))
                {
                    LogTrace("input.rvt is a ZIP archive — extracting inner .rvt...");
                    string extractDir = Path.Combine(Directory.GetCurrentDirectory(), "input_extracted");
                    if (Directory.Exists(extractDir)) Directory.Delete(extractDir, true);
                    ZipFile.ExtractToDirectory(inputRvtPath, extractDir);
                    string[] rvtFiles = Directory.GetFiles(extractDir, "*.rvt", SearchOption.AllDirectories);
                    if (rvtFiles.Length == 0)
                        throw new InvalidOperationException("No .rvt file found inside input ZIP archive.");
                    LogTrace($"ZIP contains {rvtFiles.Length} .rvt file(s): {string.Join(", ", Array.ConvertAll(rvtFiles, Path.GetFileName))}");
                    if (!string.IsNullOrEmpty(input.sourceFileName))
                    {
                        var target = System.Array.Find(rvtFiles, f =>
                            string.Equals(Path.GetFileName(f), input.sourceFileName, StringComparison.OrdinalIgnoreCase));
                        if (target != null)
                        {
                            inputRvtPath = target;
                            LogTrace($"Composite ZIP: selected '{input.sourceFileName}' as target .rvt.");
                        }
                        else
                        {
                            inputRvtPath = rvtFiles[0];
                            LogTrace($"WARNING: '{input.sourceFileName}' not found in ZIP — falling back to first file.");
                        }
                    }
                    else
                    {
                        inputRvtPath = rvtFiles[0];
                    }
                    LogTrace($"Extracted .rvt path: {inputRvtPath}");
                }

                // Use OpenOptions with DetachFromCentral to avoid cloud-server connection attempts
                // (file was downloaded from ACC so it may contain cloud model metadata).
                var openOpts = new OpenOptions
                {
                    DetachFromCentralOption = DetachFromCentralOption.DetachAndDiscardWorksets,
                    AllowOpeningLocalByWrongUser = true
                };
                var filePath = ModelPathUtils.ConvertUserVisiblePathToModelPath(inputRvtPath);
                doc = data.RevitApp.OpenDocumentFile(filePath, openOpts);
                if (doc == null) throw new InvalidOperationException("OpenDocumentFile returned null for input.rvt");
                LogTrace($"Opened input.rvt successfully (workshared={doc.IsWorkshared}).");
            }
            else
            {
                // Cloud model mode: open via cloud GUIDs.
                // ModelPathUtils.CloudRegionUS = "PROD" (NOT "US") — must use the SDK constants.
                var cloudRegion = (input.region == "EMEA" || input.region == "EU")
                    ? ModelPathUtils.CloudRegionEMEA
                    : ModelPathUtils.CloudRegionUS;
                var projectGuidObj = new Guid(input.projectGuid);
                var modelGuidObj   = new Guid(input.modelGuid);

                // Diagnostic: check ADSK_3LEGGED_TOKEN env var
                var adskToken = System.Environment.GetEnvironmentVariable("ADSK_3LEGGED_TOKEN");
                LogTrace($"ADSK_3LEGGED_TOKEN present: {!string.IsNullOrEmpty(adskToken)}, length: {adskToken?.Length ?? 0}");

                // If DA engine did not inject ADSK_3LEGGED_TOKEN, fall back to token from params.json
                if (string.IsNullOrEmpty(adskToken) && !string.IsNullOrEmpty(input.token))
                {
                    System.Environment.SetEnvironmentVariable("ADSK_3LEGGED_TOKEN", input.token);
                    adskToken = input.token;
                    LogTrace($"ADSK_3LEGGED_TOKEN set from params.json token (length: {adskToken.Length})");
                }
                LogTrace($"CloudRegionUS constant value: '{ModelPathUtils.CloudRegionUS}', CloudRegionEMEA: '{ModelPathUtils.CloudRegionEMEA}'");
                LogTrace($"Cloud model mode — region={cloudRegion}, projectGuid={input.projectGuid}, modelGuid={input.modelGuid}");

                // ── Network connectivity diagnostic ──────────────────────────────────────────────
                System.Net.ServicePointManager.SecurityProtocol =
                    System.Net.SecurityProtocolType.Tls12 | System.Net.SecurityProtocolType.Tls13;
                try
                {
                    using (var wc = new System.Net.WebClient())
                    {
                        wc.Headers["Authorization"] = $"Bearer {adskToken}";
                        wc.Headers["User-Agent"]    = "AEC-DM-UpdateParams/21";
                        var hubsJson = wc.DownloadString("https://developer.api.autodesk.com/project/v1/hubs");
                        LogTrace($"Network/Auth diagnostic: GET /project/v1/hubs OK (length={hubsJson.Length})");
                    }
                }
                catch (Exception netEx)
                {
                    LogTrace($"Network/Auth diagnostic FAILED: [{netEx.GetType().Name}] {netEx.Message}");
                }

                ModelPath cloudPath;
                try
                {
                    cloudPath = ModelPathUtils.ConvertCloudGUIDsToCloudPath(cloudRegion, projectGuidObj, modelGuidObj);
                    LogTrace("ConvertCloudGUIDsToCloudPath succeeded.");
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException(
                        $"ConvertCloudGUIDsToCloudPath failed (region='{cloudRegion}'): [{ex.GetType().Name}] {ex.Message}", ex);
                }
                var openOptions = new OpenOptions
                {
                    DetachFromCentralOption = DetachFromCentralOption.DoNotDetach
                };
                doc = data.RevitApp.OpenDocumentFile(cloudPath, openOptions);
                if (doc == null) throw new InvalidOperationException("OpenDocumentFile returned null — cloud model could not be opened.");
            }

            // Apply parameter changes
            LogTrace($"Applying {input.changes.Count} parameter change(s)...");
            int applied = 0, skipped = 0;

            using (var tx = new Transaction(doc, "AEC DM — Update Parameters"))
            {
                tx.Start();
                foreach (var change in input.changes)
                {
                    if (!int.TryParse(change.revitId, out int idInt))
                    {
                        LogTrace($"  SKIP: invalid revitId '{change.revitId}'");
                        skipped++;
                        continue;
                    }

                    var element = doc.GetElement(new ElementId(idInt));
                    if (element == null)
                    {
                        LogTrace($"  SKIP: element {change.revitId} not found.");
                        skipped++;
                        continue;
                    }

                    var param = element.LookupParameter(change.paramName);
                    if (param == null)
                    {
                        LogTrace($"  SKIP: parameter '{change.paramName}' not found on element {change.revitId}.");
                        skipped++;
                        continue;
                    }

                    if (param.IsReadOnly)
                    {
                        LogTrace($"  SKIP: parameter '{change.paramName}' is read-only on element {change.revitId}.");
                        skipped++;
                        continue;
                    }

                    try
                    {
                        if (param.StorageType == StorageType.Double)
                        {
                            if (double.TryParse(change.newValue, System.Globalization.NumberStyles.Any,
                                System.Globalization.CultureInfo.InvariantCulture, out double dVal))
                                param.Set(dVal);
                            else
                                throw new InvalidOperationException($"Cannot parse '{change.newValue}' as a number.");
                        }
                        else if (param.StorageType == StorageType.Integer)
                        {
                            if (int.TryParse(change.newValue, out int iVal))
                                param.Set(iVal);
                            else
                                throw new InvalidOperationException($"Cannot parse '{change.newValue}' as an integer.");
                        }
                        else
                        {
                            param.Set(change.newValue);
                        }

                        LogTrace($"  OK: element {change.revitId} — '{change.paramName}' = '{change.newValue}'");
                        applied++;
                    }
                    catch (Exception ex)
                    {
                        LogTrace($"  ERROR: element {change.revitId} — '{change.paramName}': {ex.Message}");
                        skipped++;
                    }
                }
                tx.Commit();
            }

            LogTrace($"Done: {applied} applied, {skipped} skipped.");

            // Save changes back — mode depends on how the model was opened.
            if (isLocalFileMode)
            {
                // Download/upload workflow: save modified file to output.rvt so DA can upload it.
                string outputPath = Path.Combine(Directory.GetCurrentDirectory(), "output.rvt");
                LogTrace($"Saving to output.rvt: {outputPath}");
                doc.SaveAs(outputPath);
                LogTrace("Saved output.rvt successfully.");
            }
            else if (doc.IsWorkshared)
            {
                LogTrace("Synchronizing with central (workshared cloud model)...");
                var swcOpts = new SynchronizeWithCentralOptions();
                swcOpts.SetRelinquishOptions(new RelinquishOptions(true));
                swcOpts.Comment = "AEC DM — Automated parameter update";
                doc.SynchronizeWithCentral(new TransactWithCentralOptions(), swcOpts);
                LogTrace("Synchronized with central successfully.");
            }
            else
            {
                LogTrace("Saving single-user cloud model...");
                doc.SaveCloudModel();
                LogTrace("Saved cloud model successfully.");
            }
        }

        private static void LogTrace(string msg) => Console.WriteLine("[UpdateParams] " + msg);

        private static bool IsZipFile(string path)
        {
            if (!File.Exists(path)) return false;
            var magic = new byte[4];
            using (var fs = File.OpenRead(path)) { fs.Read(magic, 0, 4); }
            return magic[0] == 0x50 && magic[1] == 0x4B && magic[2] == 0x03 && magic[3] == 0x04;
        }
    }
}
