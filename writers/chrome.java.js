const fs = require('fs')

module.exports = function(eventEmitter) {
  let output = ''
  eventEmitter.on('test', function(header, expectedResults) {
    function serializeResult(expectedResult) {
      const duration = expectedResult.hasOwnProperty('dur')
          ? String(expectedResult.dur)
          : '0'
      const description = expectedResult.hasOwnProperty('desc')
          ? expectedResult.desc
          : ''
      return `{${JSON.stringify(expectedResult.name)}, ${JSON.stringify(duration)}, ${JSON.stringify(description)}}`
    }
    serialized = `{${expectedResults.map(function(expectedResult) {
      return serializeResult(expectedResult)
    }).join(', ')}}`
    output += `  testServerTimingHeader(${JSON.stringify(header)}, ${serialized});\n`
  })
  eventEmitter.on('comment', function(line) {
    if (line.length)
      output += `  ${line}`
    output += '\n'
  })
  eventEmitter.on('done', function() {
    const filePath = './build/chrome.java'
    fs.writeFileSync(filePath, output)
    console.log(`${filePath} written.`)
  })
}
