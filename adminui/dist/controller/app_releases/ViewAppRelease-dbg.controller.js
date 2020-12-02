sap.ui.define([
		"../BaseController"
], function (BaseController) {

	return BaseController.extend("asc.admin.controller.app_releases.ViewAppRelease", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("viewapprelease").attachPatternMatched(this._onReleaseMatched, this);
		},
		_onReleaseMatched: function (oEvent) {
			this._app_release = oEvent.getParameter("arguments").app_release || this._app_release || "0";
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this.getView().bindElement({
				path: "/" + this._app_release,
				model: "app_releases"
			});
		},
		onFullScreenPress: function () {
			this.setLayout("EndColumnFullScreen");
			//this.oRouter.navTo("viewrelease", {app_release: this._app_release, app: this._app});
		},
		onExitFullScreenPress: function () {
			this.setLayout("ThreeColumnsMidExpanded");
			//this.oRouter.navTo("viewrelease", {release: this._app_release, app: this._app});
		},
		onClosePress: function () {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("viewapp", { app: this._app });
		}
	});
}, true);
