import * as utils from './utils'

async function main() {
  const aiPlugins: Record<string, any> = await utils.readJson('ai-plugins.json')
  const keys = Object.keys(aiPlugins).sort((a, b) => a.length - b.length)
  const t = new Set<string>()
  const k = keys.filter((key, i) => {
    const v = aiPlugins[key]
    if (!v) return false
    const name = v.name_for_model?.toLowerCase()

    if (!name) return false
    if (t.has(name)) return false
    t.add(name)

    return true
  })
  const plugins: Record<string, any> = {}
  for (const key of k) {
    plugins[key] = aiPlugins[key]
  }

  console.log(plugins)
  console.log(
    `\nfound ${Object.keys(plugins).length} plugins (${
      Object.keys(aiPlugins).length
    } total)\n`
  )

  await utils.writeJson('ai-plugins-unique.json', plugins)
}

main().catch((err) => {
  console.error('error', err)
  process.exit(1)
})
