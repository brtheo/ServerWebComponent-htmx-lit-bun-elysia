export async function builder() {
  return await Bun.build({
    entrypoints: ['./src/web/app.ts'],
    outdir: './public',
    minify: {
      identifiers: false,
      whitespace: true,
      syntax: true
    }
  })
}