sap.ui.define([
		"../BaseController"
], function (BaseController) {
	
	return BaseController.extend("asc.admin.controller.app_keywords.ViewAppKeyword", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("viewappkeyword").attachPatternMatched(this._onKeywordMatched, this);
		},
		_onKeywordMatched: function (oEvent) {
			this._app_keyword = oEvent.getParameter("arguments").app_keyword || this._app_keyword || "0";
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this.getView().bindElement({
				path: "/" + this._app_keyword,
				model: "app_keywords"
			});
		},
		onFullScreenPress: function () {
			this.setLayout("EndColumnFullScreen");
			//this.oRouter.navTo("viewkeyword", {app_keyword: this._app_keyword, app: this._app});
		},
		onExitFullScreenPress: function () {
			this.setLayout("ThreeColumnsMidExpanded");
			//this.oRouter.navTo("viewkeyword", {keyword: this._app_keyword, app: this._app});
		},
		onClosePress: function () {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("viewapp", { app: this._app });
		}
	});
}, true);
