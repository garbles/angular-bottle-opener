module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    buildDir: "build",
    tempDir: ".tmp",
    sourceDir: "src",
    sourceFiles: [
      "<%= sourceDir %>/*.js",
      "<%= sourceDir %>/**/*.js"
    ],
    uglify: {
      build: {
        src: "<%= ngmin.build.dest %>",
        dest: "<%= pkg.main %>"
      }
    },
    clean: ["<%= buildDir %>","<%= tempDir %>"],
    ngmin: {
      build: {
        src: "<%= sourceFiles %>",
        dest: "<%= tempDir %>/_ngmin.js"
      }
    }
  });

  grunt.registerTask("build", ["clean", "ngmin", "uglify"]);
};
