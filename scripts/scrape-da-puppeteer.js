/**
 * Design Automation API Documentation Scraper — Puppeteer edition
 * Uses local headless Chrome to render JS pages — no rate limits, no external service.
 *
 * Usage:
 *   node scripts/scrape-da-puppeteer.js           # fresh run
 *   node scripts/scrape-da-puppeteer.js --resume  # continue after interruption
 *
 * After completion:
 *   node scripts/clean-docs.js --file "API Documentation/DesignAutomation-API.md"
 *
 * Output: API Documentation/DesignAutomation-API.md
 */

'use strict';

const puppeteer = require('puppeteer');
const TurndownService = require('turndown');
const fs = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────

const OUTPUT_FILE = path.join(__dirname, '..', 'API Documentation', 'DesignAutomation-API.md');
const RESUME      = process.argv.includes('--resume');
/** ms to wait after navigation before extracting — gives React time to hydrate */
const SETTLE_MS   = 2500;

const BASE = 'https://aps.autodesk.com/en/docs/design-automation/v3';

const PAGES = [
  // ── Developer's Guide ────────────────────────────────────────────────────
  { section: "Developer's Guide", title: 'Overview',                                     url: `${BASE}/developers_guide/overview` },
  { section: "Developer's Guide", title: 'API Basics',                                   url: `${BASE}/developers_guide/basics` },
  { section: "Developer's Guide", title: 'Field Guide',                                  url: `${BASE}/developers_guide/field-guide` },
  { section: "Developer's Guide", title: 'Rate Limits and Quotas',                       url: `${BASE}/developers_guide/rate-limits` },
  { section: "Developer's Guide", title: 'APS Rate Limits and Quotas',                   url: `${BASE}/developers_guide/rate-limits/forge-rate-limits` },
  { section: "Developer's Guide", title: 'Automation API Rate Limits',                   url: `${BASE}/developers_guide/rate-limits/da-rate-limits` },
  { section: "Developer's Guide", title: 'Restrictions',                                 url: `${BASE}/developers_guide/restrictions` },
  { section: "Developer's Guide", title: 'Aliases and IDs',                              url: `${BASE}/developers_guide/aliases-and-ids` },
  { section: "Developer's Guide", title: 'Callbacks',                                    url: `${BASE}/developers_guide/callbacks` },
  { section: "Developer's Guide", title: 'WebSockets for When Callbacks Aren\'t an Option', url: `${BASE}/developers_guide/websocket-api` },
  { section: "Developer's Guide", title: 'Using 3-legged OAuth Tokens',                  url: `${BASE}/developers_guide/3-legged-oauth-token-usage` },
  { section: "Developer's Guide", title: 'Engine Lifecycle Policy',                      url: `${BASE}/developers_guide/engine-lifecycle` },
  { section: "Developer's Guide", title: 'Reference Downloading',                        url: `${BASE}/developers_guide/reference-downloading` },
  { section: "Developer's Guide", title: 'Revit Specific Info',                          url: `${BASE}/developers_guide/revit_specific` },
  { section: "Developer's Guide", title: 'Handling Revit Failures',                      url: `${BASE}/developers_guide/revit_specific/handling-failures` },
  { section: "Developer's Guide", title: 'Custom Fonts Support',                         url: `${BASE}/developers_guide/revit_specific/custom-fonts-support` },
  { section: "Developer's Guide", title: 'Revit Cloud Model Integration',                url: `${BASE}/developers_guide/revit_specific/revit-cloud-model-integration` },
  { section: "Developer's Guide", title: 'Inventor Specific Info',                       url: `${BASE}/developers_guide/inventor_specific` },
  { section: "Developer's Guide", title: 'iLogic Logging',                               url: `${BASE}/developers_guide/inventor_specific/ilogic-logging` },
  { section: "Developer's Guide", title: 'Fusion Specific Info',                         url: `${BASE}/developers_guide/fusion_specific` },
  { section: "Developer's Guide", title: 'Fusion – TypeScript',                          url: `${BASE}/developers_guide/fusion_specific/typescript` },
  { section: "Developer's Guide", title: 'Fusion – Arguments',                           url: `${BASE}/developers_guide/fusion_specific/arguments` },
  { section: "Developer's Guide", title: 'Fusion Team Integration',                      url: `${BASE}/developers_guide/fusion_specific/fusion-team-integration` },
  { section: "Developer's Guide", title: 'Fusion – Callbacks',                           url: `${BASE}/developers_guide/fusion_specific/callbacks` },
  { section: "Developer's Guide", title: 'FAQs',                                         url: `${BASE}/developers_guide/faqs` },
  { section: "Developer's Guide", title: 'Troubleshooting',                              url: `${BASE}/developers_guide/troubleshooting` },

  // ── How-to Guide – Execute a 3ds Max MaxScript ───────────────────────────
  { section: 'How-to Guide – 3ds Max', title: 'Execute a 3ds Max MaxScript',             url: `${BASE}/tutorials/3dsmax` },
  { section: 'How-to Guide – 3ds Max', title: '3ds Max – About this Walkthrough',        url: `${BASE}/tutorials/3dsmax/about_tutorial` },
  { section: 'How-to Guide – 3ds Max', title: '3ds Max – Task 1: Obtain an Access Token',url: `${BASE}/tutorials/3dsmax/task1-authenticate` },
  { section: 'How-to Guide – 3ds Max', title: '3ds Max – Task 2: Create a Nickname',     url: `${BASE}/tutorials/3dsmax/task2-create-nickname` },
  { section: 'How-to Guide – 3ds Max', title: '3ds Max – Task 3: Publish an Activity',   url: `${BASE}/tutorials/3dsmax/task3-create-activity` },
  { section: 'How-to Guide – 3ds Max', title: '3ds Max – Task 4: Prepare Cloud Storage', url: `${BASE}/tutorials/3dsmax/task4-manage-cloud-storage` },
  { section: 'How-to Guide – 3ds Max', title: '3ds Max – Task 5: Submit a WorkItem',     url: `${BASE}/tutorials/3dsmax/task5-submit-workitem` },
  { section: 'How-to Guide – 3ds Max', title: '3ds Max – Task 6: Download the Results',  url: `${BASE}/tutorials/3dsmax/task6-download-results` },

  // ── How-to Guide – Execute an AutoCAD Plug-in ────────────────────────────
  { section: 'How-to Guide – AutoCAD', title: 'Execute an AutoCAD Plug-in',                   url: `${BASE}/tutorials/autocad` },
  { section: 'How-to Guide – AutoCAD', title: 'AutoCAD – About this Walkthrough',             url: `${BASE}/tutorials/autocad/about_this_tutorial` },
  { section: 'How-to Guide – AutoCAD', title: 'AutoCAD – Task 1: Obtain an Access Token',     url: `${BASE}/tutorials/autocad/task1-authenticate` },
  { section: 'How-to Guide – AutoCAD', title: 'AutoCAD – Task 2: Create a Nickname',          url: `${BASE}/tutorials/autocad/task2-create-nickname` },
  { section: 'How-to Guide – AutoCAD', title: 'AutoCAD – Task 3: Upload an AppBundle',        url: `${BASE}/tutorials/autocad/task3-upload-appbundle` },
  { section: 'How-to Guide – AutoCAD', title: 'AutoCAD – Task 4: Publish an Activity',        url: `${BASE}/tutorials/autocad/task4-publish-activity` },
  { section: 'How-to Guide – AutoCAD', title: 'AutoCAD – Task 5: Prepare Cloud Storage',      url: `${BASE}/tutorials/autocad/task5-prepare_cloud_storage` },
  { section: 'How-to Guide – AutoCAD', title: 'AutoCAD – Task 6: Submit a WorkItem',          url: `${BASE}/tutorials/autocad/task6-post-workitem` },
  { section: 'How-to Guide – AutoCAD', title: 'AutoCAD – Task 7: Download the Results',       url: `${BASE}/tutorials/autocad/task7-download-results` },

  // ── How-to Guide – Execute an Inventor Add-in ────────────────────────────
  { section: 'How-to Guide – Inventor', title: 'Execute an Inventor Add-in',                  url: `${BASE}/tutorials/inventor` },
  { section: 'How-to Guide – Inventor', title: 'Inventor – About this Walkthrough',           url: `${BASE}/tutorials/inventor/about-this-tutorial` },
  { section: 'How-to Guide – Inventor', title: 'Inventor – Task 1: Obtain an Access Token',   url: `${BASE}/tutorials/inventor/task1-authenticate` },
  { section: 'How-to Guide – Inventor', title: 'Inventor – Task 2: Create a Nickname',        url: `${BASE}/tutorials/inventor/task2-create-nickname` },
  { section: 'How-to Guide – Inventor', title: 'Inventor – Task 3: Upload an AppBundle',      url: `${BASE}/tutorials/inventor/task3-upload-appbundle` },
  { section: 'How-to Guide – Inventor', title: 'Inventor – Task 4: Publish an Activity',      url: `${BASE}/tutorials/inventor/task4-publish-activity` },
  { section: 'How-to Guide – Inventor', title: 'Inventor – Task 5: Prepare Cloud Storage',    url: `${BASE}/tutorials/inventor/task5-prepare_cloud_storage` },
  { section: 'How-to Guide – Inventor', title: 'Inventor – Task 6: Submit a WorkItem',        url: `${BASE}/tutorials/inventor/task6-post-workitem` },
  { section: 'How-to Guide – Inventor', title: 'Inventor – Task 7: Download the Results',     url: `${BASE}/tutorials/inventor/task7-download-results` },

  // ── How-to Guide – Execute a Revit Add-in ────────────────────────────────
  { section: 'How-to Guide – Revit', title: 'Execute a Revit Add-in',                         url: `${BASE}/tutorials/revit` },
  { section: 'How-to Guide – Revit', title: 'Revit – About this Walkthrough',                 url: `${BASE}/tutorials/revit/about_this_tutorial` },
  { section: 'How-to Guide – Revit', title: 'Revit – Task 1: Convert Revit Add-in',           url: `${BASE}/tutorials/revit/step1-convert-addin` },
  { section: 'How-to Guide – Revit', title: 'Revit – Task 2: Obtain an Access Token',         url: `${BASE}/tutorials/revit/step2-create-forge-app` },
  { section: 'How-to Guide – Revit', title: 'Revit – Task 3: Create a Nickname',              url: `${BASE}/tutorials/revit/step3-create-nickname` },
  { section: 'How-to Guide – Revit', title: 'Revit – Task 4: Upload an AppBundle',            url: `${BASE}/tutorials/revit/step4-publish-appbundle` },
  { section: 'How-to Guide – Revit', title: 'Revit – Task 5: Publish an Activity',            url: `${BASE}/tutorials/revit/step5-publish-activity` },
  { section: 'How-to Guide – Revit', title: 'Revit – Task 6: Prepare Cloud Storage',          url: `${BASE}/tutorials/revit/step6-prepare-cloud-storage` },
  { section: 'How-to Guide – Revit', title: 'Revit – Task 7: Submit a WorkItem',              url: `${BASE}/tutorials/revit/step7-post-workitem` },
  { section: 'How-to Guide – Revit', title: 'Revit – Task 8: Download the Results',           url: `${BASE}/tutorials/revit/step8-download-results` },

  // ── How-to Guide – Execute a Fusion Script ───────────────────────────────
  { section: 'How-to Guide – Fusion', title: 'Execute a Fusion Script',                       url: `${BASE}/tutorials/fusion` },
  { section: 'How-to Guide – Fusion', title: 'Fusion – About this Walkthrough',               url: `${BASE}/tutorials/fusion/about-this-tutorial` },
  { section: 'How-to Guide – Fusion', title: 'Fusion – Task 1: Obtain an Access Token',       url: `${BASE}/tutorials/fusion/task1-authenticate` },
  { section: 'How-to Guide – Fusion', title: 'Fusion – Task 2: Create a Nickname',            url: `${BASE}/tutorials/fusion/task2-create-nickname` },
  { section: 'How-to Guide – Fusion', title: 'Fusion – Task 3: Upload an AppBundle',          url: `${BASE}/tutorials/fusion/task3-upload-appbundle` },
  { section: 'How-to Guide – Fusion', title: 'Fusion – Task 4: Publish an Activity',          url: `${BASE}/tutorials/fusion/task4-publish-activity` },
  { section: 'How-to Guide – Fusion', title: 'Fusion – Task 5: Submit a WorkItem',            url: `${BASE}/tutorials/fusion/task5-post-workitem` },
  { section: 'How-to Guide – Fusion', title: 'Fusion – Task 6: Open Result in Fusion',        url: `${BASE}/tutorials/fusion/task6-open-result-in-fusion` },

  // ── How-to Guide – Advanced ───────────────────────────────────────────────
  { section: 'How-to Guide – Advanced', title: 'Use OnDemand Input',                          url: `${BASE}/tutorials/common/using-on-demand-inputs` },

  // ── Code Samples & Blog Posts ─────────────────────────────────────────────
  { section: 'Code Samples', title: 'Code Samples',  url: `${BASE}/code_samples/code_samples` },
  { section: 'Code Samples', title: 'Blog Posts',    url: `${BASE}/code_samples/additional_resources` },

  // ── Reference – REST API ──────────────────────────────────────────────────
  { section: 'Reference – REST API', title: 'REST API Reference',                             url: `${BASE}/reference/http` },

  // Activities
  { section: 'Reference – REST API', title: 'GET activities',                                 url: `${BASE}/reference/http/activities-GET` },
  { section: 'Reference – REST API', title: 'POST activities',                                url: `${BASE}/reference/http/activities-POST` },
  { section: 'Reference – REST API', title: 'DELETE activities/:id/aliases/:aliasId',         url: `${BASE}/reference/http/activities-id-aliases-aliasId-DELETE` },
  { section: 'Reference – REST API', title: 'GET activities/:id/aliases/:aliasId',            url: `${BASE}/reference/http/activities-id-aliases-aliasId-GET` },
  { section: 'Reference – REST API', title: 'PATCH activities/:id/aliases/:aliasId',          url: `${BASE}/reference/http/activities-id-aliases-aliasId-PATCH` },
  { section: 'Reference – REST API', title: 'GET activities/:id/aliases',                     url: `${BASE}/reference/http/activities-id-aliases-GET` },
  { section: 'Reference – REST API', title: 'POST activities/:id/aliases',                    url: `${BASE}/reference/http/activities-id-aliases-POST` },
  { section: 'Reference – REST API', title: 'DELETE activities/:id',                          url: `${BASE}/reference/http/activities-id-DELETE` },
  { section: 'Reference – REST API', title: 'GET activities/:id',                             url: `${BASE}/reference/http/activities-id-GET` },
  { section: 'Reference – REST API', title: 'GET activities/:id/versions',                    url: `${BASE}/reference/http/activities-id-versions-GET` },
  { section: 'Reference – REST API', title: 'POST activities/:id/versions',                   url: `${BASE}/reference/http/activities-id-versions-POST` },
  { section: 'Reference – REST API', title: 'GET activities/:id/versions/:version',           url: `${BASE}/reference/http/activities-id-versions-version-GET` },
  { section: 'Reference – REST API', title: 'DELETE activities/:id/versions/:version',        url: `${BASE}/reference/http/activities-id-versions-version-DELETE` },

  // AppBundles
  { section: 'Reference – REST API', title: 'GET appbundles',                                 url: `${BASE}/reference/http/appbundles-GET` },
  { section: 'Reference – REST API', title: 'POST appbundles',                                url: `${BASE}/reference/http/appbundles-POST` },
  { section: 'Reference – REST API', title: 'DELETE appbundles/:id/aliases/:aliasId',         url: `${BASE}/reference/http/appbundles-id-aliases-aliasId-DELETE` },
  { section: 'Reference – REST API', title: 'GET appbundles/:id/aliases/:aliasId',            url: `${BASE}/reference/http/appbundles-id-aliases-aliasId-GET` },
  { section: 'Reference – REST API', title: 'PATCH appbundles/:id/aliases/:aliasId',          url: `${BASE}/reference/http/appbundles-id-aliases-aliasId-PATCH` },
  { section: 'Reference – REST API', title: 'GET appbundles/:id/aliases',                     url: `${BASE}/reference/http/appbundles-id-aliases-GET` },
  { section: 'Reference – REST API', title: 'POST appbundles/:id/aliases',                    url: `${BASE}/reference/http/appbundles-id-aliases-POST` },
  { section: 'Reference – REST API', title: 'DELETE appbundles/:id',                          url: `${BASE}/reference/http/appbundles-id-DELETE` },
  { section: 'Reference – REST API', title: 'GET appbundles/:id',                             url: `${BASE}/reference/http/appbundles-id-GET` },
  { section: 'Reference – REST API', title: 'GET appbundles/:id/versions',                    url: `${BASE}/reference/http/appbundles-id-versions-GET` },
  { section: 'Reference – REST API', title: 'POST appbundles/:id/versions',                   url: `${BASE}/reference/http/appbundles-id-versions-POST` },
  { section: 'Reference – REST API', title: 'GET appbundles/:id/versions/:version',           url: `${BASE}/reference/http/appbundles-id-versions-version-GET` },
  { section: 'Reference – REST API', title: 'DELETE appbundles/:id/versions/:version',        url: `${BASE}/reference/http/appbundles-id-versions-version-DELETE` },

  // Engines
  { section: 'Reference – REST API', title: 'GET engines',                                    url: `${BASE}/reference/http/engines-GET` },
  { section: 'Reference – REST API', title: 'GET engines/:id',                                url: `${BASE}/reference/http/engines-id-GET` },

  // ForgeApps
  { section: 'Reference – REST API', title: 'DELETE forgeapps/:id',                           url: `${BASE}/reference/http/forgeapps-id-DELETE` },
  { section: 'Reference – REST API', title: 'GET forgeapps/:id',                              url: `${BASE}/reference/http/forgeapps-id-GET` },
  { section: 'Reference – REST API', title: 'PATCH forgeapps/:id',                            url: `${BASE}/reference/http/forgeapps-id-PATCH` },

  // Health
  { section: 'Reference – REST API', title: 'GET health/:engine',                             url: `${BASE}/reference/http/health-engine-GET` },

  // ServiceLimits
  { section: 'Reference – REST API', title: 'PUT servicelimits/:owner',                       url: `${BASE}/reference/http/servicelimits-owner-PUT` },
  { section: 'Reference – REST API', title: 'GET servicelimits/:owner',                       url: `${BASE}/reference/http/servicelimits-owner-GET` },

  // Shares
  { section: 'Reference – REST API', title: 'GET shares',                                     url: `${BASE}/reference/http/shares-GET` },

  // WorkItems
  { section: 'Reference – REST API', title: 'GET workitems/:id',                              url: `${BASE}/reference/http/workitems-id-GET` },
  { section: 'Reference – REST API', title: 'DELETE workitems/:id',                           url: `${BASE}/reference/http/workitems-id-DELETE` },
  { section: 'Reference – REST API', title: 'POST workitems',                                 url: `${BASE}/reference/http/workitems-POST` },
  { section: 'Reference – REST API', title: 'POST workitems/batch',                           url: `${BASE}/reference/http/workitems-batch-POST` },
  { section: 'Reference – REST API', title: 'GET workitems?startAfterTime=:epochSecondsInUTC',url: `${BASE}/reference/http/workitems-startAfterTime-GET` },
  { section: 'Reference – REST API', title: 'POST workitems/status',                          url: `${BASE}/reference/http/workitems-status-POST` },
  { section: 'Reference – REST API', title: 'POST workitems/combine',                         url: `${BASE}/reference/http/workitems-combine-POST` },

  // ── Reference – Other ─────────────────────────────────────────────────────
  { section: 'Reference – Other', title: 'Websocket Reference',               url: `${BASE}/reference/websocket` },
  { section: 'Reference – Other', title: 'WorkItem Combine API Reference',    url: `${BASE}/reference/combinator` },
  { section: 'Reference – Other', title: 'Special URLs',                      url: `${BASE}/reference/special_urls` },
  { section: 'Reference – Other', title: 'Activity Variable Arguments',       url: `${BASE}/reference/vararg` },
  { section: 'Reference – Other', title: 'Command Line Reference',            url: `${BASE}/reference/cmdLine` },
  { section: 'Reference – Other', title: 'Command Line Reference – Inventor', url: `${BASE}/reference/cmdLine/cmdLine-inventor` },

  // ── Change History ────────────────────────────────────────────────────────
  { section: 'Change History', title: 'Automation API Changelog',                    url: `${BASE}/change_history/changelog_v3` },
  { section: 'Change History', title: 'AutoCAD Automation Service Release Notes',    url: `${BASE}/change_history/acad_release_notes` },
  { section: 'Change History', title: 'Inventor Automation Service Release Notes',   url: `${BASE}/change_history/inventor_release_notes` },
  { section: 'Change History', title: 'Revit Automation Service Release Notes',      url: `${BASE}/change_history/revit_release_notes` },
];

// ─── Turndown (HTML → Markdown) ───────────────────────────────────────────────

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract article content from a rendered APS doc page.
 * Removes nav/header/footer/sidebar, keeps only the article body.
 */
async function extractArticle(page) {
  return page.evaluate(() => {
    const remove = [
      'nav', 'header', 'footer',
      '.left-nav', '.sidebar', '.breadcrumb',
      '.feedback-section', '.cookie-banner',
      '[class*="nav"]', '[class*="header"]', '[class*="footer"]',
      '[class*="cookie"]', '[class*="sidebar"]',
      'script', 'style', 'noscript',
    ];
    remove.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });

    const selectors = [
      'article',
      '[class*="doc-content"]',
      '[class*="article"]',
      'main .content',
      '.content-wrapper',
      'main',
    ];

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText.trim().length > 200) {
        return el.innerHTML;
      }
    }
    return document.body.innerHTML;
  });
}

/** Load done titles from existing file for --resume */
function loadDoneTitles(file) {
  if (!fs.existsSync(file)) return new Set();
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/^### (.+)$/gm)];
  return new Set(matches.map(m => m[1].trim()));
}

/** Build section heading block */
function sectionHeading(section, title, url, isNewSection) {
  const parts = [];
  if (isNewSection) parts.push(`\n---\n\n## ${section}\n`);
  parts.push(`\n### ${title}\n`);
  parts.push(`_Source: [${url}](${url})_\n\n`);
  return parts.join('\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const doneTitles = RESUME ? loadDoneTitles(OUTPUT_FILE) : new Set();
  const toFetch    = PAGES.filter(p => !doneTitles.has(p.title));

  if (RESUME) {
    console.log(`Resuming — ${doneTitles.size} already done, ${toFetch.length} remaining.\n`);
  } else {
    const header = [
      '# Design Automation API — Full Documentation\n',
      `> Auto-generated on ${new Date().toISOString().slice(0, 10)} by scripts/scrape-da-puppeteer.js\n`,
      `> Source: ${BASE}/developers_guide/overview\n`,
      '---\n',
    ].join('\n');
    fs.writeFileSync(OUTPUT_FILE, header, 'utf8');
    console.log(`Fresh run — ${PAGES.length} pages → ${OUTPUT_FILE}\n`);
  }

  console.log('Launching headless Chrome…');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on('dialog', async dialog => { try { await dialog.dismiss(); } catch (_) {} });

  let successCount = 0;
  let failCount    = 0;
  let currentSection = RESUME ? '__resume__' : '';

  for (let i = 0; i < toFetch.length; i++) {
    const { section, title, url } = toFetch[i];
    const isNewSection = section !== currentSection;
    if (isNewSection) currentSection = section;

    const heading = sectionHeading(section, title, url, isNewSection);
    process.stdout.write(`[${i + 1}/${toFetch.length}] ${title} … `);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await delay(SETTLE_MS);

      // Dismiss cookie banner if present
      try {
        await page.click('.cookie-accept, #onetrust-accept-btn-handler');
      } catch (_) {}

      const html    = await extractArticle(page);
      const mdBody  = td.turndown(html || '').trim();
      const block   = heading + mdBody + '\n';

      fs.appendFileSync(OUTPUT_FILE, block, 'utf8');
      successCount++;
      console.log('OK');
    } catch (err) {
      const block = heading + `> ⚠️ Failed to fetch: ${err.message}\n`;
      fs.appendFileSync(OUTPUT_FILE, block, 'utf8');
      failCount++;
      console.log(`FAILED — ${err.message}`);
    }
  }

  await browser.close();

  console.log(`\nDone. ${successCount} succeeded, ${failCount} failed.`);
  console.log(`Output: ${OUTPUT_FILE}  (${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB)`);
  console.log(`\nNext: node scripts/clean-docs.js --file "API Documentation/DesignAutomation-API.md"`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
