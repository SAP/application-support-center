sap.ui.define([
		"../BaseController"
], function (BaseController) {

	return BaseController.extend("asc.admin.controller.app_help.ViewAppHelp", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("viewapphelp").attachPatternMatched(this._onHelpMatched, this);
		},
		_onHelpMatched: function (oEvent) {
			this._app_help = oEvent.getParameter("arguments").app_help || this._app_help || "0";
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this.getView().bindElement({
				path: "/" + this._app_help,
				model: "app_help"
			});
		},
		onFullScreenPress: function () {
			this.setLayout("EndColumnFullScreen");
			//this.oRouter.navTo("viewhelp", {app_help: this._app_help, app: this._app});
		},
		onExitFullScreenPress: function () {
			this.setLayout("ThreeColumnsMidExpanded");
			//this.oRouter.navTo("viewhelp", {help: this._app_help, app: this._app});
		},
		onClosePress: function () {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("viewapp", { app: this._app });
		}
	});
}, true);
