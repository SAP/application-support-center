sap.ui.define([
	"../BaseController"
], function (BaseController) {

	var setting;
	var settingId;

	return BaseController.extend("asc.admin.controller.admin.EditAdminSetting", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("editadminsetting").attachPatternMatched(this._onSettingMatched, this);
		},

		_onSettingMatched: function (oEvent) {
			this.settingId = oEvent.getParameter("arguments").setting_id || this.setting_id || "0";
			this.getView().bindElement({
				path: "/" + this.settingId,
				model: "raw_settings"
			});
			this.setting = this.getView().getModel("raw_settings").oData[this.settingId];
		},

		// UI //

		onCancelPress: function () {
			this.oRouter.navTo("admin");
		},

		onSavePress: function (oEvent) {
			this.api.putSetting(this.setting.setting_id, this.setting)
				.done(this.onSaveSettingDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onSaveSettingDone: function (oData) {
			this.onToast("Success!");
			this.oRouter.navTo("admin");
		}
	});
}, true);
