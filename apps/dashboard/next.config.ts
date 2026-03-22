import type { NextConfig } from 'next'

const config: NextConfig = {
  transpilePackages: ['@dsbuilder/core', '@dsbuilder/tokens'],
}

export default config
