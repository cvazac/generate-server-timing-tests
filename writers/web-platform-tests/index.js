const fs = require('fs')
const mustache = require('mustache')
const {writeFile} = require('../../utils')
const path = 'build/web-platform-tests'

module.exports = function(eventEmitter) {
  let count = -1;
  eventEmitter.on('test', function(header, expectedResults) {
    count++

    const fileName = `${path}/resources/parsing/${count}.js`
    fs.writeFileSync(fileName,
      `testServerTiming(document.currentScript, ${JSON.stringify(expectedResults)})\n`)
    fs.writeFileSync(`${fileName}.sub.headers`, `Server-Timing: ${header}\n`)
  })
  eventEmitter.on('done', function() {
    console.info('count', count)
    writeFile(path, 'server_timing_header-parsing.html',
      mustache.render(fs.readFileSync(`${__dirname}/server_timing_header-parsing.template.html`).toString(), {testcount: count}))
  })
}
