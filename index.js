#!/usr/bin/env node
const DHT = require('holesail-server') //require module to start server on local port
const goodbye = require('graceful-goodbye')
const argv = require('minimist')(process.argv.slice(2)) //required to parse cli arguments
const helpMessage = 'Usage: The command below will expose your local port to the network\nholesail --live port \n Command to connect to a holesail-server:\n holesail --connect <seed> --port <portno>'

//setting up the command hierarchy
if (argv.help) {
    console.log(helpMessage)
    process.exit(-1)
}
const localServer = new DHT();
if (argv.live) {
    // --host
    if (argv.host) {
        host = argv.host
    } else {
        host = '127.0.0.1'
    }

    localServer.serve(argv.live, host, () => {
        console.log(`Server started, Now listening on port ${host}:` + argv.live);
        console.log('Server public key:', localServer.getPublicKey());
    });

} else if (argv.connect) {


    if (!argv.port) {
        port = 8989
    } else {
        port = argv.port
    }
     //--host
    if (argv.host) {
        host = argv.host
    } else {
        host = '127.0.0.1'
    }

    const holesailClient = require('holesail-client')
    const pubClient = new holesailClient(argv.connect)
    pubClient.connect(port, host, () => {
        console.log(`Listening on ${host}:${port}`)
    })
} else {
    console.log(helpMessage);
    process.exit(-1)
}

goodbye(async () => {
    await localServer.destroy()
})