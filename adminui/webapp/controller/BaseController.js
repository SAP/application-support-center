sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"asc/admin/util/formatter",
	"asc/admin/util/API",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, MessageToast, formatter, API, JSONModel) {
	// Init api
	API = new API();

	return Controller.extend("asc.admin.controller.BaseController", {
		formatter: formatter,
		toast: MessageToast.show.bind(MessageToast),
		msgBox: MessageBox,
		_busyDialog: null,
		api: API,

		// UI //

		busy: function () {
			sap.ui.core.BusyIndicator.show(0);
		},

		unbusy: function () {
			sap.ui.core.BusyIndicator.hide(0);
		},
		onErrorMessage: function (sText) {
			MessageBox.error(sText);
		},
		onToast: function (sText) {
			MessageToast.show(sText);
		},
		setLayout: function(sLayout) {
			var oLayoutModel = this.getOwnerComponent().getModel("layout");
			oLayoutModel.setProperty("/layout", sLayout);
		},

		checkIfUserIsAllowedToEdit: function () {
			//Loop through contacts model and check if usersId is on it OR if user is admin
			//called from the base controller.
			var oContactsModel = this.getOwnerComponent().getModel("app_contacts");
			var oCurrentUser = this.getOwnerComponent().getModel("user");
			var bIsAppOwner = false;

			if (oContactsModel && oContactsModel.getData().length > 0) {
				var aContacts = oContactsModel.getData();
				aContacts.forEach(function (item, index) {
					if (item.external_id.toLowerCase() === oCurrentUser.getData().userId.toLowerCase()) {
						bIsAppOwner = true;
					}
				});
			}

			if (this.getView().getModel("user").getData().role === 'admin' || bIsAppOwner) {
				this.getView().byId("idButtonEditApp").setVisible(true);
				this.getView().byId("idButtonDeleteApp").setVisible(true);
				this.getView().byId("idLabelAuthToken").setVisible(true);
				this.getView().byId("idLinkAuthToken").setVisible(true);
			} else {
				this.getView().byId("idButtonEditApp").setVisible(false);
				this.getView().byId("idButtonDeleteApp").setVisible(false);
				this.getView().byId("idLabelAuthToken").setVisible(false);
				this.getView().byId("idLinkAuthToken").setVisible(false);
			}
		},

		// HTTP Helper

		onHTTPFail: function(jqXHR) {
			MessageToast.show("Server error processing this request.");
		},

		// Helper Functions //

		addRecordToModelAndRefresh: function(sModel, oNewRecord) {
			var oExistingModel = this.getView().getModel(sModel);
			oExistingModel.getData().push(oNewRecord);
			oExistingModel.setProperty("/" + sModel, oExistingModel);
		},

		onValidate: function () {
			var viewId = this.getView().getId();
			var bError = false;

			jQuery('input[required=required]').each(function () {
				// control has wrapper with no id, therefore we need to remove the "-inner" end
				var oControl = sap.ui.getCore().byId(this.id.replace(/-inner/g, ''));
				// CAUTION: as OpenUI5 keeps all loaded views in DOM, ensure that the controls found belong to the current view 
				if (oControl.getId().startsWith(viewId) && (oControl instanceof sap.m.Input || oControl instanceof sap.m.DatePicker)) {
					var sVal = oControl.getValue();
					if (!sVal) {
						oControl.setValueState(sap.ui.core.ValueState.Error);
						oControl.openValueStateMessage();
						bError = true;
					} else {
						oControl.setValueState(sap.ui.core.ValueState.None);
						oControl.closeValueStateMessage();
					}
				}
			});

			if (!bError) {
				this.onSavePress();
			}
		},

		validateControl: function (oEvent) {
			var oControl = sap.ui.getCore().byId(oEvent.getSource().getId());
			var val = oEvent.getParameter("value");
			if (!val) {
				oControl.setValueState(sap.ui.core.ValueState.Error);
				oControl.openValueStateMessage();
			} else {
				oControl.setValueState(sap.ui.core.ValueState.None);
				oControl.closeValueStateMessage();
			}
		},

		jsonToCSV: function (json, filename) {
			const items = json;
			const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
			const header = Object.keys(items[0]);
			let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
			csv.unshift(header.join(','));
			csv = csv.join('\r\n');
			var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
			if (navigator.msSaveBlob) { // IE 10+
				navigator.msSaveBlob(blob, filename);
			} else {
				var link = document.createElement("a");
				if (link.download !== undefined) { // feature detection
					// Browsers that support HTML5 download attribute
					var url = URL.createObjectURL(blob);
					link.setAttribute("href", url);
					link.setAttribute("download", filename);
					link.style.visibility = "hidden";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}
			}
		},


		// Shared App Functions

		onGetActiveUser: function() {
			this.api.getActiveUser()
				.done(this.onGetActiveUserDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		onGetApps: function() {
			this.api.getApps()
				.done(this.onGetAppsDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		onGetContacts: function () {
			this.api.getContacts()
				.done(this.onGetContactsDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		onGetAllSettings: function () {
			this.api.getAllSettings()
				.done(this.onGetSettingsDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		onGetAllNotifications: function () {
			this.api.getAllNotifications()
				.done(this.onGetNotificationsDone.bind(this))
				.fail(this.onHTTPFail.bind(this));
		},

		// App Detail Functions

		onGetAppUsageData: function (app_id, tracking_id) {
			this.api.getAppUsageData(app_id, tracking_id)
					.done(this.onGetAppUsageDataDone.bind(this));
		},

		onGetAppHelp: function (app_id) {
			this.api.getAppHelp(app_id)
					.done(this.onGetHelpDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
		},

		onGetAppContacts: function (app_id, bCheckAccess) {
			var that = this;
			this.api.getAppContacts(app_id)
					.done(function (oAppContactsModel) {
						var oModel = new JSONModel(oAppContactsModel);
						that.getOwnerComponent().setModel(oModel, "app_contacts");
						if (bCheckAccess) {
							that.checkIfUserIsAllowedToEdit();
						}
					})
					.fail(this.onHTTPFail.bind(this));
		},

		onGetAppKeywords: function (app_id) {
			this.api.getAppKeywords(app_id)
					.done(this.onGetAppKeywordsDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
		},

		onGetAppAnnouncements: function (app_id) {
			this.api.getAppAnnouncements(app_id)
					.done(this.onGetAppAnnouncementsDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
		},

		onGetAppReleases: function (app_id) {
			this.api.getAppReleases(app_id)
					.done(this.onGetAppReleasesDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
		},

		onGetAppNews: function (app_id) {
			this.api.getAppNews(app_id)
					.done(this.onGetAppNewsDone.bind(this))
					.fail(this.onHTTPFail.bind(this));
		},

		// Service Responses

		onGetAppsDone: function(oData) {
			var oAppsModel = new JSONModel(oData);
			oAppsModel.setSizeLimit(1000);
			this.getOwnerComponent().setModel(oAppsModel, "apps");
		},

		onGetContactsDone: function(oData) {
			var oContactsModel = new JSONModel(oData);
			oContactsModel.setSizeLimit(1000);
			this.getOwnerComponent().setModel(oContactsModel, "contacts");
		},

		onGetSettingsDone: function(aData) {
			var app_defaults = {};

			aData.forEach(function (item, index) {
				if (!app_defaults[item.setting_name]) {
					app_defaults[item.setting_name] = [];
				}
				app_defaults[item.setting_name].push({ "key": item.setting_key, "value": item.setting_value });
			});

			// Add feedback days to options
			app_defaults["app_feedback_repeat_on"] = [];
			for (var i = 1; i <= 28; i++) {
				app_defaults["app_feedback_repeat_on"].push({ "key": i, "value": i});
			}

			var oOptionsModel = new JSONModel(app_defaults);
			this.getOwnerComponent().setModel(oOptionsModel, "options");
		},

		onGetNotificationsDone: function(oData) {
			var oNotificationsModel = new JSONModel(oData);
			oNotificationsModel.setSizeLimit(1000);
			this.getOwnerComponent().setModel(oNotificationsModel, "notifications");
		},

		onGetHelpDone: function (oHelpModel) {
			var oModel = new JSONModel(oHelpModel);
			this.getOwnerComponent().setModel(oModel, "app_help");
		},

		onGetAppUsageDataDone: function(oData) {
			var oAppUsageModel = new JSONModel(oData);
			this.getOwnerComponent().setModel(oAppUsageModel, "app_usage");
		},

		onGetAppKeywordsDone: function (oAppKeywordsModel) {
			var oModel = new JSONModel(oAppKeywordsModel);
			this.getOwnerComponent().setModel(oModel, "app_keywords");
		},

		onGetAppAnnouncementsDone: function (oAppAnnouncementsModel) {
			var oModel = new JSONModel(oAppAnnouncementsModel);
			this.getOwnerComponent().setModel(oModel, "app_announcements");
		},

		onGetAppNewsDone: function (oAppNewsModel) {
			var oModel = new JSONModel(oAppNewsModel);
			this.getOwnerComponent().setModel(oModel, "app_news");
		},

		onGetAppReleasesDone: function (oAppReleasesModel) {
			var oModel = new JSONModel(oAppReleasesModel);
			this.getOwnerComponent().setModel(oModel, "app_releases");
		}
	});

});