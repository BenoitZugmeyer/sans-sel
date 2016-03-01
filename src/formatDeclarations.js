import isPlainObject from "./isPlainObject";
import formatDeclaration from "./formatDeclaration";

export default function formatDeclarations(selector, declaration, cb, media) {
    var result = "";

    var subRules = [];
    var property, value;

    for (property in declaration) {
        value = declaration[property];

        if (isPlainObject(value)) {
            subRules.push(property);
        }
        else {
            result += formatDeclaration(property, value);
        }
    }

    if (result) {
        result = `${selector}{${result}}`;

        if (media) {
            result = `${media}{${result}}`;
        }

        cb(result);
    }

    var i, l;
    for (i = 0, l = subRules.length; i < l; i++) {
        property = subRules[i];
        value = declaration[property];

        if (property.slice(0, 6) === "media ") {
            formatDeclarations(selector, value, cb, `@${property}`);
        }
        else {
            formatDeclarations(`${selector}:${property}`, value, cb, media);
        }
    }
}
