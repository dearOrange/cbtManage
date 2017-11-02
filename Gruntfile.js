module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        transport: {
            options: {
                paths: ['src/js/modules'],//模块在哪
                alias: '<%= pkg.spm.alias %>'
            },
            login: {
                options: {
                    idleading: 'login/'
                },
                files: [
                    {
                        cwd: 'src/js/modules/login',
                        src: '**/*.js',
                        dest: '.dest/js/modules/login'
                    }
                ]
            }
        }
    })
}