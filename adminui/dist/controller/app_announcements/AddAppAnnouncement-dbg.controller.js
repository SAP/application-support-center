sap.ui.define([
	"../BaseController"
], function (BaseController) {


	var oNewAnnouncement;

	return BaseController.extend("asc.admin.controller.app_announcements.AddAppAnnouncement", {
		onInit: function () {
			var that = this;
			this.oRouter = this.getOwnerComponent().getRouter();

			//Initialize empty model
			oNewAnnouncement = new sap.ui.model.json.JSONModel(("model/app_announcement.json"));
			this.getView().setModel(oNewAnnouncement, "app_announcement");

			this.oRouter.getRoute("addappannouncement").attachPatternMatched(this._onAnnouncementMatched, this);

			sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
				function (RTE, EditorType) {
					var oRichTextEditor = new RTE("idRichNewAnnouncementDescription", {
						editorType: EditorType.TinyMCE4,
						width: "90%",
						height: "300px",
						customToolbar: true,
						showGroupFont: false,
						showGroupLink: true,
						showGroupInsert: false,
						value: "{app_announcement>/description}",
						ready: function () {
							this.addButtonGroup("styleselect").addButtonGroup("table");
							this.addStyleClass("formattedTextPadding");
						}
					});

					that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
				});
		},
		_onAnnouncementMatched: function (oEvent) {
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this._appDetail = this.getView().getModel("apps").oData[this._app];
		},

		// UI //

		onCancelPress: function() {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("editapp", {app: this._app});
		},
		onSavePress: function (oEvent) {
			this.api.postNewAppAnnouncement(this._appDetail.app_id, oNewAnnouncement.getData())
				.done(this.onSaveAnnouncementDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onSaveAnnouncementDone: function(oData) {
			this.onToast("Success!");

				var aAppAnnouncement = this.getView().oPropagatedProperties.oModels.app_announcements;
				aAppAnnouncement.getData().push(oData.data);
				aAppAnnouncement.setData(aAppAnnouncement.getData());

				this.oRouter.navTo("editapp", { app: this._app });
		}
	});
}, true);
