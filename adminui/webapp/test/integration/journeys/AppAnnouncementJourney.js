/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"../pages/app/AppList",
	"../pages/app/ViewApp",
	"../pages/app/EditApp",
	"../pages/app_announcements/AddAppAnnouncement",
	"../pages/app_announcements/EditAppAnnouncement",
	"../pages/app_announcements/ViewAppAnnouncement",
	"../pages/Common"
], function (opaTest) {
	"use strict";

	QUnit.module("App Announcement");
	var announcementName = "Announcement " + Math.random().toString(36).substring(2, 7);

	opaTest("Select a app", function (Given, When, Then) {
		When.onTheAppListPage.iClearTheSearch();
		When.onTheAppListPage.iSearchFor(When.onTheAppListPage.getAppName());
		When.onTheAppListPage.iPressOnTheObjectAtPositionInTable(When.onTheAppListPage.getPageName(), "idTableApps", 0);
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();
	});

	opaTest("Pressing edit app I should see the edit form", function (Given, When, Then) {
		When.onTheViewAppPage.iPressOnEditApplication();
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();
	});

	opaTest("Pressing add announcement should show the new announcement page", function (Given, When, Then) {
		When.onTheEditAppPage.iPress(When.onTheEditAppPage.getPageName(), "idButtonAddAnnouncement");
		Then.onTheAddAppAnnouncementPage
			.iShouldSeeTheAddScreen()
			.iShouldSeeThePageTitle();
	});

	opaTest("Creating a new record", function (Given, When, Then) {
		When.onTheAddAppAnnouncementPage
			.iEnterText(When.onTheAddAppAnnouncementPage.getPageName(), "idInputTitle", announcementName)
			.iEnterText(When.onTheAddAppAnnouncementPage.getPageName(), "idInputSortOrder", "1")
			.iPressSave(When.onTheAddAppAnnouncementPage.getPageName());
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();

		When.onTheEditAppPage.iWaitUntilTheTableIsLoaded(When.onTheEditAppPage.getPageName(), "idTableAnnouncements");
		Then.onTheEditAppPage.theTableHasEntries(When.onTheEditAppPage.getPageName(), "idTableAnnouncements");

	});

	opaTest("I can view the new record", function (Given, When, Then) {
		When.onTheEditAppPage.iPressCancel(When.onTheEditAppPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();

		When.onTheViewAppPage.iPressOnTheObjectAtPositionInTable(When.onTheViewAppPage.getPageName(), "idTableAnnouncements", 0);
		Then.onTheViewAppAnnouncementPage.iShouldSeeTheAnnouncementInfoScreen();
		Then.onTheViewAppAnnouncementPage.iShouldSeeTheText(When.onTheViewAppAnnouncementPage.getPageName(), "idTextTitle", announcementName);
	});

	opaTest("I can close the view announcement screen", function (Given, When, Then) {
		When.onTheViewAppAnnouncementPage.iPressClose(When.onTheViewAppAnnouncementPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();
	});


	opaTest("I can edit the new record", function (Given, When, Then) {
		When.onTheViewAppPage.iPressOnEditApplication();
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();

		When.onTheEditAppPage.iPressOnTheObjectAtPositionInTable(When.onTheEditAppPage.getPageName(), "idTableAnnouncements", 0);
		Then.onTheEditAppAnnouncementPage.iShouldSeeTheEditScreen();

		var newValue = "2";
		When.onTheEditAppAnnouncementPage.iEnterText(When.onTheEditAppAnnouncementPage.getPageName(), "idInputSortOrder", newValue);
		When.onTheEditAppAnnouncementPage.iPressSave(When.onTheEditAppAnnouncementPage.getPageName());

		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();
		Then.onTheEditAppPage.iPressCancel(When.onTheEditAppPage.getPageName());

		When.onTheViewAppPage.iPressOnTheObjectAtPositionInTable(When.onTheViewAppPage.getPageName(), "idTableAnnouncements", 0);
		Then.onTheViewAppAnnouncementPage.iShouldSeeTheAnnouncementInfoScreen();
		Then.onTheViewAppAnnouncementPage.iShouldSeeTheText(When.onTheViewAppAnnouncementPage.getPageName(), "idTextSortOrder", newValue);
	});

	opaTest("Pressing the Close View Application should show the application table", function (Given, When, Then) {
		When.onTheViewAppPage.iPress(When.onTheViewAppPage.getPageName(), "idButtonCloseApp");
		Then.onTheAppListPage.iShouldSeeTheControl(When.onTheAppListPage.getPageName(), "idTableApps");
	});

});