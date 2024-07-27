const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]


const url =
    `mongodb+srv://Posen992:${password}@phonebook-database.cjdl9fv.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name : String,
	number : String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5){
	const person = new Person({
		name : newName,
		number : newNumber,
	})

	person.save().then(() => {
		console.log('note saved!')
		mongoose.connection.close()
	})

}else{
	Person.find({}).then(result => {
		console.log('phonebook:')
		result.forEach(element => {
			console.log(element.name,element.number)
		})
		mongoose.connection.close()
	})
}