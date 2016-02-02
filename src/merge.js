import isPlainObject from "./isPlainObject";

export default function merge(target, source, shallow) {
    if (typeof source !== "object" || !source) return target;

    Object.keys(source).forEach(function (key) {
        var sourceValue = source[key];

        if (sourceValue === undefined || sourceValue === null) {
            delete target[key];
        }
        else if (shallow !== true && isPlainObject(sourceValue)) {
            if (!Object.prototype.hasOwnProperty.call(target, key) ||
                    !isPlainObject(target[key])) {
                target[key] = {};
            }
            merge(target[key], sourceValue);
        }
        else {
            target[key] = sourceValue;
        }

    });

    return target;
}
