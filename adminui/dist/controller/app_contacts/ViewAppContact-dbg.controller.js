sap.ui.define([
		"../BaseController"
], function (BaseController) {

	return BaseController.extend("asc.admin.controller.app_contacts.ViewAppContact", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("viewappcontact").attachPatternMatched(this._onContactMatched, this);
		},
		_onContactMatched: function (oEvent) {
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this._app_contact = oEvent.getParameter("arguments").app_contact || this._app_contact || "0";
			this._app_contact_detail = this.getView().oPropagatedProperties.oModels.app_contacts;
			this.getView().bindElement({
				path: "/" + this._app_contact,
				model: "app_contacts"
			});
		},
		onFullScreenPress: function () {
			this.setLayout("EndColumnFullScreen");
		},
		onExitFullScreenPress: function () {
			this.setLayout("ThreeColumnsMidExpanded");
		},
		onClosePress: function () {
			this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("viewapp", { app: this._app });
		}
	});
}, true);
