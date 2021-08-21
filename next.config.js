const transpileModules = require("next-transpile-modules")
const withTM = transpileModules(["react-image-size"])
module.exports = withTM()

// const path = require('path')

// function generateIncludes(modules) {
//   return [
//     new RegExp(`(${modules.join('|')})$`),
//     new RegExp(`(${modules.join('|')})/(?!.*node_modules)`),
//   ]
// }

// const includes = generateIncludes([
//   'react-image-size',
//   'konva',
//   'react-konva',
// ])

// const config = {
//   webpack: (config) => {

//     config.externals = config.externals.map((external) => {
//       if (typeof external !== 'function') return external
//       return (context, request, callback) => {
//         return includes.find((i) =>
//           i.test(request.startsWith('.') ? path.resolve(context, request) : request)
//         )
//           ? callback() // i.e., not an external
//           : external(context, request, callback)
//       }
//     })

//     return config
//   },
// }

// // module.exports = withTM(config)
// module.exports = config
