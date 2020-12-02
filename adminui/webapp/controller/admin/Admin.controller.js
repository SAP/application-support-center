sap.ui.define([
	"../BaseController"
], function (BaseController) {
	return BaseController.extend("asc.admin.controller.admin.Admin", {

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();

			this.api.getAllSettings()
				.done(this.onGetSettingsDone.bind(this));
		},

		// UI //

		onAddNotificationPress: function (oEvent) {
			this.oRouter.navTo("addadminnotification");
		},

		onNotificationItemPress: function (oEvent) {
			var iPath = oEvent.getSource().getBindingContext("notifications").getPath();
			var sID = iPath.split("/").slice(-1).pop();
			this.oRouter.navTo("editadminnotification", { notification_id: sID});
		},

		onAddSettingPress: function (oEvent) {
			this.oRouter.navTo("addadminsetting");
		},

		onSettingItemPress: function (oEvent) {
			var iPath = oEvent.getSource().getBindingContext("raw_settings").getPath();
			var sID = iPath.split("/").slice(-1).pop();
			this.oRouter.navTo("editadminsetting", { setting_id: sID});
		},

		// Service Requests //
		onRemoveNotificationPress: function (oEvent) {
			var oTable = this.getView().byId("idTableNotifications");
			var aContexts = oTable.getSelectedContexts();
			var aNotificationItems = this.getView().oPropagatedProperties.oModels.notifications.getData();

			for (var i = aContexts.length - 1; i >= 0; i--) {
				var oNotification = aContexts[i].getObject();
				var iPath = aContexts[i].getPath().replace("/", "");
				aNotificationItems.splice(iPath, 1);

				this.getView().oPropagatedProperties.oModels.notifications.setData(aNotificationItems);

				this.api.deleteNotification(oNotification.notification_id)
					.done(this.onRemoveNotificationDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
			}
			oTable.removeSelections();
		},
		onRemoveSettingPress: function (oEvent) {
			var oTable = this.getView().byId("idTableOptions");
			var aContexts = oTable.getSelectedContexts();
			var aOptionItems = this.getView().oPropagatedProperties.oModels.raw_settings.getData();

			for (var i = aContexts.length - 1; i >= 0; i--) {
				var oOption = aContexts[i].getObject();
				var iPath = aContexts[i].getPath().replace("/", "");
				aOptionItems.splice(iPath, 1);

				this.getView().oPropagatedProperties.oModels.raw_settings.setData(aOptionItems);

				this.api.deleteSetting(oOption.setting_id)
					.done(this.onRemoveOptionDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
			}
			oTable.removeSelections();
		},

		// Service Callbacks //

		onRemoveNotificationDone: function (oData) {
			this.onToast("Success!");
		},

		onRemoveOptionDone: function (oData) {
			this.onToast("Success!");
		},

		onGetSettingsDone: function (aData) {
			var oRawOptionsModel = new sap.ui.model.json.JSONModel(aData);
			oRawOptionsModel.setSizeLimit(1000);
			this.getOwnerComponent().setModel(oRawOptionsModel, "raw_settings");
		}
	});
}, true);
