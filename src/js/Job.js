function Job ( config ) {

	if ( ! Job.initialized ) {
	
		initJob();
	
	}

	var config = config || this;

	this.jobName = config.jobName || "";
	this.targetFiles = config.targetFiles || [];
	this.sourcePath = config.sourcePath || "";
	this.timeStamp = DATE.toUTCString();

	ELEMENTSTORE
		.set( "job", ELEMENTSTORE.clone( "job-template" ) );

	this.element = ELEMENTSTORE.get( "job" );
	this.element.dataJob = this;

	ELEMENTSTORE.get( "job", ".sourcepath" )
		.innerHTML = this.sourcePath;
	ELEMENTSTORE.get( "job", ".timestamp" )
		.innerHTML = this.timeStamp;

	ELEMENTSTORE.get( "job", ".append.button" )
		.addEventListener( "click", this.appendClick, false );
	ELEMENTSTORE.get( "job", ".backup.button" )
		.addEventListener( "click", this.backupClick, false );
	ELEMENTSTORE.get( "job", ".restore.button" )
		.addEventListener( "click", this.restoreClick, false );
	ELEMENTSTORE.get( "job", ".remove.button" )
		.addEventListener( "click", this.removeClick, false );

	ELEMENTSTORE.get( "job-container" )
		.appendChild( this.element );

	settings.jobList.push( this );

	return this;

}

function initJob () {

	console.log( "initJob", arguments );

	let prototype = Job.prototype;

	Job.initialized = true;

	ELEMENTSTORE

		.set( "job-template", "template .job" )
		.set( "job-container", ".job-container" );

	initJobUi();

	function remove () {

		console.log( "remove", arguments );

		this.job.element.remove();
		settings.jobList.splice( this.index, 1 );

		FREIGHTER.save( FREIGHTER.refresh );

	}

	Object.defineProperty( prototype, "remove", {
	  "value" : remove
	} );

	function restore () {

		console.log( "restore", arguments );

	}

	Object.defineProperty( prototype, "remove", {
	  "value" : restore
	} );

	function backup () {

		console.log( "backup", arguments );

		let destination = ARCHIVE_PATH 

	}

	Object.defineProperty( prototype, "remove", {
	  "value" : backup
	} );

	function append () {

		console.log( "append", arguments );

	}

	Object.defineProperty( prototype, "remove", {
	  "value" : append
	} );

	function getIndex () {
	
		console.log( "getIndex", arguments );

		return settings.jobList.indexOf( this );

	}

	Object.defineProperty( prototype, "index", {
	  "get" : getIndex
	} );

	function getBackupPath () {
	
		console.log( "getBackupPath", arguments );

		return ARCHIVE_TEMPLATE
	 		.replace( /{{ name }}/, this.jobName );

	}

	Object.defineProperty( prototype, "backupPath", {
	  "get" : getBackupPath
	} );

	function getRestorePath () {
	
		console.log( "getRestorePath", arguments );

		return this.sourcePath
			.split( PATH.sep )
			.slice( 0, - 1 )
			.join( PATH.sep );

	}

	Object.defineProperty( prototype, "restorePath", {
	  "get" : getRestorePath
	} );

}