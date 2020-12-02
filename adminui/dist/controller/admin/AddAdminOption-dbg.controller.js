sap.ui.define([
	"../BaseController"
], function (BaseController) {


	var oNewSetting;

	return BaseController.extend("asc.admin.controller.admin.AddAdminOption", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();

			//Initialize empty model
			oNewSetting = new sap.ui.model.json.JSONModel(("model/setting.json"));
			this.getView().setModel(oNewSetting, "option");
		},

		// UI //

		onCancelPress: function () {
			this.oRouter.navTo("admin");
			//this.setLayout("OneColumn");
		},

		onSavePress: function (oEvent) {
			this.api.postNewSetting(oNewSetting.getData())
				.done(this.onSaveSettingDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onSaveSettingDone: function (oData) {
			this.onToast("Success!");
			var aOptions = this.getView().oPropagatedProperties.oModels.raw_options;
			aOptions.getData().push(oData.data);
			aOptions.setData(aOptions.getData());

			this.oRouter.navTo("admin");
		}
	});
}, true);
