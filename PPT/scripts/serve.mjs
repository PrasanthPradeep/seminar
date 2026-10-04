// Self-contained: starts a static server for dist/, runs the requested
// script against it, then shuts everything down.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const ROOT = new URL('../dist/', import.meta.url).pathname
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(req.url.split('?')[0]))
  let file = join(ROOT, path === '/' ? 'index.html' : path)
  try {
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    try {
      res.writeHead(200, { 'content-type': 'text/html' })
      res.end(await readFile(join(ROOT, 'index.html')))
    } catch {
      res.writeHead(404).end('not found')
    }
  }
})

await new Promise((r) => server.listen(0, r))
const { port } = server.address()
process.env.URL = `http://localhost:${port}/`
console.log(`serving dist on ${process.env.URL}`)

// Forward the remaining argv entries to the loaded script.
const [script, ...rest] = process.argv.slice(2)
process.argv = [process.argv[0], new URL(script, import.meta.url).pathname, ...rest]
await import(new URL(script, import.meta.url).href)

server.close()
process.exit(0)