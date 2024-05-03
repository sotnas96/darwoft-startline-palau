const express = require("express");
const bodyParser = require('body-parser');
const  mainRouter = require("./api/routes/main")
const { connectionToDB } = require("./api/dbconfig");
const port = process.env.port
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use("/api", mainRouter); 
try {
    connectionToDB();
    app.listen(port, () =>{
        console.log(`server listening on port: ${port}`);
    });
} catch(error) {
    console.error(error);
    process.exit(1)
}