var net = require('net');
var LOCAL_PORT = parseInt(process.env.PROXY_PORT) || 3131;
var log = require('debug')("proxy:log")
var error = require('debug')("error")

var server = net.createServer(function (socket) {
    var log = require('debug')("proxy:log:" + `${socket.remoteAddress}:${socket.remotePort}`)
    var error = require('debug')("error:" + `${socket.remoteAddress}:${socket.remotePort}`)
    log(` connected via TCP`);
    socket.once('close', () => log(` disconnected via TCP`))
    socket.on('error', e => error(`  got Error:${e.code}`))
    socket.once('data', function (msg) {
        var message = msg.toString();
        var [METHOD, address] = message.split("\n")[0].split(" ")
        var [ipaddress, port] = address.split(":")
        log(` requested ${METHOD} for ${address}`);
        if (METHOD !== 'CONNECT') {
            error(` bad request method ${METHOD} for ${address}`)
            socket.end(`HTTP/1.1  400 Bad Request\nContent-Type:text/html\n\n<center><h1>400 Bad Request</h1><hr>upgrade to ssl<br><h6>from Your Proxy Server</h6></center>\n\n`)
            return
        } else {
            var serviceSocket = new net.Socket();
            serviceSocket.connect(parseInt(port), ipaddress, function () {
                log(` connected to ${address}`);
                socket.write(`HTTP/1.1 200 OK\n\n`)
                socket.pipe(serviceSocket)
                serviceSocket.pipe(socket)
            });
            serviceSocket.once('close', () => log(` disconnected from ${address}`))
            serviceSocket.on('error', e => {
                error(` client ${address} got Error:${e.code}`)
                socket.end(`HTTP/1.1 503 Service Unavailable\n\n`);
                serviceSocket.end()
            })
        }
    });
});

server.listen(LOCAL_PORT, '0.0.0.0', (port, host) => log(`Proxy Server listening at ${'0.0.0.0'}:${LOCAL_PORT}`));
