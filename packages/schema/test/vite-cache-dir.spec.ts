import { describe, expect, it, vi } from 'vitest'
import { applyDefaults } from 'untyped'
import { resolve } from 'pathe'

import { NuxtConfigSchema } from '../src/index.ts'
import type { NuxtOptions } from '../src/index.ts'

vi.mock('node:fs', () => ({
  existsSync: (id: string) => id.endsWith('app'),
}))

describe('vite.cacheDir', () => {
  it('resolves under workspaceDir when rootDir matches workspaceDir', async () => {
    const result = await applyDefaults(NuxtConfigSchema, {
      rootDir: '/project',
      workspaceDir: '/project',
    }) as unknown as NuxtOptions

    expect(result.vite.cacheDir).toBe(resolve('/project', 'node_modules/.cache/vite'))
  })

  it('appends a per-app suffix when rootDir is nested under workspaceDir', async () => {
    const result = await applyDefaults(NuxtConfigSchema, {
      rootDir: '/project/src',
      workspaceDir: '/project',
    }) as unknown as NuxtOptions

    expect(result.vite.cacheDir).toBe(resolve('/project', 'node_modules/.cache/vite', 'src'))
  })

  it('respects an explicit vite.cacheDir', async () => {
    const result = await applyDefaults(NuxtConfigSchema, {
      rootDir: '/project/src',
      workspaceDir: '/project',
      vite: { cacheDir: '/custom/cache' },
    }) as unknown as NuxtOptions

    expect(result.vite.cacheDir).toBe('/custom/cache')
  })
})
