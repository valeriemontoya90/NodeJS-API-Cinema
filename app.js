var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    mysql      = require('mysql');
var qs = require("querystring");
var bodyParser = require('body-parser');

//  MYSQL tentative de connexion
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'db_api',
  password : ''
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});
 
// Quand on est connecté à io
io.sockets.on('connection', function(socket) {

});

// route des fichier statics (js, css, etc.)
app.use(express.static(__dirname+'/public'));


/***********ROUTES************/

app.get('/', function(req, res) {
      res.render('index.ejs');
});
/*
app.get('/ajouterUser', function(req, res) {
      res.render('ajouterUser.ejs');
});
*/

//User

// On crée un user
app.post('/users', function(req, res){
    console.log("POST: ");
    var user = req.param("username");
    console.log(user);
    if(!user){
        user = 'user par defaut';
    }
    connection.query('INSERT INTO user SET ?', { "username" : user}, function(err, result) {
    if (err) throw err;
    });
});

// On récupère tous les users
app.get('/users', function(req, res) {
    console.log("GET: ");
    var data = [];
    connection.query("SELECT * FROM `user`")
        .on('result', function(rows){
        data.push(rows);

        })
        .on('end', function(){
            res.json({ data: data })
        });
});

// On récupère toutes les infos concernant un user donnée
app.get('/users/:id', function(req, res) {
    console.log("GET: ");
    var data = [];
    var likes_count =[];
    var watched_count =[];

    connection.query("SELECT SUM( `id` ) AS likes_count FROM  `movie-liked` WHERE idUser = '"+req.params.id+"'")
        .on('result', function(rows){
            likes_count.push(rows);
            watched_count.push(rows.watched_count);
        })
        .on('end', function(){
            connection.query("SELECT SUM( `id` ) AS watched_count FROM  `movie-watched` WHERE idUser = '"+req.params.id+"'")
            .on('result', function(rows){
                likes_count.push(rows);
            })
            .on('end', function(){
                connection.query("SELECT * FROM  `user` WHERE  `id` = '"+req.params.id+"'")
                    .on('result', function(rows){
                        data.push(rows);
                    })
            
                .on('end', function(){
                    data[0].counts = likes_count;
                    res.json({ data: data })
                })
            }); 
        });
});

// On modifie le username d'un user donnée
app.put('/users/:id', function(req, res) {
    console.log("PUT: ");
    var user =  req.param("username")
    if(!user){ 
        user = 'val';
    }
    connection.query("UPDATE user set username = '"+user+"' WHERE  `id` = '"+req.params.id+"'", function (err, result) {
        if (err) throw err;
        console.log('deleted ' + result.affectedRows + 'rows');
    })
});

// On supprime un user donnée
app.delete('/users/:id', function(req, res) {
    console.log("DELETE: ");
    var userid = req.params.id;
    connection.query("DELETE FROM user WHERE  `id` = '"+userid+"'", function (err, result) {
        if (err) throw err;
        console.log('deleted ' + result.affectedRows + ' rows');
    })
    
});

// On récupère tous les films aimés par un user donnée
app.get('/users/:id/likes', function(req, res) {
    console.log("GET: ");
    console.log(req);
    var data = [];
    var userId = req.params.id;
    connection.query("SELECT * FROM `movie-liked` WHERE idUser = '"+userId+"'")
        .on('result', function(rows){
            data.push(rows);
        })
        .on('end', function(){
            res.json({ data: data })
        });
});

// On fait aimé un film à un user donné
app.post('/users/:id/likes/:idmovie', function(req, res) {
    console.log("POST: ");
    console.log(req);
    var userId = req.param("id");
    var movieId = req.param("idmovie");
    console.log("userId "+userId);
    console.log("movieId "+movieId);
    connection.query('INSERT INTO `movie-liked` SET ?', { idUser : userId, idMovie : movieId }, function(err, result) {
        if (err) throw err;
        });
});

// On fait aimé un film à un user donné
app.delete('/users/:id/likes/:idmovie', function(req, res) {
    console.log("DELETE: ");
    console.log(req);
    var data = [];
    var userId = req.param("id");
    var movieId = req.param("idmovie");
    console.log("userId "+userId);
    console.log("movieId "+movieId);
    connection.query("DELETE FROM `movie-liked` WHERE `idUser` = '"+userId+"' AND `idMovie` = '"+movieId+"'", function(err, result) {
        if (err) throw err;
        })
        /*
        .on('result', function(rows){
            data.push(rows);
        })
        .on('end', function(){
            res.json({ data: data })
        });
        */
});

// On récupère tous les films aimés par un user donnée
app.get('/users/:id/dislikes', function(req, res) {
    console.log("GET: ");
    console.log(req);
    var data = [];
    var userId = req.params.id;
    connection.query("SELECT * FROM `movie-disliked` WHERE idUser = '"+userId+"'")
        .on('result', function(rows){
            data.push(rows);
        })
        .on('end', function(){
            res.json({ data: data })
        });
});

// On ajoute tous les films aimés par un user donnée
app.post('/users/:id/dislikes/:idmovie', function(req, res) {
    console.log("POST: ");
    console.log(req);
    var data = [];
    var userId = req.param("id");
    var movieId = req.param("idmovie");
    console.log("userId "+userId);
    console.log("movieId "+movieId);
    connection.query('INSERT INTO `movie-disliked` SET ?', { idUser : userId, idMovie : movieId }, function(err, result) {
        if (err) throw err;
        });
});

// On supprime un film aimé par un user donnée
app.delete('/users/:id/dislikes/:idmovie', function(req, res) {
    console.log("POST: ");
    console.log(req);
    var data = [];
    var userId = req.param("id");
    var movieId = req.param("idmovie");
    console.log("userId "+userId);
    console.log("movieId "+movieId);
    connection.query("DELETE FROM `movie-disliked` WHERE `idUser` = '"+userId+"' AND `idMovie` = '"+movieId+"'", function(err, result) {
        if (err) throw err;
        })
});

app.get('/users/:id/watched', function(req, res) {
    var data = [];
    var userId = req.params.id;
    connection.query("SELECT * FROM `movie-watched` WHERE `idUser` = '"+userId+"'")
        .on('result', function(rows){
            data.push(rows);
        })
        .on('end', function(){
            res.json({ data: data })
        });
});

app.post('/users/:id/watched', function(req, res) {
    console.log("POST: ");
    console.log(req);
    var data = [];
    var userId = req.params.id;
    var movieId = req.param("idmovie");
    console.log("userId "+userId);
    console.log("movieId "+movieId);
    connection.query('INSERT INTO `movie-watched` SET ?', { idUser : userId, idMovie : movieId }, function(err, result) {
        if (err) throw err;
        });
});

app.delete('/users/:id/watched/:idmovie', function(req, res) {
    console.log("DELETE: ");
    console.log(req);
    var data = [];
    var userId = req.param("id");
    var movieId = req.param("idmovie");
    console.log("userId "+userId);
    console.log("movieId "+movieId);
    connection.query("DELETE FROM `movie-watched` WHERE `idUser` = '"+userId+"' AND `idMovie` = '"+movieId+"'", function(err, result) {
        if (err) throw err;
        })
});

//Movies

app.get('/movies', function(req, res) {
    var data = [];
    connection.query("SELECT * FROM  `movie`")
        .on('result', function(rows){
            data.push(rows);
        })
        .on('end', function(){
            res.json({ data: data })
        });
});

// On crée un movie
app.post('/movies', function(req, res){
    console.log("POST: ");
    var movie = req.param("title");
    var genre = req.param("genre");
    console.log(movie);
    if(!movie){
        movie = 'movie par defaut';
    }
    connection.query('INSERT INTO movie SET ?', { "title" : movie, "genre" : genre}, function(err, result) {
    if (err) throw err;
    });
});

// On récupère tous les films aimés par un user donnée
app.get('/movies/:id', function(req, res) {
    console.log("GET: ");
    console.log(req);
    var data = [];
    var movieId = req.params.id;
    connection.query("SELECT * FROM `movie` WHERE id = '"+movieId+"'")
        .on('result', function(rows){
            data.push(rows);
        })
        .on('end', function(){
            res.json({ data: data })
        });
});

// On récupère tous les films aimés par un user donnée
app.delete('/movies/:id', function(req, res) {
    console.log("GET: ");
    console.log(req);
    var data = [];
    var movieId = req.params.id;
    connection.query("DELETE FROM `movie` WHERE `id` = '"+movieId+"'", function(err, result) {
        if (err) throw err;
        })
});

// En cas de 404
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});


//FIN de la liste des ROUTES
server.listen(8080);