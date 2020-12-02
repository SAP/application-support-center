sap.ui.define([
	"../BaseController"
], function (BaseController) {

	var notification;
	var notificationId;

	return BaseController.extend("asc.admin.controller.admin.EditAdminNotification", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("editadminnotification").attachPatternMatched(this._onNotificationMatched, this);
		},

		_onNotificationMatched: function (oEvent) {
			this.notificationId = oEvent.getParameter("arguments").notification_id || this.notification_id || "0";
			this.getView().bindElement({
				path: "/" + this.notificationId,
				model: "notifications"
			});
			this.notification = this.getView().getModel("notifications").oData[this.notificationId];
		},

		// UI //

		onCancelPress: function () {
			this.oRouter.navTo("admin");
		},

		onSavePress: function (oEvent) {
			this.api.putNotification(this.notification.notification_id, this.notification)
				.done(this.onSaveNotificationDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onSaveNotificationDone: function (oData) {
			this.onToast("Success!");
			this.oRouter.navTo("admin");
		}
	});
}, true);
