const fs = require('fs')
const mustache = require('mustache')

module.exports = function(eventEmitter) {
  const output = {
    '_headers': '',
  }

  let count = -1;
  eventEmitter.on('test', function(header, expectedResults) {
    count++

    const resourceName = `build/server-timing/resources/${count}.js`
    fs.writeFileSync(resourceName,
      `testServerTiming(document.currentScript.src, ${JSON.stringify(expectedResults)})\n`)
    output['_headers'] += `/resources/${count}.js\nServer-Timing: ${header}\n\n`
  })
  eventEmitter.on('done', function() {
    writeFile('index.html',
      mustache.render(fs.readFileSync(`${__dirname}/index.template.html`).toString(), {testcount: count}))
    writeFile('_headers', output['_headers'])
    fs.createReadStream(`${__dirname}/harness.js`)
      .pipe(fs.createWriteStream(`./build/server-timing/harness.js`));
  })
}

function writeFile(fileName, content) {
  const filePath = `./build/server-timing/${fileName}`
  fs.writeFileSync(filePath, content)
  console.info(`${filePath} written.`)
}
