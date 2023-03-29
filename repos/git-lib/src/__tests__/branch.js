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

  describe('get', () => {
    it('should return a branch object for the passed in location', async () => {
      const current = await git.branch.current({ location: cliRoot})

      const branch = await git.branch.get(cliRoot, current.name)
      expect(branch).toEqual(current)
    })

    it('should return null when the branch can not be found', async () => {
      const res = await git.branch.get(cliRoot, 'branch-does-not-exists-4321')
      expect(res).toBe(null)
    })

  })

})
