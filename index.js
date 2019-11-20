var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var xhub = require('express-x-hub');

dotenv.config();

//Configuracion del servidor
app.set('port', (process.env.PORT));//-> Validamos un puerto a usar
app.listen(app.get('port'));//-> Asignamos un puerto

//Configuracion del Xhub
app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

var token = process.env.TOKEN;//-> Token de respuesta para la suscripcion
var received_updates = [];//-> Datos obtenidos del WebHook

// const pages_acces_token = "EAAGtibYTXHQBAAqsmZCNO9CZC14Akxx1bZAIKAF1smFrF37IVvJqQAzFDquhS9a5jjLWFI5PlrCAZAPLeUFbT8GZC9D9wxqkwQwQBZCiASsZBv5pxaauq7DcsWJsUwhmcaE5tRZC5sQODIbZC6JZAwUXrd2W8pSUGZCOZATPZCce5OKie3pHLKcoLZAqxLmiHTEQB03ZCIZD"; 
// const id_page = "100122931418648";

//Imprimir el resultado
app.get('/', function(req, res) {
    res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});  

//Validacion con facebook
app.get('/facebook', function(req, res) {
    if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == token) {
      res.send(req.query['hub.challenge']);
    } else {
      res.sendStatus(400);
    }
});

//Esperamos WebHook Facebook
app.post('/facebook', function(req, res) {
  if (!req.isXHubValid()) {//-> Validamos que nuestro WebHook sea valido
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.sendStatus(401);
    return;
  }

  received_updates.unshift(req.body); //-> Guardamos los datos nuevos en el array
  res.sendStatus(200);
});

// app.get('/facebook/subscribe', {

// }, function(req, res) {
//   var myHeaders = new Headers();

//   fetch('https://graph.facebook.com/v2.11/'+id_page+'/subscribed_apps').then(function(response) {
//     console.log(response);
//     debugger
//   });
// });

app.listen();
console.log("Servidor esta listo !!!");