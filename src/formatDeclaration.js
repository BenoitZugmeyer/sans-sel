import assertValidIdentifier from "./assertValidIdentifier";

const formatDeclarationCache = Object.create(null);

const unitLess = Object.create(null);
[
    "columnCount",
    "fillOpacity",
    "flex",
    "flexGrow",
    "flexShrink",
    "fontWeight",
    "lineClamp",
    "lineHeight",
    "opacity",
    "order",
    "orphans",
    "strokeOpacity",
    "transition",
    "transitionDelay",
    "transitionDuration",
    "widows",
    "zIndex",
    "zoom",
].forEach((property) => {
    unitLess[property] = true;
});

export default function formatDeclaration(property, value) {
    if (__DEV__) {
        assertValidIdentifier(property);
    }

    if (Array.isArray(value)) {
        return value.map((v) => formatDeclaration(property, v)).reverse().join("\n");
    }

    const isUnitLess = unitLess[property];

    if (property === "content") {
        value = JSON.stringify(value);
    }
    else if (typeof value === "number" && !isUnitLess) {
        value += "px";
    }

    if (!(property in formatDeclarationCache)) {
        formatDeclarationCache[property] = property.replace(/([A-Z])/g, "-$1");
    }

    return `${formatDeclarationCache[property]}:${value};`;
}
