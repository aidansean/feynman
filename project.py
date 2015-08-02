from project_module import project_object, image_object, link_object, challenge_object

p = project_object('feynman', 'Feynman diagram maker')
p.domain = 'http://www.aidansean.com/'
p.path = 'feynman'
p.preview_image    = image_object('%s/images/project.jpg'   %p.path, 150, 250)
p.preview_image_bw = image_object('%s/images/project_bw.jpg'%p.path, 150, 250)
p.folder_name = 'aidansean'
p.github_repo_name = 'feynman'
p.mathjax = False
p.tags = 'Tools,Physics'
p.technologies = 'canvas,HTML,PHP,SVG'
p.links.append(link_object(p.domain, 'feynman', 'Live page'))
p.introduction = 'One of the most common diagrams that particle physicists use are Feynman diagrams.  There are already a few tools that can be used to make them, but they usually have some significant drawback (including non-intuitive interface, poor quality graphics, lack of control over the final image, text only input.)  This is a drag and drop style Feynman diagram maker aimed at making creation of the diagrams as quick and simple as possible.  This is quite an advanced project with lots of scope for further development.'
p.overview = '''The user clicks and drags to create elements on an HTML canvas.  These elements can be simply written to an image file.  In order to create symbols, MathJax is used to interpret LaTeX snippets.  When the user clicks on a symbol an SVG image is used to capture the element graphically and then this is written to a canvas.  (Often a symbol is used several times in one diagram, so saving to an intermediate canvas saves CPU time and memory.)  This canvas is then copied to the larger canvas when the user clicks on it.'''

p.challenges.append(challenge_object('The application requires the user to be able to interact with the mouse, requiring careful managing of event listeners.', 'The interactions are handled using the <code>mousedown</code>, <code>mousemove</code>, <code>mouseup</code>, and <code>mouseout</code> to handle the interacations, and a variable <code>current_brush</code> keeps track of the current action and (for a many step interaction) the current step.', 'Resolved'))

p.challenges.append(challenge_object('It\'s necessary to be able to add different symbols.', 'Adding a symbol to the canvas is not a simple procedure.  MathJax can be use to take a snippet of LaTeX and lay it out on the page in an attractive manner, similar to LaTeX.  In order to import this to a canvas it must be first imported to an SVG object, and then imported to a canvas.  By using MathJax it is possible to allow the user to create their own symbols.  In addition, a selection of preset symbols are defined.  By using SVG in Chrome and Safari the security limitations make it impossible to export the pixel data from the canvas.', 'Resolved, to be revisited'))

p.challenges.append(challenge_object('The application to be user friendly and intuitive.', 'Alpha teseting shows most of the existing features to be quite intuitive.  However documentation and video tutorials would be very useful.', 'Resolved, to be revisited'))

