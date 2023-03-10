jest.resetModules()
jest.resetAllMocks()

const { colors }  = require('../colors')

const normalColors = [
  `red`,
  `blue`,
  `gray`,
  `cyan`,
  `green`,
  `white`,
  `yellow`,
  `magenta`,
] 

const brightColors = [
  `brightRed`,
  `brightCyan`,
  `brightBlue`,
  `brightWhite`,
  `brightGreen`,
  `brightYellow`,
  `brightMagenta`,
]

const colorNames = [
  ...normalColors,
  ...brightColors
]

describe('colors', () => {
  const message = `Test Log Message`

  it('should export methods for the colors names', () => {
    colorNames.map(name => {
      expect(typeof colors[name]).toBe(`function`)
      console.log(colors[name](`${message} - Color should be ${name}`))
    })
  })

  it('should add the correct color code for normal colors to the passed in log', () => {
    const reset = colors.colorMap.reset
    normalColors.map(name => {
      const colorCode = colors.colorMap[name]
      expect(colors[name](message)).toBe(`${colorCode}${message}${reset}`)
    })
  })

  it('should add the bright and the correct color code for bright colors to the passed in log', () => {
    const reset = colors.colorMap.reset
    const bright = colors.colorMap.bright

    brightColors.map(brightName => {
      const name = brightName.replace(`bright`, ``).toLowerCase()
      const colorCode = colors.colorMap[name]
      expect(colors[brightName](message)).toBe(`${bright}${colorCode}${message}${reset}`)
    })
  })

  it('should add the underline and color to the passed in log', () => {
    const reset = colors.colorMap.reset
    const underline = colors.colorMap.underline

    colorNames.map(colorName => {
      const name = colorName.replace(`bright`, ``).toLowerCase()
      const bright = colorName.includes(`bright`) ? colors.colorMap.bright : ``
      const colorCode = colors.colorMap[name]

      expect(colors.underline[colorName](message))
        .toBe(`${underline}${bright}${colorCode}${message}${reset}${reset}`)
    })
  })
  
})
