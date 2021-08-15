const transpileModules = require("next-transpile-modules")

const withTM = transpileModules(["react-konva","react-image-size"])

module.exports = withTM()


// module.exports ={
//   reactStrictMode: true,
// }
