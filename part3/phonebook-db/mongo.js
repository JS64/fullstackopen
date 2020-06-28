const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url = `mongodb+srv://fullstack:${password}@cluster-4cref.mongodb.net/test?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        
    const person = new Person({
        name: name,
        number: number,
        date: new Date(),
    })
    
    person.save().then(result => {
        console.log(`Added '${name}' with phone number '${number}' to the phonebook.`)
        mongoose.connection.close()
    })
} else if (process.argv.length === 3) {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log("Phonebook:")
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
} else {
    console.log('Invalid number of arguments. Correct usage is: node mongo.js <password> {<name> <number>}')
    process.exit(1)
}


