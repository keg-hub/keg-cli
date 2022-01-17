
const { cliStore } = require('../cliStore')

describe('cliStore', () => {

  describe('context', () => {
    afterEach(() => {
      cliStore.clearStore()
    })
    
    it('should get and set a context when setContext and getContext is called', () => {
      const context = { test: 'context' }
      cliStore.context.set('test', context)
      expect(cliStore.context.get('test')).toBe(context)
    })

    it('should throw an error when setting a context that already exists', () => {
      const context = { test: 'context' }
      cliStore.context.set('test', context)
      expect(() => { cliStore.context.set('test', {}) }).toThrow()
    })

    it('should throw an error when no name is passed', () => {
      const context = { test: 'context' }
      expect(() => { cliStore.context.set(undefined, context) }).toThrow()
    })

    it('should throw an error when no context is passed', () => {
      expect(() => { cliStore.context.set('test') }).toThrow()
    })

    it('should merge contexts when the merge option is passed', () => {
      const context = { test: 'context' }
      cliStore.context.set('test', context)
      cliStore.context.set('test', { merged: 'context-2' }, { merge: true })
      
      const merged = cliStore.context.get('test')
      expect(merged.test).toBe('context')
      expect(merged.merged).toBe('context-2')
    })

    it('should override contexts when the override option is passed', () => {
      const context = { test: 'context' }
      cliStore.context.set('test', context)
      cliStore.context.set('test', { merged: 'context-2' }, { override: true })
      
      const merged = cliStore.context.get('test')
      expect(merged.test).toBe(undefined)
      expect(merged.merged).toBe('context-2')
    })

  })

  describe('service', () => {
    afterEach(() => {
      cliStore.clearStore()
    })


    it('should wrap the passed in service when set and return a wrapper function', () => {
      const service = jest.fn()
      cliStore.service.set('test', service)
      const wrapped = cliStore.service.get('test')
      expect(wrapped).not.toBe(service)
      expect(typeof wrapped).toBe('function')
    })

    it('should call the service when the wrapped function is called', () => {
      const service = jest.fn()
      cliStore.service.set('test', service)
      const wrapped = cliStore.service.get('test')
      expect(service).not.toHaveBeenCalled()
      wrapped(1,2)
      expect(service).toHaveBeenCalled()
      const args = service.mock.calls[0]

      expect(args[0]).toBe(1)
      expect(args[1]).toBe(2)
    })

    it('should throw an error when no name is passed', () => {
      const service = jest.fn()
      expect(() => cliStore.service.set(undefined, service)).toThrow()
    })

    it('should throw an error when passed in service is not a function', () => {
      expect(() => cliStore.service.set('test', undefined)).toThrow()
    })

    it('should throw an error when the service already exists', () => {
      const service = jest.fn()
      cliStore.service.set('test', service)

      expect(() => cliStore.service.set('test', service)).toThrow()
    })


    it('should override an existing service when the override option is passed', () => {
      const service = jest.fn()
      const service2 = jest.fn()
      
      cliStore.service.set('test', service)
      cliStore.service.set('test', service2, { override: true })

      const wrapped = cliStore.service.get('test')
      wrapped(1,2)
      expect(service).not.toHaveBeenCalled()
      expect(service2).toHaveBeenCalled()
    })


    it('should call both methods when the merge option is passed and the service already exists', () => {
      const service = jest.fn()
      const service2 = jest.fn()
      
      cliStore.service.set('test', service)
      cliStore.service.set('test', service2, { merge: true })

      const wrapped = cliStore.service.get('test')
      wrapped(1,2)
      expect(service).toHaveBeenCalled()
      const args = service.mock.calls[0]
      expect(args[0]).toBe(1)
      expect(args[1]).toBe(2)

      expect(service2).toHaveBeenCalled()
      const args2 = service2.mock.calls[0]
      expect(args2[0]).toBe(1)
      expect(args2[1]).toBe(2)
    })


    it('should pass the service response from the first to the next when pipe option is passed', () => {
      const service = jest.fn(() => 'pipeline-response-1')
      const service2 = jest.fn(() => 'pipeline-response-2')
      const service3 = jest.fn(() => 'pipeline-response-3')
      const service4 = jest.fn(() => 'pipeline-response-4')
      
      cliStore.service.set('test', service)
      cliStore.service.set('test', service2, { pipe: true })
      cliStore.service.set('test', service3, { pipe: true })
      cliStore.service.set('test', service4, { pipe: true })

      const wrapped = cliStore.service.get('test')
      wrapped(1,2)
      expect(service).toHaveBeenCalled()
      expect(service2).toHaveBeenCalled()
      const args = service2.mock.calls[0]
      expect(args[0]).toBe('pipeline-response-1')

      expect(service3).toHaveBeenCalled()
      const args2 = service3.mock.calls[0]
      expect(args2[0]).toBe('pipeline-response-2')
      
      expect(service4).toHaveBeenCalled()
      const args3 = service4.mock.calls[0]
      expect(args3[0]).toBe('pipeline-response-3')
    })
  })

})