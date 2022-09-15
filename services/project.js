const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

// Init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const project_database_id = process.env.PROJECT_DATABASE_ID

module.exports = async function getProject(projectId) {

  
  const payload = {
    path: `databases/${project_database_id}/query`,
    method: 'POST',
  } 

  const { results } = await notion.request(payload)
  const projectClean = []
  const projects = results.map((page) => {
      projectClean.push(page)
   })
  return projectClean
}
