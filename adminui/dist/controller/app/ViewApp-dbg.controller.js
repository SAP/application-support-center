sap.ui.define([
	"../BaseController"
], function (BaseController) {
	return BaseController.extend("asc.admin.controller.app.ViewApp", {

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("viewapp").attachPatternMatched(this._onAppMatched, this);
		},
		_onAppMatched: function (oEvent) {
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this.getView().bindElement({
				path: "/" + this._app,
				model: "apps"
			});

			this._appDetail = this.getView().getModel('apps').getProperty("/" + this._app);

			if (this._appDetail) {
				this.onGetAppHelp(this._appDetail.app_id);
				this.onGetAppReleases(this._appDetail.app_id);
				this.onGetAppKeywords(this._appDetail.app_id);
				this.onGetAppAnnouncements(this._appDetail.app_id);
				this.onGetAppContacts(this._appDetail.app_id, true);

				if (this._appDetail.usage_tracking_id) {
					this.onGetAppUsageData(this._appDetail.app_id, this._appDetail.usage_tracking_id);
				}

				if (this.getOwnerComponent().getModel("selected_app") == undefined) {
					//Create and set the selected_app model
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(this._appDetail);
					this.getOwnerComponent().setModel(oModel, "selected_app");
				}
			}

			this.getView().byId("idLinkAuthToken").setText("Show");
			this.getView().byId("idLinkAuthTokenRefresh").setVisible(false);
			this.setAppIcon();
		},


		// UI //

		setAppIcon: function () {
			// We add the date/time as a query param to force a reload the image
			try {
				this.getView().byId("idAvatarAppIconBig").setSrc("/serverresources/app_icons/" + this._appDetail.app_id + ".png?" + new Date().getTime());
				this.getView().byId("idAvatarAppIconSmall").setSrc("/serverresources/app_icons/" + this._appDetail.app_id + ".png?" + new Date().getTime());
			} catch (err) {
				console.log("Unable to set icon");
			}
		},

		onShowUsageDataPopover: function (oEvent) {
			if (this._appDetail.usage_tracking_id) {
				var oButton = oEvent.getSource();
				this._oPopover = this.getView().byId("idUsagePopover");
				this._oPopover.openBy(oButton);
			}
		},

		onShowASCPreviewPopover: function (oEvent) {
			var oButton = oEvent.getSource();
			this._oPopover = this.getView().byId("idASCPreviewPopover");
			this._oPopover.openBy(oButton);
		},

		onUI5PopupPress: function (oEvent) {
			try {
				jQuery.sap.registerModulePath("sap.asc", "/asc_ui5_lib");
				jQuery.sap.require("sap.asc");
				sap.asc.setHelpServer("");
				sap.asc.setAppId(this._appDetail.app_id);
				sap.asc.setAppVersion("");
				sap.asc.setAppIconUrl("./resources/images/icon_default.svg");
				sap.asc.setAccessToken("fd6c38f9");
				sap.asc.setFeedbackId("1b4f1291-e818-4d2d-892b-d8073b065a50");
				sap.asc.setSupportEmail("DL_55A6CA597BCF842464000002@global.corp.sap");

				sap.asc.init();
				sap.asc.open();
			} catch (err) {
				console.log(err);
				jQuery.sap.log.error("Could not load ASC");
			}
		},

		onShowToken: function (oEvent) {
			this.api.getAppToken(this._appDetail.app_id)
				.done(this.onGetAppTokensDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		onRefreshToken: function (oEvent) {
			var that = this;
			sap.m.MessageBox.confirm("Are you sure you want to refresh the token? This will remove the existing token and is IRREVERSABLE!", {
				title: "Please confirm",
				initialFocus: sap.m.MessageBox.Action.CANCEL,
				onClose: function (sButton) {
					if (sButton === "OK") {
						that.api.getAppTokenRefresh(that._appDetail.app_id)
							.done(that.onGetAppTokensDone.bind(that))
							.fail(that.onHTTPFail.bind(that));
					}
				}
			});
		},

		onContactItemPress: function (oEvent) {
			//this.setLayout("ThreeColumnsMidExpanded");
			var iContactPath = oEvent.getSource().getBindingContext("app_contacts").getPath();
			var iContactID = iContactPath.split("/").slice(-1).pop();
			this.oRouter.navTo("viewappcontact", { app: this._app, app_contact: iContactID });
		},
		onKeywordItemPress: function (oEvent) {
			//this.setLayout("ThreeColumnsMidExpanded");
			var iKeywordPath = oEvent.getSource().getBindingContext("app_keywords").getPath();
			var iKeywordID = iKeywordPath.split("/").slice(-1).pop();
			this.oRouter.navTo("viewappkeyword", { app: this._app, app_keyword: iKeywordID });
		},
		onHelpItemPress: function (oEvent) {
			//this.setLayout("ThreeColumnsMidExpanded");
			var iHelpPath = oEvent.getSource().getBindingContext("app_help").getPath();
			var iHelpID = iHelpPath.split("/").slice(-1).pop();

			this.oRouter.navTo("viewapphelp", { app: this._app, app_help: iHelpID });
		},
		onReleaseItemPress: function (oEvent) {
			//this.setLayout("ThreeColumnsMidExpanded");
			var iPath = oEvent.getSource().getBindingContext("app_releases").getPath();
			var sID = iPath.split("/").slice(-1).pop();
			this.oRouter.navTo("viewapprelease", { app: this._app, app_release: sID });
		},
		onAnnouncementsItemPress: function (oEvent) {
			//this.setLayout("ThreeColumnsMidExpanded");
			var iPath = oEvent.getSource().getBindingContext("app_announcements").getPath();
			var sID = iPath.split("/").slice(-1).pop();
			this.oRouter.navTo("viewappannouncement", { app: this._app, app_announcement: sID });
		},

		onOpenFeedbackServicePress: function (oEvent) {
			window.open("https://sap-it-cloud-sapitcf-feedback-feedback-approuter.cfapps.eu10.hana.ondemand.com/cp.portal/site?sap-ushell-config=standalone#feedback-Display&/topic/" + this._appDetail.feedback_service_id, "_blank");
		},

		onOpenGitURL: function (oEvent) {
			window.open(this._appDetail.git_url, "_blank");
		},

		onOpenUsageTrackingPress: function (oEvent) {
			window.open("https://fiorilaunchpad.sap.com/sites#MU-Reporting", "_blank");
		},

		onFullScreenPress: function () {
			this.setLayout("MidColumnFullScreen");
		},
		onExitFullScreenPress: function () {
			this.setLayout("TwoColumnsMidExpanded");
		},
		onClosePress: function () {
			this.setLayout("OneColumn");
		},
		onEditAppPress: function () {
			this.oRouter.navTo("editapp", { app: this._app });
		},
		onDeleteAppPress: function () {
			var that = this;
			sap.m.MessageBox.confirm("Are you sure you want to delete the app? This will delete ALL associated Help, Release Notes and Announcements and is IRREVERSABLE!", {
				title: "Please confirm",
				initialFocus: sap.m.MessageBox.Action.CANCEL,
				onClose: function (sButton) {
					if (sButton === "OK") {
						that.deleteApp.bind(that);
					}
				}
			});
		},

		onAppIconSelect: function (oEvent) {
			var oFileUploader = this.byId("idFileUploaderAppIcon");
			var form = new FormData();
			form.append("file", oFileUploader.oFileUpload.files[0]);

			this.api.postAppIcon(this._appDetail.app_id, form)
				.done(this.onPostAppIcon.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		clearForm: function () {
			this.getView().byId("viewJamfInfoDialog").setBusy(false);
			this.getView().byId("idTextJamfAppName").setText("");

			this.getView().byId("idTextJamfAppID").setText("");
			this.getView().byId("idTextBundleID").setText("");

			this.getView().byId("idTextJamfCategory").setText("");
			this.getView().byId("idTextDescription").setText("");
			this.getView().byId("idTextJamfVersion").setText("");
			this.getView().byId("idTextJamfFilename").setText("");

			this.getView().byId("idAvatarJamfAppIcon").setSrc("");
			this.getView().byId("idMessageJamfNameMismatch").setVisible(false);
			this.getView().byId("idMessageJamfError").setVisible(true);
		},

		onDialogCloseButton: function (oEvent) {
			this.clearForm();
			this.getView().byId("viewJamfInfoDialog").close();
		},

		// Service Requests //

		onGetJamfInfoForApp: function () {
			if (this._appDetail.bundle_id !== "" && this._appDetail.bundle_id !== null && this._appDetail.bundle_id !== 'null') {
				this.getView().byId("viewJamfInfoDialog").open();
				this.onSelectJamfSystem();
			} else {
				this.onErrorMessage("A bundle ID is required");
			}
		},

		onSelectJamfSystem: function (oEvent) {
			this.getView().byId("viewJamfInfoDialog").setBusy(true);
			this.sJamfSystem = this.getView().byId("idSelectJamfSystem").getSelectedKey();
			this.api.postJamfAppinfo(this._appDetail.bundle_id, this.sJamfSystem)
				.done(this.onGetJamfAppInfo.bind(this))
				.fail(this.onGetJamfAppInfoFail.bind(this));
		},

		deleteApp: function (oEvent) {
			if (oEvent == "OK") {
				this.api.deleteApp(this._appDetail.app_id)
					.done(this.onRemoveAppDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
			}
		},

		onUpdateJamfAppNamePress: function (oEvent) {
			var that = this;
			this.api.putJamfAppName(this._appDetail.bundle_id, { "app_name": this._appDetail.app_name }, this.sJamfSystem)
				.done(function () {
					that.onToast("App Name in Jamf updated");
				})
				.fail(this.onGetJamfAppInfoFail.bind(this));
		},

		// Service Callbacks //

		onGetJamfAppInfo: function (oData) {
			this.getView().byId("viewJamfInfoDialog").setBusy(false);
			if (oData) {
				//this.getView().byId("idTitleHeader1").setText("Operation Details");
				this.getView().byId("idTextJamfAppName").setText(oData.mobile_device_application.general.name);

				this.getView().byId("idTextJamfAppID").setText(oData.mobile_device_application.general.id);
				this.getView().byId("idTextBundleID").setText(oData.mobile_device_application.general.bundle_id);

				this.getView().byId("idTextJamfCategory").setText(oData.mobile_device_application.general.category.name);
				this.getView().byId("idTextDescription").setText(oData.mobile_device_application.general.description);
				this.getView().byId("idTextJamfVersion").setText(oData.mobile_device_application.general.version);
				this.getView().byId("idTextJamfFilename").setText(oData.mobile_device_application.general.ipa.name);

				this.getView().byId("idAvatarJamfAppIcon").setSrc(oData.mobile_device_application.general.icon.uri);
				this.getView().byId("idMessageJamfError").setVisible(false);

				if (oData.mobile_device_application.general.name !== this._appDetail.app_name) {
					//this.getView().byId("idMessageJamfNameMismatch").setVisible(true);
				} else {
					this.getView().byId("idMessageJamfNameMismatch").setVisible(false);
				}
			}
		},

		onGetJamfAppInfoFail: function () {
			this.clearForm();
		},

		onRemoveAppDone: function () {
			this.onToast("App Deleted");
			var aAppList = this.getView().oPropagatedProperties.oModels.apps.getData();
			aAppList.splice(this._app, 1);
			this.getView().oPropagatedProperties.oModels.apps.setData(aAppList);
		},

		onGetAppTokensDone: function (oAppToken) {
			this.getView().byId("idLinkAuthToken").setVisible(true);
			this.getView().byId("idLinkAuthTokenRefresh").setVisible(true);
			if (oAppToken.length > 0) {
				this.getView().byId("idLinkAuthToken").setText(oAppToken[0].token);
			} else {
				this.getView().byId("idLinkAuthToken").setText("Not found");
			}
		}
	});
}, true);
