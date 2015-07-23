
Games
=====

This is a collection of games intended to be used in experiments on group dynamics. The games share some code that handles [input](src/js/common/input.js) (keyboard, mouse, and touch), [data buffering](src/js/common/sink.js), [browser compatibility](src/js/common/compat.js), and [manipulates URLs](src/js/common/url.js). The main [rendering loop](src/js/common/engine.js) is also shared between games.


Building
--------

First install Grunt and its dependencies:
    npm install -g grunt-cli
    npm install

Then run Grunt to concatenate and minify Javascripts:
    grunt


Platform game
-------------

To start the platform game, open the [alien.html](src/alien.html) file in a recent browser. By default the level named "level1" will be loaded, by using the ?level= argument a different level can be loaded. For example, to load the the level named "level2", you should use:

    alien.html?level=level2

Levels can be changed using the level editor, use:

    alien.html?edit=true

To see debugging lines, you can use:

    alien.html?debug=true

All player actions are sent to the [data server](http://www.ivarclemens.nl/platform_game/).


Maze game
---------

All player actions are sent to the [data server](http://www.ivarclemens.nl/maze_game/) and will be appended to the log file.

    maze.html


Generating documentation
------------------------

First install jsdoc:

    npm install -g jsdoc

To (re)generate the documentation, run:

    generate-documentation.bat
