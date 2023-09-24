export async function builder() {
  return await Bun.build({
    entrypoints: ['./src/components/app.ts'],
    outdir: './public',
    minify: true
  })
}