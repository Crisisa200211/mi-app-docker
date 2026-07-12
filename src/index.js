const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => res.send('¡Aplicación Dockerizada con Jenkins!'));
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));