export default function (o, props) {
    var prop;
    for (prop in props) {
        Object.defineProperty(o, prop, {
            value: props[prop],
            writable: false,
        });
    }
}
