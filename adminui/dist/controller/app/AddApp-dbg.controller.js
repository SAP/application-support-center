sap.ui.define([
	"../BaseController"
], function (BaseController) {
	return BaseController.extend("asc.admin.controller.app.AddApp", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.getView().setModel(new sap.ui.model.json.JSONModel(("model/app.json")), "app");
		},

		// UI //

		onCancelPress: function() {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("applist");
		},

		// Service Requests //

		onSavePress: function (oEvent) {
			this.api.postNewApp(this.getView().getModel("app").getData())
				.done(this.onSaveAppDone.bind(this))
				.fail(this.onSaveAppFailed.bind(this));
		},

		// Service Callbacks //

		onSaveAppDone: function(oData) {
			this.onToast("Success!");
			this.addRecordToModelAndRefresh("apps", oData.data);
			this.oRouter.navTo("viewapp", { app: 0 });
		},
		onSaveAppFailed: function(jqXHR) {
			this.onToast("Error: " + jqXHR);
		}
	});
});
