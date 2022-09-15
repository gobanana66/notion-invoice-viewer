
const invoicesEl = document.querySelector('#invoices')
const invoiceEl = document.querySelector('#invoice')
const loadingEl = document.querySelector('#loading')
let loading = false

const getinvoicesFromBackend = async () => {
  loading = true
  const res = await fetch('http://localhost:5000/invoices')
  const data = await res.json()
  loading = false
  return data
}

const getInvoiceProject = async () => {
  loading = true
  const res = await fetch('http://localhost:5000/projects')
  const data = await res.json()
  loading = false
  return data
}

const getInvoiceClient = async () => {
  loading = true
  const res = await fetch('http://localhost:5000/client')
  const data = await res.json()
  loading = false
  return data
}

const getInvoiceTasks = async () => {
  loading = true
  const res = await fetch('http://localhost:5000/tasks')
  const data = await res.json()
  loading = false
  return data
}

const addinvoicesToDom = async () => {
  const invoices = await getinvoicesFromBackend()
  const projects = await getInvoiceProject()
  const clients = await getInvoiceClient()
  const tasks = await getInvoiceTasks()
  let i = 0
  console.log("Project")
  console.log(projects)
  console.log("Invoices")
  console.log(invoices)
  console.log("Client")
  console.log(clients)
  console.log("Tasks")
  console.log(tasks)

  if (!loading) {
    loadingEl.innerHTML = ''
  }


  
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const invoiceId = urlParams.get('invoice')
  const projectActual = projects.filter(obj => {
    return obj.id == invoiceId
  })
  
  if(invoiceId) {
    //Get current invoice
    const invoice = invoices.filter(obj => {
      return obj.id == invoiceId
    }) 
    // Get current client 
    const client = clients.filter(obj => {
      return obj.id == invoice[0].client
    })
    //Filter non-invoiced projects
    Object.keys(projects).forEach(key => {
      if (projects[key].properties.Invoice.relation[0] === undefined) {
        delete projects[key];
      }
    })
    //Get current project
    const project = projects.filter(obj => {
      return obj.properties.Invoice.relation[0].id == invoiceId
    })
    console.log(project)

    //Get invoiced tasks
    const tasksInvoice = tasks.filter(obj => {
      // console.log(tasks)
      // console.log(obj.id)
      // console.log(invoice[0].tasks[i].id.includes(obj.id))
      return invoice[0].tasks.includes(obj.id)
    })
    
    const div = document.createElement('div')
    div.className = 'invoice'
    div.innerHTML = `
    <h1 class="invoiceTitle">Invoice</h1>
    
      
      <div id="invoiceHeader">
      <div class="client">
      <h2 id="clientName">${client[0].properties.ClientName.title[0].plain_text}</h2>
      <div id="invoiceDate">${invoice[0].json.properties.InvoiceDate.formula.string}</div>
      <div id="invoiceNum">Invoice #<span>${invoice[0].json.properties.InvoiceNumber.formula.string}</span></div>
      </div>

        
      
        <div id="me">
        FirstName LastName<br>
        Address 1<br>
        Address 2</div>
       
        </div>
      
        <div id="projectTitle">Project: ${project[0].properties.Title.title[0].plain_text}</div>`
        const tbl = document.createElement("table");
        tbl.className = "taskList"
        const tblHead = document.createElement("thead")
        const tblBody = document.createElement("tbody");
        tblHead.innerHTML += `<tr><th>Item</th><th>Subtotal</th></tr>`
      tasksInvoice.forEach((task) => {
        const taskRow = document.createElement('tr')
        const col1 = document.createElement('td')
        const taskName = document.createElement('div')
        taskName.className = "taskName"
        const taskDesc = document.createElement('div')
        taskDesc.className = "taskDesc"
        const col2 = document.createElement('td')
        const taskTotal = document.createElement('div')
        taskName.innerHTML = `${task.properties.Task.title[0].plain_text}`
        task.properties.Description.rich_text.forEach((description) => {
          taskDesc.innerHTML += `${description.plain_text}`
        })
        taskTotal.innerHTML += `$${task.properties.Total.formula.number.toLocaleString("en-US",{minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        col1.appendChild(taskName)
        col1.appendChild(taskDesc)
        col2.appendChild(taskTotal)
        taskRow.appendChild(col1)
        taskRow.appendChild(col2)
        tblBody.appendChild(taskRow)
        tbl.appendChild(tblHead)
        tbl.appendChild(tblBody)
        div.appendChild(tbl)
      
        
      })
      div.innerHTML += `<footer><h3>$${invoice[0].json.properties.Total.formula.number.toLocaleString("en-US",{minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
      <div id="invoiceDue">Due ${invoice[0].json.properties.Due.formula.string}</div></footer>`
   
  
    
  invoiceEl.appendChild(div)
  const date = new Date(invoice[0].json.created_time)
  console.log(date)
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  const filename = document.querySelector('#filename')
  filename.innerHTML = `${client[0].properties.ClientName.title[0].plain_text}-${project[0].properties.Title.title[0].plain_text}-Invoice-${month+1}_${day}_${year}.pdf`

   
  }
  invoices.forEach((invoice) => {
    const div = document.createElement('div')
    div.innerHTML = `
      <li><a href="?invoice=${invoice.id}">${invoice.title}</a><div class="total">Invoice Total $${invoice.json.properties.Total.formula.number.toLocaleString("en-US",{minimumFractionDigits: 2, maximumFractionDigits: 2})}</div></li>
    `
    tasks.forEach((task) => {
    });
    
    invoicesEl.appendChild(div)
  })

  
}

addinvoicesToDom()

function printWithSpecialFileName(){
  const tempTitle = document.title;
  const filename = document.querySelector('#filename')
  document.title = filename.innerHTML;
  console.log(document.title)
  window.print();
  document.title = tempTitle;
}