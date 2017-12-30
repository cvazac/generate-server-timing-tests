const readline = require('readline')
const fs = require('fs')

const files = {
  'chrome.java': {
    indent: '  ',
    writeTest: function(header, expectedResults) {
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
      return `testServerTimingHeader(${JSON.stringify(header)}, ${serialized});`
    }
  }
}

function copyLine(line) {
  Object.keys(files).forEach(function(fileName) {
    writeLine(fileName, line)
  })
}

global.writeLine = writeLine = function(fileName, line) {
  const indent = (files[fileName].indent || '')
  files[fileName].output = files[fileName].output || ''
  if (line.length) {
    files[fileName].output += indent + line
  }
  files[fileName].output += '\n'
}

const lineReader = readline.createInterface({
  input: fs.createReadStream('tests.js')
})

lineReader.on('line', function (line) {
  if (line.indexOf('testServerTimingHeader') !== 0) {
    copyLine(line)
    return;
  }

  Object.keys(files).forEach(function(fileName) {
    new Function('writeTest', 'fileName', `function testServerTimingHeader() {
      writeLine(${JSON.stringify(fileName)}, writeTest.apply(undefined, arguments))
    };${line}`)(files[fileName].writeTest, fileName)
  })
})

lineReader.on('close', function (line) {
  Object.keys(files).forEach(function(fileName) {
    const filePath = `./build/${fileName}`
    fs.writeFileSync(filePath, files[fileName].output)
    console.log(`${filePath} written.`)
  })
})
