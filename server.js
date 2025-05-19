const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para parsear JSON
app.use(express.json());

// Aquí se agregan las rutas de items
const itemsRoutes = require('./routes/items');
app.use('/api/items', itemsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
