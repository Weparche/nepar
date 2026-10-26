import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
const contract=JSON.parse(await readFile(new URL('../reference-designs/health-trust-v3/renderer-contract.json',import.meta.url),'utf8'));
const source=(await readFile(new URL('../src/health-trust-v3.ts',import.meta.url),'utf8')).replaceAll('\r\n','\n');
const actual=createHash('sha256').update(source).digest('hex');
if(contract.designVersion!=='health-trust-v3'||contract.rendererSha256!==actual)throw new Error('Accepted V3 renderer changed. Create a new version; do not update the accepted checksum.');
console.log('Immutable health-trust-v3 renderer contract verified.');
