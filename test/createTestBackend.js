
export default function () {
    function testBackend(rule) {
        testBackend.rules.push(rule);
    }

    // Expose rules so we can test them
    testBackend.rules = [];

    return testBackend;
}
