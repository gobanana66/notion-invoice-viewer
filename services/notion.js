const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')
const tasks = require('./tasks')

// Init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

 
module.exports = async function getInvoices() {
  const payload = {
    path: `databases/${database_id}/query`,
    method: 'POST',
  } 

  const { results } = await notion.request(payload)
  
  const invoices = results.map((page,i) => {
    const tasks2 = []
    const tasks = page.properties.Tasks.relation
    //Filter non-invoiced tasks
    Object.keys(tasks).forEach(key => {
        tasks2.push(tasks[key].id)
    })
    return {
      id: page.id, 
      title: page.properties.Title.title[0].text.content,
      project: page.properties.Project.relation[0].id,
      client: page.properties.Client.relation[0].id,
      tasks: tasks2,
      json: page
    }
  })
  
  return invoices
}
