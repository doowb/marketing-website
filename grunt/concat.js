module.exports = {
  namespacePages: {
    options: {
      banner: '<%= grunt.config.get("concat_banner") %>',
      footer: '<%= grunt.config.get("concat_footer") %>'
    },
    src: ['pages/*.js', 'layouts/*.js'],
    expand: true,
    cwd: '<%= config.guts %>/assets/js/',
    dest: '<%= config.dist %>/assets/js/'
  },
  jqueryModernizr: {
    src: [
      '<%= config.guts %>/assets/js/libraries/jquery-2.1.1.min.js',
      '<%= config.temp %>/assets/js/libraries/modernizr.2.8.3.min.js'
    ],
    expand: false,
    flatten: true,
    isFile: true,
    dest: '<%= config.dist %>/assets/js/libraries/jquery-modernizr.min.js'
  },
  namespaceGlobal: {
    options: {
      banner: '<%= grunt.config.get("concat_banner") %>',
      footer: '<%= grunt.config.get("concat_footer") %>'
    },
    files: {
        '<%= config.temp %>/assets/js/global.js': [
          '<%= config.guts %>/assets/js/utils/oform_globals.js',
          '<%= config.guts %>/assets/js/utils/check_complex_password.js',
          '<%= config.guts %>/assets/js/utils/equal_height_grid.js',
          '<%= config.guts %>/assets/js/utils/get_url_parameter.js',
          '<%= config.guts %>/assets/js/utils/uri.js',
          '<%= config.guts %>/assets/js/utils/guid_sprintf.js',
          '<%= config.guts %>/assets/js/utils/form_helper_factory.js',
          '<%= config.guts %>/assets/js/utils/form_helpers/*.js',
          '<%= config.guts %>/assets/js/utils/trim_url.js',
          '<%= config.guts %>/assets/js/global.js',
          '<%= config.guts %>/assets/js/components/*.js',
          '<%= config.guts %>/assets/js/services/*.js',
          '!<%= config.guts %>/assets/js/services/user_state.js'
          ]
    }
  },
  concatBundle: {
    files: {
      '<%= config.dist %>/assets/js/bundle.js': [
        '<%= config.bowerDir %>/jquery-cookie/jquery.cookie.js',
        '<%= config.bowerDir %>/history.js/scripts/bundled-uncompressed/html4+html5/jquery.history.js',
        '<%= config.guts %>/assets/js/libraries/handlebars-v1.3.0.js',
        '<%= config.bowerDir %>/momentjs/moment.js',
        '<%= config.temp %>/assets/js/handlebarsTemplates.js',
        '<%= config.bowerDir %>/oform/dist/oForm.min.js',
        '<%= config.temp %>/assets/js/global.js',
        '<%= config.guts %>/assets/js/components/oForm-globals.js',
        '<%= config.bowerDir %>/fitvids/jquery.fitvids.js'
      ]
    }
  }
};
