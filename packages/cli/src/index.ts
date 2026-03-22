import { intro, outro, select, text, spinner, isCancel, cancel } from '@clack/prompts'
import pc from 'picocolors'
import { run } from './commands/index.js'

const [, , command, ...args] = process.argv

intro(pc.bold(pc.cyan(' DS Builder CLI ')))

if (!command || command === 'help') {
  console.log(`
  ${pc.bold('Commands:')}

    ${pc.cyan('init')}     Set up DS Builder in the current project
    ${pc.cyan('build')}    Compile tokens and generate outputs
    ${pc.cyan('pull')}     Pull latest tokens from the DS Builder dashboard

  ${pc.dim('Run with --help for options on each command.')}
`)
  outro('See you next time!')
  process.exit(0)
}

await run(command, args).catch((err: unknown) => {
  console.error(pc.red('\nError:'), err instanceof Error ? err.message : err)
  process.exit(1)
})
