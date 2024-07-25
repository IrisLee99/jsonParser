// Read in dc-project/*/routes.js
import fs from 'fs';
import object from 'json-templater/object.js'

import widget from './templates/widget.json' assert { type: 'json' }
import templateVariables from './templates/variables.json' assert { type: 'json' }
import dashboard from './templates/dashboard.json' assert { type: 'json' }

// Read in routes.js
const statuses = {
   code23: "(2* OR 3*)",
   code4: "4*",
   code5: "5*"
}
const prefix = '$kube-namespace $service'
const buffer = fs.readFileSync('data/source/isf.routes.js', 'utf8')
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

   // render widgets here
   // ???
   const routeWidgets = [
      object(
         widget,
         {
            id: 6748651480114544,
            title: 'Response Time (s)',
            query: JsonObj1
         }),
      object(
         widget,
         {
            id: 6748651480114545,
            title: 'Response Time (s)',
            query: JsonObj2
         }),
      object(
         widget,
         {
            id: 6748651480114546,
            title: 'Response Time (s)',
            query: JsonObj3
         })      
   ]

   // ???? flat the below
   combined.splice(combined.length, 0, routeWidgets)
})

// UI routes
// GET /static/js/app.js
// const jsonString = '{"req.url":"/static/js/app.js", "req.method":"GET"}'

// const routes = JSON.stringify(combined, null, 2)
console.log(combined)

// render template variables
const variables = object(
   templateVariables,
   {
      service: 'isf',
      namespace: 'dc-production'
   }
)

// render dashboard template
const outputStream = JSON.stringify(
   object(
   dashboard,
   { 
      title: 'Jies test board', 
      description: 'isf routes',
      widgets: combined,
      variables: variables }
 ), null, 2)
 console.log(outputStream)

// file ouput
try {
  fs.writeFileSync('data/destination/dashboard.output.json', outputStream)
} catch (err) {
   console.log(err)
}
