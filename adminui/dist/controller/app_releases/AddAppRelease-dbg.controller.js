sap.ui.define([
		"../BaseController"
], function (BaseController) {
	var oNewRelease;

	return BaseController.extend("asc.admin.controller.app_releases.AddAppRelease", {
		onInit: function () {
			var that = this;
			this.oRouter = this.getOwnerComponent().getRouter();

			//Initialize empty model
			oNewRelease = new sap.ui.model.json.JSONModel(("model/app_release.json"));
			this.getView().setModel(oNewRelease, "app_release");

			sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
				function (RTE, EditorType) {
					var oRichTextEditor = new RTE("idRichNewAppReleaseDescription", {
						editorType: EditorType.TinyMCE4,
						width: "90%",
						height: "300px",
						customToolbar: true,
						showGroupFont: false,
						showGroupLink: true,
						showGroupInsert: false,
						value: "{app_release>/description}",
						ready: function () {
							this.addButtonGroup("styleselect").addButtonGroup("table");
							this.addStyleClass("formattedTextPadding");
						}
					});

					that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
				});

			this.oRouter.getRoute("addapprelease").attachPatternMatched(this._onReleaseMatched, this);
		},
		_onReleaseMatched: function (oEvent) {
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this._appDetail = this.getView().getModel("apps").oData[this._app];
		},

		// UI //

		onCancelPress: function() {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("editapp", {app: this._app});
		},
		onSavePress: function (oEvent) {
			//this.getView().getModel("app_release").getData().release_date
			this.api.postNewAppRelease(this._appDetail.app_id, this.getView().getModel("app_release").getData())
				.done(this.onSaveReleaseDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Callbacks //

		onSaveReleaseDone: function(oData) {
			this.onToast("Success!");

				var aAppRelease = this.getView().oPropagatedProperties.oModels.app_releases;
				aAppRelease.getData().splice(0, 0, oData.data);
				aAppRelease.setData(aAppRelease.getData());

				if (this.getOwnerComponent().getModel("selected_app").getData().technology === 'iOS') {
					this.oRouter.navTo("editapprelease", { app: this._app, app_release: 0 });
				} else {
					this.oRouter.navTo("editapp", {app: this._app});
				}
		}
	});
}, true);
