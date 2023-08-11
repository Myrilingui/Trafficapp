const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
//

mongoose.connect('mongodb://localhost:27017/mapas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once('open', () => {
  console.log('Se ha conectado a la base de datos de MongoDB');
});


const userSchema = new mongoose.Schema({
  nombreUsuario: String,
  nombreCompleto: String,
  correo: String,
  contraseña: String,
});

const User = mongoose.model('User', userSchema, 'users');


// ruta para el registro
app.post('/registrar', async (req, res) => {
    console.log('Solicitud recibida:', req.body);
  const { nombreUsuario, nombreCompleto, correo, contraseña } = req.body;

  const newUser = new User({
    nombreUsuario,
    nombreCompleto,
    correo,
    contraseña,
  });

  try {
    await newUser.save();
    res.status(200).send('Usuario registrado con exito');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar el usuario');
  }
});


// ruta para inicio de sesion
app.post('/iniciarSesion', async (req, res) => {
  const { correo, contraseña } = req.body;
  console.log('Solicitud recibida:', req.body);


  try {
    
    const user = await User.findOne({ correo, contraseña });

    if (user) {
      
      res.status(200).json({ success: true });
    } else {
      
      res.status(200).json({ success: false });
      
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al iniciar sesión' });
  }
});

app.listen(port, () => {
  console.log(`Servidor alojado en http://localhost:${port}`);
});