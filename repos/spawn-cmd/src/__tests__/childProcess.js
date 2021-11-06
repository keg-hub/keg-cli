const childProcess = require('../childProcess')


describe('/childProcess', () => {

  describe('create', () => {

    beforeEach(() => jest.resetAllMocks())

    it('It should create and return a spawned child process', async () => {
      const proc = childProcess.create({
        cmd: 'ls',
        args: ['-la'],
        options: {}
      })
      expect(proc.constructor.name).toBe('ChildProcess')
      expect(typeof proc.pid).toBe('number')
    })

  })

  describe('get', () => {

    beforeEach(() => jest.resetAllMocks())

    it('It should return the spawned proc by pid', async () => {
      const proc = childProcess.create({
        cmd: 'ls',
        args: ['-la'],
        options: {}
      })
      const found = childProcess.get(proc.pid)
      expect(proc).toBe(found)
    })

  })
  
})
