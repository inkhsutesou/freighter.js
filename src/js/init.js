"use strict";

const FILESYSTEM = require( "fs" ),
	PATH = require( "path" ),
	ZIP = require( "machinepack-zip" ),
	ELECTRON = require( "electron" ),
	NODEDIR = require( "node-dir" ),

	REMOTE = ELECTRON.remote,
	DIALOG = REMOTE.dialog,

	NODELIST = {},
	FSOPT = { "encoding": "utf-8" },
	DATE = new Date(),
	SAVEFILEPATH = "./app/saveFile.json";

let settings;

NODELIST.template = {};
NODELIST.template.job = document.querySelector( "#template-list .job" );

NODELIST.close = document.querySelector( ".close.button" );
NODELIST.add = document.querySelector( ".add.button" );
NODELIST.input = document.querySelector( "[ name='path' ]" );

NODELIST.jobContainer = document.querySelector( ".job-container" );

NODELIST.add.addEventListener( "click", addJob, false );
NODELIST.close.addEventListener( "click", closeWindow, false );

function closeWindow ( event ) {

	console.log( "closeWindow", arguments );

	window.close();

}

function addJob ( event ) {

	console.log( "addJob", arguments );

	let dialogSettings = { "properties" : [ "openDirectory" ] },
		value = DIALOG.showOpenDialog( dialogSettings )[ 0 ],
		job;

	switch ( true ) {

		case ( !! value ) :

			job = {

				sourcePath: value,
				restorePath: value.split( PATH.sep).slice( 0, - 1 ).join( PATH.sep ),
				backupPath: value.split( PATH.sep ).pop() + ".zip",
				watchList: [],
				watchMtime: [],
				timeStamp: DATE.toUTCString()

			}

			settings.jobList.push( job );

			saveData( refreshScreen );

			break;

		default :

	}

}

function getWatchStats ( directory, callback ) {

	console.log( "getWatchStats", arguments );

	if ( typeof directory === "string" ) {

		NODEDIR.files( directory, processFiles );

	} else {

		processFiles ( null, directory );

	}
	
	function processFiles ( error, data ) {
	
		console.log( "processFiles", arguments );
	
		let watchList = data.filter( filterIgnoredFiles ),
			watchMtime = [],
			i = watchList.length,
			total = watchList.length,
			count = 0;
	
		while ( i -- ) {
	
			FILESYSTEM.stat( watchList[ i ], function checkStatus ( error, data ) {
	
				watchMtime.unshift( data.mtime.getTime() );
	
				if ( ++ count === total ) {
	
					callback( watchList, watchMtime );
	
				}
	
			} );
	
		}
	
	}

}

function filterIgnoredFiles ( value ) {

	return value.indexOf( "node_modules" ) === -1;

}

//==============================================================================
//	Job Buttons
//==============================================================================

function checkJob ( event ) {

	console.log( "checkJob", arguments );

	var target = event.target,
		jobEl = target.parentNode.parentNode,
		index = parseInt( jobEl.getAttribute( "jobIndex" ) ),
		job = settings.jobList[ index ];

	getWatchStats( job.watchList, function compareList ( watchList, watchMtime ) {

		console.log( "compareList", arguments );

		let i = watchList.length
			,	isChanged = job.watchList.length !== i;

		while ( ! isChanged && i -- ) {
console.log( watchList[ i ], watchMtime[ i ], job.watchList[ i ], job.watchMtime[ i ]);
			isChanged = watchMtime[ i ] !== job.watchMtime[ i ];

		}

		switch ( true ) {

			case ( isChanged ) :

				target.classList.remove( "current" );
				target.classList.add( "behind" );

				break;

			default :

				target.classList.remove( "behind" );
				target.classList.add( "current" );

		}

	} );

}

function removeJob ( event ) {

	console.log( "removeJob", arguments );

	var target = event.target,
		jobEl = target.parentNode.parentNode,
		index = parseInt( jobEl.getAttribute( "jobIndex" ) );

	settings.jobList.splice( index, 1 );
	saveData( refreshScreen );

}

function backupJob ( event ) {

	console.log( "backupJob", arguments );

	var target = event.target,
		jobEl = target.parentNode.parentNode,
		index = parseInt( jobEl.getAttribute( "jobIndex" ) ),
		job = settings.jobList[ index ],
		destination = "./app/archives/" + job.backupPath,

 		zipConfig = { "sources" : [ job.sourcePath ], "destination": destination },
		execConfig = { "error" : onZipError, "success" : onZipSuccess };

		getWatchStats( job.sourcePath, function ( watchList, watchMtime ) {

			job.watchList.push.apply( job.watchList, watchList );
			job.watchMtime.push.apply( job.watchMtime, watchMtime );
	
			ZIP.zip( zipConfig )
				.exec( execConfig );

			saveData( refreshScreen );

		} );

}

function restoreJob ( event ) {

	console.log( "restoreJob", arguments );

	var target = event.target,
		jobEl = target.parentNode.parentNode,
		index = parseInt( jobEl.getAttribute( "jobIndex" ) ),
		job = settings.jobList[ index ],
		source = "./app/archives/" + job.backupPath,

 		zipConfig = { "source" : source, "destination": job.restorePath },
		execConfig = { "error" : onZipError, "success" : onZipSuccess };

	ZIP.unzip( zipConfig )
		.exec( execConfig );

}

function onZipSuccess ( data ) {

console.log( "onZipSuccess", data );

}

function onZipError ( error ) {

console.log( "onZipError", error );

}

function refreshScreen ( callback ) {

	console.log( "refreshScreen", arguments );

	var jobContainer = NODELIST.jobContainer,
		template = NODELIST.template.job.outerHTML,
		jobList = settings.jobList,
		i = jobList.length,
		job;

	jobContainer.innerHTML = "";

	while ( i -- ) {

		job = jobList[ i ];

		jobContainer.innerHTML += template
			.replace( /{{ index }}/, i )
			.replace( /{{ path }}/, job.sourcePath )
			.replace( /{{ timestamp }}/, job.timeStamp );

	}

	i = jobContainer.children.length;

	while ( i -- ) {

		jobContainer.children[ i ].querySelector( ".check.button" )
			.addEventListener( "click", checkJob, false );
		
				jobContainer.children[ i ].querySelector( ".backup.button" )
					.addEventListener( "click", backupJob, false );
		
		jobContainer.children[ i ].querySelector( ".restore.button" )
			.addEventListener( "click", restoreJob, false );
		
		jobContainer.children[ i ].querySelector( ".remove.button" )
			.addEventListener( "click", removeJob, false );

	}

}

function loadData ( callback ) {

	FILESYSTEM.readFile( SAVEFILEPATH, FSOPT, function loadDataCallback ( error, data ) {
	
		console.log( "loadDataCallback", arguments );

		switch ( true ) {

			case ( !! error ) :

				settings = { "jobList" : [] };
				saveData( loadData );

				break;

			default :

				settings = JSON.parse( data );
				callback && callback();

		}

	} );


}

function saveData ( callback ) {

	FILESYSTEM.writeFile( SAVEFILEPATH, JSON.stringify( settings ), FSOPT, function saveDataCallback ( error, data) {

		console.log( "saveData", arguments );
		callback && callback();

	} );

}

loadData( refreshScreen );