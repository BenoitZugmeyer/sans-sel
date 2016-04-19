import isPlainObject from "./isPlainObject";
import formatDeclaration from "./formatDeclaration";

export default function formatDeclarations(selector, declaration, cb, media) {
    let result = "";

    const subRules = [];

    for (const property in declaration) {
        const value = declaration[property];

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

    for (let i = 0; i < subRules.length; i++) {
        const property = subRules[i];
        const value = declaration[property];

        if (property.slice(0, 6) === "media ") {
            formatDeclarations(selector, value, cb, `@${property}`);
        }
        else {
            formatDeclarations(`${selector}:${property}`, value, cb, media);
        }
    }
}
