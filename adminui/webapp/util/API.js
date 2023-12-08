sap.ui.define([
	"asc/admin/util/BaseAPI"
], function (BaseAPI) {
	"use strict";

	// Get relevant server URL based on deployment
	var serverUrl = "";

	return BaseAPI.extend("asc.admin.util.API", {

		getActiveUser: function() {
			return $.ajax({
				url: serverUrl + "/api/v1/users/me",
				headers: {
					'X-CSRF-Token': 'Fetch'
				},
				contentType: "application/json",
				type: "GET"
			});
		},


		// Dashboard

		getAllStats: function() {
			return $.ajax({
				url: serverUrl + "/api/v1/dashboard",
				contentType: "application/json",
				type: "GET"
			});
		},

		// Reports

		getReportData: function(sReportId, sUserId) {
			return $.ajax({
				url: serverUrl + "/api/v1/reports?report_id=" + sReportId + "&externalId=" + sUserId,
				contentType: "application/json",
				type: "GET"
			});
		},

		//Apps

		getApps: function() {
			return $.ajax({
				url: serverUrl + "/api/v1/apps",
				contentType: "application/json",
				type: "GET"
			});
		},

		getApp: function(iAppId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId,
				contentType: "application/json",
				type: "GET"
			});
		},

		getAppUsageData: function(iAppId, sTrackingId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/usagedata?tracking_id=" + sTrackingId,
				contentType: "application/json",
				type: "GET"
			});
		},

		getMyApps: function(sExternalId) {
			return $.ajax({
				url: serverUrl + "/api/v1/myapps?externalId=" + sExternalId,
				contentType: "application/json",
				type: "GET"
			});
		},

		getAppToken: function(iAppId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/token",
				contentType: "application/json",
				type: "GET"
			});
		},

		getAppTokenRefresh: function(iAppId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/token/refresh",
				contentType: "application/json",
				type: "GET"
			});
		},

		postNewApp: function (oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps",
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "POST"
			});
		},

		postAppIcon: function (iAppId, formData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/appicon",
				data: formData,
				contentType: false,
				processData: false,
				type: "POST",
				mimeType: "multipart/form-data"
			});
		},

		putApp: function(iAppId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId,
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "PUT"
			});
		},

		putAppIconSync: function (iAppId, sBundleId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/syncicon?bundle_id=" + sBundleId,
				contentType: "application/json",
				type: "PUT"
			});
		},

		deleteApp: function(iAppId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId,
				data: "",
				contentType: "application/json",
				type: "DELETE"
			});
		},

		// Contacts

		postNewContact: function (oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/contacts",
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "POST"
			});
		},

		getContacts: function() {
			return $.ajax({
				url: serverUrl + "/api/v1/contacts",
				contentType: "application/json",
				type: "GET"
			});
		},

		putContact: function(iContactId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/contacts/" + iContactId,
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "PUT"
			});
		},

		deleteContact: function(iContactId) {
			return $.ajax({
				url: serverUrl + "/api/v1/contacts/" + iContactId,
				data: "",
				contentType: "application/json",
				type: "DELETE"
			});
		},

		getDownloadContacts: function(sRole) {
			return $.ajax({
				url: serverUrl + "/api/v1/download/contacts?role=" + sRole,
				contentType: "application/json",
				type: "GET"
			});
		},

		getDownloadAppContacts: function(sRole) {
			return $.ajax({
				url: serverUrl + "/api/v1/download/app/contacts",
				contentType: "application/json",
				type: "GET"
			});
		},

		getContactApps: function(iContactId) {
			return $.ajax({
				url: serverUrl + "/api/v1/contacts/" + iContactId + "/apps",
				contentType: "application/json",
				type: "GET"
			});
		},


		// App Help

		postNewAppHelp: function (iAppId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/help",
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "POST"
			});
		},

		getAppHelp: function(iAppId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/help",
				contentType: "application/json",
				type: "GET"
			});
		},

		putAppHelp: function(iAppId, iHelpId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/help/" + iHelpId,
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "PUT"
			});
		},

		deleteAppHelp: function(iAppId, iHelpId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/help/" + iHelpId,
				data: "",
				contentType: "application/json",
				type: "DELETE"
			});
		},

		// App Contacts

		postNewAppContact: function (iAppId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/contacts",
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "POST"
			});
		},

		getAppContacts: function(iAppId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/contacts",
				contentType: "application/json",
				type: "GET"
			});
		},

		putAppContact: function(iAppId, iContactId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/contacts/" + iContactId,
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "PUT"
			});
		},

		deleteAppContact: function(iAppId, iContactId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/contacts/" + iContactId,
				data: "",
				contentType: "application/json",
				type: "DELETE"
			});
		},


		// App Keywords

		postNewAppKeyword: function (iAppId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/keywords",
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "POST"
			});
		},

		getAppKeywords: function(iAppId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/keywords",
				contentType: "application/json",
				type: "GET"
			});
		},

		putAppKeyword: function(iAppId, iKeywordId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/keywords/" + iKeywordId,
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "PUT"
			});
		},

		deleteAppKeyword: function(iAppId, iKeywordId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/keywords/" + iKeywordId,
				data: "",
				contentType: "application/json",
				type: "DELETE"
			});
		},



		// App Releases

		postNewAppRelease: function (iAppId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/releases",
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "POST"
			});
		},

		getAppReleases: function(iAppId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/releases",
				contentType: "application/json",
				type: "GET"
			});
		},

		putAppRelease: function(iAppId, iReleaseId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/releases/" + iReleaseId,
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "PUT"
			});
		},

		deleteAppRelease: function(iAppId, iReleaseId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/releases/" + iReleaseId,
				data: "",
				contentType: "application/json",
				type: "DELETE"
			});
		},




		// App Annoucements

		postNewAppAnnouncement: function (iAppId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/announcements",
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "POST"
			});
		},

		getAppAnnouncements: function(iAppId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/announcements",
				contentType: "application/json",
				type: "GET"
			});
		},

		putAppAnnouncement: function(iAppId, iAnnouncementId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/announcements/" + iAnnouncementId,
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "PUT"
			});
		},

		deleteAppAnnouncement: function(iAppId, iAnnouncementId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/announcements/" + iAnnouncementId,
				data: "",
				contentType: "application/json",
				type: "DELETE"
			});
		},


		// App News

		postNewAppNews: function (iAppId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/news",
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "POST"
			});
		},

		getAppNews: function(iAppId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/news",
				contentType: "application/json",
				type: "GET"
			});
		},

		putAppNews: function(iAppId, iNewsId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/news/" + iNewsId,
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "PUT"
			});
		},

		deleteAppNews: function(iAppId, iNewsId) {
			return $.ajax({
				url: serverUrl + "/api/v1/apps/" + iAppId + "/news/" + iNewsId,
				data: "",
				contentType: "application/json",
				type: "DELETE"
			});
		},


		// Jamf Integration
		postJamfAppinfo: function(sBundleId, system) {
			return $.ajax({
				url: serverUrl + "/api/v1/jamf/" + sBundleId + "/info?system=" + system,
				contentType: "application/json",
				type: "POST"
			});
		},

		postJamfAppIPA: function (sJamfAppId, formData, appId, version, system, release_id, bundle_id, sUser) {
			return $.ajax({
				url: serverUrl + "/api/v1/jamf/" + sJamfAppId + "/ipa?app_id=" + appId + "&version=" + version + "&system=" + system + "&release_id=" + release_id + "&bundle_id=" + bundle_id + "&user=" + sUser,
				data: formData,
				contentType: false,
				processData: false,
				type: "POST",
				async: false,
				mimeType: "multipart/form-data"
			});
		},

		putJamfAppName: function (sBundleId, oData, system) {
			return $.ajax({
				url: serverUrl + "/api/v1/jamf/" + sBundleId + "/appname?system=" + system,
				contentType: "application/json",
				data: JSON.stringify(oData),
				type: "PUT"
			});
		},

		// Settings
		getAllSettings: function() {
			return $.ajax({
				url: serverUrl + "/api/v1/settings",
				contentType: "application/json",
				type: "GET"
			});
		},
		postNewSetting: function (oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/settings",
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "POST"
			});
		},
		putSetting: function (iSettingId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/settings/" + iSettingId,
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "PUT"
			});
		},
		deleteSetting: function(iSettingId) {
			return $.ajax({
				url: serverUrl + "/api/v1/settings/" + iSettingId,
				data: "",
				contentType: "application/json",
				type: "DELETE"
			});
		},

		// Notifications
		getAllNotifications: function() {
			return $.ajax({
				url: serverUrl + "/api/v1/notifications",
				contentType: "application/json",
				type: "GET"
			});
		},
		postNewNotification: function (oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/notifications",
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "POST"
			});
		},
		putNotification: function (iNotificationId, oData) {
			return $.ajax({
				url: serverUrl + "/api/v1/notifications/" + iNotificationId,
				data: JSON.stringify(oData),
				contentType: "application/json",
				type: "PUT"
			});
		},
		deleteNotification: function(iNotificationId) {
			return $.ajax({
				url: serverUrl + "/api/v1/notifications/" + iNotificationId,
				data: "",
				contentType: "application/json",
				type: "DELETE"
			});
		}
    });
});