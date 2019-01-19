/*jslint node: true */
"use strict";
var headlessWallet = require('../start.js');
var eventBus = require('wntcore/event_bus.js');
var objectHash = require('wntcore/object_hash.js');

function onError(err){
	throw Error(err);
}

function createDefinitionChange(){
	var composer = require('wntcore/composer.js');
	var network = require('wntcore/network.js');
	var callbacks = composer.getSavingCallbacks({
		ifNotEnoughFunds: onError,
		ifError: onError,
		ifOk: function(objJoint){
			network.broadcastJoint(objJoint);
		}
	});
	
	var arrNewDefinition = ["sig", {pubkey: "new pubkey in base64"}];
	var new_definition_chash = objectHash.getChash160(arrNewDefinition);
	composer.composeDefinitionChangeJoint("PYQJWUWRMUUUSUHKNJWFHSR5OADZMUYR", new_definition_chash, headlessWallet.signer, callbacks);
}

eventBus.on('headless_wallet_ready', createDefinitionChange);
