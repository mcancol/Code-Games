module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),


    jshint: {
      alienjs: {
        src: ["src/js/common/*.js", "src/js/alien/*.js"],
        options: { browser: true, globalstrict: true, devel: true, jquery: true }
      }
    },


    concat: {
      alienjs: {
        src: ["src/js/common/*.js", "src/js/alien/*.js", "src/js/alien/objects/*.js"],
        dest: "src/js/build/alien.js"
      },

      mazejs: {
        src: ["src/js/common/*.js", "src/js/maze/*.js"],
        dest: "src/js/build/maze.js"
      }
    },


    uglify: {
      alienjs: {
        src: "src/js/build/alien.js",
        dest: "src/js/build/alien.min.js"
      },

      mazejs: {
        src: "src/js/build/maze.js",
        dest: "src/js/build/maze.min.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask("default", ["jshint", "concat", "uglify"]);
}
