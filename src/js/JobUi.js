function initJobUi () {

	console.log( "initJobUi", arguments );

	let prototype = Job.prototype;

	function appendClick ( event ) {

		console.log( "appendClick", arguments );

		let job = ELEMENTSTORE.search( event.target, ".job" ).dataJob;

		job.append();

	}

	Object.defineProperty( prototype, "appendClick", {
		"value" : appendClick
	} );

	function backupClick ( event ) {

		console.log( "backupClick", arguments );

		let job = ELEMENTSTORE.search( event.target, ".job" ).dataJob;

		job.backup();

	}

	Object.defineProperty( prototype, "backupClick", {
		"value" : backupClick
	} );

	function restoreClick ( event ) {

		console.log( "restoreClick", arguments );

		let job = ELEMENTSTORE.search( event.target, ".job" ).dataJob;

		job.restore();

	}

	Object.defineProperty( prototype, "restoreClick", {
	"value" : restoreClick
	} );

	function removeClick ( event ) {

		console.log( "removeClick", arguments );

		let job = ELEMENTSTORE.search( event.target, ".job" ).dataJob;

		job.remove();

	}

	Object.defineProperty( prototype, "removeClick", {
	"value" : removeClick
	} );

}