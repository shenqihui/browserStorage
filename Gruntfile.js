module.exports = function( grunt ) {
	"use strict";


	/**
   * @name readOptionalJSON
   * @desc 读取 json 数据
   * @depend []
   * @param { string } filepath 文件路径。
   **/
	function readOptionalJSON( filepath ) {
		var data = {};
		try {
			data = grunt.file.readJSON( filepath );
		} catch ( e ) {}
		return data;
	}

	var gzip = require( "gzip-js" ),
		srcHintOptions = readOptionalJSON( "src/.jshintrc" );

	// The concatenated file won't pass onevar
	// But our modules can
	delete srcHintOptions.onevar;

	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),
		dst: readOptionalJSON( "dist/.destination.json" ),
		compare_size: {
			files: [ "dist/browserStorage.js", "dist/browserStorage.min.js" ],
			options: {
				compress: {
					gz: function( contents ) {
						return gzip.zip( contents, {} ).length;
					}
				},
				cache: "build/.sizecache.json"
			}
		},
		build: {
			all: {
				dest: "dist/browserStorage.js",
				minimum: ["browserStorage.js"]
			}
		},
		bowercopy: {
			options: {
				clean: true
			},
			src: {
				files: {}
			},
			tests: {
				options: {
					destPrefix: "test/libs"
				},
				files: {
					"browserStorage.js": "dist/browserStorage.js",
					"browserStorage.min.js": "dist/browserStorage.min.js",
				}
			}
		},
		jsonlint: {
			pkg: {
				src: [ "package.json" ]
			},

			bower: {
				src: [ "bower.json" ]
			}
		},
		jshint: {
			all: {
				src: [
					"src/**/*.js", "Gruntfile.js", "test/**/*.js", "build/tasks/*",
					"build/{bower-install,release-notes,release}.js"
				],
				options: {
					jshintrc: true
				}
			},
			dist: {
				src: "dist/browserStorage.js",
				options: srcHintOptions
			}
		},
		jscs: {
			src: "src/**/*.js",
			gruntfile: "Gruntfile.js",

			// Right know, check only test helpers
			test: [ ],
			tasks: "build/tasks/*.js"
		},
		testswarm: {
			tests: "ajax attributes callbacks core css data deferred dimensions effects event manipulation offset queue selector serialize support traversing".split( " " )
		},
		watch: {
			files: [ "<%= jshint.all.src %>" ],
			tasks: "dev"
		},
		uglify: {
			all: {
				files: {
					"dist/browserStorage.min.js": [ "dist/browserStorage.js" ]
				},
				options: {
					preserveComments: false,
					sourceMap: "dist/browserStorage.min.map",
					sourceMappingURL: "browserStorage.min.map",
					report: "min",
					beautify: {
						ascii_only: true
					},
					banner: "/*! browserStorage v<%= pkg.version %> | " +
						"(c) 2014, <%= grunt.template.today('yyyy') %> shenqihui. | " +
						"https://github.com/shenqihui/browserStorage/blob/master/MIT-LICENSE.txt */",
					compress: {
						hoist_funs: false,
						loops: false,
						unused: false
					}
				}
			}
		}
	});

	// Load grunt tasks from NPM packages
	require( "load-grunt-tasks" )( grunt );

	// Integrate browserStorage specific tasks
	grunt.loadTasks( "build/tasks" );

	grunt.registerTask( "bower", "bowercopy" );
	grunt.registerTask( "lint", [ "jshint", "jscs" ] );

	// Short list as a high frequency watch task
	grunt.registerTask( "dev", [ "build:*:*", "lint" ] );

	// Default grunt
	grunt.registerTask( "default", [ "jsonlint", "dev", "uglify", "dist:*", "compare_size" ] );
};
