import fs from 'fs'

export default function uiDashboardGenerator({ service, description, routeFile }) {

  const buffer = fs.readFileSync(routeFile, 'utf8')

   // render dashboard template
  const outputStream = JSON.stringify(
    { content: buffer } 
  )


  try {
    fs.writeFileSync('data/destination/output.json', outputStream)
  } catch (err) {
    console.log('Cannot generate ui dashboard with error: ' + err)
  }
}