
var backends = Object.create(null);
backends.dom = require('./DOMBackend');
backends.collect = require('./CollectBackend');
backends.auto = typeof window !== 'undefined' ? backends.dom : backends.collect;

function setBackend(b) {
    if (typeof b === 'string') {
        if (!(b in backends)) {
            throw new Error('Unknown backend ' + b);
        }
        b = backends[b];
    }

    if (typeof b === 'function') {
        b = new b();
    }
    exports.current = b;
}

setBackend('auto');
exports.setBackend = setBackend;
