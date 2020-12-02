sap.ui.define([
		"../BaseController"
], function (BaseController) {

	return BaseController.extend("asc.admin.controller.dashboard.Dashboard", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this._bDescendingSort = false;

			this.api.getAllStats()
				.done(this.onGetAllStatsDone.bind(this));
		},

		// UI //

		onOpenAppURL: function(oEvent) {
			var app_id = oEvent.getSource().getCustomData()[0].getValue("app_id");
			var aAppsModel = this.getOwnerComponent().getModel("apps").getData();
			//Loop through apps model and find the index to pass to the viewapp route
			var app_idx = aAppsModel.findIndex(x => x.app_id === parseInt(app_id));
			this.oRouter.navTo("viewapp", {app: app_idx});
		},

		onDownloadAppOwners: function(oEvent) {
			var that = this;
			this.api.getDownloadContacts('AppOwner')
				.done(function(data) {
					that.jsonToCSV(data, "app_owners.csv");
				});	
		},

		onDownloadAppDevelopers: function(oEvent) {
			var that = this;
			this.api.getDownloadContacts('Developer')
				.done(function(data) {
					that.jsonToCSV(data, "app_developers.csv");
				});	
		},

		onDownloadAppContacts: function(oEvent) {
			var that = this;
			this.api.getDownloadAppContacts()
				.done(function(data) {
					that.jsonToCSV(data, "app_contacts.csv");
				});
		},

		// Service Responses //

		onGetAllStatsDone: function(oData) {
			var oAppsModel = new sap.ui.model.json.JSONModel(oData);
			this.getOwnerComponent().setModel(oAppsModel, "dashboard_stats");
		}

	});
}, true);
