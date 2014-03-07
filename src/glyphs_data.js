var glyphs = [] ;

var glyphs_quarks = new glyph_group('Quarks') ;
glyphs_quarks.append([     'upQuark', 'u']) ;
glyphs_quarks.append([   'downQuark', 'd']) ;
glyphs_quarks.append([  'charmQuark', 'c']) ;
glyphs_quarks.append(['strangeQuark', 's']) ;
glyphs_quarks.append([    'topQuark', 't']) ;
glyphs_quarks.append([ 'bottomQuark', 'b']) ;
glyphs_quarks.append([       'quark', 'q']) ;
glyphs.push(glyphs_quarks) ;

var glyphs_antiquarks = new glyph_group('Antiquarks') ;
glyphs_antiquarks.append([     'antiUpQuark', '\\bar{u}']) ;
glyphs_antiquarks.append([   'antiDownQuark', '\\bar{d}']) ;
glyphs_antiquarks.append([  'antiCharmQuark', '\\bar{c}']) ;
glyphs_antiquarks.append(['antiStrangeQuark', '\\bar{s}']) ;
glyphs_antiquarks.append([    'antiTopQuark', '\\bar{t}']) ;
glyphs_antiquarks.append([ 'antiBottomQuark', '\\bar{b}']) ;
glyphs_antiquarks.append([       'antiQuark', '\\bar{q}']) ;
glyphs.push(glyphs_antiquarks) ;

var glyphs_fermions = new glyph_group('Fermions') ;
glyphs_fermions.append([       'lepton', '\\ell'     ]) ;
glyphs_fermions.append([   'leptonPlus', '\\ell^+'   ]) ;
glyphs_fermions.append([  'leptonMinus', '\\ell^-'   ]) ;
glyphs_fermions.append([            'f', 'f'         ]) ;
glyphs_fermions.append([         'fBar', '\\bar{f}'  ]) ;
glyphs_fermions.append([       'fPrime', 'f\''       ]) ;
glyphs_fermions.append([    'fBarPrime', '\\bar{f}\'']) ;
glyphs.push(glyphs_fermions) ;

var glyphs_leptons = new glyph_group('Leptons') ;
glyphs_leptons.append([     'electron', 'e'         ]) ;
glyphs_leptons.append([ 'electronPlus', 'e^+'       ]) ;
glyphs_leptons.append(['electronMinus', 'e^-'       ]) ;
glyphs_leptons.append([         'muon', '\\mu'      ]) ;
glyphs_leptons.append([     'MuonPlus', '\\mu^+'    ]) ;
glyphs_leptons.append([    'MuonMinus', '\\mu^-'    ]) ;
glyphs_leptons.append([          'tau', '\\tau'     ]) ;
glyphs_leptons.append([      'TauPlus', '\\tau^+'   ]) ;
glyphs_leptons.append([     'TauMinus', '\\tau^-'   ]) ;
glyphs.push(glyphs_leptons) ;

var glyphs_leptons2 = new glyph_group('') ;
glyphs_leptons2.append([   'electronPM', 'e^\\pm'    ]) ;
glyphs_leptons2.append([   'electronMP', 'e^\\mp'    ]) ;
glyphs_leptons2.append([       'MuonPM', '\\mu^\\pm' ]) ;
glyphs_leptons2.append([       'MuonMP', '\\mu^\\mp' ]) ;
glyphs_leptons2.append([        'TauPM', '\\tau^\\pm']) ;
glyphs_leptons2.append([        'TauMP', '\\tau^\\mp']) ;
glyphs.push(glyphs_leptons2) ;

var glyphs_neutrinos = new glyph_group('Neutrinos') ;
glyphs_neutrinos.append([      'nu', '\\nu'             ]) ;
glyphs_neutrinos.append([     'nuE', '\\nu_e'           ]) ;
glyphs_neutrinos.append([ 'antiNuE', '\\bar{\\nu}_e'    ]) ;
glyphs_neutrinos.append([     'nuM', '\\nu_\\mu'        ]) ;
glyphs_neutrinos.append([ 'antiNuM', '\\bar{\\nu}_\\mu' ]) ;
glyphs_neutrinos.append([     'nuT', '\\nu_\\tau'       ]) ;
glyphs_neutrinos.append([ 'antiNuT', '\\bar{\\nu}_\\tau']) ;
glyphs_neutrinos.append([     'nu1', '\\nu_1'           ]) ;
glyphs_neutrinos.append([     'nu2', '\\nu_2'           ]) ;
glyphs_neutrinos.append([     'nu3', '\\nu_3'           ]) ;
glyphs.push(glyphs_neutrinos) ;

var glyphs_neutralGaugeBosons = new glyph_group('Neutral gauge bosons') ;
glyphs_neutralGaugeBosons.append([      'gluon', 'g'         ]) ;
glyphs_neutralGaugeBosons.append([      'gamma', '\\gamma'   ]) ;
glyphs_neutralGaugeBosons.append([  'gammaStar', '\\gamma^*' ]) ;
glyphs_neutralGaugeBosons.append([          'Z', 'Z'         ]) ;
glyphs_neutralGaugeBosons.append([      'ZStar', 'Z^*'       ]) ;
glyphs_neutralGaugeBosons.append([      'ZZero', 'Z^0'       ]) ;
glyphs_neutralGaugeBosons.append(['GammaZStar', 'Z/\\gamma^*']) ;
glyphs.push(glyphs_neutralGaugeBosons) ;

var glyphs_chargedGaugeBosons = new glyph_group('Neutral gauge bosons') ;
glyphs_chargedGaugeBosons.append([          'W', 'W'        ]) ;
glyphs_chargedGaugeBosons.append([      'WPlus', 'W^+'      ]) ;
glyphs_chargedGaugeBosons.append([     'WMinus', 'W^-'      ]) ;
glyphs_chargedGaugeBosons.append([        'WPM', 'W^\\pm'   ]) ;
glyphs_chargedGaugeBosons.append([        'WMP', 'W^\\mp'   ]) ;
glyphs.push(glyphs_chargedGaugeBosons) ;

var glyphs_HiggsBosons = new glyph_group('Higgs bosons') ;
glyphs_HiggsBosons.append([          'H', 'H'        ]) ;
glyphs_HiggsBosons.append([      'HZero', 'H^0'      ]) ;
glyphs_HiggsBosons.append([          'h', 'h'        ]) ;
glyphs_HiggsBosons.append([         'h0', 'h^0'      ]) ;
glyphs_HiggsBosons.append([         'A0', 'A^0'      ]) ;
glyphs_HiggsBosons.append([      'HPlus', 'H^+'      ]) ;
glyphs_HiggsBosons.append([     'HMinus', 'H^-'      ]) ;
glyphs_HiggsBosons.append([        'HPM', 'H^\\pm'   ]) ;
glyphs_HiggsBosons.append([        'HMP', 'H^\\mp'   ]) ;
glyphs.push(glyphs_HiggsBosons) ;

