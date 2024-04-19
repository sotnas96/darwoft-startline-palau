const express = require("express");
const app = express();
//importo la ruta de usuarios
const apiUsersRoutes = require("./api/routes/users")

//ES UN MIDDLEWARE QUE SIRVE PARA PARSEAR LO QUE VIENE EN EL BODY
app.use(express.json())

app.use("/api/users", apiUsersRoutes);
app.listen(4000, ()=> {
    console.log("servidor funcionando")
});