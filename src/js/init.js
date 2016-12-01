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

				restorePath: value,
				backupPath: value.split( PATH.sep ).pop() + ".zip",
				watchList: [],
				watchMtime: [],
				timeStamp: DATE.toUTCString()

			}

			settings.jobList.push( job );
		
			NODEDIR.files( value, function processFiles ( error, data ) {
		
			  console.log( "processFiles", arguments );
		
			  let fileList = data.filter( filterIgnoredFiles ),
					i = fileList.length,
					total = fileList.length,
					count = 0;

				job.watchList.push.apply( job.watchList, fileList );
		
			  while ( i -- ) {
		
			    FILESYSTEM.stat( fileList[ i ], function checkStatus ( error, data ) {
	
						job.watchMtime.unshift( data.mtime );
		
			      if ( ++ count === total ) {
		
							saveData( refreshScreen );
		
			      }
		
			    } );
		
			  }
		
			} );

			break;

		default :

	}

}

function filterIgnoredFiles ( value ) {

	return value.indexOf( "node_modules" ) === -1;

}

//==============================================================================
//	Job Buttons
//==============================================================================

function removeJob ( event ) {

	console.log( "removeJob", arguments );

	var target = event.target,
		jobEl = target.parentNode,
		index = parseInt( jobEl.getAttribute( "jobIndex" ) );

	settings.jobList.splice( index, 1 );
	saveData( refreshScreen );

}

function backupJob ( event ) {

	var target = event.target,
		jobEl = target.parentNode,
		index = parseInt( jobEl.getAttribute( "jobIndex" ) ),
		job = settings.jobList[ index ],

 		zipConfig = { "sources" : [ source ], "destination": target },
		execConfig = { "error" : onZipError, "success" : onZipSuccess };

	ZIP.zip( zipConfig )
		.exec( execConfig );

}

function restoreJob ( event ) {

	var target = event.target,
		jobEl = target.parentNode,
		index = parseInt( jobEl.getAttribute( "jobIndex" ) ),
		job = settings.jobList[ index ],

 		zipConfig = { "sources" : [ source ], "destination": target },
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
			.replace( /{{ path }}/, job.restorePath )
			.replace( /{{ timestamp }}/, job.timeStamp );

	}

	i = jobContainer.children.length;

	while ( i -- ) {

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