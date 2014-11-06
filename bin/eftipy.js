#!/usr/bin/env node

(function() {
    'use strict';
    
    var eftipy      = require('../'),
        pipe        = require('pipe-io'),
        
        slice       = [].slice.bind(process.argv),
        argv        = slice(2),
        addr        = argv.pop(),
        error       = function(error) {
            if (error)
                console.error(error.message);
        },
        ftp;
    
    if (!addr) {
        console.log('eftipy <host>');
    } else {
        ftp = eftipy(addr);
        
        ftp.on('error', error);
        
        ftp.on('dir', function(list) {
            list.forEach(function(file) {
                console.log(file.name);
            });
        });
        
        ftp.on('file', function(stream) {
            pipe([stream, process.stdout], {end: true}, function(error) {
                if (error)
                    console.error(error.message);
                
                process.exit();
            });
        });
    }
})();
