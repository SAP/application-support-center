sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	'use strict';
	return BaseController.extend("asc.admin.controller.Container", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);

			this.onGetActiveUser();
			this.onGetApps();
			this.onGetContacts();
			this.onGetAllNotifications();
			this.onGetAllSettings();
		},

		onMenuPress: function (oEvent) {
			this.oRouter.navTo("dashboard");
		},

		onManageAppsPress: function (oEvent) {
			this.oRouter.navTo("applist");
		},
		onDashboardPress: function (oEvent) {
			this.oRouter.navTo("dashboard");
		},
		onAboutPress: function (oEvent) {
			this.oRouter.navTo("about");
		},
		onReportingPress: function (oEvent) {
			this.oRouter.navTo("reporting");
		},
		onAdminPress: function (oEvent) {
			this.oRouter.navTo("admin");
		},

		onBeforeRouteMatched: function (oEvent) {
			if (oEvent.getParameters().arguments.help) {
				this.setLayout("ThreeColumnsMidExpanded");
			} else if (oEvent.getParameters().arguments.app) {
				this.setLayout("TwoColumnsMidExpanded");
			}
		},

		onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");

			// Replace the URL with the new layout if a navigation arrow was used
			if (bIsNavigationArrow) {
				this.oRouter.navTo(this.currentRouteName, { layout: sLayout, app: this.currentApp });
			}
		},


		// Service Responses //

		onGetActiveUserDone: function (oData) {
			var oUserModel = new sap.ui.model.json.JSONModel(oData);
			oUserModel.setSizeLimit(1000);
			this.getOwnerComponent().setModel(oUserModel, "user");
			var sInitials = oUserModel.getData().firstname.charAt(0) + oUserModel.getData().lastname.charAt(0);
			this.getView().byId("idAvatarUser").setInitials(sInitials);

			/* SAP Specific Code */
			sap.git.usage.Reporting.setUser(this.getOwnerComponent(), oUserModel.getData().userId);
			sap.git.usage.Reporting.addEvent(this.getOwnerComponent(), "Load Admin Panel");
			/* SAP Specific Code */
		},

		onShowAvatarMenuPopover: function (oEvent) {
			var oButton = oEvent.getSource();
			this._oPopover = this.getView().byId("idAvatarMenuPopover");
			this._oPopover.openBy(oButton);
		},

		onShowAsc: function () {
			this.getOwnerComponent().loadASC();
		},

		onASCLogout: function () {
			window.location.href = "/do/logout";
		}

	});
}, true);
