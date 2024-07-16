// Read in dc-project/*/routes.js
import { read, walk } from "files";

// Find all of the readmes
const routesFile = await walk(".")
  .filter(/\/routes\.js$/)
  .map(read)

const routeString = routesFile[0]
const httpRoutes = routeString.split('httpServer.router.')
httpRoutes.splice(0, 1)
// total endpoints:
console.log(httpRoutes.length)

// Check each array with command and url
httpRoutes.forEach(route => {
   const lines = route.split('\n')
   const command = lines[0].replace('(', '').trim().toUpperCase()
   const re = /,\'/;
   const url = lines[1].replace(re, '').trim()

   // Map every endpoint to jsonString - schema?
   const jsonString = `{"request":"${command}", "endpoint":"${url}"}` 

   // Parse to JSON 
   const JSON_Obj = JSON.parse(jsonString)
   console.log(JSON_Obj)
})

