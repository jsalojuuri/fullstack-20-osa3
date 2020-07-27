require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/person')

morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())


// let persons = [
//     {
//         name: "Arto Hellas",
//         number: "040-123456",
//         id: 1
//     },
//     {
//         name: "Ada Lovelace",
//         number: "39-44-5323523",
//         id: 2
//     },
//     {
//         name: "Dan Abramov",
//         number: "12-43-234345",
//         id: 3
//     },
//     {
//         name: "Mary Poppendieck",
//         number: "39-23-6423122",
//         id: 4
//     }]

app.get('/', (req, res) => {
  res.send('<h1>Phonebook</h1>')
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p> ${new Date()}</p>`)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  //const id = Number(request.params.id)
  //const person = persons.find(person => person.id === id)
  //if (person) {
  //    response.json(person)
  //} else {
  //    response.status(404).end()  }
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // persons = persons.filter(person => person.id !== id)
  // response.status(204).end()
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// const generateId = () => {
//     const maxId = persons.length > 0
//       ? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
//       : 1
//     return maxId
//   }

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // if (body.name === undefined) {
  //   next(error)
  // }

  // if (body.number === undefined) {
  //   next(error)
  // }

  // if (Person.find( {name: body.name} )) {
  //     return response.status(400).json({
  //       error: 'name must be unique'
  //     })
  // }

  // const personExists = persons.find(person => person.name === body.name)

  // if (personExists) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   id: generateId(),
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  //persons = persons.concat(person)
  //response.json(person)

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person)
    .then(() => {
      response.json(person)
    })
    .catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomattomien osioiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  if (request.body.name === undefined) {
    return response.status(400).send({ error: 'name missing' })
  }

  if (request.body.number === undefined) {
    return response.status(400).send({ error: 'number missing' })
  }

  next(error)
}

// virheellisten pyyntöjen käsittely
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})