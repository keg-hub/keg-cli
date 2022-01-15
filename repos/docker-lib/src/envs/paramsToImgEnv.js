
const { getImgNameContext } = require('../context/getImgNameContext')

/**
 * Checks the passed in params for docker image metaData
 * Then adds it to the extraENVs object
 * @param {Object} extraENVs - Contains key/value pair of ENVs from params
 * @param {Object} params - Formatted arguments passed to the current task
 * 
 * @returns {Object} - Converted params as an object
 */
const paramsToImgEnv = async (params, globalConfig, imgNameContext) => {
  imgNameContext = imgNameContext || await getImgNameContext(params, undefined, globalConfig)

  return {
    KEG_IMAGE_FROM: imgNameContext.full,
    KEG_IMAGE_TAG: imgNameContext.tag,
  }
}

module.exports = {
  paramsToImgEnv
}