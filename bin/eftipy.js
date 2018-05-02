#!/usr/bin/env node

'use strict';

const eftipy = require('../');
const pipe = require('pipe-io/legacy');

const argv = process.argv.slice(2);
const addr = argv[0];
const filename = argv[1];
const callback = (error) => {
    if (error)
        console.error(error.message);
};

let ftp;

if (!addr) {
    console.log('eftipy <host> <filename>');
} else if (/-v|--version/.test(addr)){
    console.log(version());
} else {
    ftp = eftipy(addr, filename);
    
    ftp.on('error', callback);
    
    ftp.on('dir', (list) => {
        list.forEach((file) => {
            console.log(file.name);
        });
    });
    
    ftp.on('file', (stream) => {
        pipe([stream, process.stdout], callback);
    });
}

function version() {
    return 'v' + require('../package.json').version;
}

