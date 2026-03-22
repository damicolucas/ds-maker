import { intro, select, text, confirm, spinner, outro, isCancel, cancel } from '@clack/prompts'
import pc from 'picocolors'
import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export async function init(_args: string[]): Promise<void> {
  console.log()
  intro(pc.bold('  Initialize DS Builder'))

  const framework = await select({
    message: 'Framework',
    options: [
      { value: 'next', label: 'Next.js' },
      { value: 'vite-react', label: 'Vite + React' },
      { value: 'other', label: 'Other (vanilla CSS output)' },
    ],
  })

  if (isCancel(framework)) return cancel('Setup cancelled.')

  const prefix = await text({
    message: 'CSS variable prefix',
    placeholder: 'ds',
    defaultValue: 'ds',
    validate: (v) => (v.trim() ? undefined : 'Prefix cannot be empty'),
  })

  if (isCancel(prefix)) return cancel('Setup cancelled.')

  const s = spinner()
  s.start('Creating dsbuilder.config.ts')

  const configContent = generateConfig(String(framework), String(prefix))
  const tokensContent = generateTokenStarter()

  await mkdir('tokens', { recursive: true })
  await writeFile('dsbuilder.config.ts', configContent, 'utf-8')
  await writeFile(join('tokens', 'base.json'), tokensContent, 'utf-8')

  s.stop('Created config files')

  outro(`
  ${pc.bold('Next steps:')}

    1. Edit ${pc.cyan('tokens/base.json')} with your design tokens
    2. Run ${pc.cyan('npx dsbuilder build')} to compile them
    3. Import ${pc.cyan('tokens/tokens.css')} in your app entry point
  `)
}

function generateConfig(framework: string, prefix: string): string {
  return `import type { CompilerOptions } from '@dsbuilder/tokens'

const config: CompilerOptions = {
  prefix: '${prefix}',

  // Brand overrides — add additional brand files here
  // brands: {
  //   acme: (await import('./tokens/brand-acme.json')).default,
  // },

  // Mode overrides (e.g., dark mode)
  // modes: {
  //   dark: (await import('./tokens/mode-dark.json')).default,
  // },

  // Component token mappings (hybrid architecture)
  // The CLI generates CSS aliases from semantic tokens automatically.
  componentMappings: [
    {
      component: 'button',
      mappings: {
        'background.default': 'color.background.primary',
        'background.hover': 'color.background.primaryHover',
        'text.default': 'color.text.inverse',
      },
    },
  ],
}

export default config
`
}

function generateTokenStarter(): string {
  return JSON.stringify(
    {
      color: {
        $type: 'color',
        background: {
          primary: { $value: '#2563eb', $description: 'Primary action background' },
          primaryHover: { $value: '#1d4ed8' },
          secondary: { $value: '#f3f4f6' },
          subtle: { $value: '#f9fafb' },
          surface: { $value: '#ffffff' },
          danger: { $value: '#dc2626' },
        },
        text: {
          primary: { $value: '#111827' },
          secondary: { $value: '#6b7280' },
          inverse: { $value: '#ffffff' },
          danger: { $value: '#dc2626' },
        },
        border: {
          default: { $value: '#e5e7eb' },
          focus: { $value: '#2563eb' },
        },
      },
      spacing: {
        $type: 'dimension',
        '1': { $value: '4px' },
        '2': { $value: '8px' },
        '3': { $value: '12px' },
        '4': { $value: '16px' },
        '5': { $value: '20px' },
        '6': { $value: '24px' },
        '8': { $value: '32px' },
        '10': { $value: '40px' },
        '12': { $value: '48px' },
      },
      radius: {
        $type: 'dimension',
        none: { $value: '0px' },
        sm: { $value: '4px' },
        md: { $value: '6px' },
        lg: { $value: '8px' },
        xl: { $value: '12px' },
        full: { $value: '9999px' },
      },
    },
    null,
    2,
  )
}
