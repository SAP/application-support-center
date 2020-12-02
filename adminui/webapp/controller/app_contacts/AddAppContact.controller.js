sap.ui.define([
		"../BaseController"
], function (BaseController) {


	var oNewContact = {};

	return BaseController.extend("asc.admin.controller.app_contacts.AddAppContact", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("addappcontact").attachPatternMatched(this._onContactMatched, this);
		},
		_onContactMatched: function (oEvent) {
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this._appDetail = this.getView().getModel("apps").oData[this._app];
		},

		// UI //

		onSavePress: function (oEvent) {
			oNewContact.role =  this.getView().byId("idSelectRole").getSelectedKey();
			oNewContact.app_id = this._appDetail.app_id;

			this.api.postNewAppContact(oNewContact.app_id, oNewContact)
				.done(this.onSaveContactDone.bind(this))
				.fail(this.onSaveContactFailed.bind(this));
		},
		onCancelPress: function () {
			this.setLayout("TwoColumnsMidExpanded");
			//this.oRouter.navTo("applist");
		},
		handleUserChange: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedRow");
			var obj = oSelectedItem.getBindingContext("contacts").getObject();
			oNewContact.contact_id = obj.contact_id;
		},

		// Service Callbacks //

		onSaveContactDone: function(oData) {
			this.onToast("Success!");

				var aAppContacts = this.getView().oPropagatedProperties.oModels.app_contacts;
				//aAppContacts.getData().push(oData.data);
				aAppContacts.setData(oData.data);

				this.oRouter.navTo("editapp", { app: this._app });
				//this.getView().getModel("apps").oData[this._app]
				//this.setLayout("TwoColumnsMidExpanded");
		},

		onSaveContactFailed: function(oData) {
			this.onToast("Error adding contact");
		}
	});
}, true);
