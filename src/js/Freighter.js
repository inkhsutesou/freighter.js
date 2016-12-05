function Freighter () {

	if ( ! Freighter.initialized ) {
	
		initFreighter();
	
	}

	this.settings;

}

function initFreighter () {

	let prototype = Freighter.prototype
		, dialogSettings = { "properties" : [ "openFolder" ] };

	Freighter.initialized = true;

	ELEMENTSTORE

		.set( "close", ".close.button" )
		.set( "add", ".add.button" )

		.listen( "add", "click", addJob )
		.listen( "close", "click", close );

	function close ( event ) {

		console.log( "close", arguments );

		window.close();

	}

	Object.defineProperty( prototype, "close", {
			"value" : close
	} );

	function addJob ( event ) {

		console.log( "addJob", arguments );

		let value = DIALOG.showOpenDialog( dialogSettings )[ 0 ];

		switch ( true ) {

			case ( !! value ) :

				new Job( {

					sourcePath: value,
					timeStamp: DATE.toUTCString()

				} );

				this.save( this.refresh );

				break;


			default :

				alert( "Please choose a job root folder to continue" );

		}

	}

	Object.defineProperty( prototype, "addJob", {
		"value" : addJob
	} );

	function refresh ( callback ) {

		console.log( "refresh", arguments );

		let jobContainer = ELEMENTSTORE.get( "job-container" ),
			jobList = this.settings.jobList,
			i = jobList.length,
			job;

		while ( i -- ) {

			job = jobList[ i ];
			jobContainer.appendChild( job.element );

		}

	}

	Object.defineProperty( prototype, "refresh", {
		"value" : refresh
	} );

	function load ( callback ) {

		console.log( "load", arguments );

		let self = this;

		FILESYSTEM.readFile( SAVEFILEPATH, FSOPT, loadCallback );

		function loadCallback ( error, data ) {

			console.log( "loadCallback", arguments );

			switch ( true ) {

				case ( !! error ) :

					self.settings = JSON.parse( JSON.stringify( DEFAULTSAVE ) );
					self.save( self.load );

					break;

				default :

					self.settings = JSON.parse( data );
					callback && callback.apply( self );

			}

		}

	}

	Object.defineProperty( prototype, "load", {
		"value" : load
	} );

	function save ( callback ) {

		let self = this;

		FILESYSTEM.writeFile( SAVEFILEPATH, JSON.stringify( this.settings ), FSOPT, saveCallback );

		function saveCallback ( error, data ) {

			console.log( "saveData", arguments );
			callback && callback.apply( self );

		} 

	}

	Object.defineProperty( prototype, "save", {
		"value" : save
	} );

}