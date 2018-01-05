const fs = require('fs')

module.exports = function(eventEmitter) {
  const output = {
    '_headers': '',
    'index.html': '<div>Open devtools.</div>\n',
    'index.js': '',
  }

  let count = -1;
  const resourcesPath = 'resources/'
  eventEmitter.on('test', function(header, expectedResults) {
    count++

    const resourceName = `${resourcesPath}${count}.js`
    output[resourceName] = ''
    output['_headers'] += `/${resourceName}\nServer-Timing: ${header}\n\n`

    output['index.html'] += `<script src="./${resourceName}"></script>\n`
    output['index.js'] += `testServerTiming('${resourceName}', ${JSON.stringify(expectedResults)})\n`
  })
  eventEmitter.on('done', function() {
    output['index.js'] += 'done()\n'
    output['index.html'] += '<script src="./harness.js"></script>\n<script src="./index.js"></script>\n'

    Object.keys(output).forEach(function(fileName) {
      const filePath = `./build/server-timing/${fileName}`
      fs.writeFileSync(filePath, output[fileName])
      if (fileName.indexOf(resourcesPath) === -1)
        console.info(`${filePath} written.`)
    })
  })
}
