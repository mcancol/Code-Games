

Platform game
-------------

To start the platform game, open the alien.html file in a recent browser. By default the level named "level1" will be loaded, by using the ?level= argument a different level can be loaded. For example, to load the the level named "level2", you should use:

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

Then generate the documentation:

    cd doc
    jsdoc ..\readme.md ..\src\js\common ..\src\js\maze ..\src\js\alien -p
s
