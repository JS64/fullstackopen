require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

morgan.token('body', function (req) { 
    if (req.method === 'POST') {
        return JSON.stringify(req.body) 
    }
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person.toJSON())
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({ 
          error: 'name missing' 
        })
    }

    if (!body.number) {
        return res.status(400).json({ 
          error: 'phone number missing' 
        })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number,
        date: new Date(),
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})