// $kube-namespace
// $kube-service

// Read in dc-project/*/routes.js
import fs from 'fs';

let httpRoutes
// Read in routes.js
const buffer = fs.readFileSync('data/source/routes.js', 'utf8')
const re = /[\'\,]+/g
httpRoutes = buffer.split('httpServer.router.')
httpRoutes.splice(0, 1)

// total endpoints:
console.log(httpRoutes.length)

let combined = []
// Check each array with command and url
httpRoutes.forEach(route => {
   const lines = route.split('\n')
   const command = lines[0].replaceAll('(', ' /').trim().toUpperCase()
   const url = lines[1].replaceAll(re, '').trim()

   // Map every endpoint to jsonString - schema?
   const jsonString = `{"request":"${command}", "req.url":\"${url}\"}` 

   // Parse to JSON and combine
   const JSON_Obj = JSON.parse(jsonString)
   console.log(JSON_Obj)
   combined = combined.concat(JSON_Obj)

})

// UI routes
// GET /static/js/app.js
// const jsonString = '{"request":"GET", "req.url":"/static/js/app.js"}'

const outputStream = JSON.stringify(combined, null, 2)
console.log(outputStream)

// file ouput
try {
  fs.writeFileSync('data/destination/output.json', outputStream)
} catch (err) {
   console.log(err)
}
