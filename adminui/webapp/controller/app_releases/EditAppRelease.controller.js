sap.ui.define([
		"../BaseController"
], function (BaseController) {
	var oRichTextEditor;

	return BaseController.extend("asc.admin.controller.app_releases.EditAppRelease", {
		onInit: function () {
			var that = this;
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("editapprelease").attachPatternMatched(this._onReleaseMatched, this);

			sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
				function (RTE, EditorType) {
					oRichTextEditor = new RTE("idEditAppReleaseRichDescription", {
						editorType: EditorType.TinyMCE4,
						width: "90%",
						height: "300px",
						customToolbar: true,
						showGroupFont: false,
						showGroupLink: true,
						showGroupInsert: false,
						value: "",
						ready: function () {
							this.setValue(that._app_release_detail.description);
							this.addButtonGroup("styleselect").addButtonGroup("table");
							this.addStyleClass("formattedTextPadding");
						}
					});

					that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
				});
		},
		_onReleaseMatched: function (oEvent) {
			this._app_release = oEvent.getParameter("arguments").app_release || this._app_release || "0";
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this._appDetail = this.getView().getModel('apps').getProperty("/" + this._app);

			this.getView().setBusyIndicatorDelay(0);

			this.getView().bindElement({
				path: "/" + this._app_release,
				model: "app_releases"
			});
			if (this._app_release) {
				this._app_release_detail = this.getView().getModel("app_releases").oData[this._app_release];
			}
			if (oRichTextEditor) {
				oRichTextEditor.setValue(this._app_release_detail.description);
			}
		},

		// UI //

		onCancelPress: function () {
			//this.setLayout("TwoColumnsMidExpanded");
			this.oRouter.navTo("editapp", {app: this._app});
		},


		// Service Requests //

		onSavePress: function (oEvent) {
			this._app_release_detail.description = oRichTextEditor.getValue();

			this.api.putAppRelease(this._app_release_detail.app_id, this._app_release_detail.release_id, this._app_release_detail)
				.done(this.onEditReleaseDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		changeDate: function (oEvent) {
			this._app_release_detail.release_date = oEvent.getParameter("value");
		},

		// Service Callbacks //

		onEditReleaseDone: function (oData) {
			this.onToast("Success!");
			this.onGetAppReleases(this._appDetail.app_id);
			this.oRouter.navTo("editapp", {app: this._app});
		},


		// UI Jamf Dialog Functions //

		onAddJamf: function () {
			if (this._appDetail.bundle_id !== "" && this._appDetail.bundle_id !== null && this._appDetail.bundle_id !== 'null') {
				this.getView().byId("addJamfDialog").open();
				this.getView().byId("addJamfDialog").setBusyIndicatorDelay(10);
				this.onSelectJamfSystem();
			} else {
				this.onErrorMessage("A bundle ID is required");
			}
		},

		onSelectJamfSystem: function (oEvent) {
			this.getView().byId("addJamfDialog").setBusy(true);
			this.sJamfSystem = this.getView().byId("idSelectReleaseJamfSystem").getSelectedKey();
			this.api.postJamfAppinfo(this._appDetail.bundle_id, this.sJamfSystem)
					.done(this.onGetJamfAppInfo.bind(this))
					.fail(this.onGetJamfAppInfoFail.bind(this));
		},

		onAddJamfFileBeforeUpload: function(oEvent) {
			//Not working
			this.getView().byId("addJamfDialog").setBusy(true);
		},

		onAddJamfFilePress: function (oEvent) {
			var oFileUploader = this.byId("idFileUploaderAppIPA");
			var filename = oFileUploader.oFileUpload.files[0].name;
			if (filename) {
				this.getView().byId("idFileUploaderAppIPA").setButtonText(filename);
				this.getView().byId("idJamfFileUploadConfirmLabel").setVisible(true);
				this.getView().byId("idJamfFileUploadConfirmButton").setVisible(true);
			}
		},

		onAddJamfFileUploadPress: function (oEvent) {
			var that = this;
			this.getView().byId("addJamfDialog").setBusy(true);
			var oCurrentUser = this.getOwnerComponent().getModel("user");
			var sUser = oCurrentUser.getData().firstname + ' ' + oCurrentUser.getData().lastname;
			//Hack to get the busy spinner showing
			setTimeout( function() {
				var oFileUploader = that.byId("idFileUploaderAppIPA");
				var form = new FormData();
				form.append("file", oFileUploader.oFileUpload.files[0]);

				var jamf_id = that.getView().byId("idTextReleaseJamfAppID").getText();
				var version = that.getView().byId("idInputAppVersion").getValue();
				var app_id = that._appDetail.app_id;
				var release_id = that._app_release_detail.release_id;
				var bundle_id = that.getView().byId("idTextReleaseBundleID").getText();

				that.api.postJamfAppIPA(jamf_id, form, app_id, version, that.sJamfSystem, release_id, bundle_id, sUser)
					.done(that.onPostJamfAppIPA.bind(that))
					.fail(that.onGetJamfAppInfoFail.bind(that));
			}, 500);
		},

		onDialogCloseButton: function (oEvent) {
			this.clearForm();
			this.getView().byId("addJamfDialog").close();
		},

		clearForm: function() {
			this.getView().byId("addJamfDialog").setBusy(false);	
			this.getView().byId("idTextReleaseJamfVersion").setText("");
			this.getView().byId("idTextReleaseJamfFilename").setText("");
			this.getView().byId("idTextReleaseBundleID").setText("");
			this.getView().byId("idTextReleaseJamfAppID").setText("");
		},


		onGetJamfAppInfo: function(oData) {
			this.getView().byId("addJamfDialog").setBusy(false);
			if (oData) {
				this.getView().byId("idTextReleaseJamfVersion").setText(oData.mobile_device_application.general.version);
				this.getView().byId("idTextReleaseJamfFilename").setText(oData.mobile_device_application.general.ipa.name);
				this.getView().byId("idTextReleaseBundleID").setText(oData.mobile_device_application.general.bundle_id);
				this.getView().byId("idTextReleaseJamfAppID").setText(oData.mobile_device_application.general.id);
			}
		},

		onGetJamfAppInfoFail: function (oData) {
			try {
				this.getView().byId("addJamfDialog").setBusy(false);
				var response = JSON.parse(oData.responseText);
				this.onToast("Server Response: " + response.error);
			} catch (err) {
				this.onToast("IPA File not uploaded, please try again");
			}
		},

		onPostJamfAppIPA: function(oData) {
			this.getView().byId("addJamfDialog").setBusy(false);
			this.onToast("IPA File Uploaded");
			var that = this;
			//Lets add a small delay before downloading the info again:
			setTimeout(function() {
				that.onSelectJamfSystem();
			}, 5000);
			this.getView().byId("addJamfDialog").close();
			if (this.getView().byId("idSelectReleaseJamfSystem").getSelectedKey() === 'prod' && oData.expiration_date) {
				this._appDetail.expiration_date = oData.expiration_date;
			}
		}
	});
}, true);
