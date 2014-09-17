function modulation(type,s,n,is_arc){
  // Some function of length along line (in the range [0,1])
  // First value is height above the line
  // Second value is change is change along line (0 except for gluons)
  // Third value is whether present or not (alternating 0 and 1 in portions for dahsed lines)
  if(s<0 || s>1) return [0,0,false] ;
  if(type=='solid'   ) return [0,0,true] ;
  if(type=='wavy'    ) return [sin(2*pi*s*n),0,true] ;
  if(type=='curly'   ){
    if(is_arc){ // This is broken and needs to be fixed
      var t = (n*s-Math.floor(n*s)) ;
      return [1-cos(2*pi*t),sin(2*pi*t),true] ;
    }
    else{
      var t = (n*s-Math.floor(n*s)) ;
      return [1-cos(2*pi*t),sin(2*pi*t),true] ;
    }
  }
  if(type=='dashed'  ) return [0,0,Math.floor(s*n)%2==0] ;
  if(type=='sawtooth'){ // This serves no purpose really, unless someone wants to make a new particle
    var t = (n*s-Math.floor(n*s)) ;
    var y = 0 ;
    if     (t<0.25){ y =    4*t        ; }
    else if(t<0.75){ y =  1-4*(t-0.25) ; }
    else if(t<=1.0){ y = -1+4*(t-0.75) ; }
    return [y,0,true] ;
  }
}
function average_angle(a1,a2,counterclockwise){
  if(counterclockwise){
    if(a1<a2) a1 += 2*pi ;
    return 0.5*(a1+a2) ;
  }
  if(a1>a2) a2 += 2*pi ;
  return 0.5*(a1+a2) ;
}

// User interaction
function choose_brush(element_type){
  current_brush = element_type ;
  update_preview() ;
  update_selected_canvases() ;
  Get('current_brush').innerHTML = current_brush ;
}
function choose_type(type){
  current_type = type ;
  if(current_brush=='glyph') current_brush = 'line' ;
  update_preview() ;
  update_selected_canvases() ;
}
function toggle_arrowhead(value){
  current_arrowhead = value ;
  update_preview() ;
  update_selected_canvases() ;
}
function choose_arrowhead_position(position){
  current_arrowhead_position = position ;
  update_preview() ;
  update_selected_canvases() ;
}
function choose_arrowhead_style(style){
  current_arrowhead_style    = style ;
  update_preview() ;
  update_selected_canvases() ;
}

function remove_last_thing(){
  if(history_feynman.length==0) return ;
  var last_history_feynman = history_feynman.pop() ;
  for(var i=elements.length-1 ; i>=0 ; i--){
    if(elements[i].uid==last_history_feynman) elements.splice(i,1) ;
  }
  for(var i=characters.length-1 ; i>=0 ; i--){
    if(characters[i].uid==last_history_feynman) characters.splice(i,1) ;
  }
  find_extrema() ;
  update_canvas() ;
}
function remove_all_things(){
  elements   = new Array() ;
  characters = new Array() ;
  find_extrema() ;
  update_canvas() ;
  paint_image() ;
}

function move_elements(){
  previous_brush = current_brush ;
  current_brush = 'move0' ;
  Get('current_brush').innerHTML = current_brush ;
}
function delete_elements(){
  previous_brush = current_brush ;
  current_brush = 'delete0' ;
  Get('current_brush').innerHTML = current_brush ;
}

function fermion_settings(){
  current_type = 'solid' ;
  current_arrowhead = true ;
  update_preview() ;
  update_selected_canvases() ;
}
function boson_settings(){
  current_arrowhead = false ;
  update_preview() ;
  update_selected_canvases() ;
}
function gluon_settings(){
  current_type = 'curly' ;
  boson_settings() ;
}
function photon_settings(){
  current_type = 'wavy' ;
  boson_settings() ;
}
function higgs_settings(){
  current_type = 'dashed' ;
  boson_settings() ;
}

// Main
function start(){
  canvas_main    = Get('canvas_feynman') ;
  canvas_preview = Get('canvas_preview') ;
  canvas_main.addEventListener('mousedown',get_xy_down,false) ;
  canvas_main.addEventListener('mouseup'  ,get_xy_up  ,false) ;
  canvas_main.addEventListener('mousemove',get_xy_move,false) ;
  canvas_main.addEventListener('mouseout' ,get_xy_out ,false) ;
  Get('submit_line_width').addEventListener('click' , change_line_weight       , false) ;
  Get('submit_snap'      ).addEventListener('click' , change_snap              , false) ;
  Get('submit_mathjax'   ).addEventListener('click' , create_user_defined_glyph, false) ;
  context_main    = canvas_main   .getContext('2d') ;
  context_preview = canvas_preview.getContext('2d') ;

  // Save some typing
  c         = context_main    ;
  c_preview = context_preview ;
  c.lineWidth = 2 ;
  c_preview.lineWidth = 2 ;

  update_canvas() ;
  draw_all() ;
  update_preview() ;
  generate_thumbnails() ;
  make_all_glyphs_from_main() ;
  update_selected_canvases() ;
  Get('canvas_feynman').oncontextmenu = function(e){ e.preventDefault() ; }
  Get('current_brush').innerHTML = current_brush ;
  Get('input_line_width').value = line_weight ;
  
  window.setTimeout('analyse_latex()', 1000) ;
}

function change_snap(){
  snap_mode = Get('select_snap').value ;
}
function change_line_weight(){
  var line_weight_tmp = parseInt(Get('input_line_width').value) ;
  if(line_weight_tmp>0) line_weight = line_weight_tmp ;
  draw_all() ;
  update_preview() ;
  generate_thumbnails() ;
  paint_image() ;
  update_canvas() ;
}

function update_selected_canvases(){
  Get('canvas_element_line'  ).className = (current_brush=='line'  ) ? 'selected' : '' ;
  Get('canvas_element_arc'   ).className = (current_brush=='arc1'  ) ? 'selected' : '' ;
  Get('canvas_element_circle').className = (current_brush=='circle') ? 'selected' : '' ;
  for(var i=0 ; i<line_types.length             ; i++){
    Get('canvas_type_' +line_types[i]             ).className = (current_type==line_types[i]                       ) ? 'selected' : '' ;
  }
  for(var i=0 ; i<arrowhead_styles.length       ; i++){
    Get('canvas_arrow_'+arrowhead_styles[i]       ).className = (current_arrowhead_style==arrowhead_styles[i]      ) ? 'selected' : '' ;
  }
  for(var i=0 ; i<arrowhead_positions.length    ; i++){
    Get('canvas_arrow_' +arrowhead_positions[i]   ).className = (current_arrowhead_position==arrowhead_positions[i]) ? 'selected' : '' ;
  }
  for(var i=0 ; i<arrowhead_visibilities.length ; i++){
    Get('canvas_arrow_' +arrowhead_visibilities[i]).className = (current_arrowhead!=i                              ) ? 'selected' : '' ;
  }
  var tds = document.getElementsByTagName('td') ;
  for(var i=0 ; i<tds.length ; i++){
    if(tds[i].className=='td_latex_wrapper_selected') tds[i].className = 'td_latex_wrapper' ;
  }
  if(current_brush=='glyph'){
    Get(glyph_name).className = 'td_latex_wrapper_selected' ;
  }
}

function generate_random_arc(){
  elements = new Array() ;
  var arc = new arc_element(150+100*Math.random(),300+100*Math.random(),350+100*Math.random(),300+100*Math.random()) ;
  arc.set_altitude(200+100*Math.random(),300+100*Math.random()) ;
  elements.push(arc) ;
  update_canvas() ;
  draw_all() ;
}
function generate_random_line(){
  elements = new Array() ;
  var line = new line_element(150+100*Math.random(),300+100*Math.random(),350+100*Math.random(),300+100*Math.random()) ;
  elements.push(line) ;
  update_canvas() ;
  draw_all() ;
}

function find_extrema(){
  x_min =  1e6 ;
  y_min =  1e6 ;
  x_max = -1e6 ;
  y_max = -1e6 ;
  for(var i=0 ; i<elements.length ; i++){
    if(elements[i].x_min<x_min) x_min = elements[i].x_min ;
    if(elements[i].y_min<y_min) y_min = elements[i].y_min ;
    if(elements[i].x_max>x_max) x_max = elements[i].x_max ;
    if(elements[i].y_max>y_max) y_max = elements[i].y_max ;
  }
  for(var i=0 ; i<characters.length ; i++){
    if(characters[i].x_min<x_min) x_min = characters[i].x_min ;
    if(characters[i].y_min<y_min) y_min = characters[i].y_min ;
    if(characters[i].x_max>x_max) x_max = characters[i].x_max ;
    if(characters[i].y_max>y_max) y_max = characters[i].y_max ;
  }
  x_min = Math.floor(x_min) ;
  y_min = Math.floor(y_min) ;
  x_max = Math.floor(x_max) ;
  y_max = Math.floor(y_max) ;
}

function read_markup(){
  elements = [] ;
  characters = [] ;
  var markup = Get('markup_in').value ;
  eval(markup) ;
  add_all_user_glyphs_1() ;
  for(var i=0 ; i<characters.length ; i++){
    var name = characters[i].glyph_name ;
    name = name.replace('canvas_','') ;
    canvas_from_element(Get(name), 'canvas_' + name, Get('div_glyphs')) ;
  }
  window.setTimeout('add_all_user_glyphs_2()',  500) ;
  window.setTimeout('read_markup2()'         , 2000) ;
}

function read_markup2(){
  find_extrema() ;
  update_canvas() ;
  draw_all() ;
  paint_image() ;
  write_markup() ;
}
function write_markup(){
  var text = '' ;
  text = text + markup_from_user_glyphs() ;
  for(var i=0 ; i<elements.length ; i++){
    text = text + elements[i].markup() + '\n' ;
  }
  for(var i=0 ; i<characters.length ; i++){
    text = text + characters[i].markup() + '\n' ;
  }
  Get('markup_out').value = text ;
}

function analyse_latex(){
  var node = Get('td_latex_TauPM') ;
  var mathjax_elements_out = [] ;
  var spans = node.getElementsByTagName('span') ;
  for(var i=1 ; i<spans.length ; i++){
    var s = spans[i] ;
    for(var j=0 ; j<s.childNodes.length ; j++){
      var c = s.childNodes[j] ;
      if(!(c.innerHTML)) continue ;
      if(c.innerHTML!='' && c.innerHTML.indexOf('<span')==-1){
        mathjax_elements_out.push(new mathjax_element_object(c)) ;
      }
    }
  }
  this.name = node.id ;
  this.mathjax = mathjax_elements_out ;
  this.x_min = 1e6 ;
  this.y_min = 1e6 ;
  this.normalise = function(){
    for(var i=0 ; i<this.mathjax.length ; i++){
      if(this.mathjax[i].left_offset<x_min) this.x_min = this.mathjax[i].left_offset ;
      if(this.mathjax[i].top_offset <y_min) this.y_min = this.mathjax[i].top_offset  ;
    }
    for(var i=0 ; i<this.mathjax.length ; i++){
      this.mathjax[i].left_offset -= this.x_min ;
      this.mathjax[i].top_offset  -= this.y_min ;
    }
  }
  this.print = function(dx, dy){
    var text_out = [] ;
    text_out.push('%!') ;
    for(var i=0 ; i<this.mathjax.length ; i++){
      text_out.push('/' + this.mathjax[i].font_family + ' ' + this.mathjax[i].font_size + ' selectfont') ;
      text_out.push( (dx+this.mathjax[i].left_offset) + ' ' + (dy+this.mathjax[i].top_offset) + ' moveto') ;
      text_out.push( '(' + this.mathjax[i].innerHTML + ') show') ;
    }
    var result = text_out.join('\n') ;
    Get('eps_out').value = result ;
    return result ;
  }
  this.normalise() ;
  this.print(100,100) ;
}

function mathjax_element_object(span){
  var offset = $('#'+span.id).offset() ;
  this.innerHTML   = span.innerHTML    ;
  this.top_offset  = offset.top  ;
  this.left_offset = offset.left ;
  this.font_family = $('#'+span.id).css('fontFamily') ;
  this.font_size   = $('#'+span.id).css('fontSize'  ) ;
  this.font_style  = $('#'+span.id).css('fontStyle' ) ;
  this.width       = $('#'+span.id).outerWidth()  ;
  this.height      = $('#'+span.id).outerHeight() ;
}

function  abs(x){ return Math.abs(x)  ; }
function  sin(x){ return Math.sin(x)  ; }
function  cos(x){ return Math.cos(x)  ; }
function acos(x){ return Math.acos(x) ; }
function sign(x){ return (x>0) ? 1 : -1 ; }
function sqrt(x){ return Math.sqrt(x) ; }
function  pow(x,n){ return Math.pow(x,n)  ; }
function atan2(y,x){ return Math.atan2(y,x) ; }
function Get(id){ return document.getElementById(id) ; }
