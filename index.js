const {EventEmitter} = require('events')
const readline = require('readline')
const fs = require('fs')

const lineReader = readline.createInterface({
  input: fs.createReadStream('tests.js')
})

var eventEmitter = new EventEmitter();

fs.readdir('./writers', function(err, items) {
  items.forEach((writer) => {
    require(`./writers/${writer}`)(eventEmitter)
  })
})


lineReader.on('line', function (line) {
  if (line.indexOf('testServerTimingHeader') !== 0) {
    eventEmitter.emit('comment', line)
    return;
  }

  new Function('emitTest', `function testServerTimingHeader() {
      emitTest.apply(undefined, arguments)
    };${line}`)(function(header, expectedResults) {
    eventEmitter.emit('test', header, expectedResults)
  })
})

lineReader.on('close', function () {
  eventEmitter.emit('done')
})
