/**
 * Post-processor for APS documentation markdown files.
 * Strips the APS site navigation boilerplate that jina.ai includes on every page,
 * keeping only the actual article content.
 *
 * Usage:
 *   node scripts/clean-docs.js                                              # cleans Parameters-API.md
 *   node scripts/clean-docs.js --file "API Documentation/AEC-DataModel-API.md"
 *
 * Input/Output: in-place
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Resolve --file argument or fall back to Parameters-API.md
const fileArgIdx = process.argv.indexOf('--file');
const FILE = fileArgIdx !== -1
  ? path.resolve(__dirname, '..', process.argv[fileArgIdx + 1])
  : path.join(__dirname, '..', 'API Documentation', 'Parameters-API.md');

// ─── Per-page cleanup ─────────────────────────────────────────────────────────

/**
 * Given the raw jina.ai markdown for one page, return only the article content.
 *
 * Structure jina returns for every APS doc page:
 *   Title: ...
 *   URL Source: ...
 *   Markdown Content:
 *   # Full Page Title | Parameters API | APS
 *   [global nav: logo, Solutions, Community, Support, App Store ...]
 *   [sidebar nav: bullet list ending with Changelog link]
 *   [loading GIF images]
 *   [Jump To link]
 *   [breadcrumb: Documentation / Parameters API / ...]
 *   # Actual Article Heading       <-- content starts here
 *   ...article content...
 *   [![Image N: Autodesk]...]      <-- footer starts here
 *   [cookie dialog]
 */
function extractArticle(raw) {
  let text = raw;

  // 1. Strip jina front-matter block
  text = text.replace(/^Title:.*\nURL Source:.*\n(?:Markdown Content:\n)?/m, '');

  // 2. The sidebar nav always ends with the Changelog link.
  //    Find the LAST occurrence and skip past everything up to the first `# ` heading.
  const CHANGELOG_MARKER = 'change-history/changelog)';
  const changelogIdx = text.lastIndexOf(CHANGELOG_MARKER);
  if (changelogIdx !== -1) {
    const afterSidebar = text.slice(changelogIdx + CHANGELOG_MARKER.length);
    // Find the first article heading (# at start of line)
    const headingMatch = afterSidebar.match(/\n(#+ )/);
    if (headingMatch) {
      text = afterSidebar.slice(headingMatch.index + 1); // +1 skips the leading \n
    } else {
      // Fallback: just drop everything before the first # heading in the whole text
      const fallback = text.match(/\n(#+ )/);
      if (fallback) text = text.slice(fallback.index + 1);
    }
  }

  // 3. Strip footer: Autodesk logo link and everything after
  //    Matches both adsk-logo--black.svg and autodesk-logo-blk.svg variants
  const footerMatch = text.search(/\[!\[Image \d+: Autodesk\]/);
  if (footerMatch !== -1) {
    text = text.slice(0, footerMatch);
  }

  // 4. Collapse excessive blank lines
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(FILE)) {
    console.error(`File not found: ${FILE}`);
    process.exit(1);
  }

  const original = fs.readFileSync(FILE, 'utf8');
  const originalSize = Buffer.byteLength(original, 'utf8');

  // Split into file-header + per-page sections.
  // Each page section starts with "\n### " (added by scrape-docs.js).
  const SECTION_SPLIT = /(?=\n### )/;
  const parts = original.split(SECTION_SPLIT);

  const cleaned = parts.map((part, i) => {
    // Keep the file header and section separators untouched
    if (i === 0) return part;

    // Separate the section heading + source line from the raw jina content
    // Pattern:  "\n### Title\n\n_Source: [url](url)_\n\n<jina content>"
    const headingMatch = part.match(/^(\n### .+?\n\n_Source: .+?_\n\n)([\s\S]*)$/);
    if (!headingMatch) return part;

    const heading = headingMatch[1];
    const rawContent = headingMatch[2];

    const article = extractArticle(rawContent);
    return `${heading}${article}\n`;
  });

  const result = cleaned.join('');
  const newSize = Buffer.byteLength(result, 'utf8');

  fs.writeFileSync(FILE, result, 'utf8');

  console.log(`Done.`);
  console.log(`  Before: ${(originalSize / 1024).toFixed(1)} KB`);
  console.log(`  After:  ${(newSize / 1024).toFixed(1)} KB`);
  console.log(`  Saved:  ${((originalSize - newSize) / 1024).toFixed(1)} KB (${(100 - newSize / originalSize * 100).toFixed(0)}% reduction)`);
}

main();
