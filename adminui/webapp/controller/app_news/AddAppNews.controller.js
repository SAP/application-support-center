sap.ui.define([
	"../BaseController"
], function (BaseController) {


	var oNewNews;

	return BaseController.extend("asc.admin.controller.app_news.AddAppNews", {
		onInit: function () {
			var that = this;
			this.oRouter = this.getOwnerComponent().getRouter();

			//Initialize empty model
			oNewNews = new sap.ui.model.json.JSONModel(("model/app_news.json"));
			this.getView().setModel(oNewNews, "app_news");

			this.oRouter.getRoute("addappnews").attachPatternMatched(this._onNewsMatched, this);

			sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
				function (RTE, EditorType) {
					var oRichTextEditor = new RTE("idRichNewNewsDescription", {
						editorType: EditorType.TinyMCE4,
						width: "90%",
						height: "300px",
						customToolbar: true,
						showGroupFont: false,
						showGroupLink: true,
						showGroupInsert: false,
						value: "{app_news>/description}",
						ready: function () {
							this.addButtonGroup("styleselect").addButtonGroup("table");
							this.addStyleClass("formattedTextPadding");
						}
					});

					that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
				});
		},
		_onNewsMatched: function (oEvent) {
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this._appDetail = this.getView().getModel("apps").oData[this._app];
		},

		// UI //

		onCancelPress: function() {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("editapp", {app: this._app});
		},
		onSavePress: function (oEvent) {
			this.api.postNewAppNews(this._appDetail.app_id, oNewNews.getData())
				.done(this.onSaveNewsDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onSaveNewsDone: function(oData) {
			this.onToast("Success!");

				var aAppNews = this.getView().oPropagatedProperties.oModels.app_news;
				aAppNews.getData().push(oData.data);
				aAppNews.setData(aAppNews.getData());

				this.oRouter.navTo("editapp", { app: this._app });
		}
	});
}, true);
