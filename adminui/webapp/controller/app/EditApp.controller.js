sap.ui.define([
	"../BaseController"
], function (BaseController) {
	return BaseController.extend("asc.admin.controller.app.EditApp", {

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("editapp").attachPatternMatched(this._onAppMatched, this);
		},

		_onAppMatched: function (oEvent) {
			this._app = oEvent.getParameter("arguments").app || this._app || "0";
			this.getView().bindElement({
				path: "/" + this._app,
				model: "apps"
			});

			this._appDetail = this.getView().getModel('apps').getProperty("/" + this._app);

			// Add a new property for the radio button
			this._appDetail.feedback_no_end_date = this._appDetail.feedback_end_date == null ? 0 : 1;

			if (this._appDetail.go_live && this._appDetail.go_live !== "") {
				this.byId("idDatePickerGoLive").setDateValue(new Date(this._appDetail.go_live));
			}
			if (this._appDetail.retired && this._appDetail.retired !== "") {
				this.byId("idDatePickerRetired").setDateValue(new Date(this._appDetail.retired));
			}

			if (this._appDetail.expiration_date && this._appDetail.expiration_date !== "") {
				this.byId("idDatePickerProfileExpiration").setDateValue(new Date(this._appDetail.expiration_date));
			}

			if (this._appDetail && this.getOwnerComponent().getModel("selected_app") == undefined) {
				this.onGetAppHelp(this._appDetail.app_id);
				this.onGetAppReleases(this._appDetail.app_id);
				this.onGetAppKeywords(this._appDetail.app_id);
				this.onGetAppAnnouncements(this._appDetail.app_id);
				this.onGetAppContacts(this._appDetail.app_id, false);

				//Create and set the selected_app model
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(this._appDetail);
				this.getOwnerComponent().setModel(oModel, "selected_app");
			}

			this.setAppIcon();
		},

		// UI //

		onSetFeedbackEndDate: function (oEvent) {
			if (oEvent.getParameter("selectedIndex") == 0) {
				this.getView().byId("idDatePickerFeedbackEndDate").setProperty("value", "");
			}
		},

		onCancelPress: function () {
			//this.getView().getModel('apps').updateBindings(true);
			//this.getView().getModel('apps').getProperty("/" + this._app);
			//this.getView().getModel('apps').getBinding().resetChanges();

			this.oRouter.navTo("viewapp", { app: this._app });
		},
		onAddHelpPress: function (oEvent) {
			this.oRouter.navTo("addapphelp", { app: this._app });
		},
		onAddContactPress: function (oEvent) {
			this.oRouter.navTo("addappcontact", { app: this._app });
		},
		onAddKeywordPress: function (oEvent) {
			this.oRouter.navTo("addappkeyword", { app: this._app });
		},
		onAddReleasePress: function (oEvent) {
			this.oRouter.navTo("addapprelease", { app: this._app });
		},
		onAddAnnouncementPress: function (oEvent) {
			this.oRouter.navTo("addappannouncement", { app: this._app });
		},


		onEditHelpPress: function (oEvent) {
			var iHelpPath = oEvent.getSource().getBindingContext("app_help").getPath();
			var sHelpID = iHelpPath.split("/").slice(-1).pop();

			this.oRouter.navTo("editapphelp", { app: this._app, app_help: sHelpID });
		},
		onEditContactPress: function (oEvent) {
			var iContactPath = oEvent.getSource().getBindingContext("app_contacts").getPath();
			var sContactID = iContactPath.split("/").slice(-1).pop();

			this.oRouter.navTo("editappcontact", { app: this._app, app_contact: sContactID });
		},
		onEditKeywordPress: function (oEvent) {
			var iKeywordPath = oEvent.getSource().getBindingContext("app_keywords").getPath();
			var sKeywordID = iKeywordPath.split("/").slice(-1).pop();

			this.oRouter.navTo("editappkeyword", { app: this._app, app_keyword: sKeywordID });
		},
		onEditReleasePress: function (oEvent) {
			//this.setLayout("ThreeColumnsMidExpanded");
			var iPath = oEvent.getSource().getBindingContext("app_releases").getPath();
			var sID = iPath.split("/").slice(-1).pop();
			this.oRouter.navTo("editapprelease", { app: this._app, app_release: sID });
		},
		onEditAnnouncementPress: function (oEvent) {
			var iPath = oEvent.getSource().getBindingContext("app_announcements").getPath();
			var sID = iPath.split("/").slice(-1).pop();
			this.oRouter.navTo("editappannouncement", { app: this._app, app_announcement: sID });
		},

		onAvatarAppIconPress: function (oEvent) {
			$("#__xmlview2--idFileUploaderAppIcon-fu").trigger("click");
		},

		setAppIcon: function () {
			// We add the date/time as a query param to force a reload the image
			try {
				this.getView().byId("idAvatarAppIconBig").setSrc("/serverresources/app_icons/" + this._appDetail.app_id + ".png?" + new Date().getTime());
				this.getView().byId("idAvatarAppIconSmall").setSrc("/serverresources/app_icons/" + this._appDetail.app_id + ".png?" + new Date().getTime());
			} catch (err) {
				console.log("Unable to set icon");
			}
		},

		onAppIconSelect: function (oEvent) {
			var oFileUploader = this.byId("idFileUploaderAppIcon");
			var form = new FormData();
			form.append("file", oFileUploader.oFileUpload.files[0]);

			this.api.postAppIcon(this._appDetail.app_id, form)
				.done(this.onPostAppIcon.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		onAvatarJamfSyncPress: function (oEvent) {
			var that = this;
			this.api.putAppIconSync(this._appDetail.app_id, this._appDetail.bundle_id)
				.done(function () {
					that.setAppIcon();
				})
				.fail(this.onHTTPFail.bind(this));
		},

		// Service Requests //

		onPostAppIcon: function (oData) {
			this.setAppIcon();
		},

		onSavePress: function (oEvent) {
			if (this._appDetail.expiration_date == "") {
				this._appDetail.expiration_date = null;
			}
			if (this._appDetail.feedback_status === null || this._appDetail.feedback_status == 'Inactive' || this._appDetail.feedback_status == 0) {
				this._appDetail.feedback_status = 0;
			} else {
				this._appDetail.feedback_status = 1;
			}

			this.api.putApp(this._appDetail.app_id, this._appDetail)
				.done(this.onEditAppDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},
		onRemoveHelpPress: function (oEvent) {
			var oTable = this.getView().byId("idTableHelp");
			var aContexts = oTable.getSelectedContexts();
			var aHelpItems = this.getView().oPropagatedProperties.oModels.app_help.getData();

			for (var i = aContexts.length - 1; i >= 0; i--) {
				var oHelp = aContexts[i].getObject();
				var iPath = aContexts[i].getPath().replace("/", "");
				aHelpItems.splice(iPath, 1);
				this.getView().oPropagatedProperties.oModels.app_help.setData(aHelpItems);

				this.api.deleteAppHelp(oHelp.app_id, oHelp.help_id)
					.done(this.onRemoveHelpDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
			}
			oTable.removeSelections();
		},
		onRemoveContactPress: function (oEvent) {
			var oTable = this.getView().byId("idTableContacts");
			var aContexts = oTable.getSelectedContexts();
			var aContactItems = this.getView().oPropagatedProperties.oModels.app_contacts.getData();

			for (var i = aContexts.length - 1; i >= 0; i--) {
				var oContact = aContexts[i].getObject();
				var iPath = aContexts[i].getPath().replace("/", "");
				aContactItems.splice(iPath, 1);

				this.getView().oPropagatedProperties.oModels.app_contacts.setData(aContactItems);

				this.api.deleteAppContact(oContact.app_id, oContact.contact_id)
					.done(this.onRemoveContactDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
			}
			oTable.removeSelections();
		},
		onRemoveKeywordPress: function (oEvent) {
			var oTable = this.getView().byId("idTableKeywords");
			var aContexts = oTable.getSelectedContexts();
			var aKeywordItems = this.getView().oPropagatedProperties.oModels.app_keywords.getData();

			for (var i = aContexts.length - 1; i >= 0; i--) {
				var oKeyword = aContexts[i].getObject();
				var iPath = aContexts[i].getPath().replace("/", "");
				aKeywordItems.splice(iPath, 1);

				this.getView().oPropagatedProperties.oModels.app_keywords.setData(aKeywordItems);

				this.api.deleteAppKeyword(oKeyword.app_id, oKeyword.keyword_id)
					.done(this.onRemoveKeywordDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
			}
			oTable.removeSelections();
		},
		onRemoveReleasePress: function (oEvent) {
			var oTable = this.getView().byId("idTableReleases");
			var aContexts = oTable.getSelectedContexts();
			var aReleaseItems = this.getView().oPropagatedProperties.oModels.app_releases.getData();

			for (var i = aContexts.length - 1; i >= 0; i--) {
				var oRelease = aContexts[i].getObject();
				var iPath = aContexts[i].getPath().replace("/", "");
				aReleaseItems.splice(iPath, 1);

				this.getView().oPropagatedProperties.oModels.app_releases.setData(aReleaseItems);

				this.api.deleteAppRelease(oRelease.app_id, oRelease.release_id)
					.done(this.onRemoveReleaseDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
			}
			oTable.removeSelections();
		},
		onRemoveAnnouncementPress: function (oEvent) {
			var oTable = this.getView().byId("idTableAnnouncements");
			var aContexts = oTable.getSelectedContexts();
			var aAnnouncementItems = this.getView().oPropagatedProperties.oModels.app_announcements.getData();

			for (var i = aContexts.length - 1; i >= 0; i--) {
				var oAnnouncement = aContexts[i].getObject();
				var iPath = aContexts[i].getPath().replace("/", "");
				aAnnouncementItems.splice(iPath, 1);

				this.getView().oPropagatedProperties.oModels.app_announcements.setData(aAnnouncementItems);

				this.api.deleteAppAnnouncement(oAnnouncement.app_id, oAnnouncement.announcement_id)
					.done(this.onRemoveAnnouncementDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
			}
			oTable.removeSelections();
		},

		// Service Callbacks //

		onEditAppDone: function (oData) {
			this.onToast("Success!");
			this.oRouter.navTo("viewapp", { app: this._app });
		},

		onRemoveHelpDone: function (oData) {
			this.onToast("Success!");
		},


		onRemoveContactDone: function (oData) {
			this.onToast("Success!");
		},

		onRemoveKeywordDone: function (oData) {
			this.onToast("Success!");
		},

		onRemoveAnnouncementDone: function (oData) {
			this.onToast("Success!");
		},

		onRemoveReleaseDone: function (oData) {
			this.onToast("Success!");
		}
	});
}, true);
