var backends = Object.create(null);
backends.dom = require('./DOMBackend');
backends.collect = require('./CollectBackend');
backends.auto = typeof window !== 'undefined' ? backends.dom : backends.collect;

function getBackend(b) {

    if (!b) {
        b = 'auto';
    }

    if (typeof b === 'string') {
        if (!(b in backends)) {
            throw new Error('Unknown backend ' + b);
        }
        b = backends[b];
    }

    if (typeof b === 'function') {
        b = new b();
    }

    return b;
}

exports.getBackend = getBackend;
