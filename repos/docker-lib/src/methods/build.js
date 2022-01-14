const { toBuildArgs } = require('../utils/buildArgs')
const { toBuildTags } = require('../utils/buildTags')
const { getBuildCmd } = require('../utils/getBuildCmd')
const { toBuildLabels } = require('../utils/buildLabels')
const { noPropArr, noOpObj, isStr, isBool } = require('@keg-hub/jsutils')

/*
const {
  cmd,
  env,
  ssh,
  pull,
  url,
  quiet,
  secret,
  buildX,
  target,
  squash,
  ulimit,
  output,
  memory,
  rm=true,
  iidfile,
  addHost,
  shmSize,
  cpuQuota,
  network,
  platform,
  compress,
  progress,
  cpuPeriod,
  isolation,
  cpuShares,
  cacheFrom,
  entrypoint,
  cache=true,
  forceRm=true,
  memorySwap,
  cpusetCpus,
  cpusetMems,
  securityOpt,
  cgroupParent,
  buildArgs=noPropArr,
  disableContentTrust,
} = args
*/


const paramMap = {
  addHost: `add-host`,
  cacheFrom: `cache-from`,
  cgroupParent: `cgroup-parent`,
  compress: `compress`,
  cpuPeriod: `cpu-period`,
  cpuquota: `cpu-quota`,
  cpuShares: `cpu-shares`,
  cpusetCpus: `cpuset-cpus`,
  cpusetMems: `cpuset-mems`,
  disableContentTrust: `disable-content-trust`,
  forceRm: `force-rm`,
  iidfile: `iidfile`,
  isolation: `isolation`,
  label: `label`,
  memory: `memory`,
  memorySwap: `memory-swap`,
  network: `network`,
  noCache: `no-cache`,
  output: `output`,
  progress: `progress`,
  quiet: `quiet`,
  rm: `rm`,
  shmSize: `shm-size`,
  squash: `squash`,
  ssh: `ssh`,
  stream: `stream`,
  target: `target`,
  ulimit: `ulimit`,
}

const defTrueParams = [
  `rm`,
  `forceRm`,
]

const inverseParams = [
  `cache`,
]

/**
 * TODO: this could be more generalized to work with all commands
 * It could get a paramMap passed in and build it the params from that
 * Instead of the locally hardCoded one
 */
const getBuildParams = args => {
  return Object.entries(args).reduce((acc, [key, value]) => {
    if(!paramMap[key]) return acc
    const docKey = paramMap[key]

    if(isStr(value))
      acc.push(`--${docKey}`, value)

    else if(isBool(value) && (value !== false && defTrueParams.includes(key)))
      acc.push(`--${docKey}`)

    // TODO: investigate this more
    else if(isBool(value) && (!value && inverseParams.includes(key)))
      acc.push(`--${docKey}`)

    return acc
  }, []).join(` `)
}

/**
 * See here for full list => https://docs.docker.com/engine/reference/commandline/build/#set-build-time-variables-build-arg
 * 
 */
const dockerBuild = async args => {

  const {
    env,
    push,
    file,
    buildX,
    buildx=buildX,
    tags=noPropArr,
    labels=noPropArr,
    buildArgs=noOpObj,
    envs=env || noOpObj,
  } = args

  const buildArr = [
    `docker`,
    getBuildCmd(buildx, push),
    toBuildArgs(envs),
    toBuildArgs(buildArgs),
    toBuildTags(tags),
    toBuildLabels(labels),
    getBuildParams(args),
    location
  ]

  envFile && buildArr.push(`--envFile`, envFile)
  file && buildArr.push(`-f`, file)

}

module.exports = {
  dockerBuild,
}