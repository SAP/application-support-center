sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	return Opa5.extend("asc.admin.test.integration.arrangements.Startup", {

		iStartMyApp : function () {
			this.iStartMyAppInAFrame("../../index.html#/apps");
		}
	});
});
