import { init } from './init.js'
import { build } from './build.js'

const commands: Record<string, (args: string[]) => Promise<void>> = {
  init,
  build,
}

export async function run(command: string, args: string[]): Promise<void> {
  const handler = commands[command]

  if (!handler) {
    console.error(`Unknown command: ${command}`)
    console.error(`Available commands: ${Object.keys(commands).join(', ')}`)
    process.exit(1)
  }

  await handler(args)
}
