var biblia = {}; //Recebe um objeto completo da bliblia
var livroAtual = {}; //Armazena qual o livro o usuario esta visualizando
var lenghtLivroAtual = 0; //quantos capitulos tem o livro escolhido pelo usuario
var capituloAtual = 0; 
var verciculoAtual = "";
var referenciaVerciculo = "";

//Recebe um objeto JSON, armazena no objeto biblia e cria um menu com o nome de todos os livros.
function getBiblia(){
  $.getJSON("https://raw.githubusercontent.com/davigsouza81/biblia/master/json/aa.json", function(dados) {
    var livros = [];
    livros.push('<h4 class="list-group-item active">Velho Testamento</h4>');
    
    $.each( dados, function( key, val ) {
      biblia[val.name] = val;
      
      if(val.name === "Mateus")
        livros.push('<h4 class="list-group-item active">Novo Testamento</h4>');
      else
        livros.push('<a href="#" class="list-group-item" onclick="getLivro(\'' + val.name + '\')">' + val.name +'</a>');
    });
    
    $('#livros').html(livros);
  });
}

//Pega no objeto Biblia o livro que o usuario ecolheu e preencre o Modal
function getLivro(livro){
  livroAtual = biblia[livro];
  lenghtLivroAtual = livroAtual.chapters.length -1;
  var capitulos = [];
  
  for(var i = 0; i <= lenghtLivroAtual; i++){
    capitulos.push(' <li class="text-justify"><a href="#" onclick="getCapitulo('+ i +')">Capítulo - <span class="badge">'+(i+1)+'</span></a></li>');
  }
  
  $("#labelCapitulo").html(livroAtual.name);
  $(".dropdown-menu").html(capitulos);
  getCapitulo(0);
  
  $("#modalCapitulos").modal();
}

//Pega no objeto LivroAtual o capitulo escolhido e coloca no Modal
function getCapitulo(numero){
  capituloAtual = numero;
  var verciculos = [];
  var tooltip = 'data-toggle="tooltip" data-placement="bottom" title="Clique para compartilhar"';
  
  $.each( livroAtual.chapters[numero], function( key, val ) {
    verciculos.push('<li class="list-group-item"><a href="#" onclick="compartilhar('+key+')"'+ tooltip +'><b>' + (key+1) + ' - </b>' + val +'</a></li>');
  });
  
  $("#capituloAtual").html(capituloAtual+1);
  $(".modal-body > ul").html(verciculos);
  $('[data-toggle="tooltip"]').tooltip();
}

//Apresenta um Modal com o verciculo escolhido para compartilhar em redes sociais
function compartilhar(vercilulo){
  verciculoAtual = livroAtual.chapters[capituloAtual][vercilulo];
  referenciaVerciculo = livroAtual.name + " " + (capituloAtual+1) +":"+ (vercilulo+1);
  
  $("#modalCompartilhar #text").html(verciculoAtual);
  $("#modalCompartilhar footer").html(referenciaVerciculo)
  
  $('#tweet-quote').attr('href', 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + verciculoAtual + '" ' + referenciaVerciculo));
  $("#whats-quote").attr('href', 'https://api.whatsapp.com/send?text=*' + encodeURIComponent('"' + verciculoAtual + '"* ' + referenciaVerciculo));
 
  $("#modalCompartilhar").modal();
  $("#modalCompartilhar").on('hidden.bs.modal', function(){
      $("body").addClass("modal-open");
  });
}

$(document).ready(function() {
  getBiblia();
  
  $("#next").on("click", function(){
    if(capituloAtual < lenghtLivroAtual)
      getCapitulo(capituloAtual+1);
    else
      getCapitulo(0);
  });
  
  $("#prev").on("click", function(){
    if(capituloAtual > 0)
      getCapitulo(capituloAtual-1);
    else
      getCapitulo(lenghtLivroAtual);
  });
});