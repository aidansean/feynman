<?php
include_once($_SERVER['FILE_PREFIX']."/project_list/project_object.php") ;
$github_uri   = "https://github.com/aidansean/feynman" ;
$blogpost_uri = "http://aidansean.com/projects/?tag=feynman" ;
$project = new project_object("feynman", "Feynman diagram maker", "https://github.com/aidansean/feynman", "http://aidansean.com/projects/?tag=feynman", "feynman/images/project.jpg", "feynman/images/project_bw.jpg", "One of the most common diagrams that particle physicists use are Feynman diagrams.  There are already a few tools that can be used to make them, but they usually have some significant drawback (including non-intuitive interface, poor quality graphics, lack of control over the final image, text only input.)  This is a drag and drop style Feynman diagram maker aimed at making creation of the diagrams as quick and simple as possible.  This is quite an advanced project with lots of scope for further development.", "Tools,Physics", "canvas,HTML,PHP,SVG") ;
?>