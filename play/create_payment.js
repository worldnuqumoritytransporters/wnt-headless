/*jslint node: true */
"use strict";
var headlessWallet = require('../start.js');
var eventBus = require('wntcore/event_bus.js');

function onError(err){
	throw Error(err);
}

function createPayment(){
	var composer = require('wntcore/composer.js');
	var network = require('wntcore/network.js');
	var callbacks = composer.getSavingCallbacks({
		ifNotEnoughFunds: onError,
		ifError: onError,
	/*	preCommitCb: function (conn, objJoint, handle){ //In this optional callback you can add SQL queries to be executed atomically with the payment
						conn.query("UPDATE my_table SET status='paid' WHERE transaction_id=?",[transaction_id]);
						handle();
					},*/
		ifOk: function(objJoint){
			network.broadcastJoint(objJoint);
		}
	});
	
	var from_address = "PYQJWUWRMUUUSUHKNJWFHSR5OADZMUYR";
	var payee_address = "LS3PUAGJ2CEYBKWPODVV72D3IWWBXNXO";
	var arrOutputs = [
		{address: from_address, amount: 0},      // the change
		{address: payee_address, amount: 10000}  // the receiver
	];
	composer.composePaymentJoint([from_address], arrOutputs, headlessWallet.signer, callbacks);
}

eventBus.on('headless_wallet_ready', createPayment);
