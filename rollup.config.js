import babel from 'rollup-plugin-babel'

export default {
  input: 'src/mobx-location.js',
  plugins: [babel()],
  output: [
    { file: 'dist/mobx-location.cjs.js', format: 'cjs' },
    { file: 'dist/mobx-location.es.js', format: 'es' }
  ]
}
