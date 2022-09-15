const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

// Init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const client_database_id = process.env.CLIENT_DATABASE_ID

module.exports = async function getClient(clientId) {

  const payload = {
    path: `databases/${client_database_id}/query`,
    method: 'POST',
  } 

  const { results } = await notion.request(payload)
  const clientClean = []
  const client = results.map((page) => {
      clientClean.push(page)
    
  })
  return clientClean
}
