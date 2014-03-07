// Classes for the various things
var element_uid   = 0 ;
var character_uid = 0 ;

function rectangle_object(x1, y1, x2, y2){
  this.x1 = x1 ;
  this.y1 = y1 ;
  this.x2 = x2 ;
  this.y2 = y2 ;
  this.x1_0 = this.x1 ;
  this.y1_0 = this.y1 ;
  this.w = this.x2-this.x1 ;
  this.h = this.y2-this.y1 ;
  this.context = c ;
  this.draw = function(){
    this.context.strokeStyle = 'rgb(100,100,100)' ;
    this.context.strokeRect(this.x1,this.y1,this.w,this.h) ;
  }
}

function character_object(glyph_name, x, y){
  this.uid = -1 ;
  this.glyph_name = glyph_name ;
  this.x = x ;
  this.y = y ;
  this.w = $('#'+this.glyph_name).outerWidth()  ;
  this.h = $('#'+this.glyph_name).outerHeight() ;
  this.x_min = this.x - 0.5*this.w ;
  this.x_max = this.x + 0.5*this.w ;
  this.y_min = this.y - 0.5*this.h ;
  this.y_max = this.y + 0.5*this.h ;
  this.context = c ;
  this.draw = function(){
    // Some of this is taken from https://developer.mozilla.org/en/docs/HTML/Canvas/Drawing_DOM_objects_into_a_canvas
    var source = Get(this.glyph_name) ;
    this.context.drawImage(source, this.x-0.2*this.w, this.y-0.5*this.h) ;
    if(this.in_rectangle) this.draw_selection_circle(this.x,this.y) ;
  }
  this.draw_selection_circle = function(x,y){
    this.context.beginPath() ;
    this.context.strokeStyle = 'rgb(255,0,0)' ;
    //this.context.arc(x,y,15,0,2*Math.PI,false) ;
    this.context.strokeRect(this.x_min,this.y_min,this.w,this.h) ;
    this.context.stroke() ;
  }
  
  this.clone = function(){
    var character_out = new character_object(this.glyph_name,this.x,this.y) ;
    character_out.context = this.context ;
    return character_out ;
  }
  this.translate = function(dx,dy){
    this.x += dx ;
    this.y += dy ;
  }
  
  // Methods for selecting and moving the element
  this.in_rectangle = false ;
  this.snapshot_coords = function(){
    this.x_0 = this.x ;
    this.y_0 = this.y ;
  }
  this.snapshot_coords() ;
  this.falls_in_rectangle = function(xA, yA, xB, yB){
    var xMin = Math.min(xA,xB) ;
    var xMax = Math.max(xA,xB) ;
    var yMin = Math.min(yA,yB) ;
    var yMax = Math.max(yA,yB) ;
    if(this.x>=xMin && this.x<=xMax && this.y>=yMin && this.y<=yMax){
      this.in_rectangle = true ;
      this.snapshot_coords() ;
    }
  }
  this.update_parameters = function(){
    this.x_min = this.x - 0.5*this.w ;
    this.x_max = this.x + 0.5*this.w ;
    this.y_min = this.y - 0.5*this.h ;
    this.y_max = this.y + 0.5*this.h ;
  }
  this.markup = function(){
    var text = [] ;
    text.push( 'symbol = new character_object("'+this.glyph_name+'",'+this.x+','+this.y+')' ) ;
    text.push('characters.push(symbol)') ;
    text.push('') ;
    return text.join(';') ;
  }
}
function arc_element(x1,y1,x2,y2,r,direction){
  this.uid = -1 ;
  // This element is defined by three points:
  // The user specifies two points that fall on the arc (these define a chord of a circle)
  // Then the user specifies a point above the centre of the chord, the altitude.
  // A circle is created whose cirumference passes through all three points.
  // The arc is taken from this circle.

  // Chord parameters
  this.x1 = x1 ;
  this.y1 = y1 ;
  this.x2 = x2 ;
  this.y2 = y2 ;
  this.dx = this.x2-this.x1 ;
  this.dy = this.y2-this.y1 ;
  this.d  = sqrt(pow(this.dx,2)+pow(this.dy,2)) ;
  this.a  = atan2(this.dy,this.dx) ;

  this.x_min =  1e6 ;
  this.y_min =  1e6 ;
  this.x_max = -1e6 ;
  this.y_max = -1e6 ;
  
  if(this.x1<this.x_min) this.x_min = this.x1 ;
  if(this.x2<this.x_min) this.x_min = this.x2 ;
  if(this.x1>this.x_max) this.x_max = this.x1 ;
  if(this.x2>this.x_max) this.x_max = this.x2 ;
  if(this.y1<this.y_min) this.y_min = this.y1 ;
  if(this.y2<this.y_min) this.y_min = this.y2 ;
  if(this.y1>this.y_max) this.y_max = this.y1 ;
  if(this.y2>this.y_max) this.y_max = this.y2 ;

  // Altitude parameters
  this.xh = 0 ; // x coordinate of altitude above chord
  this.yh = 0 ; // y coordinate of altitude above chord
  this.h  = 0 ;
  this.has_altitude = false ;

  // Circle parameters
  this.cx = 0 ;
  this.cy = 0 ;
  this.r  = 0 ;
  this.angle_start = 0 ;
  this.angle_end   = 0 ;
  this.counterclockwise = false ;
  this.arc_length = this.d ;

  // All the normal parameters
  this.type  = current_type ;
  this.color = current_color ;
  this.has_arrowhead = current_arrowhead ;
  this.wiggle = 10 ;
  this.n_dashes = 1 ;
  this.is_circle = false ;

  // Arrowhead style
  this.arrowhead_position = current_arrowhead_position ;
  this.arrowhead_style    = current_arrowhead_style ;
  this.arrowhead_angle    = arrowhead_angle ; // degrees
  this.arrowhead_size     = arrowhead_size ;

  // Segments
  this.n_segments = new Array() ;
  this.n_segments['dashed'  ] = 1 ;
  this.n_segments['wavy'    ] = 1 ;
  this.n_segments['curly'   ] = 1 ;
  this.n_segments['sawtooth'] = 1 ;

  this.context = c ;
  this.find_extrema = true ;
  
  this.points = [] ;
  
  // Methods for selecting and moving the element
  this.p1_in_rectangle = false ;
  this.p2_in_rectangle = false ;
  this.snapshot_coords = function(){
    this.x1_0 = this.x1 ;
    this.y1_0 = this.y1 ;
    this.x2_0 = this.x2 ;
    this.y2_0 = this.y2 ;
    this.h_0  = this.h  ;
    this.r_0  = this.r  ;
    this.d_0  = this.d  ;
  }
  this.snapshot_coords() ;
  this.falls_in_rectangle = function(xA, yA, xB, yB){
    var xMin = Math.min(xA,xB) ;
    var xMax = Math.max(xA,xB) ;
    var yMin = Math.min(yA,yB) ;
    var yMax = Math.max(yA,yB) ;
    if(this.x1>=xMin && this.x1<=xMax && this.y1>=yMin && this.y1<=yMax){ this.p1_in_rectangle = true ; this.snapshot_coords() ; }
    if(this.x2>=xMin && this.x2<=xMax && this.y2>=yMin && this.y2<=yMax){ this.p2_in_rectangle = true ; this.snapshot_coords() ; }
  }
  this.update_parameters = function(){
    this.dx = this.x2-this.x1 ;
    this.dy = this.y2-this.y1 ;
    this.d  = sqrt(pow(this.dx,2)+pow(this.dy,2)) ;
    this.a  = atan2(this.dy,this.dx) ;
  
    if(this.has_altitude==true){
      this.r = this.r_ratio*this.d*this.r_sign ;
      this.h = this.h_ratio*this.d ; //*this.h_sign ;
      var  c = this.transform_out(0.5*this.d,this.h-this.r) ;
      this.r = abs(this.r) ;
      this.cx = c[0] ;
      this.cy = c[1] ;
      
      var h  = this.transform_out(0.5*this.d,this.h) ;
      this.xh = h[0] ;
      this.yh = h[1] ;
      
      var a1 = atan2(this.y1-this.cy,this.x1-this.cx) ;
      var a2 = atan2(this.y2-this.cy,this.x2-this.cx) ;
      if(a1<0) a1 += 2*pi ;
      if(a2<0) a2 += 2*pi ;
      this.angle_start = a1 ;
      this.angle_end   = a2 ;
      this.arc_length = this.r*acos(1-abs(this.h/this.r)) ;

      this.n_dashes = Math.floor(2*this.arc_length/dash_length) ;
      if(this.n_dashes%2==0) this.n_dashes++ ;

      this.n_dashes = Math.floor(2*this.arc_length/dash_length) ;
      this.n_waves  = Math.floor(2*this.arc_length/wave_length) ;
      this.n_curls  = Math.floor(2*this.arc_length/curl_length) ;
      this.n_saws   = Math.floor(2*this.arc_length/ saw_length) ;
      if(this.n_dashes%2==0) this.n_dashes++ ; // This number must be odd

      this.n_segments['dashed'  ] = this.n_dashes ;
      this.n_segments['wavy'    ] = this.n_waves  ;
      this.n_segments['curly'   ] = this.n_curls  ;
      this.n_segments['sawtooth'] = this.n_saws   ;
    }
    else{
      this.n_dashes = Math.floor(this.d/dash_length) ;
      this.n_waves  = Math.floor(this.d/wave_length) ;
      this.n_curls  = Math.floor(this.d/curl_length) ;
      this.n_saws   = Math.floor(this.d/ saw_length) ;
      if(this.n_dashes%2==0) this.n_dashes++ ; // This number must be odd

      this.n_segments['dashed'  ] = this.n_dashes ;
      this.n_segments['wavy'    ] = this.n_waves  ;
      this.n_segments['curly'   ] = this.n_curls  ;
      this.n_segments['sawtooth'] = this.n_saws   ;
    }
    this.set_points() ;
  }

  this.transform_in = function(x,y){
    // Transform into a frame where (x1,y1)=(0,0) and (x2,y2)=(d,0)
    x -= this.x1 ;
    y -= this.y1 ;
    var x_out =  x*cos(this.a) + y*sin(this.a) ;
    var y_out = -x*sin(this.a) + y*cos(this.a) ;
    return [x_out,y_out] ;
  }
  this.transform_out = function(x,y){
    // Transform back to the normal coorindates
    var x_out =  x*cos(this.a) - y*sin(this.a) ;
    var y_out =  x*sin(this.a) + y*cos(this.a) ;
    x_out += this.x1 ;
    y_out += this.y1 ;
    return [x_out,y_out] ;
  }
  
  this.make_line = function(){
    this.set_altitude(0.5*(this.x1+this.x2),0.5*(this.y1+this.y2)) ;
    this.has_altitude = false ;
    this.n_dashes = Math.floor(this.d/dash_length) ;
    this.n_waves  = Math.floor(this.d/wave_length) ;
    this.n_curls  = Math.floor(this.d/curl_length) ;
    this.n_saws   = Math.floor(this.d/ saw_length) ;
    if(this.n_dashes%2==0) this.n_dashes++ ; // This number must be odd

    this.n_segments['dashed'  ] = this.n_dashes ;
    this.n_segments['wavy'    ] = this.n_waves  ;
    this.n_segments['curly'   ] = this.n_curls  ;
    this.n_segments['sawtooth'] = this.n_saws   ;
  }
  this.make_circle = function(){
    this.arc_length = pi*this.d ;
    this.has_altitude = false ;
    this.is_circle = true ;
    
    this.cx = 0.5*(this.x1+this.x2) ;
    this.cy = 0.5*(this.y1+this.y2) ;
    
    this.n_dashes = Math.floor(2*this.arc_length/dash_length) ;
    this.n_waves  = Math.floor(2*this.arc_length/wave_length) ;
    this.n_curls  = Math.floor(2*this.arc_length/curl_length) ;
    this.n_saws   = Math.floor(2*this.arc_length/ saw_length) ;
    if(this.n_dashes%2==0) this.n_dashes++ ; // This number must be odd

    this.n_segments['dashed'  ] = this.n_dashes ;
    this.n_segments['wavy'    ] = this.n_waves  ;
    this.n_segments['curly'   ] = this.n_curls  ;
    this.n_segments['sawtooth'] = this.n_saws   ;
    
    var a1 = atan2(this.y1-this.cy,this.x1-this.cx) ;
    if(a1<0) a1 += 2*pi ;
    this.angle_start = a1 ;
    this.angle_end   = a1 + 2*pi ;
    
    this.set_points() ;
  }
  this.set_altitude = function(x3,y3){
    // Translate so that p1=(0,0), then rotate so that p2=(x2,0)
    // Return the height of p3 above the x-axis
    // We only care about the y coordinate of the altitude,
    // so fix the x coordinate of it
    this.x3 = x3 ;
    this.y3 = y3 ;
    var altitude = this.transform_in(x3,y3) ;
    this.h = altitude[1] ;
    this.h_sign = sign(this.sign) ;
    altitude[0] = this.d/2 ;
    var altitude_point = this.transform_out(altitude[0],altitude[1]) ;
    this.xh = altitude_point[0] ;
    this.yh = altitude_point[1] ;
    this.counterclockwise = (this.h>0) ;    

    // Now get the circle parameters
    if(abs(this.h)>1e-3){
      this.r = (pow(this.d/2,2)+pow(this.h,2))/(2*this.h) ;
      this.r_sign = sign(this.r) ;
      this.has_altitude = true ;
    }
    else{
      this.r = 0 ;
      this.has_altitude = false ;
    }
    var c   = this.transform_out(0.5*this.d,this.h-this.r) ;
    this.cx = c[0] ;
    this.cy = c[1] ;
    this.r  = abs(this.r) ;
    
    // Save some parameters to make later calculations easier
    this.r_ratio = this.r/this.d ;
    this.h_ratio = this.h/this.d ;

    var a1 = atan2(this.y1-this.cy,this.x1-this.cx) ;
    var a2 = atan2(this.y2-this.cy,this.x2-this.cx) ;
    if(a1<0) a1 += 2*pi ;
    if(a2<0) a2 += 2*pi ;
    this.angle_start = a1 ;
    this.angle_end   = a2 ;
    
    // Taken from http://en.wikipedia.org/wiki/Circular_segment
    this.arc_length = this.r*acos(1-abs(this.h/this.r)) ;
    
    this.n_dashes = Math.floor(2*this.arc_length/dash_length) ;
    this.n_waves  = Math.floor(2*this.arc_length/wave_length) ;
    this.n_curls  = Math.floor(2*this.arc_length/curl_length) ;
    this.n_saws   = Math.floor(2*this.arc_length/ saw_length) ;
    if(this.n_dashes%2==0) this.n_dashes++ ; // This number must be odd

    this.n_segments['dashed'  ] = this.n_dashes ;
    this.n_segments['wavy'    ] = this.n_waves  ;
    this.n_segments['curly'   ] = this.n_curls  ;
    this.n_segments['sawtooth'] = this.n_saws   ;
    
    this.set_points() ;
  }
  this.clone = function(){
    var arc_out = new arc_element(this.x1,this.y1,this.x2,this.y2) ;
    if(this.has_altitude){
      arc_out.set_altitude(this.xh,this.yh) ;
    }
    else if(this.is_circle){
      arc_out.make_circle() ;
    }
    else{
      arc_out.make_line() ;
    }

    arc_out.type   = this.type ;
    arc_out.color  = this.color ;
    arc_out.wiggle = this.wiggle ;

    // Arrowhead settings
    arc_out.has_arrowhead      = this.has_arrowhead      ;
    arc_out.arrowhead_position = this.arrowhead_position ;
    arc_out.arrowhead_style    = this.arrowhead_style    ;
    arc_out.arrowhead_angle    = this.arrowhead_angle    ;
    arc_out.arrowhead_size     = this.arrowhead_size     ;

    arc_out.x_min = this.x_min ;
    arc_out.y_min = this.y_min ;
    arc_out.x_max = this.x_max ;
    arc_out.y_max = this.y_max ;
    
    arc_out.is_circle = this.is_circle ;
    arc_out.update_parameters() ;

    arc_out.context = this.context ;
    return arc_out ;
  }
  this.translate = function(dx,dy){
    this.x1 += dx ; this.y1 += dy ;
    this.x2 += dx ; this.y2 += dy ;
    this.xh += dx ; this.yh += dy ;
    if(abs(this.cx)>1e-3) this.cx += dx ;
    if(abs(this.cy)>1e-3) this.cy += dy ;
    this.update_parameters() ;
  }

  this.set_points = function(){
    this.points = [] ;
    if(this.has_altitude==true && abs(this.h)>1e-3){
      this.n_dashes = Math.floor(2*this.arc_length/dash_length) ;
      if(this.n_dashes%2==0) this.n_dashes++ ;

      this.n_dashes = Math.floor(2*this.arc_length/dash_length) ;
      this.n_waves  = Math.floor(2*this.arc_length/wave_length) ;
      this.n_curls  = Math.floor(2*this.arc_length/curl_length) ;
      this.n_saws   = Math.floor(2*this.arc_length/ saw_length) ;
      if(this.n_dashes%2==0) this.n_dashes++ ; // This number must be odd

      this.n_segments['dashed'  ] = this.n_dashes ;
      this.n_segments['wavy'    ] = this.n_waves  ;
      this.n_segments['curly'   ] = this.n_curls  ;
      this.n_segments['sawtooth'] = this.n_saws   ;
      var n = this.n_segments[this.type] ;
    
      var angle_stop = this.angle_end ;
      if(this.counterclockwise){
        while(angle_stop>=this.angle_start){ angle_stop -= 2*pi ; }
      }
      else{
        while(angle_stop<=this.angle_start) angle_stop += 2*pi ;
      }
      var nPoints = 1+this.arc_length/grain ;
      var da = (angle_stop-this.angle_start)/nPoints ;
      for(var i=0 ; i<=nPoints ; i++){
        var a = angle_stop-i*da ;
        var m = modulation(this.type,1.0*i/nPoints,n,true) ;
        if(this.type=='curly' && abs(this.r)>1e-3){
          m[1] *= this.wiggle/this.r ;
        }
        var r = abs(this.r)+this.wiggle*m[0] ;
        var t = a+m[1] ;
        var x = this.cx+r*cos(t) ;
        var y = this.cy+r*sin(t) ;
        this.points.push([x,y,m[2]]) ;
      }
    }
    else if(this.is_circle){
      this.n_dashes = Math.floor(2*this.arc_length/dash_length) ;
      if(this.n_dashes%2==0) this.n_dashes++ ;

      this.n_dashes = Math.floor(this.arc_length/dash_length) ;
      this.n_waves  = Math.floor(this.arc_length/wave_length) ;
      this.n_curls  = Math.floor(this.arc_length/curl_length) ;
      this.n_saws   = Math.floor(this.arc_length/ saw_length) ;
      if(this.n_dashes%2==0) this.n_dashes++ ; // This number must be odd

      this.n_segments['dashed'  ] = this.n_dashes ;
      this.n_segments['wavy'    ] = this.n_waves  ;
      this.n_segments['curly'   ] = this.n_curls  ;
      this.n_segments['sawtooth'] = this.n_saws   ;
      var n = this.n_segments[this.type] ;
    
      var angle_stop = this.angle_start+2*pi ;
      
      var nPoints = 1+this.arc_length/grain ;
      var da = (angle_stop-this.angle_start)/nPoints ;
      for(var i=0 ; i<=nPoints ; i++){
        var a = angle_stop-i*da ;
        var m = modulation(this.type,1.0*i/nPoints,n,true) ;
        if(this.type=='curly' && abs(this.r)>1e-3){
          m[1] *= this.wiggle/this.r ;
        }
        var r = 0.5*abs(this.d)+this.wiggle*m[0] ;
        var t = a+m[1] ;
        if(this.type=='curly'){
          t = a+m[1]*2*pi/(2*this.n_curls) ;
        }
        var x = this.cx+r*cos(t) ;
        var y = this.cy+r*sin(t) ;
        this.points.push([x,y,m[2]]) ;
      }
    }
    else{
      this.n_dashes = Math.floor(this.d/dash_length) ;
      this.n_waves  = Math.floor(this.d/wave_length) ;
      this.n_curls  = Math.floor(this.d/curl_length) ;
      this.n_saws   = Math.floor(this.d/ saw_length) ;
      if(this.n_dashes%2==0) this.n_dashes++ ; // This number must be odd

      this.n_segments['dashed'  ] = this.n_dashes ;
      this.n_segments['wavy'    ] = this.n_waves  ;
      this.n_segments['curly'   ] = this.n_curls  ;
      this.n_segments['sawtooth'] = this.n_saws   ;
      
      var n = this.n_segments[this.type] ;
      var nPoints = 1+Math.floor(this.d/grain) ;
      for(var i=0 ; i<=nPoints ; i++){
        var m = modulation(this.type,1.0*i/nPoints,n,false) ;
        if(!m) continue ;
        if(m.length<3) continue ;
        var w = this.wiggle ;
        var a = this.a ;
        var x = this.x1 + this.dx*(i)/nPoints + w*(m[1]*cos(a)-m[0]*sin(a)) ;
        var y = this.y1 + this.dy*(i)/nPoints + w*(m[1]*sin(a)+m[0]*cos(a)) ;
        this.points.push([x,y,m[2]]) ;
      }
    }
    if(this.find_extrema){
      for(var i=0 ; i<this.points.length ; i++){
        // Hideously inefficient?  Maybe...
        var x = this.points[i][0] ;
        var y = this.points[i][1] ;
        if(x<this.x_min) this.x_min = x ;
        if(x>this.x_max) this.x_max = x ;
        if(y<this.y_min) this.y_min = y ;
        if(y>this.y_max) this.y_max = y ;
      }
    }
  }
  this.set_points() ;
  
  this.draw = function(){
    this.context.strokeStyle = this.color ;
    this.context.lineCap = line_cap ;
    this.context.lineWidth = line_weight ;
    for(var i=0 ; i<this.points.length-1 ; i++){
      if(this.points[i+0][2]==0) continue ;
      if(this.points[i+1][2]==0) continue ;
      var x1 = this.points[i+0][0] ;
      var y1 = this.points[i+0][1] ;
      var x2 = this.points[i+1][0] ;
      var y2 = this.points[i+1][1] ;
      this.context.beginPath() ;
      this.context.moveTo(x1+c_offset,y1+c_offset) ;
      this.context.lineTo(x2+c_offset,y2+c_offset) ;
      this.context.stroke() ;
    }
    if(this.has_arrowhead) this.draw_arrowhead() ;
    if(this.p1_in_rectangle) this.draw_selection_circle(this.x1,this.y1) ;
    if(this.p2_in_rectangle) this.draw_selection_circle(this.x2,this.y2) ;
    if(this.p1_in_rectangle && this.p2_in_rectangle) this.draw_selection_line() ;
  }
  this.arrowhead_transformation = function(points_in, theta, dx, dy){
    // Take the position of the arrowhead, and work out what transformation to perform
    var points_out = [] ;
    for(var i=0 ; i<points_in.length ; i++){
      var p = points_in[i] ;
      var x = p[0]*cos(theta) - p[1]*sin(theta) + dx ;
      var y = p[1]*cos(theta) + p[0]*sin(theta) + dy ;
      points_out.push([x,y]) ;
    }
    return points_out ;
  }
  this.draw_arrowhead = function(){
    var arrowheads = [] ;
    if(this.is_circle){
      if(this.arrowhead_position=='center'){
        var arrowhead1 = new arrowhead_from_style(this.arrowhead_style) ;
        var arrowhead2 = new arrowhead_from_style(this.arrowhead_style) ;
        arrowhead1.points = this.arrowhead_transformation(arrowhead1.points, pi, 0.5*this.d,  0.5*this.d) ;
        arrowhead2.points = this.arrowhead_transformation(arrowhead2.points,  0, 0.5*this.d, -0.5*this.d) ;
        arrowheads.push(arrowhead1) ;
        arrowheads.push(arrowhead2) ;
      }
      else{
        var arrowhead = new arrowhead_from_style(this.arrowhead_style) ;
        arrowhead.points = this.arrowhead_transformation(arrowhead.points, 0.5*pi, this.d, 0) ;
        arrowheads.push(arrowhead) ;
      }
    }
    else if(this.has_altitude){
      if(this.arrowhead_position=='center'){
        var arrowhead = new arrowhead_from_style(this.arrowhead_style) ;
        arrowhead.points = this.arrowhead_transformation(arrowhead.points, 0, 0.5*this.d, this.h) ;
        arrowheads.push(arrowhead) ;
      }
      else{
        var arrowhead = new arrowhead_from_style(this.arrowhead_style) ;
        var angle = (this.counterclockwise) ? this.angle_end-0.5*pi : this.angle_end+0.5*pi ;
        arrowhead.points = this.arrowhead_transformation(arrowhead.points, angle, this.d-arrowhead_size*0.25, 0) ;
        arrowheads.push(arrowhead) ;
      }
    }
    else{
      if(this.arrowhead_position=='center'){
        var arrowhead = new arrowhead_from_style(this.arrowhead_style) ;
        arrowhead.points = this.arrowhead_transformation(arrowhead.points, 0, 0.5*this.d+0.1*this.arrowhead_size, 0) ;
        arrowheads.push(arrowhead) ;
      }
      else{
        var arrowhead = new arrowhead_from_style(this.arrowhead_style) ;
        arrowhead.points = this.arrowhead_transformation(arrowhead.points, 0, this.d-0.25*this.arrowhead_size, 0) ;
        arrowheads.push(arrowhead) ;
      }
    }
    for(var i=0 ; i<arrowheads.length ; i++){
      for(var j=0 ; j<arrowheads[i].points.length ; j++){
        arrowheads[i].points[j] = this.transform_out(arrowheads[i].points[j][0], arrowheads[i].points[j][1]) ;
      }
      arrowheads[i].draw(this.context) ;
    }
  }
  this.draw_selection_circle = function(x,y){
    this.context.beginPath() ;
    this.context.lineWidth = line_weight ;
    this.context.strokeStyle = 'rgb(255,0,0)' ;
    this.context.arc(x,y,5,0,2*Math.PI,false) ;
    this.context.stroke() ;
  }
  this.draw_selection_line = function(){
    this.context.strokeStyle = 'rgb(255,0,0)' ;
    this.context.beginPath() ;
    this.context.moveTo(this.x1,this.y1) ;
    this.context.lineTo(this.x2,this.y2) ;
    this.context.stroke() ;
  }
  this.markup = function(){
    var text = [] ;
    text.push('el = new arc_element('+this.x1+','+this.y1+','+this.x2+','+this.y2+')') ;
    text.push('el.type = "'               + this.type               + '"') ;
    text.push('el.arrowhead_position = "' + this.arrowhead_position + '"') ;
    text.push('el.arrowhead_style = "'    + this.arrowhead_style    + '"') ;
    text.push('el.has_arrowhead = '       + this.has_arrowhead           ) ;
    if(this.is_circle){
      text.push( 'el.make_circle()') ;
    }
    else if(this.has_altitude){
      text.push('el.set_altitude('+this.x3+','+this.y3+')') ;
    }
    else{
      text.push('el.make_line()') ;
    }
    text.push('el.update_parameters()') ;
    text.push('elements.push(el)') ;
    text.push('') ;
    return text.join(';\n') ;
  }
}

function arrowhead_solid(){
  this.x = 0 ;
  this.y = 0 ;
  var d = arrowhead_size ;
  this.points = [] ;
  this.points.push([ 0.5*d,0]) ;
  this.points.push([-0.5*d,-d*sin(pi*arrowhead_angle/180)]) ;
  this.points.push([-0.5*d, d*sin(pi*arrowhead_angle/180)]) ;
  this.draw = function(context){
    context.beginPath() ;
    context.fillStyle   = 'black' ;
    context.moveTo(this.points[0][0], this.points[0][1]) ;
    context.lineTo(this.points[1][0], this.points[1][1]) ;
    context.lineTo(this.points[2][0], this.points[2][1]) ;
    context.lineTo(this.points[0][0], this.points[0][1]) ;
    context.fill() ;
  }
}
function arrowhead_hollow(){
  this.x = 0 ;
  this.y = 0 ;
  var d = arrowhead_size ;
  this.points = [] ;
  this.points.push([ 0.5*d,0]) ;
  this.points.push([-0.5*d,-d*sin(pi*arrowhead_angle/180)]) ;
  this.points.push([-0.5*d, d*sin(pi*arrowhead_angle/180)]) ;
  this.draw = function(context){
    context.beginPath() ;
    context.fillStyle   = 'white' ;
    context.strokeStyle = 'black' ;
    context.moveTo(this.points[0][0], this.points[0][1]) ;
    context.lineTo(this.points[1][0], this.points[1][1]) ;
    context.lineTo(this.points[2][0], this.points[2][1]) ;
    context.lineTo(this.points[0][0], this.points[0][1]) ;
    context.fill() ;
    context.stroke() ;
  }
}
function arrowhead_line(){
  this.x = 0 ;
  this.y = 0 ;
  var d = arrowhead_size ;
  this.points = [] ;
  this.points.push([ 0.5*d,0]) ;
  this.points.push([-0.5*d,-d*sin(pi*arrowhead_angle/180)]) ;
  this.points.push([-0.5*d, d*sin(pi*arrowhead_angle/180)]) ;
  this.draw = function(context){
    context.beginPath() ;
    context.strokeStyle = 'black' ;
    context.moveTo(this.points[0][0], this.points[0][1]) ;
    context.lineTo(this.points[1][0], this.points[1][1]) ;
    context.moveTo(this.points[0][0], this.points[0][1]) ;
    context.lineTo(this.points[2][0], this.points[2][1]) ;
    context.stroke() ;
  }
}
function arrowhead_cross(){
  this.x = 0 ;
  this.y = 0 ;
  var d = 0.5*arrowhead_size ;
  this.points = [] ;
  this.points.push([-d,-d]) ;
  this.points.push([ d, d]) ;
  this.points.push([-d, d]) ;
  this.points.push([ d,-d]) ;
  this.draw = function(context){
    context.beginPath() ;
    context.strokeStyle = 'black' ;
    context.moveTo(this.points[0][0], this.points[0][1]) ;
    context.lineTo(this.points[1][0], this.points[1][1]) ;
    context.moveTo(this.points[2][0], this.points[2][1]) ;
    context.lineTo(this.points[3][0], this.points[3][1]) ;
    context.stroke() ;
  }
}

function arrowhead_from_style(style){
  if(style=='solid' ) return new arrowhead_solid () ;
  if(style=='hollow') return new arrowhead_hollow() ;
  if(style=='line'  ) return new arrowhead_line  () ;
  if(style=='cross' ) return new arrowhead_cross () ;
}

var history    = new Array() ;
var elements   = new Array() ;
var characters = new Array() ;
var current_element = null ;
