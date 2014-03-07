// Adding custom symbols to the canvas

var safari_image = [] ;
safari_image['img'] = null ;
safari_image['w'  ] = null ;
safari_image['h'  ] = null ;
safari_image['m'  ] = null ;
safari_image['url'] = null ;
safari_image['id' ] = null ;
safari_image['DOMURL'] = null ;
safari_image['container'] = null ;

function canvas_from_element(element, id, container){
  if(Get(id)!=undefined && Get(id)!=null) return false ; // Check to make sure id is not already used
  if(container==undefined || container==null) container = document.getElementsByTagName('body')[0] ;
  if(element==undefined || element==null) return false ;
  //var w = element.offsetWidth  ;
  //var h = element.offsetHeight ;
  var id2 = element.id ;
  var w = $('#'+id2).outerWidth() ;
  var h = $('#'+id2).outerHeight() ;
  var m = margin ;
  var render = element.innerHTML ;
  
  // Hint from http://stackoverflow.com/questions/21049179/drawing-an-svg-containing-html-in-a-canvas-with-safari
  //var data = 'data:image/svg+xml,'+'<svg xmlns="http://www.w3.org/2000/svg" width="'+ (w+2*m) +'" height="'+ (h+2*m) +'">' +
  var data = '<svg xmlns="http://www.w3.org/2000/svg" width="'+ (w+2*m) +'" height="'+ (h+2*m) +'">' +
             '<foreignObject width="100%" height="100%">' +
               '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20pt;padding:0.1em">' +
                 render +
               '</div></foreignObject></svg>';
  var DOMURL = self.URL || self.webkitURL || self ;
  var img = new Image() ;
  var svg = new Blob([data], {type: "image/svg+xml;charset=utf-8"}) ;
  var url = DOMURL.createObjectURL(svg) ;
  img.onload = function(){
    var canvas = document.createElement('canvas') ;
    canvas.width  = w+2*m ;
    canvas.height = h+2*m ;
    canvas.style.width  = w+2*m ;
    canvas.style.height = h+2*m ;
    canvas.id = id ;
    var context = canvas.getContext('2d') ;
    context.fillStyle = 'rgb(255,255,255)' ;
    context.drawImage(img, 0, 0, w, h, m, m, 1*w, 1*h) ;
    container.appendChild(canvas) ;
    
    DOMURL.revokeObjectURL(url) ; // Garbage collection
  } ;
  img.src = url ;
  
  safari_image['img'] = img ;
  safari_image['w'  ] =   w ;
  safari_image['h'  ] =   h ;
  safari_image['m'  ] =   m ;
  safari_image['url'] = url ;
  safari_image['id' ] =  id ;
  safari_image['DOMURL'] =  DOMURL ;
  safari_image['container'] = container ;
  
  //window.setTimeout('safari_process_image()', 500)
  return true ;
}

function safari_process_image(){
  var img = safari_image['img'] ;
  var w   = safari_image['w'  ] ;
  var h   = safari_image['h'  ] ;
  var m   = safari_image['m'  ] ;
  var url = safari_image['url'] ;
  var id  = safari_image['id' ] ;
  var DOMURL = safari_image['DOMURL'] ;
  var container = safari_image['container'] ;
  
  alert(img.src) ;

  var canvas = document.createElement('canvas') ;
  canvas.width  = w+2*m ;
  canvas.height = h+2*m ;
  canvas.style.width  = w+2*m ;
  canvas.style.height = h+2*m ;
  canvas.id = id ;
  var context = canvas.getContext('2d') ;
  context.fillStyle = 'rgb(255,255,255)' ;
  context.drawImage(img, 0, 0, w, h, m, m, 1*w, 1*h) ;
  container.appendChild(canvas) ;
    
  DOMURL.revokeObjectURL(url) ; // Garbage collection
  Get('span_mathjax_box').innerHTML = '' ;
  
  safari_image['img'] = null ;
  safari_image['w'  ] = null ;
  safari_image['h'  ] = null ;
  safari_image['m'  ] = null ;
  safari_image['url'] = null ;
  safari_image['id' ] = null ;
  safari_image['container'] = null ;
}


function glyph_group(name){
  this.name = name ;
  this.symbols = [] ;
  this.append = function(symbol){
    this.symbols.push(symbol) ;
  }
  this.row = function(nCells){
    var tr = document.createElement('tr') ;
    var th = document.createElement('th') ;
    th.innerHTML = this.name ;
    tr.appendChild(th) ;
    for(var i=0 ; i<nCells ; i++){
      var td = document.createElement('td') ;
      if(i<this.symbols.length){
        var name  = this.symbols[i][0] ;
        var latex = '\\(' + this.symbols[i][1] + '\\)' ;
        var span = document.createElement('span') ;
        span.innerHTML = latex ;
        td.appendChild(span) ;
        td.addEventListener('click',select_glyph) ;
        td.id = 'td_latex_' + name ;
        td.fontSize = '20pt' ;
        td.className = 'td_latex_wrapper' ;
      }
      tr.appendChild(td) ;
    }   
    return tr ;
  }
}

function findUpTag(el, tag){
  while(el.parentNode){
    el = el.parentNode ;
    if(el.tagName){
      if(el.tagName.toUpperCase()===tag.toUpperCase()) return el ;
    }
  }
  return null;
}

function select_glyph(evt){
  var node = findUpTag(evt.target, 'td') ;
  if(!node) return ;
  var name = node.id ;
  canvas_from_element(Get(name), 'canvas_' + name, Get('div_glyphs')) ;
  current_brush = 'glyph' ;
  glyph_name = name ;
  update_selected_canvases() ;
}

function make_all_glyphs_from_main(){
  nCells = 0 ;
  for(var i=0 ; i<glyphs.length ; i++){
    if(glyphs[i].symbols.length>nCells) nCells = glyphs[i].symbols.length ;
  }
  for(var i=0 ; i<glyphs.length ; i++){
    var row = glyphs[i].row(nCells) ;
    Get('tbody_glyphs').appendChild(row) ;
  }
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,Get('tbody_glyphs')]) ;
  Get('tbody_glyphs').appendChild(latex_user_row()) ;
}

function latex_user_row(){
  var tr = document.createElement('tr') ;
  tr.id = 'tr_latex_user_1' ;
  var th = document.createElement('th') ;
  th.innerHTML = 'User defined' ;
  tr.appendChild(th) ;
  for(var i=0 ; i<nCells ; i++){
    var td = document.createElement('td') ;
    td.id = 'td_latex_user_' + user_counter ;
    td.className = 'td_latex_wrapper' ;
    tr.appendChild(td) ;
    user_counter++ ;
  }
  return tr ;
}

function create_user_defined_glyph(){
  var name   = 'user_' + used_user_counter ;
  user_glyphs.push(Get('input_mathjax').value) ;
  var latex = '\\(' + Get('input_mathjax').value + '\\)' ;
  var td = Get('td_latex_user_' + used_user_counter) ;
  if(td==null || td==undefined){
    Get('tbody_glyphs').appendChild(latex_user_row()) ;
    td = Get('td_latex_user_' + used_user_counter) ;
  }
  var span = document.createElement('span') ;
  span.innerHTML = latex ;
  td.appendChild(span) ;
  td.addEventListener('click',select_glyph) ;
  td.id = 'td_latex_' + name ;
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,Get('tbody_glyphs')]) ;
  used_user_counter++ ;
}

function markup_from_user_glyphs(){
  var text = [] ;
  for(var i=0 ; i<user_glyphs.length ; i++){
    text.push('user_glyphs.push("'+user_glyphs[i]+'")') ;
  }
  text.push('') ;
  return text.join(';\n') ;
}

function add_all_user_glyphs_1(){
  for(var i=0 ; i<user_glyphs.length ; i++){
    var name   = 'user_' + used_user_counter ;
    var latex = '\\(' + user_glyphs[i] + '\\)' ;
    var td = Get('td_latex_user_' + used_user_counter) ;
    if(td==null || td==undefined){
      Get('tbody_glyphs').appendChild(latex_user_row()) ;
      td = Get('td_latex_user_' + used_user_counter) ;
    }
    var span = document.createElement('span') ;
    span.innerHTML = latex ;
    td.appendChild(span) ;
    td.addEventListener('click',select_glyph) ;
    td.id = 'td_latex_' + name ;
    used_user_counter++ ;
  }
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,Get('tbody_glyphs')]) ;
}
function add_all_user_glyphs_2(){
  for(var i=0 ; i<user_glyphs.length ; i++){
    var name   = 'td_latex_user_' + i ;
    canvas_from_element(Get(name), 'canvas_' + name, Get('div_glyphs')) ;
  }
}

var user_glyphs = [] ;
