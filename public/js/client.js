var socket = io.connect('http://localhost:8080');
(function($){

	

	// récupère les données entrées dans le formulaire page create
	$('#sondageform').submit(function(event){
		console.log($('#position').val())
			event.preventDefault();
			socket.emit('NewSondage', {
				question : $('#question').val(),
				r1	: $('#r1').val(),
				r2	: $('#r2').val(),
				r3	: $('#r3').val(),
				r4	: $('#r4').val(),
				r5	: $('#r5').val(),
				contexte	: $('#contexte').val(),
				adresse	: $('#adresse').val(),
				position	: $('#position').val(),
			})
	});	

	socket.on('newusr', function(){
		alert('nouvel utilisateur');
	});



	// récupère la recherche et l'envoi
		$('#rechercheForm').submit(function(event){
			event.preventDefault();
			socket.emit('recherche', $('#recherche').val())
	});	



		
			// envoi du texte "sondage bien envoyé etc"
	socket.on('reponse' , function(msg){

            $('.change').html(msg);
            
        });		
        	// Liste  les sondages
	socket.on('liste' , function(data){
			var html ='';
			/*<a href="sondage/'+data[i].id+'">*/
			 for (var i = 0; i < data.length; i++){
			 	if(data[i].contexte){
	                html+='<a href="sondage/'+data[i].id+'"><div class="vignette"><div class="vignette-question">' + data[i].question + '</div><div class="vignette-contexte"><span>'+ data[i].contexte +'</span></div></div></a>';
	           		}
           		else 
           			{
           			html+='<a href="sondage/'+data[i].id+'"><div class="vignette"><div class="vignette-question">' + data[i].question + '</div><div class="vignette-contexte"></div></div></a>';
	           		}
            };
            $('#content-vignettes').replaceWith('<div id="content-vignettes">'+html+'</div>');
            
        });



})(jQuery);
		// vote unique
		// recupère l'id du sondage venant d'être voté et le stock dans une variable de session 
		function sendId(voteId){
		    var id = voteId;
	        socket.emit('voteId', voteId)
    	};
