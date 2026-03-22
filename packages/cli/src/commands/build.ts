import { spinner, outro } from '@clack/prompts'
import pc from 'picocolors'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { compile } from '@dsbuilder/tokens'
import type { CompilerOptions } from '@dsbuilder/tokens'

export async function build(_args: string[]): Promise<void> {
  const s = spinner()

  // ── Load config ─────────────────────────────────────────────────────────
  s.start('Loading dsbuilder.config.ts')

  let config: CompilerOptions = {}
  try {
    const configPath = resolve(process.cwd(), 'dsbuilder.config.ts')
    // Dynamic import works once the config is compiled or with ts-node/tsx
    const mod = (await import(configPath)) as { default: CompilerOptions }
    config = mod.default
    s.stop('Config loaded')
  } catch {
    s.stop(pc.yellow('No dsbuilder.config.ts found — using defaults'))
  }

  // ── Load base tokens ─────────────────────────────────────────────────────
  s.start('Loading tokens')

  const tokensPath = resolve(process.cwd(), 'tokens', 'base.json')
  let rawTokens: string

  try {
    rawTokens = await readFile(tokensPath, 'utf-8')
  } catch {
    s.stop(pc.red('tokens/base.json not found. Run `dsbuilder init` first.'))
    process.exit(1)
  }

  const tokens = JSON.parse(rawTokens) as Record<string, unknown>
  s.stop('Tokens loaded')

  // ── Compile ──────────────────────────────────────────────────────────────
  s.start('Compiling')

  const output = compile(tokens, config)

  s.stop(`Compiled ${pc.bold(String(output.tokens.length))} tokens`)

  // ── Write outputs ────────────────────────────────────────────────────────
  s.start('Writing outputs')

  const outDir = resolve(process.cwd(), 'tokens')
  await mkdir(outDir, { recursive: true })

  await Promise.all([
    writeFile(join(outDir, 'tokens.css'), output.css, 'utf-8'),
    writeFile(join(outDir, 'tokens.js'), output.js, 'utf-8'),
    writeFile(join(outDir, 'tokens.d.ts'), output.dts, 'utf-8'),
  ])

  s.stop('Outputs written')

  outro(`
  ${pc.bold('Generated:')}

    ${pc.cyan('tokens/tokens.css')}   CSS custom properties
    ${pc.cyan('tokens/tokens.js')}    ES module with named exports
    ${pc.cyan('tokens/tokens.d.ts')}  TypeScript declarations

  ${pc.dim('Import tokens.css in your app entry point to activate the design tokens.')}
`)
}
