module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            ejs: {
                files: ['views/**'],
                options: {
                    livereload: true,
                },
            },
        },
        js: {
            files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
            options: {
                livereload: true,
            },
        },
        nodemon: {
            dev: {
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Stroe'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000,
                    },
                    cwd: __dirname,
                },
            },
        },

        mochaTest: {
            options: {
                reporter: 'spec',
            },
            src: ['test/**/*.js'],
        },

        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true,
            },
        },
    })

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.option('force', true)
    grunt.registerTask('default', ['concurrent'])
    grunt.registerTask('test', ['mochaTest'])
}
