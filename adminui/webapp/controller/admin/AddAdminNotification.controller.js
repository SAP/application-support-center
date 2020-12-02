sap.ui.define([
	"../BaseController"
], function (BaseController) {

	var oNewNotification;

	return BaseController.extend("asc.admin.controller.admin.AddAdminNotification", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();

			//Initialize empty model
			oNewNotification = new sap.ui.model.json.JSONModel(("model/notification.json"));
			this.getView().setModel(oNewNotification, "notification");
		},

		// UI //

		onCancelPress: function () {
			this.oRouter.navTo("admin");
			//this.setLayout("OneColumn");
		},

		onSavePress: function (oEvent) {
			this.api.postNewNotification(oNewNotification.getData())
				.done(this.onSaveNotificationDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onSaveNotificationDone: function (oData) {
			this.onToast("Success!");
			var aNotifications = this.getView().oPropagatedProperties.oModels.notifications;
			aNotifications.getData().push(oData.data);
			aNotifications.setData(aNotifications.getData());

			this.oRouter.navTo("admin");
		}
	});
}, true);
