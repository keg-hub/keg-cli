const colorMap = {
  black: `\x1b[30m`,
  red: `\x1b[31m`,
  green: `\x1b[32m`,
  yellow: `\x1b[33m`,
  blue: `\x1b[34m`,
  magenta: `\x1b[35m`,
  cyan: `\x1b[36m`,
  white: `\x1b[37m`,
  gray: `\x1b[90m`,
  crimson: `\x1b[38m`,
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underline: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
}

const addColor = (...args) => `${args.join('')}${colorMap.reset}`

const colors = {
  colorMap,
  red: (log) => addColor(colorMap.red, log),
  blue: (log) => addColor(colorMap.blue, log),
  gray: (log) => addColor(colorMap.gray, log),
  cyan: (log) => addColor(colorMap.cyan, log),
  green: (log) => addColor(colorMap.green, log),
  white: (log) => addColor(colorMap.white, log),
  yellow: (log) => addColor(colorMap.yellow, log),
  magenta: (log) => addColor(colorMap.magenta, log),
  brightRed: (log) => addColor(colorMap.bright, colorMap.red, log),
  brightBlue: (log) => addColor(colorMap.bright, colorMap.blue, log),
  brightGray: (log) => addColor(colorMap.bright, colorMap.gray, log),
  brightCyan: (log) => addColor(colorMap.bright, colorMap.cyan, log),
  brightWhite: (log) => addColor(colorMap.bright, colorMap.white, log),
  brightGreen: (log) => addColor(colorMap.bright, colorMap.green, log),
  brightYellow: (log) => addColor(colorMap.bright, colorMap.yellow, log),
  brightMagenta: (log) => addColor(colorMap.bright, colorMap.magenta, log),
}

colors.underline = Object.keys(colors).reduce((acc, key) => {
  acc[key] = (log) => addColor(colorMap.underline, colors[key](log))

  return acc
}, {})

colors.dim = Object.keys(colors).reduce((acc, key) => {
  acc[key] = (log) => addColor(colorMap.dim, colors[key](log))

  return acc
}, {})


module.exports = {
  colors,
}
