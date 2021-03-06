require('../../../scripts/cli/aliases')
const { asyncCmd } = require('@keg-hub/spawn-cmd')
const { apiSuccess } = require('../../libs/docker/helpers')
const { inspect } = require('../../libs/docker/image')


const getImages = async () => {
  const { data, error } = await asyncCmd(`docker image ls --format "{{json .}}"`, {cwd: process.cwd()})
  if(error) throw new Error(error)

  return apiSuccess(data, 'json')
}

const buildBase = async () => {

}

const checkBaseImage = async () => {
  const images = await getImages()
  
  const filteredImgs = await images.filter(image => image.rootId === 'keg-base')
  if(filteredImgs && filteredImgs.length)
    return filteredImgs.shift()

  // TODO: Create the docker base image if it does not exist

}

const initDockerForTests = async () => {
  const baseImg = await checkBaseImage()
  const baseInfo = await inspect({ image: baseImg.id })

  // Get the command => baseInfo.Config.Cmd
  // Get the ports => baseInfo.Config.ExposedPorts
  
  // console.log(`---------- baseInfo ----------`)
  // console.log(baseInfo.Config.ExposedPorts)

}


(async () => {

  await initDockerForTests()

})()