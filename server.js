var http=require('http');
var fs=require('fs')
var mime=require('mime')
var path=require('path')
var chatServer=require('./lib/chat_server')

var cache={}

function send404(response){
    console.log('404')
    response.writeHead(404,{
        'content-type':'text/plain'
    });
    response.write('Error 404: resource not found.')

    response.end()
}

function sendFile(response,filePath,fileContent){
    response.writeHead(200,{
        'content-type':mime.lookup(path.basename(filePath))
    })

    response.end(fileContent)
}

function serverStatic(response,cache,absPath){
    console.log(absPath);
    if(cache[absPath]){
        sendFile(response,absPath,cache[absPath])
    }else{
        fs.exists(absPath,function(exists){
           if(exists){
               fs.readFile(absPath,function(err,data){
                   if(err){
                       send404(response)
                   }else{
                       cache[absPath]=data;
                       sendFile(response,absPath,data)
                   }
               })
           }else{
               console.log('send 404')
               send404(response)
           }
        });
    }
}

var server=http.createServer(function(request,response){
    var filePath=null;
    console.log(request.url)
    if(request.url=='/'){
        filePath='public/index.html'
    }else {
        filePath = 'public' + request.url;
    }
    var absPath='./'+filePath;
    serverStatic(response,cache,absPath)
})

server.listen(3000,function(){
    console.log("server listening on port 3000")
})

chatServer.listen(server)