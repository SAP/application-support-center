sap.ui.define([
	"../BaseController"
], function (BaseController) {
	var oNewContact;

	return BaseController.extend("asc.admin.controller.contacts.AddContact", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();

			//Initialize empty model
			oNewContact = new sap.ui.model.json.JSONModel(("model/contact.json"));
			this.getView().setModel(oNewContact, "contact");
		},

		// UI //

		onSavePress: function (oEvent) {
			this.api.postNewContact(oNewContact.getData())
				.done(this.onSaveContactDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},
		onCancelPress: function () {
			this.oRouter.navTo("viewcontacts");
		},

		// Service Callbacks //

		onSaveContactDone: function (oData) {
			this.onToast("Success!");

			var aContacts = this.getView().oPropagatedProperties.oModels.contacts;
			aContacts.getData().push(oData.data);
			aContacts.setData(aContacts.getData());

			this.oRouter.navTo("viewcontacts");
			this.oRouter.navTo("viewcontacts");
		}
	});
}, true);
