/**
 * Created by JailBreak on 2015/1/24.
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: function() {
                var pkg = grunt.file.readJSON('package.json');
                console.log(pkg);
                return pkg;
            }(),
        uglify: {
            options: {
                banner: '/*! <%= pkg.customJS %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'js/<%= pkg.customJS %>.js',
                dest: 'build/<%= pkg.customJS %>.min.js'
            }
        },
        watch: {
            client: {
                files: ['*.html', 'style/*', 'post/**/*'],
                options: {
                    livereload: true
                }
            }
        }
    });
 
    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('live', ['watch']);

};