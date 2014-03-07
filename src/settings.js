var canvas_main  = 0 ;
var context_main = 0 ;
var c = 0 ;

var user_counter = 0 ;
var used_user_counter = 0 ;

var x_down = -1 ;
var y_down = -1 ;
var x_move =  0 ;
var y_move =  0 ;
var x_up   =  0 ;
var y_up   =  0 ;

var x_min =  1e6 ;
var y_min =  1e6 ;
var x_max = -1e6 ;
var y_max = -1e6 ;

var current_color  = 'black' ;
var current_brush  = 'line'  ; // line, arc1, arc2, move, delete
var previous_brush = 'line'  ; // line, arc1, arc2
var current_type   = 'solid' ; // solid, wavy, curly, sawtooth, dashed
var current_arrowhead = true ;
var current_arrowhead_position = 'center' ; // 'end' , 'center'
var current_arrowhead_style    = 'solid'  ; // 'hollow' ,'line' , 'solid'

var grid = true ;
var grid_dx = 20 ;
var grid_dy = 20 ;
var snap_dx = Math.floor(grid_dx/2) ;
var snap_dy = Math.floor(grid_dy/2) ;
var grid_color   = '#aaaaff' ;
var grid_color_2 = '#ff8888' ;
var grid_width = 1 ;
var grid_interval = 5 ; // How many small squares in a large square

var grain = 1 ; // How fine to make the steps

var dash_length = 10 ;
var wave_length = 25 ;
var curl_length = 25 ;
var  saw_length = 25 ;

// Canvas dimensions
var cw = 600 ;
var ch = 600 ;
var cw_preview = 300 ;
var ch_preview =  50 ;
var paint_margin = 25 ;

// Offset all drawing by this amount to get "crisper" lines
var c_offset = 0.5 ;

var cw_arrow =  50 ;
var ch_arrow =  25 ;
var cw_type  = 100 ;
var ch_type  =  40 ;

// Characters
var n_char_row = 10 ;
var char_spacing = 50 ;
var char_index = -1 ;
var char_brush = false ;

// This makes me feel bad
var pi = Math.PI ;

// Font
var font_size   = 25        ;
var font_style  = 'italic'  ;
//font_style  = ''  ;
var font_family = 'Palatino,times' ;

var margin = 10 ;
var nCells = 0 ;
var current_glyph_name = 'none' ;

var arrowhead_styles       = ['solid' , 'hollow' , 'line' , 'cross'] ;
var arrowhead_positions    = ['center' , 'end' ] ;
var arrowhead_visibilities = ['on' , 'off' ] ;
var line_types             = ['solid' , 'dashed' , 'wavy' , 'curly' ] ;

// Line settings
var line_weight = 2 ;
var line_cap = 'round' ;

// Arrow settings
var arrowhead_angle = 30 ; // degrees
var arrowhead_size  = 15 ;

var snap_mode = 'grid' ;