import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', 'dist', '.vercel']);
const jsFiles = [];
const htmlFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignored.has(entry.name)) walk(join(directory, entry.name));
      continue;
    }
    const path = join(directory, entry.name);
    if (extname(entry.name) === '.js') jsFiles.push(path);
    if (extname(entry.name) === '.html') htmlFiles.push(path);
  }
}

walk(root);
let inlineScriptsChecked = 0;

for (const file of jsFiles) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
}

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const scripts = html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi);
  let inlineIndex = 0;
  for (const match of scripts) {
    if (/\bsrc\s*=/.test(match[1])) continue;
    inlineIndex += 1;
    try {
      new Function(match[2]);
    } catch (error) {
      throw new Error(file + ': inline script ' + inlineIndex + ': ' + error.message);
    }
    inlineScriptsChecked += 1;
  }
}

console.log('Syntax check passed: ' + jsFiles.length + ' JavaScript files and ' + inlineScriptsChecked + ' inline HTML scripts.');
