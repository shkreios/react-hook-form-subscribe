import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react'],

  treeshake: true,
  sourcemap: true,
  clean: true,
  splitting: true,

  outExtension: ({ format }) => ({
    js: format === 'cjs' ? '.js' : `.${format}.js`,
  }),
});
