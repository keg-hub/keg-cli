jest.resetAllMocks()
jest.clearAllMocks()

const runTaskMock = jest.fn()
jest.setMock(`../src/runTask`, {
  runTask: runTaskMock
})


describe("runTask", () => {

  afterAll(() => {
    runTaskMock.mockClear()
  })

  it(`should call the runTask method`, () => {
    require('../runTask')
    expect(runTaskMock).toHaveBeenCalled()
  })

})

