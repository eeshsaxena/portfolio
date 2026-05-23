const path = require('path')
const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const ip = require('ip')
const portFinderSync = require('portfinder-sync')
const { createProxyMiddleware } = require('http-proxy-middleware')

const infoColor = (_message) =>
{
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

const REMIX_PORT = 7777

module.exports = merge(
    commonConfiguration,
    {
        stats: 'errors-warnings',
        mode: 'development',
        infrastructureLogging:
        {
            level: 'warn',
        },
        devServer:
        {
            host: 'local-ip',
            port: portFinderSync.getPort(8080),
            open: true,
            https: false,
            allowedHosts: 'all',
            hot: false,
            watchFiles: ['src/**', 'static/**'],
            static:
            {
                watch: true,
                directory: path.join(__dirname, '../static')
            },
            client:
            {
                logging: 'none',
                overlay: true,
                progress: false
            },
            setupMiddlewares: function(middlewares, devServer)
            {
                const port = devServer.options.port
                const https = devServer.options.https ? 's' : ''
                const localIp = ip.address()
                const domain1 = `http${https}://${localIp}:${port}`
                const domain2 = `http${https}://localhost:${port}`

                console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`)
                console.log(`  - Simple View: ${infoColor(`${domain2}/simple`)}`)

                // Proxy /simple/* → Remix dev server at root
                // pathRewrite strips the /simple prefix so Remix sees /
                const remixProxy = createProxyMiddleware({
                    target: `http://localhost:${REMIX_PORT}`,
                    changeOrigin: true,
                    ws: true,
                    pathRewrite: { '^/simple': '' },
                    on: {
                        error: (err, req, res) => {
                            console.warn('[Proxy] Remix server not running — start it with: npm run dev:simple')
                            if (res && res.writeHead) {
                                res.writeHead(502)
                                res.end('<h2 style="font-family:monospace;color:#ff4444">Simple View offline</h2><p>Run <code>npm run dev:simple</code> in a second terminal, then refresh.</p>')
                            }
                        }
                    }
                })

                // Mount proxy for /simple and /simple/* — also proxy Remix asset paths
                devServer.app.use('/simple', remixProxy)

                return middlewares
            }
        }
    }
)
