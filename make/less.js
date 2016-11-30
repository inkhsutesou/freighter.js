const less = require( "less" ),
	fileSystem = require( "fs" ),
	sourcePath = "./src/less/",
	sourceFile = "style.less",
	destination = "./src/css/style.css",
	source = sourcePath + sourceFile,

	lessConfig = {

	  paths: [ sourcePath ],
	  compress: false

	};

function runLessProcessor ( error, data ) {

	less.render( data.toString(), lessConfig, function runLessProcessorCallback ( error, output ) {

		// console.log( "runLessProcessorCallback", arguments );

		fileSystem.writeFileSync( destination, output.css );

	});

}

fileSystem.readFile( source, runLessProcessor );