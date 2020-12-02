sap.ui.define([
		"../BaseController"
], function (BaseController) {
	var oRichTextEditor;

	return BaseController.extend("asc.admin.controller.app_help.EditAppHelp", {
		onInit: function () {
			var that = this;
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("editapphelp").attachPatternMatched(this._onHelpMatched, this);

			sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
				function (RTE, EditorType) {
					oRichTextEditor = new RTE("idEditAppHelpRichDescription", {
						editorType: EditorType.TinyMCE4,
						width: "90%",
						height: "300px",
						customToolbar: true,
						showGroupFont: false,
						showGroupLink: true,
						showGroupInsert: false,
						value: "",
						ready: function () {
							this.setValue(that._app_help_detail.description);
							this.addButtonGroup("styleselect").addButtonGroup("table");
							this.addStyleClass("formattedTextPadding");
						}
					});

					that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
				});
		},
		_onHelpMatched: function (oEvent) {
			this._app_help = oEvent.getParameter("arguments").app_help || this._app_help || "0";
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this.getView().bindElement({
				path: "/" + this._app_help,
				model: "app_help"
			});
			this._app_help_detail = this.getView().getModel("app_help").oData[this._app_help];
			if (oRichTextEditor !== undefined) {
				oRichTextEditor.setValue(this._app_help_detail.description);
			}
		},

		// UI //

		onCancelPress: function() {
			this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("editapp", {app: this._app});
		},

		// Service Requests //

		onSavePress: function (oEvent) {
			this._app_help_detail.description = oRichTextEditor.getValue();
			this.api.putAppHelp(this._app_help_detail.app_id, this._app_help_detail.help_id, this._app_help_detail)
				.done(this.onEditHelpDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onEditHelpDone: function(oData) {
			this.onToast("Success!");
			this.oRouter.navTo("editapp", { app: this._app });
		}

	});
}, true);
