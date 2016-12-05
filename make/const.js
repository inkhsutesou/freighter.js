"use strict";

const FILESYSTEM = require( "fs" ),
	PATH = require( "path" ),
	ZIP = require( "machinepack-zip" ),
	ELECTRON = require( "electron" ),
	NODEDIR = require( "node-dir" ),

	REMOTE = ELECTRON.remote,
	DIALOG = REMOTE.dialog,

	ELEMENTSTORE = new ElementStore(),
	FSOPT = { "encoding": "utf-8" },
	DATE = new Date(),

	APP_PATH = "./app/",
	ARCHIVE_PATH = APP_PATH + "archive/",
	ARCHIVE_TEMPLATE = ARCHIVE_PATH + "{{ name }}.zip",
	SAVEFILEPATH = APP_PATH + "saveFile.json",

	DEFAULTSAVE = { "jobList" : [] },

	FREIGHTER = new Freighter();