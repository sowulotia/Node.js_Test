app = require('./app');
const httpServer = require('http').createServer(app);
const {Server} = require('socket.io');
require('dotenv').config();

const io = new Server(httpServer, {
	cors : {
		origin : ["http://localhost:3000", "http://localhost:5001"],
		credentials : true
	},
});

require("./utils/io_util")(io);

// // app.use(express.static(__dirname + '/react-project/build'))

//  app.get('/', (req, res) => {
//      res.sendFile('index.html')
// })s

httpServer.listen(process.env.PORT, ()=>{
    console.log(`Listening on Port : http://localhost:${process.env.PORT}`)
});

