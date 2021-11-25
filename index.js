const express = require('express');
const cors = require('cors');
// const serverRoutes = require('./routes');
const {
  Server: HTTPServer
} = require('http');   
const {
  Server: IOServer
} = require('socket.io');
const Container = require('./container');
const moment = require('moment');
const productos = new Container('./productos.txt');

const PORT = 8088;

const app = express();
const httpServer = new HTTPServer(app);
const io = new IOServer(httpServer);


//// app.set('view engine', 'ejs'); //todo Make it with the hbs cdn at the frond


app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use('', express.static(__dirname + '/public'));



/////todo Nuevas Rutas por ahora, ver si agregar a serverRoutes()

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
})
app.post('/', (req, res) => {
  const obj = req.body;
  const savedObj = productos.save(obj);
  savedObj.then(res.redirect('/')).catch(err => console.log('Error en app.post()', err));
})


httpServer.listen(PORT, () => {
  console.log(`Estamos conectados a la URL http://localhost:${PORT}`);
})

////Agregar usuario desconected
const messages = [];

io.on('connection', (socket) => {
  console.log('nuevo usuario conectado');
  socket.emit('messages', messages);
  productos.getAll().then(res => socket.emit('products', res)).catch(err => console.log('Error en io.on(socket)', err));
  socket.on('new-message', data => {
    const time = moment().format('DD/MM/YYYY hh:mm:ss');
    const dataWithTime = {
      ...data,
      time
    }
    messages.push(dataWithTime);
    io.sockets.emit('messages', messages);
  })
})