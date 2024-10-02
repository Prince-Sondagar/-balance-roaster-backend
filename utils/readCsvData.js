const csv = require('csv-parser')
const fs = require('fs')


const readCsvData = (path) => {
    return new Promise((resolve, reject) => {
        let fileData = []
        fs.createReadStream(path)
            .pipe(csv())
            .on('error', error => reject(error))
            .on('data', row => {
                fileData.push(row)
            })
            .on('end', () => resolve(fileData))
    })

}

module.exports = { readCsvData };