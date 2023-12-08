sap.ui.define([
	"../BaseController"
], function (BaseController) {
	var oRichTextEditor;

	return BaseController.extend("asc.admin.controller.app_announcements.EditAppAnnouncement", {
		onInit: function () {
			var that = this;
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("editappannouncement").attachPatternMatched(this._onAnnouncementMatched, this);

			sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
				function (RTE, EditorType) {
					oRichTextEditor = new RTE("idEditAppAnnouncementRichDescription", {
						editorType: EditorType.TinyMCE4,
						width: "90%",
						height: "300px",
						customToolbar: true,
						showGroupFont: false,
						showGroupLink: true,
						showGroupInsert: false,
						value: "",
						ready: function () {
							this.setValue(that._app_announcement_detail.description);
							this.addButtonGroup("styleselect").addButtonGroup("table");
							this.addStyleClass("formattedTextPadding");
						}
					});

					that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
				});
		},
		_onAnnouncementMatched: function (oEvent) {
			this._app_announcement = oEvent.getParameter("arguments").app_announcement || this._app_announcement || "0";
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this.getView().bindElement({
				path: "/" + this._app_announcement,
				model: "app_announcements"
			});
			this._app_announcement_detail = this.getView().getModel("app_announcements").oData[this._app_announcement];
			if (oRichTextEditor !== undefined) {
				oRichTextEditor.setValue(this._app_announcement_detail.description);
			}
		},

		// UI //

		onCancelPress: function() {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("editapp", {app: this._app});
		},

		// Service Requests //

		onSavePress: function (oEvent) {
			this._app_announcement_detail.description = oRichTextEditor.getValue();
			this.api.putAppAnnouncement(this._app_announcement_detail.app_id, this._app_announcement_detail.announcement_id, this._app_announcement_detail)
				.done(this.onEditAnnouncementDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onEditAnnouncementDone: function(oData) {
			this.onToast("Success!");
			this.oRouter.navTo("editapp", { app: this._app });
		}
	});
}, true);
