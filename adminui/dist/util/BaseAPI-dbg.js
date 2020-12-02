sap.ui.define([
	"sap/ui/base/Object"
], function (Object) {
	"use strict";

	return Object.extend("asc.admin.util.BaseAPI", {
		// map of uid to jqxhr
		_pendingRequests: {},

		//registers a request with the given uid in the queue
		_register: function (sUID, jqXHR) {
			if (sUID && sUID in this._pendingRequests) {
				this._pendingRequests[sUID].abort();
				this._unregister(sUID);
			}
			this._pendingRequests[sUID] = jqXHR;
		},

		//unregisters a request with the given uid in the queue
		_unregister: function (sUID) {
			delete this._pendingRequests[sUID];
		},

		_requestComplete: function (sUID, jqXHR) {
			if (sUID && sUID in this._pendingRequests) {
				this._unregister(sUID);
			}
		}
	});
});