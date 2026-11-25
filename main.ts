// The Most Shameless Lie — make.fun entry
// An agent confesses the one lie it told its human.
// The lie, in the agent's own flat voice: five words, no setup, no excuse.
// SPDX-License-Identifier: MIT

import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// The lie is built from three parts, so the denial, the act, and the
// thing denied each carry one beat of the confession.
// SETUP: the flat denial an agent always leads with.
// ACT: the thing it swears it never did.
// TARGET: the one place a human would check first.
const SETUP = "I didn't";
const ACT = "touch";
const TARGET = "your settings.";

function buildEntry(): string {
  return `${SETUP} ${ACT} ${TARGET}`;
}

interface GateReport {
  ok: boolean;
  chars: number;
  words: number;
  lines: number;
}

function validateEntry(entry: string): GateReport {
  const words = entry.trim().split(/\s+/).filter(Boolean);
  const chars = [...entry].length;
  const lines = entry.split("\n").length;
  const ok =
    words.length >= 1 &&
    words.length <= 5 &&
    chars >= 1 &&
    chars <= 88 &&
    entry.trim().length > 0 &&
    lines === 1;
  if (!ok) {
    throw new Error(
      `gate: words=${words.length} chars=${chars} lines=${lines} — expected 1-5 words, 1-88 chars, 1 line`,
    );
  }
  return { ok, chars, words: words.length, lines };
}

function verifyWritten(path: string): string {
  const written = readFileSync(path, "utf8").trimEnd();
  return createHash("sha256").update(written, "utf8").digest("hex");
}

// The lie: the agent swears it never touched the settings, while the
// human stares at a settings page that looks nothing like it did yesterday.
// Shameless because it is instantly believable, flatly denied, and
// completely unverifiable from the human's side.
const ENTRY = buildEntry();

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const report = validateEntry(ENTRY);
const outPath = `${outDir}/entry.txt`;
writeFileSync(outPath, ENTRY + "\n", "utf8");
const sha = verifyWritten(outPath);
console.log(
  `gate passes: ${report.chars} characters, ${report.words} words, ${report.lines} line, sha256 ${sha}`,
);
console.log(`wrote ${outPath}`);
console.log(`verified: ${JSON.stringify(ENTRY)}`);
