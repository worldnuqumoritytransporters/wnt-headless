/*jslint node: true */
"use strict";
var headlessWallet = require('../start.js');
var eventBus = require('wntcore/event_bus.js');

function onError(err){
	throw Error(err);
}

function createAttestation(){
	var composer = require('wntcore/composer.js');
	var network = require('wntcore/network.js');
	var callbacks = composer.getSavingCallbacks({
		ifNotEnoughFunds: onError,
		ifError: onError,
		ifOk: function(objJoint){
			network.broadcastJoint(objJoint);
		}
	});
	
	var profile = {
		age: 24,
		name: "George",
		emails: ["george@example.com", "george@anotherexample.com"]
	};
	composer.composeAttestationJoint(
		"LS3PUAGJ2CEYBKWPODVV72D3IWWBXNXO", // attestor address
		"PYQJWUWRMUUUSUHKNJWFHSR5OADZMUYR", // address of the person being attested (subject)
		profile,                            // attested profile
		headlessWallet.signer, 
		callbacks
	);
}

eventBus.on('headless_wallet_ready', createAttestation);
