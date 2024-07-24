// $kube-namespace
// $kube-service

// Read in dc-project/*/routes.js
import fs from 'fs';

// Read in routes.js
const statuses = {
   code23: "(2* OR 3*)",
   code4: "4*",
   code5: "5*"
}
const prefix = '$kube-namespace $service'
const buffer = fs.readFileSync('data/source/routes.js', 'utf8')
const re = /[\'\,]+/g

let httpRoutes = buffer.split('httpServer.router.')
httpRoutes.splice(0, 1)

// total endpoints:
console.log(httpRoutes.length)

let combined = []
// Check each array with command and url
httpRoutes.forEach(route => {
   const lines = route.split('\n')
   const command = lines[0].replaceAll('(', '').trim().toUpperCase()
   const url = lines[1].replaceAll(re, '').trim().replaceAll('/', '\\\\/')

   // Map every endpoint to jsonString
   const query1 = `{"query": "${prefix} @req.url:${url}/* @req.method:${command} @req.statusCode:${statuses.code23}"}` 
   const query2 = `{"query": "${prefix} @req.url:${url}/* @req.method:${command} @req.statusCode:${statuses.code4}"}` 
   const query3 = `{"query": "${prefix} @req.url:${url}/* @req.method:${command} @req.statusCode:${statuses.code5}"}` 

   // Parse to JSON and combine
   const JsonObj1 = JSON.parse(query1)
   const JsonObj2 = JSON.parse(query2)
   const JsonObj3 = JSON.parse(query3)

   console.log(JsonObj1, JsonObj2, JsonObj3)
   combined = combined.concat(JsonObj1, JsonObj2, JsonObj3)

})

// UI routes
// GET /static/js/app.js
// const jsonString = '{"req.url":"/static/js/app.js", "req.method":"GET"}'

const outputStream = JSON.stringify(combined, null, 2)
console.log(outputStream)

// file ouput
try {
  fs.writeFileSync('data/destination/output.json', outputStream)
} catch (err) {
   console.log(err)
}
