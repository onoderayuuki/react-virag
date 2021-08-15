const transpileModules = require("next-transpile-modules")

const withTM = transpileModules(["react-konva"])

module.exports = withTM()


// module.exports ={
//   reactStrictMode: true,
// }
