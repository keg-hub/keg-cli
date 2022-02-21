const { getGitKey } = require('KegUtils')

const printGitKey = async (args) => {
  const { globalConfig, params } = args
  const key = await getGitKey(globalConfig, params)
  console.log(key)
}

module.exports = {
  print: {
    name: 'print',
    action: printGitKey,
    description: `Prints the store github key in plain text`,
    example: 'keg git key print',
    options: {
      profile: {
        alias: ['pat', 'pro'],
        example: "keg git key print --profile <alias>",
      }
    }
  }
}
