var net = require('net');
var LOCAL_PORT = parseInt(process.env.PROXY_PORT) || 3131;
if (process.env.PRODUCTION) console.log = () => { }
var users = {
    kaka: 'mama',
    local: 'pc',
    "": ""
}
var connected = new Set
var server = net.createServer(function (socket) {
    socket.once('data', function (msg) {
        console.log('  ** START **');
        var message = msg.toString()
        var [METHOD, address] = message.split("\n")[0].split(" ")
        console.log('<< From client to proxy ', address);
        var auth = message.search('Proxy-Authorization: Basic ')
        if (auth > 0) {
            let data = message.substring(auth).split(" ").pop();
            let buff = new Buffer(data, 'base64');
            let [user, password] = buff.toString('ascii').split(":");
            if (connected.has(user))
                console.log("A request from " + user);
            else {
                if (user in users && password === users[user]) {
                    console.log(`${user} is authroized now!`)
                }
                else {
                    console.log("Unauthorized user " + user + " diconnected!")
                    socket.write(`HTTP/1.1 401 Unauthorized

`)
                    return
                }
                connected.add(user)
                console.log("New User " + user + 'connected!')
            }
        } else {
            socket.write(`HTTP/1.1 407 Proxy Authentication
Proxy-Authenticate: Basic realm="Access to the internal site"

`)
            console.log("::<< From proxy to client 407 Proxy Authentication")
            return
        }
        var [ipaddress, port] = address.split(":")
        if (METHOD !== 'CONNECT') {

            socket.write(`HTTP/1.1  400 Bad Request
Proxy-Authenticate: Basic realm="Access to the internal site"

`)
            console.log("::<< From proxy to client 400 Bad Request")
            return
        }
        var serviceSocket = new net.Socket();
        serviceSocket.connect(parseInt(port), ipaddress, function () {
            socket.write(`HTTP/1.1 200 OK

`)
            console.log("::<< From proxy to client 200")
            socket.pipe(serviceSocket)
            serviceSocket.pipe(socket)
        });
        serviceSocket.on('error', (...a) => {
            console.log(a);
            socket.write(`HTTP/1.1 503 Service Unavailable

            `)
            console.log("::<< From proxy to client 503 Service Unavailable")
        })
        socket.on('error', (...a) => {
            console.log(a);
        })
    });
});

server.listen(LOCAL_PORT);
console.log("TCP server accepting connection on port: " + LOCAL_PORT);