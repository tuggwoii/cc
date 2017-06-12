module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
        options: {
            configFile: 'config/eslint.json',
            rulePaths: ['config/rules']
        },
        target: ['src/**/*.js', 'index.js']
    },
    execute: {
      target: {
          src: ['server.js']
      }
    },
    open: {
        dev: {
            path: 'http://127.0.0.1:8000',
            app: 'Chrome'
        }
    },
    sass: {
        dist: {
            options: {
                style: 'compressed'
            },
            files: {
                'src/static/css/styles.css': 'src/static/css/import.scss'
            }
        }
    },
    watch: {
        css: {
            files: '**/*.scss',
            tasks: ['sass']
        },
        js: {
            files: 'src/static/js/modules/**/*.js',
            tasks: ['concat','uglify']
        }
    },
    concat: {
        options: {
            separator: ';',
        },
        frontend: {
            src: [
                'node_modules/jquery/dist/jquery.min.js',
                'node_modules/angular/angular.min.js',
                'src/static/css/bootstrap-3.3.6-dist/js/bootstrap.min.js',
                'node_modules/angular-animate/angular-animate.min.js',
                'node_modules/angular-cookies/angular-cookies.min.js',
                'src/static/js/libs/ui-router.js',
                'src/static/js/libs/fb.js',
                'src/static/js/libs/picker.js',
                'src/static/js/libs/picker.date.js',
                'src/static/js/libs/iscroll/build/iscroll.js',
                'node_modules/lity/dist/lity.min.js',
                'src/static/js/libs/jquery.dotdotdot.min.js',
                'src/static/js/ui.js',
                'src/static/js/app.js',
                'src/static/js/mobile-workgroup.js',
                'src/static/js/modules/app/directives/load.js',
                'src/static/js/modules/app/directives/stars.js',
                'src/static/js/modules/app/directives/rating.js',
                'src/static/js/modules/app/directives/confirm.js',
                'src/static/js/modules/app/directives/upload.js',
                'src/static/js/modules/shops/directives/shop-popup.js',
                'src/static/js/modules/shops/directives/shop-create-popup.js',
                'src/static/js/modules/works/directives/work-popup.js',
                'src/static/js/modules/notifications/directives/notification-popup.js',
                'src/static/js/modules/repairs/directives/image-caption-popup.js',
                'src/static/js/modules/app/services/event.js',
                'src/static/js/modules/configs/request.js',
                'src/static/js/modules/app/services/helper.js',
                'src/static/js/modules/workgroup/services/workgroup.js',
                'src/static/js/modules/notifications/services/notifications.js',
                'src/static/js/modules/file/services/files.js',
                'src/static/js/modules/shops/services/shops.js',
                'src/static/js/modules/works/services/works.js',
                'src/static/js/routes.js',
                'src/static/js/modules/app/services/pages.js',
                'src/static/js/modules/shares/services/shares.js',
                'src/static/js/modules/repairs/services/repairs.js',
                'src/static/js/modules/apis/services/urls.js',
                'src/static/js/modules/strings/services/strings.js',
                'src/static/js/modules/accounts/services/accounts.js',
                'src/static/js/modules/car/services/cars.js',
                'src/static/js/modules/app/controllers/app-controller.js',
                'src/static/js/modules/accounts/controllers/login-controller.js',
                'src/static/js/modules/notifications/controllers/notifications-controller.js',
                'src/static/js/modules/notifications/controllers/notification-controller.js',
                'src/static/js/modules/accounts/controllers/register-controller.js',
                'src/static/js/modules/accounts/controllers/account-controller.js',
                'src/static/js/modules/accounts/controllers/update-account-controller.js',
                'src/static/js/modules/car/controllers/car-controller.js',
                'src/static/js/modules/repairs/controllers/repair-controller.js',
                'src/static/js/modules/repairs/controllers/repairs-controller.js',
                'src/static/js/modules/shares/controllers/shares-controller.js',
                'src/static/js/modules/car/controllers/edit-car-controller.js',
                'src/static/js/modules/car/controllers/new-car-controller.js',
                'src/static/js/modules/app/controllers/index-controller.js',
                'src/static/js/modules/notifications/controllers/edit-notification-controller.js',
                'src/static/js/modules/notifications/controllers/new-notification-controller.js',
                'src/static/js/modules/repairs/controllers/new-repair-controller.js',
                'src/static/js/modules/repairs/controllers/edit-repair-controller.js',
                'src/static/js/modules/shops/controllers/edit-shop-controller.js',
                'src/static/js/modules/shops/controllers/shop-controller.js',
                'src/static/js/modules/app/controllers/nav-controller.js',
                'src/static/js/modules/shops/controllers/shops-controller.js',
                'src/static/js/modules/accounts/controllers/forgot-password-controller.js',
                'src/static/js/modules/app/directives/message.js',
                'src/static/js/modules/report/directives/report-popup.js',
                'src/static/js/modules/report/services/reports.js',
                'src/static/resources/areas.js',
            ],
            dest: 'src/static/js/build/frontend.js',
            nonull: true
        }
    },
    uglify: {
        options: {
            mangle: false,
            sourceMap: true,
            compress: {
                drop_console: false
            }
        },
        frontend: {
            files: {
                'src/static/js/build/frontend.min.js': ['src/static/js/build/frontend.js']
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['eslint', 'open', 'execute']);
  grunt.registerTask('test', ['eslint']);
  grunt.registerTask('css', ['watch:css']);
  grunt.registerTask('run', ['open', 'execute']);
  grunt.registerTask('js', ['watch:js']);
  
};
