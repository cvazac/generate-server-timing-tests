const fs = require('fs')
const mustache = require('mustache')
const {writeFile} = require('../../utils')
const path = 'build/netlify'

module.exports = function(eventEmitter) {
  const output = {
    '_headers': '',
  }

  let count = -1;
  eventEmitter.on('test', function(header, expectedResults) {
    count++

    fs.writeFileSync(`${path}/resources/${count}.js`,
      `testServerTiming(document.currentScript, ${JSON.stringify(expectedResults)})\n`)
    output['_headers'] += `/resources/${count}.js\nServer-Timing: ${header}\nCache-Control: no-store\n\n`
  })
  eventEmitter.on('done', function() {
    writeFile(path, 'index.html',
      mustache.render(fs.readFileSync(`${__dirname}/index.template.html`).toString(), {testcount: count}))
    writeFile(path, '_headers', output['_headers'])
    fs.createReadStream(`${__dirname}/harness.js`)
      .pipe(fs.createWriteStream(`./${path}/harness.js`));
  })
}
