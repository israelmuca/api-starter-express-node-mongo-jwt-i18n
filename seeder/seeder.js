const { Seeder } = require('mongo-seeding')
const path = require('path')
require('./config/env')

const config = {
    database: process.env.MONGOOSE_DB,
    dropDatabase: true,
}

const seeder = new Seeder(config)

const collections = seeder.readCollectionsFromPath(path.resolve('./seeder/data'))

seeder
    .import(collections)
    .then(() => {
        console.log('Your data was imported successfully!')
    })
    .catch(err => {
        console.log('ERROR! ' + err)
    })