var history_feynman = [] ;

function keydown(evt){
  var keyDownID = window.event ? event.keyCode : (evt.keyCode != 0 ? evt.keyCode : evt.which) ;
  alert(keyDownID) ;
  switch(keyDownID){
    case 27:
      evt.preventDefault() ;
      remove_last_thing() ;
      break ;
  }
}

function is_right_click(e){
  // Is it a right click?
  var rightclick ;
  if(!e) var e = window.event ;
  if     (e.which ) rightclick = (e.which ==3) ;
  else if(e.button) rightclick = (e.button==2) ;
  return rightclick ;
}

function get_mouse_xy(e, stage){
  var rc = is_right_click(e) ;
  var x = e.pageX - Get('canvas_feynman').offsetLeft ;
  var y = e.pageY - Get('canvas_feynman').offsetTop  ;
  if(rc) return [x,y] ;
  if(snap_mode=='grid'){
    x = snap_dx*Math.round(x/snap_dx) ;
    y = snap_dy*Math.round(y/snap_dy) ;
  }
  else if(snap_mode=='shapes' || snap_mode=='shapesGrid'){
    if(stage=='move' || stage=='up')y += 2*snap_dy ;
    var best_dr2 = snap_dx*snap_dy ;
    var best_x = -1 ;
    var best_y = -1 ;
    var dj = 1 ;
    for(var i=0 ; i<elements.length ; i++){
      var el = elements[i] ;
      for(var j=0 ; j<el.points.length ; j+=dj){
        var p = el.points[j] ;
        var dr2_tmp = pow(x-p[0],2) + pow(y-p[1],2) ;
        if(dr2_tmp<best_dr2){
          best_x = p[0] ;
          best_y = p[1] ;
          best_dr2 = dr2_tmp ;
        }
      }
    }
    if(best_x>0 && best_y>0){
      x = best_x ;
      y = best_y ;
    }
    else if(snap_mode=='shapesGrid'){
      x = snap_dx*Math.round(x/snap_dx) ;
      y = snap_dy*Math.round(y/snap_dy) ;
    }
  }
  return [x,y] ;
}

function get_xy_down(e){
  var rc = is_right_click(e) ;
  var xy = get_mouse_xy(e,'down') ;
  x_down = xy[0] ;
  y_down = xy[1] ;
  if(rc){
    previous_brush = current_brush ;
    current_brush = 'move1' ;
  }
  if(current_brush=='arc2'   ) current_brush = 'arc3'    ; 
  if(current_brush=='move0'  ) current_brush = 'move1'   ; 
  if(current_brush=='move2'  ) current_brush = 'move3'   ;
  if(current_brush=='delete0') current_brush = 'delete1' ;
  Get('current_brush').innerHTML = current_brush ;
}
function get_xy_move(e){
  var rc = is_right_click(e) ;
  var xy = get_mouse_xy(e,'move') ;
  x_move = xy[0] ;
  y_move = xy[1] ;
  
  if(current_brush=='move1' || current_brush=='delete1'){
    // We're just dragging a rectangle around, so just update which elements are captured by it
    current_element = new rectangle_object(x_down,y_down,x_move,y_move) ;
    for(var i=0 ; i<elements.length ; i++){
      elements[i].falls_in_rectangle(x_down, y_down, x_move, y_move) ;
    }
    for(var i=0 ; i<characters.length ; i++){
      characters[i].falls_in_rectangle(x_down, y_down, x_move, y_move) ;
    }
  }
  else if(current_brush=='move3' && current_element!=null){
    // Now we need to actually move things
    var dx = x_move - x_down ;
    var dy = y_move - y_down ;
    current_element.x1 = current_element.x1_0 + dx ;
    current_element.y1 = current_element.y1_0 + dy ;
    for(var i=0 ; i<elements.length ; i++){
      if(elements[i].p1_in_rectangle){
        elements[i].x1 = elements[i].x1_0 + dx ;
        elements[i].y1 = elements[i].y1_0 + dy ;
      }
      if(elements[i].p2_in_rectangle){
        elements[i].x2 = elements[i].x2_0 + dx ;
        elements[i].y2 = elements[i].y2_0 + dy ;
      }
      elements[i].update_parameters() ;
    }
    for(var i=0 ; i<characters.length ; i++){
      if(characters[i].in_rectangle){
        characters[i].x = characters[i].x_0 + dx ;
        characters[i].y = characters[i].y_0 + dy ;
      }
      characters[i].update_parameters() ;
    }
  }
  else if(current_brush=='glyph'){
    current_element = new character_object('canvas_'+glyph_name,x_move,y_move) ;
  }
  else{
    if(x_down==-1 && y_down==-1) return ;
    if(current_brush=='line' || current_brush=='arc1'){
      current_element = new arc_element(x_down,y_down,x_move,y_move) ;
      current_element.make_line() ;
    }
    if(current_brush=='circle'){
      current_element = new arc_element(x_down,y_down,x_move,y_move) ;
      current_element.make_circle() ;
    }
    else if(current_brush=='arc3'){
      current_element.set_altitude(x_move,y_move) ;
    }
  }
  update_canvas() ;
  draw_all() ;
  Get('current_brush').innerHTML = current_brush ;
}
function get_xy_up(e){
  var rc = is_right_click(e) ;
  var xy = get_mouse_xy(e,'up') ;
  x_up = xy[0] ;
  y_up = xy[1] ;
  if(current_brush=='move1'){ current_brush = 'move2' ; }
  else if(current_brush=='move3'){
    for(var i=0 ; i<elements.length ; i++){
      elements[i].p1_in_rectangle = false ;
      elements[i].p2_in_rectangle = false ;
      elements[i].snapshot_coords() ;
    }
    for(var i=0 ; i<characters.length ; i++){
      characters[i].in_rectangle = false ;
      characters[i].snapshot_coords() ;
    }
    current_brush = previous_brush ;
    current_element = null ;
  }
  else if(current_brush=='delete1'){
    for(var i=elements.length-1 ; i>=0 ; i--){
      if(elements[i].p1_in_rectangle && elements[i].p2_in_rectangle){
        for(var j=history_feynman.length-1 ; j>=0 ; j--){
          if(history_feynman[j]==elements[i].uid){
            history_feynman.splice(j,1) ;
            break ;
          }
        }
        elements.splice(i,1) ;
      }
    }
    for(var i=characters.length-1 ; i>=0 ; i--){
      if(characters[i].in_rectangle){
        for(var j=history_feynman.length-1 ; j>=0 ; j--){
          if(history_feynman[j]==characters[i].uid){
            history_feynman.splice(j,1) ;
            break ;
          }
        }
        characters.splice(i,1) ;
      }
    }
    for(var i=0 ; i<elements.length ; i++){
      elements[i].p1_in_rectangle = false ;
      elements[i].p2_in_rectangle = false ;
    }
    for(var i=0 ; i<characters.length ; i++){
      characters[i].in_rectangle = false ;
    }
    current_brush = previous_brush ;
    current_element = null ;
  }
  else if(current_brush=='glyph'){
    var character = new character_object('canvas_'+glyph_name,x_down,y_down) ;
    var uid = 'C' + character_uid ;
    character.uid = uid ;
    characters.push(character) ;
    history_feynman.push(uid) ;
    character_uid++ ;
  }
  else if(current_brush=='line'){
    var line = new arc_element(x_down,y_down,x_up,y_up) ;
    var uid = 'L' + element_uid ;
    line.uid = uid ;
    history_feynman.push(uid) ;
    element_uid++ ;
    line.make_line() ;
    current_element = null ;
    elements.push(line) ;
    history_feynman.push(uid) ;
    x_down = -1 ;
    y_down = -1 ;
  }
  else if(current_brush=='arc1'){
    //current_element = new arc_element(x_down,y_down,x_up,y_up) ;
    current_brush = 'arc2' ;
  }
  else if(current_brush=='arc3'){
    var uid = 'A' + element_uid ;
    current_element.uid = uid ;
    history_feynman.push(uid) ;
    element_uid++ ;
    elements.push(current_element) ;
    current_element = null ;
    current_brush = 'arc1' ;
  }
  else if(current_brush=='circle'){
    var uid = 'C' + element_uid ;
    current_element.uid = uid ;
    history_feynman.push(uid) ;
    element_uid++ ;
    elements.push(current_element) ;
    current_element = null ;
  }
  else if(x_down==x_up && y_down==y_up && current_brush!='arc3'){
    x_down = -1 ;
    y_down = -1 ;
    return ;
  }
  Get('current_brush').innerHTML = current_brush ;
  update_canvas() ;
  draw_all() ;
  paint_image() ;
  write_markup() ;
  x_down = -1 ;
  y_down = -1 ;
}
function get_xy_out(e){
  current_element = null ;
  if(current_brush=='arc2'   ) current_brush = 'arc1'         ;
  if(current_brush=='move1'  ) current_brush = previous_brush ;
  if(current_brush=='move2'  ) current_brush = previous_brush ;
  if(current_brush=='move3'  ) current_brush = previous_brush ;
  if(current_brush=='delete1') current_brush = previous_brush ;
  update_selected_canvases() ;
  update_canvas() ;
  x_down = -1 ;
  y_down = -1 ;
  Get('current_brush').innerHTML = current_brush ;
}

