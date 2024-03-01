

module.exports = function (io) {
  numUsers = 0;
  // io 관련 작업 (emit, on)
  io.on('connection', async(socket) => {
    console.log("client is connected", socket.id);

    socket.on("add user", async(userName, cb)=>{
      socket.userName = userName;
      ++numUsers;
      try{
        console.log(`User Name : ${userName}, # Users : ${numUsers}`);
        cb({ok:true,data: {userName:userName, numUsers:numUsers}});

        socket.emit("login", {numUsers:numUsers});
    
        socket.broadcast.emit("user joined", {
          userName:socket.userName,
          numUsers:numUsers
        });
      }
      catch(error){
        console.log(`Error ${error.message}`)
        cb({ok:true,data: error.message}) ;
      }
    })    

    socket.on("new message", (data)=>{
      console.log(`${socket.userName} : ${data}`)
      socket.broadcast.emit("new message", {userName:socket.userName, message:data});
    })

    socket.on("disconnect", ()=>{
      if (numUsers > 0 && socket.userName){
        --numUsers;
        console.log(`user(${socket.id}) is disconnected`)
        socket.broadcast.emit('user left', {
          userName: socket.userName,
          numUsers: numUsers
        });
      }
      
    });
  });
  // socket.on('message', ({name, message}) => {
  //   io.emit('message', ({name, message}))
  // })
};