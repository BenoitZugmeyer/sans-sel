
module.exports = function assertValidIdentifier(id) {
    if (!/^[a-z](?:[a-z0-9_-]*[a-z0-9])?$/i.test(id)) {
        throw new Error('Invalid identifier: ' + id);
    }
};

