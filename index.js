const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const date = new Date()
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

morgan.token('data', request => JSON.stringify(request.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


app.get('/api/persons', (request, response) => {

    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send("Phonebook has info for " + persons.length + " people <br></br>" + date)

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(persons => persons.id === id)
    person ? response.json(person) : response.status(404).end()
    console.log(person)

})


app.post('/api/persons', (request, response) => {
    let body = request.body

    if (body.name && body.number) {
 
        let a = persons.find(persons => persons.name === body.name)
        // console.log(a)
        if (!a) {
            const person = { name: body.name, number: body.number, id: Math.round(Math.random() * 10000) }
            persons = persons.concat(person)
            response.json(person)
        }
        else { response.status(400).json({ error: "Name already exists" }) }
    }
    else
        response.status(400).json({ error: "Name or Number missing" })
})

app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(persons => persons.id === id)
    person.number = request.body.number
    response.status(200).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(persons => persons.id !== id)

    response.status(204).end()
})




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})