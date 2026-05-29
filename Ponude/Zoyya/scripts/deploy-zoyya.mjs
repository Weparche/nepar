import { spawnSync } from 'node:child_process'
import { cp, mkdir, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const zoyyaRoot = path.resolve(__dirname, '..')
const neparRoot = path.resolve(zoyyaRoot, '..', '..')
const distDir = path.join(zoyyaRoot, 'dist')
const targetDir = path.join(neparRoot, 'public', 'zoyya')

const withNeparBuild = process.argv.includes('--with-nepar-build')

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

async function pathExists(p) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

console.log('→ Building Zoyya demo...')
run('npm', ['run', 'build'], zoyyaRoot)

if (!(await pathExists(distDir))) {
  console.error('Build failed: dist/ folder not found.')
  process.exit(1)
}

if (!(await pathExists(neparRoot))) {
  console.error(`Nepar root not found at ${neparRoot}`)
  process.exit(1)
}

console.log(`→ Copying dist/ → ${targetDir}`)
await rm(targetDir, { recursive: true, force: true })
await mkdir(targetDir, { recursive: true })
await cp(distDir, targetDir, { recursive: true })

console.log('✓ Zoyya demo copied to Nepar public/zoyya/')

if (withNeparBuild) {
  console.log('→ Building Nepar site...')
  run('npm', ['run', 'build'], neparRoot)
  console.log('✓ Nepar dist/ ready for deploy')
  console.log('  Preview: cd ../../ && npm run preview')
  console.log('  Live URL: https://nepar.hr/zoyya/')
} else {
  console.log('')
  console.log('Next steps:')
  console.log('  cd ../..')
  console.log('  npm run build')
  console.log('  # deploy dist/ as usual for nepar.hr')
  console.log('')
  console.log('Or run: npm run deploy:zoyya:full')
  console.log('Live URL: https://nepar.hr/zoyya/')
}
