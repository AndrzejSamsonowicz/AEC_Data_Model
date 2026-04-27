/**
 * APS Documentation Scraper
 * Crawls a list of APS doc pages via r.jina.ai (handles JS-rendered pages),
 * and writes a single consolidated .md file ready for Copilot context.
 *
 * Usage:
 *   node scripts/scrape-docs.js
 *
 * Output:
 *   API Documentation/Parameters-API.md
 *
 * Requirements: only axios (already installed)
 *   npm install axios
 */

'use strict';

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ─── Configuration ────────────────────────────────────────────────────────────

const OUTPUT_FILE = path.join(__dirname, '..', 'API Documentation', 'Parameters-API.md');

/** Delay between requests (ms) — be polite to Autodesk servers */
const DELAY_MS = 800;

/** All doc pages, in the order they appear in the left-hand nav */
const PAGES = [
  // Developer's Guide
  { section: "Developer's Guide", title: 'Introduction',                        url: 'https://aps.autodesk.com/en/docs/parameters/v1/overview/introduction' },
  { section: "Developer's Guide", title: 'Field Guide',                         url: 'https://aps.autodesk.com/en/docs/parameters/v1/overview/field-guide' },
  { section: "Developer's Guide", title: 'Rate Limits and Quotas',              url: 'https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits' },
  { section: "Developer's Guide", title: 'Forge Rate Limits',                   url: 'https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/forge-rate-limits' },
  { section: "Developer's Guide", title: 'Parameters API Rate Limits',          url: 'https://aps.autodesk.com/en/docs/parameters/v1/overview/rate-limits/Parameters-API-rate-limits' },

  // Tutorials
  { section: 'Tutorials', title: 'Getting Started',                             url: 'https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started' },
  { section: 'Tutorials', title: 'Retrieve ACC Account',                        url: 'https://aps.autodesk.com/en/docs/parameters/v1/tutorials/getting-started/retrieve-account' },
  { section: 'Tutorials', title: 'Parameters Overview',                         url: 'https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters' },
  { section: 'Tutorials', title: 'Retrieve ACC Parameters Data',                url: 'https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/retrieve-parameters-data' },
  { section: 'Tutorials', title: 'Create Parameters',                           url: 'https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-parameters' },
  { section: 'Tutorials', title: 'Search Parameters Indices and Parameters',    url: 'https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/search-parameters' },
  { section: 'Tutorials', title: 'Create Enumerations',                         url: 'https://aps.autodesk.com/en/docs/parameters/v1/tutorials/parameters/create-enumerations' },

  // API Reference — Parameter Groups
  { section: 'API Reference – Parameter Groups',  title: 'GET Retrieve Parameters Groups',    url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listgroups-GET' },
  { section: 'API Reference – Parameter Groups',  title: 'GET Retrieve a Parameters Group',   url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getgroup-GET' },
  { section: 'API Reference – Parameter Groups',  title: 'PUT Update a Parameters Group',     url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updategroup-PUT' },

  // API Reference — Parameter Collections
  { section: 'API Reference – Parameter Collections', title: 'POST Create the Parameters Collection',  url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createcollection-POST' },
  { section: 'API Reference – Parameter Collections', title: 'GET Retrieve Parameter Collections',     url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparametercollections-GET' },
  { section: 'API Reference – Parameter Collections', title: 'GET Retrieve a Parameter Collection',    url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getcollection-GET' },
  { section: 'API Reference – Parameter Collections', title: 'PUT Update a Parameter Collection',      url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatecollection-PUT' },

  // API Reference — Parameters
  { section: 'API Reference – Parameters', title: 'GET Retrieve parameters',       url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listparameters-GET' },
  { section: 'API Reference – Parameters', title: 'GET Retrieve a parameter',      url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getparameterv1-GET' },
  { section: 'API Reference – Parameters', title: 'POST Create parameters',        url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createparameters-POST' },
  { section: 'API Reference – Parameters', title: 'PATCH Modify parameters',       url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateparameters-PATCH' },
  { section: 'API Reference – Parameters', title: 'POST Render parameters',        url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-renderparametersv1-POST' },
  { section: 'API Reference – Parameters', title: 'POST Batch share parameters',   url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchshareparameters-POST' },
  { section: 'API Reference – Parameters', title: 'POST Batch unshare parameters', url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-batchunshareparameters-POST' },

  // API Reference — Parameters Search
  { section: 'API Reference – Search', title: 'POST Search parameters',        url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersv2-POST' },
  { section: 'API Reference – Search', title: 'POST Search parameters indices', url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-searchparametersindicesv2-POST' },

  // API Reference — Enumerations
  { section: 'API Reference – Enumerations', title: 'GET List enumerations',    url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listenumerations-GET' },
  { section: 'API Reference – Enumerations', title: 'POST Create enumerations', url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createenumerations-POST' },
  { section: 'API Reference – Enumerations', title: 'PATCH Update enumerations',url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumerations-PATCH' },
  { section: 'API Reference – Enumerations', title: 'PATCH Update enumeration', url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updateenumeration-PATCH' },

  // API Reference — Specs
  { section: 'API Reference – Specs', title: 'GET List specs',    url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecs-GET' },
  { section: 'API Reference – Specs', title: 'POST Create specs', url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createspecs-POST' },
  { section: 'API Reference – Specs', title: 'PUT Update specs',  url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespecs-PUT' },
  { section: 'API Reference – Specs', title: 'PUT Update spec',   url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatespec-PUT' },

  // API Reference — Labels
  { section: 'API Reference – Labels', title: 'GET Retrieve labels',               url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listlabelsv2-GET' },
  { section: 'API Reference – Labels', title: 'POST Create labels',                url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-createlabelsv2-POST' },
  { section: 'API Reference – Labels', title: 'GET Retrieve a label',              url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-getlabelv2-GET' },
  { section: 'API Reference – Labels', title: 'PATCH Modify a label',              url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-updatelabelv2-PATCH' },
  { section: 'API Reference – Labels', title: 'DELETE Delete a label',             url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-deletelabelv2-DELETE' },
  { section: 'API Reference – Labels', title: 'POST Attach labels to parameters',  url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-attachlabelsv2-POST' },
  { section: 'API Reference – Labels', title: 'POST Detach labels from parameters',url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-detachlabelsv2-POST' },

  // API Reference — Classifications
  { section: 'API Reference – Classifications', title: 'GET Retrieve disciplines',         url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listdisciplinesv1-GET' },
  { section: 'API Reference – Classifications', title: 'GET Retrieve specs',               url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listspecsv1-GET' },
  { section: 'API Reference – Classifications', title: 'GET Retrieve units',               url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listunitsv1-GET' },
  { section: 'API Reference – Classifications', title: 'GET Retrieve groups',              url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listclassificationgroupsv1-GET' },
  { section: 'API Reference – Classifications', title: 'GET Retrieve categories',          url: 'https://aps.autodesk.com/en/docs/parameters/v1/reference/http/parameters-listcategoriesv1-GET' },

  // Change History
  { section: 'Change History', title: 'Changelog', url: 'https://aps.autodesk.com/en/docs/parameters/v1/change-history/changelog' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch one documentation page as clean Markdown via r.jina.ai.
 * r.jina.ai renders JavaScript SPAs server-side and returns ready-to-use markdown.
 */
async function fetchPage(url) {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const response = await axios.get(jinaUrl, {
    headers: {
      'Accept': 'text/markdown, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (compatible; APS-doc-scraper/1.0)',
      'X-Return-Format': 'markdown',
    },
    timeout: 30000,
  });

  let md = typeof response.data === 'string' ? response.data : String(response.data);

  // Strip jina front-matter block (Title: / URL Source: / Markdown Content:)
  md = md.replace(/^Title:.*?\n(?:URL Source:.*?\n)?(?:Markdown Content:\n)?/ms, '');

  // Strip the full-page H1 title (duplicates the section heading we already added)
  md = md.replace(/^#\s+.+?\|.*\n/m, '');

  // Strip the global APS site navigation block that jina includes on every page.
  // It starts at the APS logo image link and ends just before the breadcrumb / article content.
  // Pattern: remove everything up to (but not including) the first real breadcrumb or article heading.
  md = md.replace(
    /\[!\[.*?Autodesk Platform Services.*?Sign in[\s\S]*?(?=\[Documentation\]|#{1,3}\s+(About|Introduction|Field|Rate|Getting|Parameters|Retrieve|Create|Search|Update|Modify|Delete|Attach|Detach|List|Render|Batch|POST|GET|PUT|PATCH|DELETE|Changelog))/,
    ''
  );

  // Strip trailing footer navigation (everything after "Follow APS" or "© 20" copyright line)
  md = md.replace(/\n(?:Follow APS|©\s*20\d\d Autodesk)[\s\S]*$/m, '');

  // Collapse runs of 3+ blank lines into 2
  return md.replace(/\n{3,}/g, '\n\n').trim();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Scraping ${PAGES.length} pages → ${OUTPUT_FILE}\n`);

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const chunks = [
    '# APS Parameters API — Full Documentation\n',
    `> Auto-generated on ${new Date().toISOString().slice(0, 10)} by scripts/scrape-docs.js\n`,
    `> Source: https://aps.autodesk.com/en/docs/parameters/v1/\n`,
    '---\n',
  ];

  let currentSection = '';
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < PAGES.length; i++) {
    const { section, title, url } = PAGES[i];

    // Emit section header when it changes
    if (section !== currentSection) {
      currentSection = section;
      chunks.push(`\n---\n\n## ${section}\n`);
    }

    chunks.push(`\n### ${title}\n`);
    chunks.push(`_Source: [${url}](${url})_\n`);

    process.stdout.write(`[${i + 1}/${PAGES.length}] ${title} … `);

    try {
      const md = await fetchPage(url);
      chunks.push(md + '\n');
      successCount++;
      console.log('OK');
    } catch (err) {
      const msg = `_(Failed to fetch: ${err.message})_`;
      chunks.push(msg + '\n');
      failCount++;
      console.log(`FAILED — ${err.message}`);
    }

    // Polite delay between requests (skip after last page)
    if (i < PAGES.length - 1) await delay(DELAY_MS);
  }

  fs.writeFileSync(OUTPUT_FILE, chunks.join('\n'), 'utf8');

  console.log(`\nDone. ${successCount} succeeded, ${failCount} failed.`);
  console.log(`Output: ${OUTPUT_FILE}`);
  console.log(`Size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);
  console.log(`\nRun "node scripts/clean-docs.js" to strip navigation boilerplate.`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
