const express = require('express')
const getInvoices = require('./services/notion')
const getProject = require('./services/project')
const getClient = require('./services/client')
const getTasks = require('./services/tasks')
const PORT = process.env.PORT || 5000

const app = express()


app.use(express.static('public'))

app.get('/invoices', async (req, res) => {
  const invoices = await getInvoices()
  res.json(invoices)
  app.get('/projects', async (req, res) => {
    const projects = await getProject()
    res.json(projects)
    app.get('/client', async (req, res) => {
      const client = await getClient()
      res.json(client)
      app.get('/tasks', async (req, res) => {
        const tasks = await getTasks()
        res.json(tasks)
      })
    })
  })
  
})



app.listen(PORT, console.log(`Server started on port ${PORT}`))

