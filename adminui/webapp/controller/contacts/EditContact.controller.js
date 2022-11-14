sap.ui.define([
		"../BaseController"
], function (BaseController) {
	return BaseController.extend("asc.admin.controller.contacts.EditContact", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("editcontact").attachPatternMatched(this._onContactMatched, this);
		},
		_onContactMatched: function (oEvent) {
			this._contact = oEvent.getParameter("arguments").contact || this._contact || "0";
			this.getView().bindElement({
				path: "/" + this._contact,
				model: "contacts"
			});

			this.contactDetail = this.getView().getModel("contacts").oData[this._contact];

			if (this.contactDetail && this.contactDetail.contact_id) {
				this.api.getContactApps(this.contactDetail.contact_id)
				.done(this.onGetContactAppsDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
			}
		},

		// UI //

		onCancelPress: function() {
			this.oRouter.navTo("viewcontacts");
		},

		onAppItemPress: function (oEvent) {
			var appPath = oEvent.getSource().getBindingContext("contacts_apps").getPath();
			var appId = appPath.split("/").slice(-1).pop();

			this.oRouter.navTo("viewapp", {app: appId});
		},

		// Service Requests //

		onSavePress: function (oEvent) {
			this.api.putContact(this.contactDetail.contact_id, this.contactDetail)
				.done(this.onEditContactDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onEditContactDone: function(oData) {
			this.onToast("Success!");
			this.oRouter.navTo("viewcontacts");
		},

		onGetContactAppsDone: function(oData) {
			var oContactAppsModel = new sap.ui.model.json.JSONModel(oData);
			this.getView().setModel(oContactAppsModel, "contacts_apps");
		}
	});
}, true);
