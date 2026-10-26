import { readFile, writeFile } from 'node:fs/promises';
import { qaReportSchema } from '../src/schema';
import { reviewFingerprint, v3ReportReady } from '../src/health-trust-v3-qa';
// The review file must be authored after Astra has inspected the referenced screenshots.
// This command verifies and attaches a review; it never creates a design score.
const args=process.argv.slice(2),option=(k:string)=>args[args.indexOf(k)+1];
if(!args.includes('--report')||!args.includes('--judgment'))throw new Error('Required: --report PATH --judgment PATH');
const report=qaReportSchema.parse(JSON.parse(await readFile(option('--report'),'utf8')));
if(!report.v3)throw new Error('V3 report required');
const judgment=JSON.parse(await readFile(option('--judgment'),'utf8'));
const fp=await reviewFingerprint(report.v3);
if(judgment.reviewFingerprint!==fp)throw new Error('Review does not match captured inputs.');
for(const capture of report.v3.captures){
  const entry=judgment.captures.find((c:{viewport:string})=>c.viewport===capture.viewport);
  if(!entry)throw new Error(`Missing ${capture.viewport} judgment`);
  capture.designJudgment={...entry.designJudgment,reviewFingerprint:fp};
}
const validated=qaReportSchema.parse(report);
const ready=await v3ReportReady(validated,validated.v3!.contentFingerprint);
validated.visualStatus=ready?'passed':'needs_visual_review';
await writeFile(option('--report'),JSON.stringify(validated,null,2)+'\n');
console.log(JSON.stringify({ready,reviewFingerprint:fp}));
if(!ready)process.exitCode=1;
