import babel from "rollup-plugin-babel";

export default {
    entry: "src/sansSel.js",
    plugins: [ babel() ],
    format: "umd",
    moduleName: "sansSel",
};
