const express = require('express')
const path = require('path')
const APILoader = require('./lib/APILoader')
const app = express()

const apiLoader = new APILoader(app)

apiLoader.useJson()
apiLoader.useCors()

const dir = path.join(__dirname, 'api')
apiLoader.loadAPIs(dir)

const port = 4000
apiLoader.listen(port)
