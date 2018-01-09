let asserts = 0
console.assert = (function(_assert) {
  return function() {
    asserts++
    _assert.apply(console, arguments)
  }
})(console.assert)

function testServerTiming(resource, expectedResults) {
  const {serverTiming} = performance.getEntriesByName(resource)[0]
  console.assert(serverTiming.length === expectedResults.length, `matching entry count: ${resource}`)

  expectedResults.forEach(function(expectedResult, i) {
    console.assert(expectedResult.name === serverTiming[i].name,
      `name (${resource}): ${expectedResult.name} !== ${serverTiming[i].name}`)
    console.assert((expectedResult.dur || 0) === serverTiming[i].duration,
      `duration (${resource}): ${expectedResult.dur} !== ${serverTiming[i].duration}`)
    console.assert((expectedResult.desc || '') === serverTiming[i].description,
      `description (${resource}): ${expectedResult.desc} !== ${serverTiming[i].description}`)
  })
}

function done() {
  console.info(`${asserts} asserts passed.`)
}
