(function() {
    'use strict';
    
    var FTP             = require('ftp'),
        EventEmitter    = require('events').EventEmitter,
        ERROR_OPEN      = 550;
    
    module.exports  = function(addr) {
        var emitter = new EventEmitter(),
            dir,
            ftp     = new FTP(),
            dirs    = addr.split('/'),
            host    = dirs.shift();
            
            dir = '/' + dirs.join('/');
        
        ftp.on('ready', function() {
            ftp.get(dir, function(error, file) {
                if (!error)
                    emitter.emit('file', file);
                else if (error.code === ERROR_OPEN)
                    ftp.list(dir, function(error, list) {
                        if (error)
                            emitter.emit('error', error);
                        else
                            emitter.emit('dir', list);
                        
                        ftp.end();
                    });
                else
                    emitter.emit('error', error);
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