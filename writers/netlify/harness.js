let asserts = 0
console.assert = (function(_assert) {
  return function() {
    asserts++
    _assert.apply(console, arguments)
  }
})(console.assert)

function testServerTiming(script, expectedResults) {
  const url = script.src
  const {serverTiming} = performance.getEntriesByName(url)[0]
  console.assert(serverTiming.length === expectedResults.length, `matching entry count: ${url}`)

  expectedResults.forEach(function(expectedResult, i) {
    console.assert(expectedResult.name === serverTiming[i].name,
      `name (${url}): ${expectedResult.name} !== ${serverTiming[i].name}`)
    console.assert((expectedResult.dur || 0) === serverTiming[i].duration,
      `duration (${url}): ${expectedResult.dur} !== ${serverTiming[i].duration}`)
    console.assert((expectedResult.desc || '') === serverTiming[i].description,
      `description (${url}): ${expectedResult.desc} !== ${serverTiming[i].description}`)
  })
}

function done() {
  log('')
  log(`${asserts} asserts passed.`)
}

function log(msg) {
  document.getElementById('log').innerHTML += msg + '<br>'
}