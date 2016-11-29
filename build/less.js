const less = require( "less" ),
	fileSystem = require( "fs" ),
	sourcePath = "./src/less/",
	sourceFile = "style.less",
	destination = "./dist/style.css",
	source = sourcePath + sourceFile,

	lessConfig = {

	  paths: [ sourcePath ],
	  compress: false

	};

function runLessProcessor ( error, data ) {

 less.render( data.toString(), lessConfig, function ( error, output ) {

	 fileSystem.writeFileSync( destination, output.css );

 });

}

fileSystem.readFile( source, runLessProcessor );