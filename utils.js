const fs = require('fs')
module.exports = {
  writeFile: function(path, fileName, content) {
    const filePath = `./${path}/${fileName}`
    fs.writeFileSync(filePath, content)
    console.info(`${filePath} written.`)
  }
}
