const fs = require('fs')
const mustache = require('mustache')
const {writeFile} = require('../../utils')

module.exports = function(eventEmitter) {
  let output = ''
  eventEmitter.on('test', function(header, expectedResults) {
    header = JSON.stringify(header)
    header = header.substring(1, header.length - 1)
    header = header.replace(/`/g, '\\`')
    output += `testServerTimingHeader(\`${header}\`, ${JSON.stringify(expectedResults)});\n`
  })
  eventEmitter.on('comment', function(line) {
    if (line.length)
      output += line
    output += '\n'
  })
  eventEmitter.on('done', function() {
      writeFile('build/javascript', 'tests.js', output)
  })
}
