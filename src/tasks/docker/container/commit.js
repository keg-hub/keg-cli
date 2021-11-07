const { throwRequired } = require('KegUtils/error')
const { pickKeys, noOpObj } = require('@keg-hub/jsutils')
const { getImgTags } = require('KegUtils/docker/getImgTags')
const { imageFromContainer } = require('KegUtils/package/imageFromContainer')
const { mergeTaskOptions } = require('KegUtils/task/options/mergeTaskOptions')
const { buildContainerContext } = require('KegUtils/builders/buildContainerContext')

/**
 * Creates an image from a docker container
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const containerCommit = async args => {
  const { globalConfig, params, task } = args
  const { context, message, author, log } = params

  const { imgWTag, cleanedTag } = await await getImgTags(params)
  
  // Ensure we have a content to build the container
  !context && throwRequired(task, 'context', task.options.context)

  // Get the context data for the command to be run
  const { id, name } = await buildContainerContext({
    globalConfig,
    task,
    params,
  })

  return await imageFromContainer({
    log,
    author,
    imgWTag,
    message,
    cleanedTag,
    container: id || name || context,
  })

}

module.exports = {
  commit: {
    name: 'commit',
    alias: [ 'com' ],
    action: containerCommit,
    description: `Creates an image from a docker container`,
    example: 'keg docker container commit <options>',
    options: {
      context: {
        description: 'Context of the docker container to commit',
        enforced: true,
      },
      author: {
        description: `The author of the new docker image`,
        example: `keg docker container commit --author "John Doe"`,
      },
      message: {
        description: `Apply a commit message to the docker image`,
        example: `keg docker container commit --message "My Image"`,
      },
      image: {
        description: 'Name of the new image being created',
        example: 'keg docker container commit --image my-image',
      },
      ...pickKeys(
        mergeTaskOptions(`docker`, `commit`, `build`, noOpObj),
        [
          'log',
          'tags',
          'tagGit',
          'tagVariable',
          'tagPackage',
        ]
      )
    },
  }
}
