sap.ui.define([
	"../BaseController"
], function (BaseController) {

	return BaseController.extend("asc.admin.controller.contacts.ViewContact", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("viewcontact").attachPatternMatched(this._onContactMatched, this);
		},
		_onContactMatched: function (oEvent) {
			this._contact = oEvent.getParameter("arguments").contact || this._contact || "0";
			this.getView().bindElement({
				path: "/" + this._contact,
				model: "contacts"
			});
		},
		onClosePress: function () {
			this.oRouter.navTo("viewcontacts");
		}
	});
}, true);
