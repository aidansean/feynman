<?php
$title = 'Feynman diagram maker' ;
$stylesheets = array('style.css') ;
$js_scripts  = array('settings.js', 'elements.js', 'cursor.js', 'functions.js', 'draw.js', 'glyphs.js', 'glyphs_data.js') ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
  
  <div class="right">
    <div class="blurb center">
      <p>This page should help you to make Feynman diagrams.  For best results use Firefox.  Note this page may not work with Safari.</p>
    </div>
  </div>
  <div class="tab">
    <div class="tab_row">
      <div class="tab_cell">
        <h3>Arrow</h3>
        <table>
          <tbody>
            <tr>
              <td class="button_1">
                <canvas id="canvas_arrow_solid"  width="50" height="25" onclick="choose_arrowhead_style('solid' )"></canvas>
              </td>
              <td class="button_1">
                <canvas id="canvas_arrow_hollow" width="50" height="25" onclick="choose_arrowhead_style('hollow')"></canvas>
              </td>
            </tr>
            <tr>
              <td class="button_1">
                <canvas id="canvas_arrow_line"   width="50" height="25" onclick="choose_arrowhead_style('line'  )"></canvas>
              </td>
              <td class="button_1">
                <canvas id="canvas_arrow_cross"  width="50" height="25" onclick="choose_arrowhead_style('cross' )"></canvas>
              </td>
            </tr>
            
            <tr>
              <th class="button_1">Center</td>
              <th class="button_1">End</td>
            </tr>
            <tr>
              <td class="button_1">
                <canvas id="canvas_arrow_center" width="50" height="25" onclick="choose_arrowhead_position('center')"></canvas>
              </td>
              <td class="button_1">
                <canvas id="canvas_arrow_end"    width="50" height="25" onclick="choose_arrowhead_position('end')"></canvas>
              </td>
            </tr>
            <tr>
              <th class="button_1">Visible</td>
              <th class="button_1">Invisible</td>
            </tr>
            <tr>
              <td class="button_1">
                <canvas id="canvas_arrow_on"     width="50" height="25" onclick="toggle_arrowhead(true)" ></canvas>
              </td>
              <td class="button_1">
                <canvas id="canvas_arrow_off"    width="50" height="25" onclick="toggle_arrowhead(false)"></canvas>
              </td>
            </tr>
          </tbody>
        </table>
        <h3>Line type</h3>
        <table>
          <tbody>
            <tr>
              <td class="button_2">
                <canvas id="canvas_type_solid"    width="100" height="40" onclick="choose_type('solid')"></canvas>
              </td>
            </tr>
            <tr>
              <td class="button_2">
                <canvas id="canvas_type_dashed"   width="100" height="40" onclick="choose_type('dashed')"></canvas>
              </td>
            </tr>
            <tr>
              <td class="button_2">
                <canvas id="canvas_type_wavy"     width="100" height="40" onclick="choose_type('wavy')"></canvas>
              </td>
            </tr>
            <tr>
              <td class="button_2">
                <canvas id="canvas_type_curly"    width="100" height="40" onclick="choose_type('curly')"></canvas>
              </td>
            </tr>
          </tbody>
        </table>
        
        <h3>Shape</h3>
        <p class="center">
        Line<br /><canvas id="canvas_element_line"  width="100" height="40" onclick="choose_brush('line')"></canvas><br />
        Arc<br /><canvas id="canvas_element_arc"   width="100" height="40" onclick="choose_brush('arc1')"></canvas>
        Circle<br /><canvas id="canvas_element_circle"   width="100" height="40" onclick="choose_brush('circle')"></canvas>
        </p>
        
        <h3>Line width:</h3>
        <p><input type="text" id="input_line_width" value="2"/>px <input type="submit" id="submit_line_width" value="Change"/></p>
        
        <h3>Snap to:</h3>
        <select id="select_snap">
          <option value="grid" selected="selected">Grid</option>
          <option value="shapes"                  >Shapes</option>
          <option value="shapesGrid"              >Shapes, then grid</option>
          <option value="nothing"                 >Nothing</option>
        </select>
        <input type="submit" id="submit_snap" value="Change"/>
        
      </div>
      <div class="tab_cell">
        <h3>Preview</h3>
        <canvas id="canvas_preview" width="200" height="50"></canvas><br />
        <input id="input_paint"       type="submit" onclick="paint_image()"        value="Paint"      />
        <input id="input_undo"        type="submit" onclick="remove_last_thing()"  value="Undo"       />
        <input id="input_clear"       type="submit" onclick="remove_all_things()"  value="Clear"      />
        <input id="input_move"        type="submit" onclick="move_elements()"      value="Move elements"/>
        <input id="input_delete"      type="submit" onclick="delete_elements()"    value="Delete elements"/><br />
        <input class="settings" type="submit" onclick="fermion_settings()" value="fermion"/>
        <input class="settings" type="submit" onclick="photon_settings()"  value="photon/weak boson"/>
        <input class="settings" type="submit" onclick="gluon_settings()"   value="gluon"/>
        <input class="settings" type="submit" onclick="higgs_settings()"   value="Higgs boson"/><br />
        Current brush: <span id="current_brush"></span><br />
        <canvas id="canvas_feynman" width="600" height="600"></canvas>
        <br />
      </div>
    </div>
  </div>

  <div class="right">
    <div class="blurb center">
      <h3>Symbols:</h3>
      <p class="center">Custom symbol: (eg J/\psi)
        <input id="input_mathjax" type="text"/>
        <input id="submit_mathjax" type="submit" value="Create"/>
      </p>
      <table id="table_glyphs">
        <tbody id="tbody_glyphs">
        </tbody>
      </table>
    </div>
  </div>
  <div class="right">
    <div class="blurb center">
      <h3>Image:</h3>
      <div id="image_wrapper"></div>
      <div id="hidden"></div>
    </div>
  </div>
  <div class="right">
    <div class="blurb center">
      <h3>Markup:</h3>
      Enter markup:<br />
      <textarea id="markup_in"  cols="80" rows="5"></textarea><br />
      <input type="submit" id="submit_markup_in" value="Generate diagram" onclick="read_markup()"/>
      <hr />
      Current markup:</br />
      <textarea id="markup_out" cols="80" rows="5"></textarea><br />
      eps source:</br />
      <textarea id="eps_out" cols="80" rows="5"></textarea><br />
    </div>
  </div>
  <div id="hidden_image_preview"><img src="penguin.png"/></div>
  <div class="right">
    <div class="blurb center">
      <h3>Symbol canvases:</h3>
      <p>These canvases are needed to draw symbols and they must be visible on the web page.  It's safe to ignore these images.</p>
      <div id="div_glyphs"></div>
     </div>
  </div>

<?php foot() ; ?>
