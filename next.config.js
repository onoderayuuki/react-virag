const transpileModules = require("next-transpile-modules")
const withTM = transpileModules(["react-konva","konva","react-image-size"])
module.exports = withTM()


