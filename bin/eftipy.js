#!/usr/bin/env node

(function() {
    'use strict';
    
    var eftipy      = require('../'),
        pipe        = require('pipe-io'),
        
        argv        = process.argv.slice(2),
        addr        = argv[0],
        filename    = argv[1],
        callback    = function(error) {
            if (error)
                console.error(error.message);
            
            process.exit();
        },
        ftp;
    
    if (!addr) {
        console.log('eftipy <host> <filename>');
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
})();
