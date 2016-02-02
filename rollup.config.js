import babel from "rollup-plugin-babel";

export default {
    entry: "src/browser.js",
    plugins: [ babel() ],
    format: "umd",
    moduleName: "sansSel",
};
