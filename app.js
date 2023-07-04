const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

// Utiliza las variables de entorno en la configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error conectándose a la base de datos:', err);
    process.exit(1);  // Finaliza el proceso con un código de error
  }
  console.log('Conectado a la base de datos');
});

// Ruta GET para obtener todos los marcadores
app.get('/markers', (req, res) => {
  console.info("GET /markers");
  db.query('SELECT * FROM markers', (err, results) => {
    if (err) {
      console.error('Error obteniendo marcadores:', err);
      res.status(500).json({ error: 'Error del servidor al obtener marcadores' });
      return;
    }
    res.json(results);
  });
});

// Ruta POST para agregar un nuevo marcador
app.post('/markers', (req, res) => {
  const { lat, lng, type, description } = req.body;
  const query = 'INSERT INTO markers (lat, lng, type, description) VALUES (?, ?, ?, ?)';
  console.info("POST /markers");
  db.query(query, [lat, lng, type, description], (err, result) => {
    if (err) {
      console.error('Error insertando marcador:', err);
      res.status(500).json({ error: 'Error del servidor al insertar marcador' });
      return;
    }
    res.json({ id: result.insertId, lat, lng, type, description });
  });
});


// Ruta DELETE para eliminar un marcador
app.delete('/markers/:id', (req, res) => {
  const { id } = req.params;
  console.info("DELETE /markers", id);
  db.query('DELETE FROM markers WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error eliminando marcador:', err);
      res.status(500).json({ error: 'Error del servidor al eliminar marcador' });
      return;
    }
    res.json({ success: true });
  });
});

// Ruta PUT para actualizar un marcador
app.put('/markers/:id', (req, res) => {
  const { id } = req.params;
  const { lat, lng, type } = req.body;
  console.info("PUT /markers");
  const query = 'UPDATE markers SET lat = ?, lng = ?, type = ? WHERE id = ?';
  db.query(query, [lat, lng, type, id], (err, result) => {
    if (err) {
      console.error('Error actualizando marcador:', err);
      res.status(500).json({ error: 'Error del servidor al actualizar marcador' });
      return;
    }
    res.json({ success: true });
  });
});

// Ruta GET para obtener los tipos de marcadores
app.get('/marker-types', (req, res) => {
  console.info("GET /marker-types");
  db.query('SELECT DISTINCT type FROM markers', (err, results) => {
    if (err) {
      console.error('Error obteniendo tipos de marcadores:', err);
      res.status(500).json({ error: 'Error del servidor al obtener tipos de marcadores' });
      return;
    }
    const types = results.map(result => result.type);
    res.json(types);
  });
});

app.listen(5000, () => console.log('Servidor ejecutándose en el puerto 5000'));
