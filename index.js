require('dotenv').config()
var { argv: { port, host, verbose, filter } } = require('yargs')
    .usage('Usage: $0 -p <local port> -h <local ip> -v < degree of verbosity> -f <filter by client ip>')
    .example('$0 -p 8080 -h 0.0.0.0 -v 3 -f 192.168.43.12')
    .example('$0 -p 9090 -h 192.168.43.1 -v 0')
    .default({
        p: process.env.PROXY_PORT || 8080,
        a: process.env.PROXY_IP || '0.0.0.0',
        v: 1
    })
    .help('h')
    .alias({ h: 'help', p: 'port', a: 'host', v: 'verbose', f: 'filter' })
    .epilog('copyright 2020 © nikhilesh')
process.env.PROXY_PORT = port
process.env.PROXY_IP = host

if (filter)
    process.env.DEBUG = '*:' + filter + ':*'
else {
    var levels = ['proxy:status', 'proxy:status:*', 'proxy:log:*,proxy:log', 'error,error:*']
    process.env.DEBUG = levels.slice(0, verbose).join()
}
require('./app')