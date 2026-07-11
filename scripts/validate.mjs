#!/usr/bin/env node
// Asserts the skill and its reference stay internally consistent.
// Exits non-zero on any failure. Run before committing; CI runs it too.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ref = readFileSync(join(root, 'references', 'wcag-2.2-full.md'), 'utf8');
const skill = readFileSync(join(root, 'SKILL.md'), 'utf8');

const EXPECT = { A: 31, AA: 24, AAA: 31, total: 86, aa: 55, date: '12 December 2024' };

const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };

// Count criteria by level. Each criterion heading is followed, before the next
// heading, by a "(Level X)" marker.
const blocks = ref.split(/^#### Success Criterion /m).slice(1);
const counts = { A: 0, AA: 0, AAA: 0 };
for (const b of blocks) {
  const m = b.match(/\(Level (A|AA|AAA)\)/);
  if (m) counts[m[1]]++;
}
const total = counts.A + counts.AA + counts.AAA;
const aa = counts.A + counts.AA;

check(counts.A === EXPECT.A, `Level A count ${counts.A} != ${EXPECT.A}`);
check(counts.AA === EXPECT.AA, `Level AA count ${counts.AA} != ${EXPECT.AA}`);
check(counts.AAA === EXPECT.AAA, `Level AAA count ${counts.AAA} != ${EXPECT.AAA}`);
check(total === EXPECT.total, `total criteria ${total} != ${EXPECT.total}`);
check(aa === EXPECT.aa, `A+AA criteria ${aa} != ${EXPECT.aa}`);

// Spec identity.
check(ref.includes(EXPECT.date), `reference missing spec date "${EXPECT.date}"`);

// 4.1.1 Parsing was removed in WCAG 2.2. It survives in the spec only as an
// obsolete tombstone heading with no conformance level, so it is not counted.
const parsingHeading = ref.match(/#### Success Criterion 4\.1\.1[^\n]*/);
check(parsingHeading && /Obsolete and removed/.test(parsingHeading[0]),
  '4.1.1 Parsing must appear only as "(Obsolete and removed)"');
const parsingBlock = ref.split(/^#### Success Criterion /m).find((b) => b.startsWith('4.1.1'));
check(parsingBlock && !/\(Level (A|AA|AAA)\)/.test(parsingBlock),
  '4.1.1 Parsing must not carry a conformance level');

// W3C attribution must be preserved.
check(/W3C Document License/.test(ref), 'reference missing W3C Document License attribution');

// Skill must agree with the reference numbers.
check(skill.includes(`${EXPECT.total} success criteria`), `SKILL.md missing "${EXPECT.total} success criteria"`);
check(/checklist \(55\)/.test(skill), 'SKILL.md checklist header must say (55)');
check(skill.includes('31 A + 24 AA'), 'SKILL.md must state "31 A + 24 AA"');

// The six criteria new in WCAG 2.2 must all be named in the skill.
for (const id of ['2.4.11', '2.5.7', '2.5.8', '3.2.6', '3.3.7', '3.3.8']) {
  check(skill.includes(id), `SKILL.md missing new-in-2.2 criterion ${id}`);
}

// No emdashes in authored docs.
const authored = [['SKILL.md', skill]];
for (const f of ['README.md', 'AGENTS.md', 'CHANGELOG.md']) {
  authored.push([f, readFileSync(join(root, f), 'utf8')]);
}
for (const [name, text] of authored) {
  check(!text.includes('—'), `${name} contains an emdash; use a hyphen`);
}

if (failures.length) {
  console.error('validate: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log(`validate: OK (A=${counts.A} AA=${counts.AA} AAA=${counts.AAA} total=${total})`);
