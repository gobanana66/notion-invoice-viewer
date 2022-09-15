const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

// Init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const tasks_database_id = process.env.TASKS_DATABASE_ID

module.exports = async function getTasks(invoiceId) {

  const payload = {
    path: `databases/${tasks_database_id}/query`,
    method: 'POST',
  } 

  const { results } = await notion.request(payload)
  
  const tasksClean = []
  const tasks = results.map((page) => {
        tasksClean.push(page)
    // if(page.properties.Invoice && page.properties.Invoice.relation[0].id == invoiceId) {
    //   tasksClean.push(page)
    // }
  })
  
  return tasksClean
}
