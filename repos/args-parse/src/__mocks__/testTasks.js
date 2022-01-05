module.exports = {
  testTask1: {
    name: 'testTask1',
    options: {
      doo: {
        description: "dew the doo",
        require: true,
      },
      foo: {
        alias: [ 'zoo' ],
        description: 'I am foo bar',
        default: 'bar'
      },
      baz: {
        description: 'The baz with bas',
      },
    }
  },
  testTask2: {
    name: 'testTask2',
    options: {
      context: {
        description: "context of the task",
        require: true,
      },
      tap: {
        description: "Name of the tap",
        ask: 'Please enter the name of the tap?',
      },
    }
  },
  testTask3: {
    name: 'testTask3',
    options: {
      number: {
        description: "Is a number",
        type: 'number',
      },
      num: {
        description: "Is a number",
        type: 'num',
      },
      object: {
        description: "Is an object",
        type: 'Object',
      },
      obj: {
        description: "Is an object",
        type: 'Obj',
      },
      array: {
        description: "Is an array",
        type: 'array',
      },
      arr: {
        description: "Is an array",
        type: 'arr',
      },
      boolean: {
        description: "Is an boolean",
        type: 'boolean',
      },
      bool: {
        description: "Is an boolean",
        type: 'bool',
      },
      quoted: {
        description: 'Is a quoted string',
        type: 'string',
      }
    }
  },
  testTask4: {
    name: 'testTask4',
  },
  testTask5: {
    name: 'testTask5',
    options: {
      foo: {
        description: "defaults to true",
        type: 'bool',
        default: true
      },
      bar: {
        description: "defaults to false",
        type: 'bool',
        default: false
      },
      str: {
        description: "defaults to Mr. Goat",
        type: 'string',
        default: 'Mr. Goat'
      },
      num: {
        description: "defaults to 5001",
        type: 'number',
        default: 5001
      },
      arr: {
        description: "defaults to [1, 2, 'buckle my shoe']",
        type: 'array',
        default: [1, 2, 'buckle my shoe']
      },
      obj: {
        description: "defaults to { first: 1, second: 2, finally: 'buckle my shoe' }",
        type: 'object',
        default: { first: 1, second: 2, finally: 'buckle my shoe' }
      },
    }
  },
  testTask6: {
    name: 'testTask6',
    options: {
      foo: {
        description: "Gets the values from TEST_ENV_VALUE env is not set",
        env: 'TEST_FOO_ENV_VALUE',
        required: true,
      },
      bar: {
        description: "Gets the boolean values from TEST_ENV_BOOL env if not set",
        type: 'bool',
        env: 'TEST_BAR_ENV_BOOL'
      },
      arr: {
        description: "defaults to [1, 2, 'buckle my shoe'] if TEST_ENV_ARR env is not set",
        type: 'array',
        env: 'TEST_ARR_ENV_ARR',
        default: [1, 2, 'buckle my shoe']
      },
      num: {
        description: "defaults to 100 if TEST_ENV_NUM env is not set",
        type: 'number',
        env: 'TEST_NUM_ENV_NUM',
        default: 1000
      },
    }
  },
  
}
