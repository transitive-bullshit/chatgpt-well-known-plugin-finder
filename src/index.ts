import * as fs from 'node:fs/promises'

import cliProgress from 'cli-progress'
import flatCache from 'flat-cache'
import pMap from 'p-map'
import pMemoize from 'p-memoize'
import papaparse from 'papaparse'

import * as utils from './utils'
import got from './got'

const cache = flatCache.load('well-known-ai-plugins-by-domain')

const getAIPluginMetadataForDomain = pMemoize(
  getAIPluginMetadataForDomainImpl,
  {
    cache: {
      get: (key: string) => {
        return cache.getKey(key)
      },
      set: (key: string, value) => {
        cache.setKey(key, value)
      },
      has: (key: string) => {
        return cache.getKey(key) !== undefined
      },
      delete: (key: string) => {
        return cache.removeKey(key)
      }
    }
  }
)

async function main() {
  const topNDomains = 1000000
  const parsed = papaparse.parse(await fs.readFile('top-1m.csv', 'utf-8'))
  const domains: string[] = parsed.data
    .map((row) => row[1])
    .slice(0, topNDomains)
  console.log(domains)

  const progressBar = new cliProgress.SingleBar(
    {
      hideCursor: true
    },
    cliProgress.Presets.shades_classic
  )

  let aiPlugins: Record<string, any> = {}
  try {
    aiPlugins = await utils.readJson('ai-plugins.json')
  } catch (err) {}

  progressBar.start(domains.length, 0)
  let maxIndex = 0
  await pMap(
    domains,
    async (domain, index) => {
      if (index > maxIndex) {
        maxIndex = index
        progressBar.update(maxIndex + 1)
      }

      const res = await getAIPluginMetadataForDomain(domain)
      if (res) {
        // save the plugins every time we find a new one
        aiPlugins[domain] = res
        await utils.writeJson('ai-plugins.json', aiPlugins)
      }

      if (index % 10000 === 0) {
        cache.save(true)
      }
    },
    { concurrency: 128 }
  )

  progressBar.stop()
  console.log(`\nfound ${Object.keys(aiPlugins).length} plugins\n`)
  console.log(aiPlugins)
  console.log(`\nfound ${Object.keys(aiPlugins).length} plugins\n`)

  await utils.writeJson('ai-plugins.json', aiPlugins)
  cache.save(true)
}

async function getAIPluginMetadataForDomainImpl(domain: string): Promise<any> {
  try {
    const url = `https://${domain}/.well-known/ai-plugin.json`
    const parsedUrl = new URL(url)
    const res: any = await got(url, {
      timeout: {
        request: 10000
      }
    }).json()

    if (!res || res.status === 404 || res.status === '404') {
      return null
    }
    if (!res.description_for_model || !res.api) {
      return null
    }

    return res
  } catch (err) {
    return null
  }
}

main().catch((err) => {
  console.error('error', err)
  process.exit(1)
})
