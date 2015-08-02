function draw_all(){
  if(grid) draw_grid() ;
  for(var i=0 ; i<characters.length ; i++){ characters[i].draw() ; }
  for(var i=0 ; i<elements.length   ; i++){ elements[i].draw()   ; }
  if(current_element) current_element.draw() ;
}

function draw_grid(){
  c.strokeStyle = grid_color ;
  c.lineWidth   = grid_width ;
  c.beginPath() ;
  for(var x=0 ; x<=cw ; x+=grid_dx){
    c.moveTo(x+c_offset,   c_offset) ;
    c.lineTo(x+c_offset,ch+c_offset) ;
  }
  for(var y=0 ; y<=ch ; y+=grid_dy){
    c.moveTo(   c_offset,y+c_offset) ;
    c.lineTo(cw+c_offset,y+c_offset) ;
  }
  c.stroke() ;
  
  c.beginPath() ;
  c.strokeStyle = grid_color_2 ;
  for(var x=0 ; x<=cw ; x+=grid_dx*grid_interval){
    c.moveTo(x+c_offset,   0.5) ;
    c.lineTo(x+c_offset,ch+0.5) ;
  }
  for(var y=0 ; y<=ch ; y+=grid_dy*grid_interval){
    c.moveTo(   c_offset,y+c_offset) ;
    c.lineTo(cw+c_offset,y+c_offset) ;
  }
  c.stroke() ;
}
function update_preview(){
  var x1 =  10 ;
  var y1 =  25 ;
  var x2 = 190 ;
  var y2 =  25 ;
  var x3 =  75 ;
  var y3 =  30 ;
  if(current_brush=='arc1' || current_brush=='arc2'){
    y1 = 10 ; y2 = 10 ;
  }
  c_preview.lineWidth = 1 ;
  c_preview.fillStyle = 'white' ;
  c_preview.fillRect(0,0,cw_preview,ch_preview) ;
  var element = new arc_element(x1,y1,x2,y2) ;
  if(current_brush=='line'){
    element.make_line() ;
  }
  else if(current_brush=='arc1' || current_brush=='arc2'){
    element.set_altitude(x3,y3) ;
  }
  if(current_brush=='circle'){
    element.make_circle() ;
  }
  element.context = c_preview ;
  element.draw() ;
  char_brush = false ; // This doesn't really belong here, but it's a convenient place to put it!
}
function update_canvas(){
  c.fillStyle = 'white' ;
  c.fillRect(0,0,cw,ch) ;
  draw_all() ;
  if(current_element) current_element.draw() ;
}

function generate_thumbnails(){
  var canvas  = 0 ;
  var context = 0 ;

  var elements = ['line','arc','circle'] ;
  for(var i=0 ; i<elements.length ; i++){
    canvas  = document.getElementById('canvas_element_'+elements[i]) ;
    context = canvas.getContext('2d') ;
    context.fillStyle = 'white' ;
    context.fillRect(0,0,cw_type,ch_type) ;
    var element = new arc_element(10,0.5*ch_type,cw_type-10,0.5*ch_type) ;
    if(elements[i]=='line'){
      element.make_line() ;
    }
    else if(elements[i]=='arc'){
      element.set_altitude(0.5*cw_type,0.75*ch_type) ;
    }
    else if(elements[i]=='circle'){
      element.make_circle() ;
    }
    element.context = context ;
    element.has_arrowhead = false ;
    element.type = 'solid' ;
    element.set_points() ;
    element.draw() ;
  }

  for(var i=0 ; i<line_types.length ; i++){
    canvas  = document.getElementById('canvas_type_'+line_types[i]) ;
    context = canvas.getContext('2d') ;
    context.fillStyle = 'white' ;
    context.fillRect(0,0,cw_type,ch_type) ;
    var dy = (line_types[i]=='curly') ? -10 : 0 ;
    var line = new arc_element(10,0.5*ch_type+dy,cw_type-10,0.5*ch_type+dy) ;
    line.context = context ;
    line.has_arrowhead = false ;
    line.type = line_types[i] ;
    line.make_line() ;
    line.draw() ;
  }

  var styles = ['solid','hollow','line','cross'] ;
  for(var i=0 ; i<styles.length ; i++){
    canvas  = document.getElementById('canvas_arrow_'+styles[i]) ;
    context = canvas.getContext('2d') ;
    context.fillStyle = 'white' ;
    context.fillRect(0,0,cw_arrow,ch_arrow) ;
    var line = new arc_element(10,0.5*ch_arrow,cw_arrow-10,0.5*ch_arrow) ;
    line.context = context ;
    line.arrowhead_position = 'center' ;
    line.arrowhead_style = styles[i] ;
    line.has_arrowhead = true ;
    line.make_line() ;
    line.type = 'solid' ;
    line.set_points() ;
    line.draw() ;
  }

  var positions = ['end','center'] ;
  for(var i=0 ; i<positions.length ; i++){
    canvas  = document.getElementById('canvas_arrow_'+positions[i]) ;
    context = canvas.getContext('2d') ;
    context.fillStyle = 'white' ;
    context.fillRect(0,0,cw_arrow,ch_arrow) ;
    var line = new arc_element(10,0.5*ch_arrow,cw_arrow-10,0.5*ch_arrow) ;
    line.context = context ;
    line.arrowhead_style    = 'solid' ;
    line.arrowhead_position = positions[i] ;
    line.has_arrowhead = true ;
    line.make_line() ;
    line.type = 'solid' ;
    line.set_points() ;
    line.draw() ;
  }

  var bools = ['on','off'] ;
  for(var i=0 ; i<bools.length ; i++){
    canvas  = document.getElementById('canvas_arrow_'+bools[i]) ;
    context = canvas.getContext('2d') ;
    context.fillStyle = 'white' ;
    context.fillRect(0,0,cw_arrow,ch_arrow) ;
    var line = new arc_element(10,0.5*ch_arrow,cw_arrow-10,0.5*ch_arrow) ;
    line.context = context ;
    line.arrowhead_style    = 'solid' ;
    line.arrowhead_position = 'center' ;
    line.has_arrowhead = (bools[i]=='on') ;
    line.make_line() ;
    line.type = 'solid' ;
    line.set_points() ;
    line.draw() ;
  }
}

function paint_image(){
  find_extrema() ;
  if(x_max<0) return ;
  var dx = -(x_min-paint_margin) ;
  var dy = -(y_min-paint_margin) ;
  x_max += dx ;
  y_max += dy ;
  x_min += dx ;
  y_min += dy ;
  var canvas_out  = document.createElement('canvas') ;
  var context_out = canvas_out.getContext('2d') ;
  
  canvas_out.width  = x_max+paint_margin ;
  canvas_out.height = y_max+paint_margin ;
  
  context_out.fillStyle = 'rgb(255,255,255)' ;
  context_out.fillRect(0,0,canvas_out.width,canvas_out.height) ;
  
  document.getElementById('hidden').appendChild(canvas_out) ;
  for(var i=0 ; i<characters.length ; i++){
    var character = characters[i].clone() ;
    character.translate(dx,dy) ;
    character.context = context_out ;
    character.draw() ;
  }
  for(var i=0 ; i<elements.length ; i++){
    var e = elements[i].clone() ;
    e.translate(dx,dy) ;
    e.context = context_out ;
    e.draw() ;
  }
  if(Get('img_paint')){ Get('img_paint').parentNode.removeChild(Get('img_paint')) ; }
  var img = document.createElement('img') ;
  img.id = 'img_paint' ;
  img.src = canvas_out.toDataURL() ;
  img.width  = canvas_out.width  ;
  img.height = canvas_out.height ;
  Get('image_wrapper').appendChild(img) ;
}

