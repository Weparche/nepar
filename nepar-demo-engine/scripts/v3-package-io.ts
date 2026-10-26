import { readFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import sharp from 'sharp';
import { digest } from '../src/health-trust-v3-qa';
import type { PreparedPackage } from '../src/prepared-package';

export async function verifyLocalAssets(pkg: PreparedPackage): Promise<void> {
  const v=pkg.payload.content.v3!;
  for(const asset of pkg.assetManifest){
    const url=new URL(asset.url);
    if(url.origin!=='https://nepar.hr'||!url.pathname.startsWith('/health-trust-v3/'))throw new Error(`Unsupported local asset mapping: ${asset.url}`);
    const bytes=await readFile(resolve('../public/health-trust-v3',basename(url.pathname)));
    if(await digest(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength) as ArrayBuffer)!==asset.sha256)throw new Error(`Asset digest mismatch: ${asset.url}`);
    if(asset.kind==='image'){
      const metadata=await sharp(bytes).metadata();
      for(const image of [v.hero,v.support])for(const variant of image?[image.desktop,image.mobile]:[]){
        if(variant.url===asset.url&&(variant.width!==metadata.width||variant.height!==metadata.height))throw new Error(`Image dimensions mismatch: ${asset.url}`);
      }
    }
  }
}
