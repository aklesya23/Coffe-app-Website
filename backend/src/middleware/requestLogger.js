export function requestLogger(req, res, next) {
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    const status = res.statusCode
    const color = status >= 400 ? '\x1b[31m' : '\x1b[32m'
    console.log(`${color}${req.method} ${req.url} → ${status} (${ms}ms)\x1b[0m`)
  })
  next()
}