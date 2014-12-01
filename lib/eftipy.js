(function() {
    'use strict';
    
    var FTP             = require('ftp'),
        EventEmitter    = require('events').EventEmitter,
        ERROR_OPEN      = 550;
    
    module.exports  = function(addr, filename) {
        var emitter = new EventEmitter(),
            dir,
            ftp     = new FTP(),
            dirs    = addr.split('/'),
            host    = dirs.shift();
            
            dir = '/' + dirs.join('/');
        
        ftp.on('ready', function() {
            if (filename)
                ftp.put(filename, dir, function(error) {
                    if (error)
                        emitter.emit('error', error);
                    
                    ftp.end();
                });
            else
                ftp.get(dir, function(error, file) {
                    if (!error)
                        emitter.emit('file', file);
                    else if (error.code !== ERROR_OPEN)
                        emitter.emit('error', error);
                    else
                        ftp.list(dir, function(error, list) {
                            if (error)
                                emitter.emit('error', error);
                            else
                                emitter.emit('dir', list);
                        });
                    
                    ftp.end();
                });
        });
        
        ftp.on('error', function(error) {
            emitter.emit('error', error);
        });
        
        ftp.connect({
            host: host
        });
        
        return emitter;
    };
})();
