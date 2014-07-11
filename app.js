var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    mysql      = require('mysql');
var qs = require("querystring");
var bodyParser = require('body-parser');

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'db_api',
  password : ''
});

connection.connect(function(err) {
    if (err) {
        console.error('Error de connection: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

/****** TOUS LES UTILISATEURS ***/

// On crée un utilisateur
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

// On récupère tous les utilisateurs
app.get('/users', function(req, res) {
    console.log("GET: ");
    var data = [];
    connection.query("SELECT `id`, `username` FROM `user`")
        .on('result', function(rows){
            data.push(rows);
        })
        .on('end', function(){
            res.json({ data: data })
        });
});

/****** UN UTILISATEUR ***/

// On modifie le username d'un utilisateur donnée
app.put('/users/:id', function(req, res) {
    console.log("PUT: ");
    var user =  req.param("username");
    var data = [];
    if(!user){
        user = "valerie";
    }
    connection.query("UPDATE user set username = '"+user+"' WHERE `id` = '"+req.params.id+"'", function (err, result) {
        if (err) throw err;
    })
    connection.query("SELECT * FROM `user` WHERE `id` = '"+req.params.id+"'")
        .on('result', function(rows){
            data.push(rows);

        })
        .on('end', function(){
            res.json({ data: data })
        });
});

// On supprime un utilisateur
app.delete('/users/:id', function(req, res) {
    console.log("DELETE: ");
    var idUser = req.params.id;
    connection.query("DELETE FROM user WHERE  `id` = '"+idUser+"'", function (err, result) {
        if (err) throw err;
    })
});

// On récupère toutes les infos concernant un utilisateur
app.get('/users/:id', function(req, res) {
    console.log("GET: ");
    var data = [];
    var idUser = req.params.id;
    connection.query("SELECT * FROM `user` WHERE id = '"+idUser+"'")
        .on('result', function(rows){
            data.push(rows);
        })
        .on('end', function(){
            res.json({ data: data })
        });
});


/*** DANS LES 4 SESSIONS SUIVANTES, POUR TOUS LES RETOURS ON AFFICHE LES FILMS ***/
/****** UTILISATEUR et ses LIKES ***/


// On récupère tous les films aimés d'un utilisateur
app.get('/users/:id/likes', function(req, res) {
    console.log("GET: ");
    var data = [];
    var idsMovie = [];
    var nbMovieLikes;
    var idUser = req.params.id;
    connection.query("SELECT `idMovie` FROM `movie-liked` WHERE idUser = '"+idUser+"'")
        .on('result', function(rows2){
            idsMovie.push(rows2["idMovie"]);
            console.log(idsMovie);
        })
        .on('end', function(){
            console.log("avant for",idsMovie)
            for(var i=0; i<idsMovie.length; i++){
            console.log("pendant for")
                console.log("idsMovie[i]",idsMovie[i])
                connection.query("SELECT * FROM `movie` WHERE id = '"+idsMovie[i]+"'")
                    .on('result', function(rows){
                        data.push(rows);
                        console.log("rows: %o",rows);
                        console.log("data: %o",data);
                    })
                    .on('end', function(){
                        console.log(data.length)
                        if(data.length==idsMovie.length){
                            res.json({ data: data })
                        }
                    });
            }
        });
        console.log("AAAAAAAAAA")
});

// Quand un utilisateur aime un film
app.post('/users/:id/likes/:idmovie', function(req, res) {
    console.log("POST: ");
    console.log(req);
    var data = [];
    var idUser = req.param("id");
    var idMovie = req.param("idmovie");
    var nblikes;
    console.log("idUser "+idUser);
    console.log("idMovie "+idMovie);
    // On ajoute le film
    connection.query('INSERT INTO `movie-liked` SET ?', { idUser : idUser, idMovie : idMovie }, function (err, result) {
        if (err) throw err;
    });
    // Et on incrémente le nombre de likes
    connection.query("SELECT `numberLikes` FROM `user` WHERE id = '"+idUser+"'")
        .on('result', function(rows1){
            console.log(rows1["numberLikes"]);
            nblikes = rows1["numberLikes"];
            nblikes = nblikes + 1;
        })
        .on('end', function(){
            connection.query("UPDATE `user` SET `numberLikes` = "+nblikes+" WHERE id = '"+idUser+"'", function (err, result) {
                if (err) throw err;
            })
        });
});

// Quand un utilisateur n'aime plus un film
app.delete('/users/:id/likes/:idmovie', function(req, res) {
    console.log("DELETE: ");
    console.log(req);
    var data = [];
    var idUser = req.param("id");
    var idMovie = req.param("idmovie");
    console.log("idUser "+idUser);
    console.log("idMovie "+idMovie);
    // On supprime le film
    connection.query("DELETE FROM `movie-liked` WHERE `idUser` = '"+idUser+"' AND `idMovie` = '"+idMovie+"'", function(err, result) {
        if (err) throw err;
        })
    // Et on décrémente le nombre de likes
    connection.query("SELECT `numberLikes` FROM `user` WHERE id = '"+idUser+"'")
        .on('result', function(rows1){
            console.log(rows1["numberLikes"]);
            nblikes = rows1["numberLikes"];
            nblikes = nblikes - 1;
        })
        .on('end', function(){
            connection.query("UPDATE `user` SET `numberLikes` = "+nblikes+" WHERE id = '"+idUser+"'"), function (err, result) {
                if (err) throw err;
            }
        });
});


/****** UTILISATEUR et ses DISLIKES ***/


// On récupère tous les films non aimés d'un utilisateur
app.get('/users/:id/dislikes', function(req, res) {
    console.log("GET: ");
    var data = [];
    var idsMovie = [];
    var idUser = req.params.id;
    connection.query("SELECT `idMovie` FROM `movie-disliked` WHERE idUser = '"+idUser+"'")
        .on('result', function(rows2){
            idsMovie.push(rows2["idMovie"]);
            console.log(idsMovie);
        })
        .on('end', function(){
            console.log("avant for",idsMovie)
            for(var i=0; i<idsMovie.length; i++){
            console.log("pendant for")
                console.log("idsMovie[i]",idsMovie[i])
                connection.query("SELECT * FROM `movie` WHERE id = '"+idsMovie[i]+"'")
                    .on('result', function(rows){
                        data.push(rows);
                        console.log("rows: %o",rows);
                        console.log("data: %o",data);
                    })
                    .on('end', function(){
                        console.log(data.length)
                        if(data.length==idsMovie.length){
                            res.json({ data: data })
                        }
                    });
            }
        });
        console.log("AAAAAAAAAA")
});

// On signale un film non aimé par un utilisateur
app.post('/users/:id/dislikes/:idmovie', function(req, res) {
    console.log("POST: ");
    console.log(req);
    var data = [];
    var idUser = req.param("id");
    var idMovie = req.param("idmovie");
    console.log("idUser "+idUser);
    console.log("idMovie "+idMovie);
    // On ajoute le film
    connection.query('INSERT INTO `movie-disliked` SET ?', { idUser : idUser, idMovie : idMovie }, function(err, result) {
        if (err) throw err;
        });
    // Et on incrémente le nombre de likes
    connection.query("SELECT `numberDislikes` FROM `user` WHERE id = '"+idUser+"'")
        .on('result', function(rows1){
            console.log(rows1["numberDislikes"]);
            nbdislikes = rows1["numberDislikes"];
            nbdislikes = nbdislikes + 1;
        })
        .on('end', function(){
            connection.query("UPDATE `user` SET `numberDislikes` = "+nbdislikes+" WHERE id = '"+idUser+"'", function (err, result) {
                if (err) throw err;
            })
        });
});

// On supprime un film non aimé par un user donnée
app.delete('/users/:id/dislikes/:idmovie', function(req, res) {
    console.log("POST: ");
    console.log(req);
    var data = [];
    var idUser = req.param("id");
    var idMovie = req.param("idmovie");
    console.log("idUser "+idUser);
    console.log("idMovie "+idMovie);
    // On supprime le film dans la table movie-disliked
    connection.query("DELETE FROM `movie-disliked` WHERE `idUser` = '"+idUser+"' AND `idMovie` = '"+idMovie+"'", function(err, result) {
        if (err) throw err;
        })
    // Et on décrémente le nombre de likes dans la table user
    connection.query("SELECT `numberDislikes` FROM `user` WHERE id = '"+idUser+"'")
        .on('result', function(rows1){
            console.log(rows1["numberDislikes"]);
            nbdislikes = rows1["numberDislikes"];
            nbdislikes = nbdislikes - 1;
        })
        .on('end', function(){
            connection.query("UPDATE `user` SET `numberDislikes` = "+nbdislikes+" WHERE id = '"+idUser+"'", function (err, result) {
                if (err) throw err;
            })
        });
});


/****** L'UTILISATEUR et ses WATCHED ***/
// On ajoute un film vu par un utilisateur
app.post('/users/:id/watched/:idmovie', function(req, res) {
    console.log("POST: ");
    console.log(req);
    var data = [];
    var nbwatched;
    var idUser = req.param("id");
    var idMovie = req.param("idmovie");
    console.log("idUser "+idUser);
    console.log("idMovie "+idMovie);
    // On ajoute le film dans la table movie-watched
    connection.query('INSERT INTO `movie-watched` SET ?', { idUser : idUser, idMovie : idMovie }, function(err, result) {
        if (err) throw err;
        });
    // Et on incrémente le nombre de watched dans la table user
    connection.query("SELECT `numberWatched` FROM `user` WHERE id = '"+idUser+"'")
        .on('result', function(rows1){
            console.log(rows1["numberWatched"]);
            nbwatched = rows1["numberWatched"];
            nbwatched = nbwatched + 1;
        })
        .on('end', function(){
            connection.query("UPDATE `user` SET `numberWatched` = "+nbwatched+" WHERE id = '"+idUser+"'", function (err, result) {
                if (err) throw err;
            })
        });
});
/*
// On récupère tous les films vus par un utilisateur
app.get('/users/:id/watched', function(req, res) {
    var data = [];
    var idUser = req.params.id;
    connection.query("SELECT * FROM `movie-watched` WHERE `idUser` = '"+idUser+"'")
        .on('result', function(rows){
            data.push(rows);
        })
        .on('end', function(){
            res.json({ data: data })
        });
});
*/
// On récupère tous les films vus par un utilisateur
app.get('/users/:id/watched', function(req, res) {
    console.log("GET: ");
    var data = [];
    var idsMovie = [];
    var idUser = req.params.id;
    connection.query("SELECT `idMovie` FROM `movie-watched` WHERE idUser = '"+idUser+"'")
        .on('result', function(rows2){
            console.log(idsMovie);
            //if (!idsMovie.contains(rows2)) {
            //if (idsMovie.indexOf(rows2)!=-1) {
            idsMovie.push(rows2["idMovie"]);
            //}
        })
        .on('end', function(){
            console.log("avant for",idsMovie)
            for(var i=0; i<idsMovie.length; i++){
                console.log("pendant for")
                console.log("idsMovie[i]",idsMovie[i])
                connection.query("SELECT * FROM `movie` WHERE id = '"+idsMovie[i]+"'")
                    .on('result', function(rows){
                        data.push(rows);
                        console.log("rows: %o",rows);
                        console.log("data: %o",data);
                    })
                    .on('end', function(){
                        console.log(data.length)
                        console.log(idsMovie.length)
                        //if(data.length==idsMovie.length){
                        if(data.length==4){
                            console.log("data.length==idsMovie.length");
                            res.json({ data: data })
                        }
                    });
            }
        });
        console.log("AAAAAAAAAA")
});


// On supprime un film vu par un user donnée
app.delete('/users/:id/watched/:idmovie', function(req, res) {
    console.log("DELETE: ");
    console.log(req);
    var data = [];
    var idUser = req.param("id");
    var idMovie = req.param("idmovie");
    console.log("idUser "+idUser);
    console.log("idMovie "+idMovie);
    // On supprime le film dans la table movie-watched
    connection.query("DELETE FROM `movie-watched` WHERE `idUser` = '"+idUser+"' AND `idMovie` = '"+idMovie+"'", function(err, result) {
        if (err) throw err;
        })
    // Et on décrémente le nombre de watched dans la table user
    connection.query("SELECT `numberWatched` FROM `movie-watched` WHERE id = '"+idUser+"'")
        .on('result', function(rows1){
            console.log(rows1["numberWatched"]);
            nbwatched = rows1["numberWatched"];
            nbwatched = nbwatched - 1;
        })
        .on('end', function(){
            connection.query("UPDATE `user` SET `numberWatched` = "+nbwatched+" WHERE id = '"+idUser+"'", function (err, result) {
                if (err) throw err;
            })
        });
});


/****** LES FILMS ***/


// On affiche tous les films
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

// On crée un film
app.post('/movies', function(req, res){
    console.log("POST: ");
    var movie = req.param("title");
    //var genre = req.param("genre");
    console.log(movie);
    if(!movie){
        movie = 'movie par defaut';
    }
    connection.query('INSERT INTO movie SET ?', { "title" : movie}, function(err, result) {
        if (err) throw err;
    });
});

// On récupère la fiche d'un film.
app.get('/movies/:id', function(req, res) {
    console.log("GET: ");
    console.log(req);
    var data = [];
    var idMovie = req.params.id;
    connection.query("SELECT * FROM `movie` WHERE id = '"+idMovie+"'")
        .on('result', function(rows){
            data.push(rows);
        })
        .on('end', function(){
            res.json({ data: data })
        });
});

// On supprime la fiche d'un film.
app.delete('/movies/:id', function(req, res) {
    console.log("GET: ");
    console.log(req);
    var data = [];
    var idMovie = req.params.id;
    connection.query("DELETE FROM `movie` WHERE `id` = '"+idMovie+"'", function(err, result) {
        if (err) throw err;
        })
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, "Cette page n'existe pas !");
});

server.listen(8080);