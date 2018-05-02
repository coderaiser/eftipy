'use strict';

const FTP = require('ftp');
const EventEmitter = require('events').EventEmitter;
const ERROR_OPEN = 550;

module.exports  = (addr, filename) => {
    var emitter = new EventEmitter(),
        dir,
        ftp     = new FTP(),
        dirs    = addr.split('/'),
        host    = dirs.shift();
        
        dir = '/' + dirs.join('/');
    
    ftp.on('ready', () => {
        if (filename)
            ftp.put(filename, dir, (error) => {
                if (error)
                    emitter.emit('error', error);
                
                ftp.end();
            });
        else
            ftp.get(dir, (error, file) => {
                if (!error)
                    emitter.emit('file', file);
                else if (error.code !== ERROR_OPEN)
                    emitter.emit('error', error);
                else
                    ftp.list(dir, (error, list) => {
                        if (error)
                            return emitter.emit('error', error);
                        
                        emitter.emit('dir', list);
                    });
                
                ftp.end();
            });
    });
    
    ftp.on('error', (error) => {
        emitter.emit('error', error);
    });
    
    ftp.connect({
        host: host
    });
    
    return emitter;
};
