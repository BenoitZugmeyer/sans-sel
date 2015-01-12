var owns = require('../owns');

var backends = {
    dom: require('./DOMBackend'),
    collect: require('./CollectBackend'),
};
backends.auto = typeof window !== 'undefined' ? backends.dom : backends.collect;

function getBackend(b) {

    if (!b) {
        b = 'auto';
    }

    if (typeof b === 'string') {
        if (!owns(backends, b)) {
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
