param()

$clientId     = "P2NZ27MFnq8SDruej5JBA5fFCb51nLTrR0fkPIS3YmoiBfAd"
$clientSecret = "WnN6iqUzkSbq69MA61dvYOfH65LC63MNEd0wUFEGgtjb3Mzd17ELNFNyxb7Xukj3"
$DA            = "https://developer.api.autodesk.com/da/us-east/v3"
$nick          = "P2NZ27MFnq8SDruej5JBA5fFCb51nLTrR0fkPIS3YmoiBfAd"
$bundleName    = "UpdateParams_1778499147"
$zipPath       = "c:\MCPServer\AEC Data Model\DesignAutomation\UpdateParams\UpdateParamsBundle.zip"
$engine        = "Autodesk.Revit+2026"

Write-Host "=== Deploy Bundle ==="

# 1. Get 2-legged token
$tok = (Invoke-RestMethod -Method Post `
    -Uri "https://developer.api.autodesk.com/authentication/v2/token" `
    -ContentType "application/x-www-form-urlencoded" `
    -Body "grant_type=client_credentials&scope=code%3Aall&client_id=$clientId&client_secret=$clientSecret").access_token
Write-Host "Token: $($tok.Substring(0,30))..."

$hdrs = @{ Authorization="Bearer $tok"; "Content-Type"="application/json" }

# 2. Check current bundle
try {
    $alias = Invoke-RestMethod -Uri "$DA/appbundles/$nick.${bundleName}+prod" -Headers $hdrs
    Write-Host "Current bundle: v$($alias.version) engine=$($alias.engine)"
} catch {
    Write-Host "No existing bundle alias: $($_.Exception.Message)"
}

# 3. Create new bundle version
Write-Host "Creating new bundle version (engine=$engine)..."
$newVerBody = @{ engine=$engine; description="sourceFileName fix" } | ConvertTo-Json
$newVer = Invoke-RestMethod -Uri "$DA/appbundles/$bundleName/versions" -Method Post -Headers $hdrs -Body $newVerBody
Write-Host "New bundle version: v$($newVer.version)"

# 4. Upload the ZIP via multipart form
Write-Host "Uploading bundle zip..."
$up = $newVer.uploadParameters
$boundary = [System.Guid]::NewGuid().ToString()
$body = [System.IO.MemoryStream]::new()
$writer = [System.IO.StreamWriter]::new($body)

# Write form fields
foreach ($kv in $up.formData.PSObject.Properties) {
    $writer.Write("--$boundary`r`n")
    $writer.Write("Content-Disposition: form-data; name=`"$($kv.Name)`"`r`n`r`n")
    $writer.Write("$($kv.Value)`r`n")
}

# Write file field
$fileBytes = [System.IO.File]::ReadAllBytes($zipPath)
$writer.Write("--$boundary`r`n")
$writer.Write("Content-Disposition: form-data; name=`"file`"; filename=`"UpdateParamsBundle.zip`"`r`n")
$writer.Write("Content-Type: application/octet-stream`r`n`r`n")
$writer.Flush()
$body.Write($fileBytes, 0, $fileBytes.Length)
$writer.Write("`r`n--$boundary--`r`n")
$writer.Flush()

$bodyBytes = $body.ToArray()

$uploadResp = Invoke-RestMethod -Uri $up.endpointURL -Method Post `
    -ContentType "multipart/form-data; boundary=$boundary" `
    -Body $bodyBytes
Write-Host "Upload response: $uploadResp"

# 5. Update prod alias to new version
Write-Host "Updating prod alias to v$($newVer.version)..."
$patchBody = @{ version=$newVer.version } | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$DA/appbundles/$bundleName/aliases/prod" -Method Patch -Headers $hdrs -Body $patchBody
    Write-Host "Alias patched to v$($newVer.version)"
} catch {
    Write-Host "Patch failed, trying POST: $($_.Exception.Message)"
    $postBody = @{ id="prod"; version=$newVer.version } | ConvertTo-Json
    Invoke-RestMethod -Uri "$DA/appbundles/$bundleName/aliases" -Method Post -Headers $hdrs -Body $postBody
    Write-Host "Alias created at v$($newVer.version)"
}

# 6. Verify
$aliasAfter = Invoke-RestMethod -Uri "$DA/appbundles/$nick.${bundleName}+prod" -Headers $hdrs
Write-Host "=== DONE === Bundle prod alias now: v$($aliasAfter.version) engine=$($aliasAfter.engine)"
