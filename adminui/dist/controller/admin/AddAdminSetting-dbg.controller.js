sap.ui.define([
	"../BaseController"
], function (BaseController) {


	var oNewSetting;

	return BaseController.extend("asc.admin.controller.admin.AddAdminSetting", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();

			//Initialize empty model
			oNewSetting = new sap.ui.model.json.JSONModel(("model/setting.json"));
			this.getView().setModel(oNewSetting, "setting");
		},

		// UI //

		onCancelPress: function () {
			this.oRouter.navTo("admin");
		},

		onSavePress: function (oEvent) {
			this.api.postNewSetting(oNewSetting.getData())
				.done(this.onSaveSettingDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onSaveSettingDone: function (oData) {
			this.onToast("Success!");
			var aSettings = this.getView().oPropagatedProperties.oModels.raw_settings;
			aSettings.getData().push(oData.data);
			aSettings.setData(aSettings.getData());

			this.oRouter.navTo("admin");
		}
	});
}, true);
