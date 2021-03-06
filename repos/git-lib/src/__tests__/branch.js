const path = require('path')
const { isArr } = require('@keg-hub/jsutils')
const cliRoot = path.join(__dirname, '../../../../')
const { git } = require('../git')


describe('branch', () => {

  afterEach(() => jest.resetAllMocks())

  describe('list', () => {

    it('should return a list of all branches for the passed in location', async () => {
      const res = await git.branch.list(cliRoot)

      expect(isArr(res)).toBe(true)
    })

    it('should return an array of  branch objects matching the correct model', async () => {
      const res = await git.branch.list(cliRoot)
      const keys = [ 'commit', 'name', 'current', 'message' ]

      res.map(branch => keys.map(key => expect(key in branch).toBe(true)))
    })

  })

})
