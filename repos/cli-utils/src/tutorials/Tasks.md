
# Cli Tasks
* Tasks are built by creating task definitions

### Task Definition
* A task definition should contain the following keys
  ```js
  {
    alias: Array,
    name: String, **Required**
    options: Object,
    example: String,
    action: Function, **Required**
    description: String, **Required**
    tasks: Object,
    // Other properties are allowed, but not used internally
  }
  ```
**Property Descriptions**
* `name` - The name of the command. Each must be unique the parent task **Required**
* `alias` - Alternate names of the `name` key, which can be used in-lue of the `name` key
* `description` - Long form description of the task **Required**
  * Is printed out to the terminal
  * Some helpers are included to provided better formatting
* `options` - Allowed options of the task
  * See options model below for more information
* `example` - Example text showing how to call the task from the command line
* `action` - Function to run for the task **Required**
  * Gets passed an `arguments` object, with the following keys
    * `globalConfig` - See the `Global Config Object` for more information
    * `command` - Name of the current command being run
    * `options` - Arguments passed from the command line
    * `params` - Options converted into key/value pairs
      * Sets defaults where needed
      * Ensures all required options exist
        * If missing, an error is throw before the action is called
    * `tasks` - All loaded `tasks` of the `keg-cli`
    * `task` - the `task` object of the `action` being run
* `tasks` - An object containing **sub-task definitions** of this task
  * Called by passing the name of the **sub-task** as the first argument to the **parent task** form the command line
  * Example of calling from the command line => `yarn task start app <options>`
  * Sub-tasks definitions can also has their own **sub-tasks**.
  * The process is recursive and can go as deep as needed, using the `tasks` property of the **task definition** 

**Task Definitions Example**
```js
{
  start: {
    name: 'start',
    alias: ['begin', 'st'],
    example: 'yarn task start <options>',
    description: 'When called this task will start the ...',
    actions: (argsObj) => { /*...code to start */ },
    tasks: {
      app: {
        name: 'app',
        // ...task definition properties
      }
    }
    options: {
      foo: {
        default: 'bar',
        alias: [ 'zoo' ],
        description: 'I am foo bar',
      },
      baz: {
        type: 'num',
        require: true,
        description: 'The baz with bas',
      },
    }
  },
  stop: {
    // ...task definition properties
  }
}
```


### Option Model
* A task option should match the Task Option Model with the following keys
```js
{
  name: String, **Required**
  alias: Array,
  allowed: Array,
  type: String,
  required: Boolean,
  enforced: String,
  description: String,
  default: * - ( Must match the type property ),
}
```

**Property Descriptions**
* `name` - **Required** Name of the option. Key in the `params` object passed to a `task` action
* `alias` - Alternate names of the `name` key, which can be used in-lue of the `name` key 
* `allowed` - List of allowed values of the option. Will throw if value is not one of these options
* `required` - Makes the option required when calling the task. Will throw if the option does not exist
* `enforced` - States the `action` requires the argument, but will not throw if it doesn't exist
* `description` - Describes the option
* `default` - Value used when no value is passed for the option
* `type` - Type the value of the option should be coerced into when parsed

**Type Property**
* It possiable to coerced the passed in value for an option into a specific `type`
* This is done by setting `type` property of the `option model` to a specific type
  * When not set, the default type is `string`, which is the type of the command line argument
* The `type` property must be one of
  * `string` **default**
    * The value for an option is left as is
    * **This is the default type, then the `type` property is not set**
    * **Examples**
      * `task someTask --option value` => The value of `option` would be `value` as a string
      * `task someTask --option \"[\"foo\"]\"` => The value of `option` would be `[\"foo\"]` as a string
  * `array` | `arr`
    * The value is converted into an array when it matches one of the following
      * A valid JSON string => `"[ "one", 2 ]"`
      * A list of values seperated by a comma => "foo,bar"
    * If the `type` is set to `array`, and the value can not be parsed, it will be added as the first item in an array
      * If the value is `my-value`, and the `type` is `array`, it will be converted to `["my-value"]`
    * **Examples**
      * `task someTask --option \"[\"foo\",\"bar\"]\"` => The value of `option` would be `["foo"]` as an array
      * `task someTask --option foo,bar` => The value of `option` would be `["foo", "bar"]` as an array
      * `task someTask --option foo` => The value of `option` would be `["foo"]` as an array
  * `object` | `obj`
    * The value is converted into a object when it matches one of the following
      * A valid JSON string => `"{ "key": "value" }" === { key: "value" }`
      * A key value pairs using a colon and separated by a comma => `"foo:1,bar:2" === { foo: '1', bar: '2' }`
    * **Examples**
      * `task someTask --option \"{\"foo\":1}\"` => The value of `option` would be `{foo: 1}` as an object
      * `task someTask --option foo:1` => The value of `option` would be `{foo: "1"}` as an object **with string values**
  * `number` | `num`
    * The value is converted into a number when it matches one of the following
      * A valid number is passed => `42 === 42` 
      * A valid number is passed within a string => `4-some-text-2 === 42` 
    * **Examples**
      * `task someTask --option 24` => The value of `option` would be `24` as a number
      * `task someTask --option 2-text-4` => The value of `option` would be `24` as a number
      * `task someTask --option two-four` => The value of `option` would be `undefined`
  * `boolean` | `bool`
    * The value is converted into a boolean when it matches one of the following
      * One of `true` | `t` | `yes` | `y` === `true`
      * One of `false` | `f` | `no` | `n` === `false`
    * **Examples**
      * `task  someTask --option t` => The value of `option` would be `true`
      * `task  someTask option=yes ` => The value of `option` would be `true`
      * `task  someTask --option f` => The value of `option` would be `false`
      * `task  someTask option=no ` => The value of `option` would be `false`
