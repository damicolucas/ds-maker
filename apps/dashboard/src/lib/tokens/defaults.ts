import type { PrimitiveToken, SemanticToken, Theme } from './types'

// ─── Color palette ────────────────────────────────────────────────────────────

function colorScale(
  group: string,
  stops: Record<string, string>,
): PrimitiveToken[] {
  return Object.entries(stops).map(([stop, value]) => ({
    id: `${group}-${stop}`,
    name: `${group}-${stop}`,
    value,
    category: 'color' as const,
    group,
  }))
}

const GRAY = colorScale('gray', {
  '50': '#f9fafb', '100': '#f3f4f6', '200': '#e5e7eb',
  '300': '#d1d5db', '400': '#9ca3af', '500': '#6b7280',
  '600': '#4b5563', '700': '#374151', '800': '#1f2937',
  '900': '#111827', '950': '#030712',
})

const BLUE = colorScale('blue', {
  '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe',
  '300': '#93c5fd', '400': '#60a5fa', '500': '#3b82f6',
  '600': '#2563eb', '700': '#1d4ed8', '800': '#1e40af',
  '900': '#1e3a8a', '950': '#172554',
})

const GREEN = colorScale('green', {
  '50': '#f0fdf4', '100': '#dcfce7', '200': '#bbf7d0',
  '300': '#86efac', '400': '#4ade80', '500': '#22c55e',
  '600': '#16a34a', '700': '#15803d', '800': '#166534',
  '900': '#14532d', '950': '#052e16',
})

const RED = colorScale('red', {
  '50': '#fef2f2', '100': '#fee2e2', '200': '#fecaca',
  '300': '#fca5a5', '400': '#f87171', '500': '#ef4444',
  '600': '#dc2626', '700': '#b91c1c', '800': '#991b1b',
  '900': '#7f1d1d', '950': '#450a0a',
})

const AMBER = colorScale('amber', {
  '50': '#fffbeb', '100': '#fef3c7', '200': '#fde68a',
  '300': '#fcd34d', '400': '#fbbf24', '500': '#f59e0b',
  '600': '#d97706', '700': '#b45309', '800': '#92400e',
  '900': '#78350f', '950': '#451a03',
})

const PURPLE = colorScale('purple', {
  '50': '#faf5ff', '100': '#f3e8ff', '200': '#e9d5ff',
  '300': '#d8b4fe', '400': '#c084fc', '500': '#a855f7',
  '600': '#9333ea', '700': '#7e22ce', '800': '#6b21a8',
  '900': '#581c87', '950': '#3b0764',
})

const CYAN = colorScale('cyan', {
  '50': '#ecfeff', '100': '#cffafe', '200': '#a5f3fc',
  '300': '#67e8f9', '400': '#22d3ee', '500': '#06b6d4',
  '600': '#0891b2', '700': '#0e7490', '800': '#155e75',
  '900': '#164e63', '950': '#083344',
})

const SPECIAL: PrimitiveToken[] = [
  { id: 'white',       name: 'white',       value: '#ffffff', category: 'color', group: 'base' },
  { id: 'black',       name: 'black',       value: '#000000', category: 'color', group: 'base' },
  { id: 'transparent', name: 'transparent', value: 'transparent', category: 'color', group: 'base' },
]

// ─── Spacing ──────────────────────────────────────────────────────────────────

function spacingTokens(): PrimitiveToken[] {
  const scale: Record<string, string> = {
    px: '1px', '0': '0px', '0.5': '2px', '1': '4px', '1.5': '6px',
    '2': '8px', '2.5': '10px', '3': '12px', '3.5': '14px', '4': '16px',
    '5': '20px', '6': '24px', '7': '28px', '8': '32px', '9': '36px',
    '10': '40px', '11': '44px', '12': '48px', '14': '56px', '16': '64px',
    '20': '80px', '24': '96px', '28': '112px', '32': '128px',
  }
  return Object.entries(scale).map(([step, value]) => ({
    id: `spacing-${step}`,
    name: step,
    value,
    category: 'spacing' as const,
    group: 'scale',
  }))
}

// ─── Typography ───────────────────────────────────────────────────────────────

const FONT_FAMILY: PrimitiveToken[] = [
  { id: 'font-sans',  name: 'sans',  value: 'ui-sans-serif, system-ui, sans-serif',        category: 'typography', group: 'font-family' },
  { id: 'font-serif', name: 'serif', value: 'ui-serif, Georgia, serif',                    category: 'typography', group: 'font-family' },
  { id: 'font-mono',  name: 'mono',  value: 'ui-monospace, "JetBrains Mono", monospace',   category: 'typography', group: 'font-family' },
]

const FONT_SIZE: PrimitiveToken[] = [
  { id: 'text-xs',   name: 'xs',   value: '12px', category: 'typography', group: 'font-size' },
  { id: 'text-sm',   name: 'sm',   value: '14px', category: 'typography', group: 'font-size' },
  { id: 'text-base', name: 'base', value: '16px', category: 'typography', group: 'font-size' },
  { id: 'text-lg',   name: 'lg',   value: '18px', category: 'typography', group: 'font-size' },
  { id: 'text-xl',   name: 'xl',   value: '20px', category: 'typography', group: 'font-size' },
  { id: 'text-2xl',  name: '2xl',  value: '24px', category: 'typography', group: 'font-size' },
  { id: 'text-3xl',  name: '3xl',  value: '30px', category: 'typography', group: 'font-size' },
  { id: 'text-4xl',  name: '4xl',  value: '36px', category: 'typography', group: 'font-size' },
  { id: 'text-5xl',  name: '5xl',  value: '48px', category: 'typography', group: 'font-size' },
]

const FONT_WEIGHT: PrimitiveToken[] = [
  { id: 'fw-thin',       name: 'thin',       value: '100', category: 'typography', group: 'font-weight' },
  { id: 'fw-light',      name: 'light',      value: '300', category: 'typography', group: 'font-weight' },
  { id: 'fw-normal',     name: 'normal',     value: '400', category: 'typography', group: 'font-weight' },
  { id: 'fw-medium',     name: 'medium',     value: '500', category: 'typography', group: 'font-weight' },
  { id: 'fw-semibold',   name: 'semibold',   value: '600', category: 'typography', group: 'font-weight' },
  { id: 'fw-bold',       name: 'bold',       value: '700', category: 'typography', group: 'font-weight' },
  { id: 'fw-extrabold',  name: 'extrabold',  value: '800', category: 'typography', group: 'font-weight' },
]

// ─── Radius ───────────────────────────────────────────────────────────────────

const RADIUS: PrimitiveToken[] = [
  { id: 'radius-none', name: 'none', value: '0px',     category: 'radius', group: 'scale' },
  { id: 'radius-sm',   name: 'sm',   value: '2px',     category: 'radius', group: 'scale' },
  { id: 'radius-md',   name: 'md',   value: '4px',     category: 'radius', group: 'scale' },
  { id: 'radius-lg',   name: 'lg',   value: '8px',     category: 'radius', group: 'scale' },
  { id: 'radius-xl',   name: 'xl',   value: '12px',    category: 'radius', group: 'scale' },
  { id: 'radius-2xl',  name: '2xl',  value: '16px',    category: 'radius', group: 'scale' },
  { id: 'radius-3xl',  name: '3xl',  value: '24px',    category: 'radius', group: 'scale' },
  { id: 'radius-full', name: 'full', value: '9999px',  category: 'radius', group: 'scale' },
]

// ─── Duration ─────────────────────────────────────────────────────────────────

const DURATION: PrimitiveToken[] = [
  { id: 'dur-instant', name: 'instant', value: '0ms',   category: 'duration', group: 'scale' },
  { id: 'dur-fast',    name: 'fast',    value: '100ms', category: 'duration', group: 'scale' },
  { id: 'dur-normal',  name: 'normal',  value: '200ms', category: 'duration', group: 'scale' },
  { id: 'dur-slow',    name: 'slow',    value: '300ms', category: 'duration', group: 'scale' },
  { id: 'dur-slower',  name: 'slower',  value: '500ms', category: 'duration', group: 'scale' },
]

// ─── All primitives ───────────────────────────────────────────────────────────

export const DEFAULT_PRIMITIVES: PrimitiveToken[] = [
  ...SPECIAL,
  ...GRAY, ...BLUE, ...GREEN, ...RED, ...AMBER, ...PURPLE, ...CYAN,
  ...spacingTokens(),
  ...FONT_FAMILY, ...FONT_SIZE, ...FONT_WEIGHT,
  ...RADIUS,
  ...DURATION,
]

// ─── Semantic defaults ────────────────────────────────────────────────────────

function sem(
  group: string,
  name: string,
  light: string,
  dark: string,
  description?: string,
): SemanticToken {
  return {
    id: `sem-color-${group}-${name}`,
    name,
    category: 'color',
    group,
    light,
    dark,
    description,
  }
}

export const DEFAULT_SEMANTIC_TOKENS: SemanticToken[] = [
  // Background
  sem('background', 'default',    'white',       'gray-950',  'Page background'),
  sem('background', 'subtle',     'gray-50',     'gray-900',  'Subtle surface'),
  sem('background', 'muted',      'gray-100',    'gray-800',  'Muted surface'),
  sem('background', 'inverse',    'gray-900',    'white',     'Inverse background'),
  sem('background', 'primary',    'blue-600',    'blue-500',  'Primary action background'),
  sem('background', 'danger',     'red-600',     'red-500',   'Destructive action background'),
  sem('background', 'warning',    'amber-400',   'amber-300', 'Warning background'),
  sem('background', 'success',    'green-600',   'green-500', 'Success background'),

  // Text
  sem('text', 'primary',    'gray-900',  'gray-50',   'Primary text'),
  sem('text', 'secondary',  'gray-600',  'gray-400',  'Secondary text'),
  sem('text', 'tertiary',   'gray-400',  'gray-600',  'Tertiary / placeholder text'),
  sem('text', 'inverse',    'white',     'gray-900',  'Text on dark backgrounds'),
  sem('text', 'disabled',   'gray-300',  'gray-700',  'Disabled text'),
  sem('text', 'danger',     'red-600',   'red-400',   'Error / danger text'),
  sem('text', 'success',    'green-700', 'green-400', 'Success text'),
  sem('text', 'link',       'blue-600',  'blue-400',  'Interactive link text'),

  // Border
  sem('border', 'default',  'gray-200',  'gray-700',  'Default border'),
  sem('border', 'strong',   'gray-400',  'gray-500',  'Stronger border'),
  sem('border', 'focus',    'blue-500',  'blue-400',  'Focus ring'),
  sem('border', 'danger',   'red-500',   'red-400',   'Error border'),
  sem('border', 'success',  'green-500', 'green-400', 'Success border'),

  // Icon
  sem('icon', 'default',  'gray-700',  'gray-300', 'Default icon'),
  sem('icon', 'muted',    'gray-400',  'gray-600', 'Muted icon'),
  sem('icon', 'inverse',  'white',     'gray-900', 'Inverse icon'),
  sem('icon', 'danger',   'red-500',   'red-400',  'Danger icon'),
]

// ─── Default theme ────────────────────────────────────────────────────────────

export const BASE_THEME: Theme = {
  id: 'base',
  name: 'Base',
  overrides: {},
}

export const DEFAULT_THEMES: Theme[] = [BASE_THEME]
