sap.ui.define([
		"../BaseController"
], function (BaseController) {
	return BaseController.extend("asc.admin.controller.app_keywords.EditAppKeyword", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("editappkeyword").attachPatternMatched(this._onKeywordMatched, this);
		},
		_onKeywordMatched: function (oEvent) {
			this._app_keyword = oEvent.getParameter("arguments").app_keyword || this._app_keyword || "0";
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this.getView().bindElement({
				path: "/" + this._app_keyword,
				model: "app_keywords"
			});
			this._app_keyword_detail = this.getView().getModel("app_keywords").oData[this._app_keyword];
		},

		// UI //

		onCancelPress: function() {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("editapp", {app: this._app});
		},

		// Service Requests //

		onSavePress: function (oEvent) {
			this.api.putAppKeyword(this._app_keyword_detail.app_id, this._app_keyword_detail.keyword_id, this._app_keyword_detail)
				.done(this.onEditKeywordDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onEditKeywordDone: function(oData) {
			this.onToast("Success!");
			this.oRouter.navTo("editapp", { app: this._app });
		}

	});
}, true);
