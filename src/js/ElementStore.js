function ElementStore () {

		if ( ! ElementStore.initialized ) {
		
			initElementStore();
		
		}

		this.storage = {};

		return this;

}

function initElementStore () {

	console.log( "initElementStore", arguments );

	ElementStore.initialized = true;

	let prototype = ElementStore.prototype;

	function search ( element, query ) {

		while ( ! element.matches( query ) ) {

			element = element.parentNode;

		}

		return element;

	}

	Object.defineProperty( prototype, "search", {
		"value" : search
	} );

	function set ( key, mix ) {

		if ( typeof mix === "string" ) {

			mix = document.querySelector( mix );

		}

		this.storage[ key ] = mix;

		return this;

	}

	Object.defineProperty( prototype, "set", {
		"value" : set
	} );
	
	function get ( key, query ) {

		let element = this.storage[ key ];

		if ( query ) {

			element = element.querySelector( query );

		}

		return element;

	}

	Object.defineProperty( prototype, "get", {
		"value" : get
	} );
	
	function listen ( key, trigger, method ) {

		this.get( key )
			.addEventListener( trigger, method, false )

		return this;

	}

	Object.defineProperty( prototype, "listen", {
		"value" : listen
	} );
	
	function clone ( key ) {

		return this
			.get( key )
			.cloneNode( true );

	}

	Object.defineProperty( prototype, "clone", {
		"value" : clone
	} );

}