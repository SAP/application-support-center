sap.ui.define([
		"../BaseController"
], function (BaseController) {
	var oNewKeyword;

	return BaseController.extend("asc.admin.controller.app_keywords.AddAppKeyword", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();

			//Initialize empty model
			oNewKeyword = new sap.ui.model.json.JSONModel(("model/app_keyword.json"));
			this.getView().setModel(oNewKeyword, "app_keyword");

			this.oRouter.getRoute("addappkeyword").attachPatternMatched(this._onKeywordMatched, this);
		},
		_onKeywordMatched: function (oEvent) {
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this._appDetail = this.getView().getModel("apps").oData[this._app];
		},

		// UI //

		onCancelPress: function() {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("editapp", {app: this._app});
		},
		onSavePress: function (oEvent) {
			this.getView().getModel("app_keyword").getData().keyword = this.getView().byId("idSelectKeyword").getSelectedKey();
			this.api.postNewAppKeyword(this._appDetail.app_id, this.getView().getModel("app_keyword").getData())
				.done(this.onSaveKeywordDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onSaveKeywordDone: function(oData) {
			this.onToast("Success!");

				var aAppKeyword = this.getView().oPropagatedProperties.oModels.app_keywords;
				aAppKeyword.getData().push(oData.data);
				aAppKeyword.setData(aAppKeyword.getData());

				this.oRouter.navTo("editapp", {app: this._app});
		}
	});
}, true);
