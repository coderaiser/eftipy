#!/usr/bin/env node

(function() {
    'use strict';
    
    var ftop        = require('../'),
        pipe        = require('pipe-io'),
        
        slice       = [].slice.bind(process.argv),
        argv        = slice(2),
        addr        = argv.pop(),
        ftp;
    
    if (!addr)
        console.log('ftp <host>');
    else
        ftp = ftop(addr);
        
        ftp.on('error', function(error) {
            console.error(error.message);
        });
        
        ftp.on('dir', function(list) {
            list.forEach(function(file) {
                console.log(file.name);
            });
        });
        
        ftp.on('file', function(stream) {
            pipe.getBody(stream, function(error, data) {
                if (error)
                    console.error(error.message);
                else
                    console.log(data);
            });
        });
})();
