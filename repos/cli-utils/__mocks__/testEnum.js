const { get, isArr, eitherArr, isFunc } = require('@keg-hub/jsutils')

/**
 * @typedef TestItem
 * @desc Used to test a method by defining parameters and expected output
 * @Object
 * @property {boolean} [not=false] - Expect the opposite of the output (ignored when matchers exists)
 * @property {boolean} [inverse=false] - Same as `not` (ignored when matchers exists)
 * @property {string} [matcher=toEqual] - Jest matcher used to compare expected with receive
 * @property {Array[string]} [matchers] - Groups of Jest matcher used to compare expected with receive
 * @property {string} description - Info about the test being run
 * @property {*} inputs - Arguments passed to the method being tested
 * @property {*} outputs - Expected result returned from the test method
 */


const execTest = (testAction, name, data, log) => {
  const inverse = data.not || data.inverse
  const matchers = data.matchers || null
  const matcher = data.matcher || 'toEqual'
  const testTitle = data.description ? `${name} - ${data.description}` : name

  const testMethod = async () => {
    const resp = await testAction(...(eitherArr(data.inputs, [data.inputs])))
    if(log) return console.log(resp)

    if(isFunc(data.outputs))
        return await data.outputs(resp, name, data)

    const expected = expect(resp)
    const received = eitherArr(data.outputs, [data.outputs])

    return isArr(matchers)
      ? matchers.map(match => get(expected, match)(...received))
      : inverse
        ? expected.not[matcher](...received)
        : get(expected, matcher)(...received)
  }

  return data.only
    ? it.only(testTitle, testMethod)
    : it(testTitle, testMethod)
}

/**
 * Loops over a collection of test items, and executes a test on them
 * @function
 * @param {Object|Array} testItems - Items that should be tested
 * @param {function} testAction - Function that is being tested
 *
 * @returns {void}
 */
const testEnum = (testItems, testAction, log) => {
  return Object.entries(testItems)
    .map(([name, data]) => {
      return isArr(data)
        ? data.map(subItem => execTest(testAction, name, subItem, log))
        : execTest(testAction, name, data, log)
    })
}


module.exports = {
  testEnum
}