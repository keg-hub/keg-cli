
const { addExitEvents, getEventExitCode } = require('../processExit')

const existEvents = [
  'exit',
  'SIGINT',
  'SIGUSR1',
  'SIGUSR2',
  'uncaughtException',
  'SIGTERM'
]

describe('addExitEvents', () => {

  afterEach(() => {
    existEvents.map(evt => process._events[evt] = undefined)
  })

  it('should event exit listeners to the current process', () => {
    existEvents.map(evt => expect(typeof process._events[evt]).toBe('undefined'))
    addExitEvents()
    existEvents.map(evt => expect(typeof process._events[evt]).toBe('function'))
  })

})

describe('getEventExitCode', () => {

  afterEach(() => {
    existEvents.map(evt => process._events[evt] = undefined)
  })
  
  it('should set the exit code when an exit event is called', () => {
    addExitEvents()
    process._events.SIGINT('SIGINT', 123)
    expect(getEventExitCode()).toEqual({ code: 123, message: 'Process exit from event: SIGINT' })
  })

})