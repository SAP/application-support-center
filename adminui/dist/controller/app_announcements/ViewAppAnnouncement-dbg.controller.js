sap.ui.define([
		"../BaseController"
], function (BaseController) {
	return BaseController.extend("asc.admin.controller.app_announcements.ViewAppAnnouncement", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("viewappannouncement").attachPatternMatched(this._onAnnouncementMatched, this);
		},
		_onAnnouncementMatched: function (oEvent) {
			this._app_announcement = oEvent.getParameter("arguments").app_announcement || this._app_announcement || "0";
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this.getView().bindElement({
				path: "/" + this._app_announcement,
				model: "app_announcements"
			});
		},
		onFullScreenPress: function () {
			this.setLayout("EndColumnFullScreen");
		},
		onExitFullScreenPress: function () {
			this.setLayout("ThreeColumnsMidExpanded");
		},
		onClosePress: function () {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("viewapp", { app: this._app });
		}
	});
}, true);
