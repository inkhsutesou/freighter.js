const less = require( "less" ),
	fileSystem = require( "fs" ),
	fsConfig = { "encoding" : "utf-8" }
	nodeDir = require( "node-dir" ),

	lessConfig = {

	  // paths: [ sourcePath ],
	  compress: false

	},
	separator = "\n\n//=====================================================\n\n",
	scriptText = fileSystem.readFileSync( "./make/const.js" ),
	NOOP = function NOOP () {};

let jsFileTotal, jsFileCount;

function runJsProcessor ( error, data ) {

	// console.log( "runJsProcessor", arguments );

	i = jsFileTotal = data.length;
	jsFileCount = 0;

	while ( i -- ) {

		fileSystem.readFile( data[ i ], fsConfig, appendJS );

	}

}

function appendJS ( error, data ) {

	// console.log( "appendJS", arguments );

	scriptText += separator + data;

	if ( ++ jsFileCount === jsFileTotal ) {

		scriptText += fileSystem.readFileSync( "./make/init.js" ),

		fileSystem.writeFile( "./app/script.js", scriptText, fsConfig, NOOP );

	}

}

function runLessProcessor ( error, data ) {

	less.render( data.toString(), lessConfig, runLessProcessorCallback );

}

function runLessProcessorCallback ( error, data ) {

	// console.log( "runLessProcessorCallback", arguments );

	fileSystem.writeFile( "./app/style.css", data.css, NOOP );

}

nodeDir.files( "./src/js/", runJsProcessor );
fileSystem.readFile( "./src/less/style.less", runLessProcessor );