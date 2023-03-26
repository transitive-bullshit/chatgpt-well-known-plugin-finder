import fs from 'node:fs/promises'

export async function readJson<T = any>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, 'utf-8'))
}

export async function writeJson<T = any>(filePath: string, json: T) {
  return fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8')
}

export function pick<T extends object, U = T>(obj: T, ...keys: string[]): U {
  return Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]])
  ) as U
}

export function omit<T extends object, U = T>(obj: T, ...keys: string[]): U {
  return Object.fromEntries<T>(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  ) as U
}
