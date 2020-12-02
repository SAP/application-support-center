sap.ui.define([
		"../BaseController"
], function (BaseController) {
	var oNewHelp;

	return BaseController.extend("asc.admin.controller.app_help.AddAppHelp", {
		onInit: function () {
			var that = this;
			this.oRouter = this.getOwnerComponent().getRouter();

			//Initialize empty model
			oNewHelp = new sap.ui.model.json.JSONModel(("model/app_help.json"));
			this.getView().setModel(oNewHelp, "app_help");

			this.oRouter.getRoute("addapphelp").attachPatternMatched(this._onHelpMatched, this);

			sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
				function (RTE, EditorType) {
					var oRichTextEditor = new RTE("idRichNewHelpDescription", {
						editorType: EditorType.TinyMCE4,
						width: "90%",
						height: "300px",
						customToolbar: true,
						showGroupFont: false,
						showGroupLink: true,
						showGroupInsert: false,
						value: "{app_help>/description}",
						ready: function () {
							this.addButtonGroup("styleselect").addButtonGroup("table");
							this.addStyleClass("formattedTextPadding");
						}
					});

					that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
				});
		},
		_onHelpMatched: function (oEvent) {
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this._appDetail = this.getView().getModel("apps").oData[this._app];
		},

		// UI //

		onCancelPress: function() {
			//TwoColumnsMidExpanded");
			this.oRouter.navTo("editapp", {app: this._app});
		},
		onSavePress: function (oEvent) {
			this.api.postNewAppHelp(this._appDetail.app_id, oNewHelp.getData())
				.done(this.onSaveHelpDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onSaveHelpDone: function(oData) {
			this.onToast("Success!");

				var aAppHelp = this.getView().oPropagatedProperties.oModels.app_help;
				aAppHelp.getData().push(oData.data);
				aAppHelp.setData(aAppHelp.getData());

				this.oRouter.navTo("editapp", { app: this._app });
		}
	});
}, true);
