sap.ui.define([
		"../BaseController"
], function (BaseController) {
	return BaseController.extend("asc.admin.controller.app_news.ViewAppNews", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("viewappnews").attachPatternMatched(this._onnewsMatched, this);
		},
		_onnewsMatched: function (oEvent) {
			this._app_news = oEvent.getParameter("arguments").app_news || this._app_news || "0";
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this.getView().bindElement({
				path: "/" + this._app_news,
				model: "app_news"
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
