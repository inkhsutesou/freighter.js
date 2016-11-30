"use strict";
const electron = require( "electron" ),
	path = require( "path" ),
	url = require( "url" ),
	app = electron.app,

	BrowserWindow = electron.BrowserWindow,
	browserConfig = {

		"width" : 800,
		"height" : 600,

		"x" : - 1920 + 800 / 2,
		"y" : - 1280 + 600 / 2,

		"frame" : false

	},

	urlConfig = {

		pathname : path.join( __dirname, "app/index.html" ),
		protocol : "file",
		slashes : true

	},
	urlString = url.format( urlConfig );

let mainWindow;

function createWindow () {

  mainWindow = new BrowserWindow( browserConfig );
  mainWindow.loadURL( urlString )

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
	
		console.log( "-- mainWindow.on( closed )", arguments );

    mainWindow = null

  });

}

app.on( "ready", createWindow );

app.on( "window-all-closed", function () {

	console.log( "-- app.on( window-all-closed )", arguments );

  if ( process.platform !== "darwin" ) { // OSX Specific

    app.quit()

  }

});

app.on( "activate", function () {

	console.log( "-- app.on( activate )", arguments );

  if ( mainWindow === null ) { // OSX Specific

    createWindow()

  }

});