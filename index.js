const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(express.json()) 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }]
      

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
    })

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
            <p> ${new Date()}</p>`)
  })    

app.get('/api/persons', (req, res) => {
res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)  
    } else {    
        response.status(404).end()  }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
      : 1
    return maxId
  }

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }

    const personExists = persons.find(person => person.name === body.name)

    if (personExists) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})