"use strict";
( function initApplication () {

	var elementCatalog = {};

	elementCatalog.pre = document.createElement( "pre" );
	elementCatalog.close = document.createElement( "div" );

	elementCatalog.pre.innerHTML = JSON.stringify( process.versions, null, 2 );

	document.body.appendChild( elementCatalog.pre );

} ) ();