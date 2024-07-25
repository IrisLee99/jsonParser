// Read in dc-project/*/routes.js
import fs from 'fs';
import object from 'json-templater/object.js'

import widget from './templates/widget.json' assert { type: 'json' }
import templateVariables from './templates/variables.json' assert { type: 'json' }
import dashboard from './templates/dashboard.json' assert { type: 'json' }

// Read in routes.js
const statusCodes = [
   "(2* OR 3*)",
   "4*",
   "5*"
]
const prefix = '$kube-namespace $service'
const buffer = fs.readFileSync('data/source/isf.routes.js', 'utf8')
const re = /[\'\,]+/g
const baseId = 6748651480114544 // ???

let httpRoutes = buffer.split('httpServer.router.')
httpRoutes.splice(0, 1)

// total endpoints:
console.log(httpRoutes.length)

let widgets = []
// Check each array with command and url
httpRoutes.forEach(route => {
   const lines = route.split('\n')
   const command = lines[0].replaceAll('(', '').trim().toUpperCase()
   const url = lines[1].replaceAll(re, '').trim().replaceAll('/', '\\\\/')

   // Map every endpoint to jsonString
   statusCodes.forEach( code => {
      const query = `{"query": "${prefix} @req.url:${url}/* @req.method:${command} @req.statusCode:${code}"}` 
      const JsonObj = JSON.parse(query)

      //render a widget per query
      const routeWidget = object(
         widget,
         {
            id: baseId + widgets.length,
            title: 'Response Time (s)',
            query: JsonObj
         })
      
      //combine all route widgets
      widgets.splice(widgets.length, 0, routeWidget)
   })
})

console.log(widgets)

// UI routes
// GET /static/js/app.js
// const jsonString = '{"req.url":"/static/js/app.js", "req.method":"GET"}'

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
      widgets: widgets,
      variables: variables }
 ), null, 2)
 console.log(outputStream)

// file ouput
try {
   fs.writeFileSync('data/destination/output.json', outputStream)
} catch (err) {
   console.log(err)
}
