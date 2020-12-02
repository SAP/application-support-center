sap.ui.define([
		"../BaseController"
], function (BaseController) {
	return BaseController.extend("asc.admin.controller.home.Home", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
		}
	});
}, true);
