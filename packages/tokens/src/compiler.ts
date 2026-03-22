import type {
  TokenTree,
  CompilerOptions,
  CompilerOutput,
} from './types.js'
import { resolve } from './resolver.js'
import { generateCSS } from './outputs/css.js'
import { generateJS, generateDTS } from './outputs/js.js'

/**
 * Compile a W3C DTCG token tree into CSS, JS, and TypeScript outputs.
 *
 * @example
 * ```ts
 * import { compile } from '@dsbuilder/tokens'
 *
 * const output = compile(tokens, {
 *   prefix: 'ds',
 *   brands: { acme: acmeOverrides },
 *   modes: { dark: darkOverrides },
 *   componentMappings: [
 *     {
 *       component: 'button',
 *       mappings: {
 *         'background.default': 'color.background.primary',
 *         'background.hover': 'color.background.secondary',
 *         'text.default': 'color.text.inverse',
 *       },
 *     },
 *   ],
 * })
 *
 * // output.css  → write to tokens.css
 * // output.js   → write to tokens.js
 * // output.dts  → write to tokens.d.ts
 * ```
 */
export function compile(tokens: TokenTree, options: CompilerOptions = {}): CompilerOutput {
  const prefix = options.prefix ?? 'ds'
  const resolved = resolve(tokens, prefix)

  return {
    tokens: resolved,
    css: generateCSS(resolved, { ...options, prefix }),
    js: generateJS(resolved),
    dts: generateDTS(resolved),
  }
}
