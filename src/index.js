
function sansSel(options) {
    return new sansSel.SansSel(options);
}

sansSel.merge = require('./merge');
sansSel.SansSel = require('./SansSel');
sansSel.Backend = require('./Backend');

module.exports = sansSel;
