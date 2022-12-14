const express = require('express');
const socket = require('socket.io')
const path = require('path')
const app = express();
let testing = false;
//const server = app.listen((process.env.PORT || 3000, ()=> console.log("listening port 3000")))
var server = require('http').createServer(app);
const io = socket(server)
const fs = require('fs')
const {userjoin,getcurrentuser, userleave,users} = require('./public/user');
const e = require('express');
const { globalEval, data } = require('jquery');
let testusers = []
server.listen(process.env.PORT || 3000);

const mongo = require('mongodb').MongoClient;

mongo.connect('mongodb+srv://abdu:abdu4532@cluster0.zdkrf.mongodb.net/test?retryWrites=true&w=majority' || process.env.MONGO_URL, {useUnifiedTopology: true}, (err, client)=>{
    
    if(err){
        throw err
    }
    
    console.log('MongoDB connected.....')


    io.on("connect", function(socket){
        
        const db = client.db('test')
        let post_collection = db.collection('posts') 
        
        //post_collection.remove()
            post_collection.find().limit(300).sort({_id:1}).toArray(function(err,res){  
                //console.log(res)  
                socket.emit('chat', res);
                
            })  

            connections.push(socket)
            console.log("Connected: %s sockets connected", connections.length)
            
            socket.on('typing',(data)=>{
                socket.broadcast.emit('typing',data)
            })

            socket.on('chat', function(data){

                const user = getcurrentuser(socket.id)  
                
                let messagechat = data.msg
                let usersname = data.name
                let userscolor= data.color
                let dateTime = data.time

                post_collection.insertOne({msg:messagechat, name:usersname, color:userscolor, time:dateTime},()=>{
                    console.log([data])
                    io.emit('chat',[data])                
                })
            })

            
            socket.on("peerjoined",(data)=>{
                socket.broadcast.emit('user-connected',data) 
            })

            socket.on('usercounter',(data)=>{
                
                io.emit('usercounter',{
                    data,users
                })
                        
            })

            socket.on('disconnect', ()=> {
                
                const user= userleave(socket.id);
                
                io.emit('usercounter',{
                    users
                })

                connections.splice(connections.indexOf(socket), 1)
                console.log("Disconnected: " + connections.length + " sockets connected (NOW)")

                    disconnectss = false
                
            })

            socket.on("user_joined", (data)=>{
                // io.emit("testing", users)
                
                // want this to only happen if the testing above turns out to be false
                // io.emit("confirmation",testing)
                // socket.on("confirmation",(data)=>{
                //     console.log(data)
                // })
                
                    const user = userjoin(socket.id,data)
                
                //io.emit('userjoinedmessage', user)
            })

            disconnectss = true
        })
})

let disconnectss = false

connections = []
    

function formatmessage(name,msg){
    return {
        name,
        msg
    }
}

app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'public')))
    app.get('/', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'public/test.html'))
    })
  }

  app.get('/secretadminroom', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'public/videoroom.html'))
  })

  //WHAT I WANT TO DO: 
  // --video chat:
  //    - secretroom it shows everyone camera thats all
        

  // NUMBER 1 TIP: THINK LIKE A ROBOT EXACTLYYYYYYYYYYYYYYYYYYYYYYYYYY
  
  // main objective: get ahead coding career 
   