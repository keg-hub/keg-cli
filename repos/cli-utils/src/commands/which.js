const { runCmd } = require('./commands')
const { limbo } = require('@keg-hub/jsutils')


const which = async (cmd, throwErr=true) => {
  const [err, res] = await limbo(runCmd(`which`, [cmd], { exec: true }))
  const { error, data, exitCode } = res

  if(exitCode || error || err){
    if(throwErr) throw new Error(err || error || `${cmd} not found`)
    return false
  }

  return data
}

module.exports = {
  which
}
