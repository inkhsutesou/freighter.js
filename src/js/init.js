"use strict";

const FILESYSTEM = require( "fs" ),
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

	var value = NODELIST.input.value;

	NODELIST.input.value = "";

	switch ( true ) {

		case ( !! value ) :

			settings.jobList.push( {

				restorePath: value,
				timeStamp: DATE.getTime()

			} );

			saveData( refreshScreen );

			break;

		default :

	}

}

function removeJob ( event ) {

	console.log( "removeJob", arguments );

	var target = event.target,
		jobEl = target.parentNode,
		index = parseInt( jobEl.getAttribute( "jobIndex" ) );

	settings.jobList.splice( index, 1 );
	saveData( refreshScreen );

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