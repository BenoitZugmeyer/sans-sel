import babel from "rollup-plugin-babel"

export default {
  entry: "src/sansSel.js",
  plugins: [
    babel({
            // Add a whitelist, else the AsyncGenerator helper is included no matter what.
      externalHelpersWhitelist: [
        "typeof",
      ],
    }),
  ],
  format: "umd",
  moduleName: "sansSel",
}
