
const http = require('http')
const express = require( 'express')
const { time } = require('console')
const morgan = require('morgan')
const app = express()
app.use(express.json())

morg = morgan(function (tokens, req, res) {
  let r =  [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ]
  if (tokens.method(req,res) === "POST"){
    r = r.concat(JSON.stringify(req.body))
  } 
  return(r.join(' '))
})
app.use(morg)
let luettelo = [
  {
    id: "1",
    name: "Arto Hellas",
    number: 123312123
  },
  {
    id: "2",
    name: "Tupu",
    number: 390458
  },
  {
    id: "3",
    name: "Hupu",
    number: 1456312123
  },
]

app.get('/api/persons', (request,response) =>{
    response.json(luettelo)
})

app.get('/info', (request,response) =>{
    let n = luettelo.length
    const date = new Date()
    const message = `
  <p>Phonebook has info for ${n} people</p>
  <p>${date}</p>
`;
    response.send(message)
})

app.get('/api/persons/:id', (request,response) =>{
    const id = request.params.id
    const note = luettelo.find(note => note.id === id)
    if(note){
        response.json(note)
    }else{
        response.status(404).end()
    }
})


app.delete('/api/persons/:id', (request,response) =>{
    const id = request.params.id
    const note = luettelo.find(note => note.id === id)
    luettelo = luettelo.filter(note => note.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request,response) =>{
    const newid = Math.floor(Math.random() * 1000)
    const body = request.body

    if(!body.name){
        return response.status(400).json({
            error: "name is missing"
        })
    }

    if(!body.number){
        return response.status(400).json({
            error: "number is missing"
        })
    }

    if(luettelo.find(ff => ff.name === body.name)){
        return response.status(400).json({
            error: "name must be unique"
        })
    }


    newname = body.name
    newnbr = body.number
    newnote = {
        id:newid,
        name: newname,
        number: newnbr,
    }
    luettelo = luettelo.concat(newnote)
    response.json(newnote)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})