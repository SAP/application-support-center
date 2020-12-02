sap.ui.define([
	"../BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, Filter, FilterOperator) {

	return BaseController.extend("asc.admin.controller.contacts.ContactList", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
		},
		onClosePress: function () {
			this.oRouter.navTo("applist");
		},
		onContactItemPress: function (oEvent) {
			var iPath = oEvent.getSource().getBindingContext("contacts").getPath();
			var iID = iPath.split("/").slice(-1).pop();

			this.oRouter.navTo("editcontact", { contact: iID });
		},
		onAddContactPress: function (oEvent) {
			this.oRouter.navTo("addcontact");
		},
		onSearchContacts: function (oEvent) {
			// filter binding
			var oList = this.getView().byId("idTableContacts");
			var oBinding = oList.getBinding("items");
			var aFilter = [];

			if (oEvent.getParameter("clearButtonPressed")) {
				this.getView().byId("idTableContacts").getBinding("items").filter([]);
			} else {
				// build filter array
				var sQuery = oEvent.getParameter("query");
				if (sQuery) {
					aFilter.push(new Filter("first_name", FilterOperator.Contains, sQuery));
					aFilter.push(new Filter("last_name", FilterOperator.Contains, sQuery));
				}

				oBinding.filter(new Filter({
					filters: aFilter,
					and: false
				}));
			}
		},
		onRemoveContactPress: function (oEvent) {
			var oTable = this.getView().byId("idTableContacts");
			var aContexts = oTable.getSelectedContexts();
			var aContactItems = this.getView().oPropagatedProperties.oModels.contacts.getData();

			for (var i = aContexts.length - 1; i >= 0; i--) {
				var oContact = aContexts[i].getObject();
				var iPath = aContexts[i].getPath().replace("/", "");
				aContactItems.splice(iPath, 1);

				this.getView().oPropagatedProperties.oModels.contacts.setData(aContactItems);

				this.api.deleteContact(oContact.contact_id)
					.done(this.onRemoveContactDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
			}
		},
		onRemoveContactDone: function (oData) {
			this.onToast("Success!");
		}
	});
}, true);
