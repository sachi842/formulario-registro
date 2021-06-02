const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");

const port = 3000;

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
mongoose.connection.on('error', (e) => console.log(e));
mongoose.connection.once('open', () => console.log('Mongoose Connected'));
const dataSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const VisitorModel = mongoose.model('Visitor', dataSchema);

app.use("/register", express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({}))

app.post("/register", async(request, response) => {

    const firstData = new VisitorModel({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password
    });

    await firstData.save((error) => {
        if (error){
            console.log(error);
            return;
        }
        console.log('Document created');
        response.redirect("/");
    });

    
}) 

app.get('/', (request, response) => {
    
    VisitorModel.find().exec((error, elements) =>{

        let trString = "";
        
        elements.map( (value) =>{
            trString += `
                <tr>
                    <td>${value.name}</td>
                    <td>${value.email}</td>
                </tr>
            `            
        });

        response.send(`
        <a href="register">Registrarse</a>
        <table>
            <thead>
                <th>Name</th>
                <th>Email</th>
            </thead>
            <tbody>
                ${trString}
            </tbody>
        </table>
    `);       
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));