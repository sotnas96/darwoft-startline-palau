const express = require("express");
const apiUsersRoutes = require("./api/routes/users")
const { connectionToDB } = require("./api/dbconfig");

const app = express();
app.use(express.json())
app.use("/api/users", apiUsersRoutes);

const port = process.env.port
try
{
    connectionToDB();
    app.listen(port, () => 
    {
        console.log(`server listening on port: ${port}`)
    });
}
catch(error)
{
    console.error(error)
    process.exit(1)
}