import { terser } from "rollup-plugin-terser";

export default [
  // ESM Build
  {
    input: "pre-act.js",
    output: {
      file: "dist/pre-act.esm.js",
      format: "es",
      sourcemap: true
    },
    plugins: [terser()],
    inlineDynamicImports: true   // 🔥 Important
  },
  // UMD Build
  {
    input: "pre-act.js",
    output: {
      file: "dist/pre-act.umd.js",
      format: "umd",
      name: "PreAct",
      sourcemap: true,
      globals: {}
    },
    plugins: [terser()],
    inlineDynamicImports: true   // 🔥 Important
  }
];
