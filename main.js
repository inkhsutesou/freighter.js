"use strict";
const electron = require( "electron" ),
	path = require( "path" ),
	url = require( "url" ),
	app = electron.app,

	BrowserWindow = electron.BrowserWindow,
	browserConfig = {

		"width" : 800,
		"height" : 600,
		"frame" : false

	},

	urlConfig = {

		pathname : path.join(__dirname, 'index.html'),
		protocol : 'file:',
		slashes : true

	},
	urlString = url.format( urlConfig );

let mainWindow;

function createWindow () {

  mainWindow = new BrowserWindow( browserConfig );
  mainWindow.loadURL( urlString )

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
	
		console.log( "-- mainWindow.on( closed )" );

    mainWindow = null

  });

}

app.on( "ready", createWindow );

app.on( "window-all-closed", function () {

	console.log( "-- app.on( window-all-closed )" );

  if ( process.platform !== "darwin" ) { // OSX Specific

    app.quit()

  }

});

app.on( "activate", function () {

	console.log( "-- app.on( activate )" );

  if ( mainWindow === null ) { // OSX Specific

    createWindow()

  }

});