sap.ui.define([
		"../BaseController"
], function (BaseController) {
	var oContact = {};

	return BaseController.extend("asc.admin.controller.app_contacts.EditAppContact", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("editappcontact").attachPatternMatched(this._onContactMatched, this);
		},
		_onContactMatched: function (oEvent) {
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this._app_contact = oEvent.getParameter("arguments").app_contact || this._app_contact || "0";
			this._app_contact_detail = this.getView().getModel("app_contacts").oData[this._app_contact];
			this.getView().bindElement({
				path: "/" + this._app_contact,
				model: "app_contacts"
			});
		},

		// UI //

		onCancelPress: function() {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("editapp", {app: this._app});
		},

		// Service Requests //

		onSavePress: function (oEvent) {
			oContact.contact_id = this._app_contact_detail.contact_id;
			oContact.app_id = this._app_contact_detail.app_id;
			oContact.role =  this.getView().byId("idSelectRole").getSelectedKey();

			this.api.putAppContact(oContact.app_id, oContact.contact_id, oContact)
				.done(this.onSaveContactDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onSaveContactDone: function(oData) {
			this.onToast("Success!");
			this.oRouter.navTo("editapp", { app: this._app });
		}

	});
}, true);
