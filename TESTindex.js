const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')
const project = require('./services/project')

// Init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})



const databaseId = process.env.PROJECT_DATABASE_ID
const projectId = '92d6849d-2055-40a5-a83a-17846d2790cd'

async function addItem(text) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId
          });
        const projects = response.results;
        console.log(projects)
        projects.forEach((project) => {
            if(project.id == projectId) {
                console.log(`match`)
            }
        });
      console.log("Success! Entry added.")
    } catch (error) {
      console.error(error.body)
    }
  }
  
  addItem("Yurts in Big Sur, California")