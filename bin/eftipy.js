#!/usr/bin/env node

'use strict';

var eftipy      = require('../'),
    pipe        = require('pipe-io/legacy'),
    
    argv        = process.argv.slice(2),
    addr        = argv[0],
    filename    = argv[1],
    callback    = function(error) {
        if (error)
            console.error(error.message);
    },
    ftp;

if (!addr) {
    console.log('eftipy <host> <filename>');
} else if (/-v|--version/.test(addr)){
    console.log(version());
} else {
    ftp = eftipy(addr, filename);
    
    ftp.on('error', callback);
    
    ftp.on('dir', function(list) {
        list.forEach(function(file) {
            console.log(file.name);
        });
    });
    
    ftp.on('file', function(stream) {
        pipe([stream, process.stdout], callback);
    });
}

function version() {
    return 'v' + require('../package.json').version;
}
