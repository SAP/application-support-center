/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"../pages/app/AppList",
	"../pages/app/ViewApp",
	"../pages/app/EditApp",
	"../pages/app_releases/AddAppRelease",
	"../pages/app_releases/EditAppRelease",
	"../pages/app_releases/ViewAppRelease",
	"../pages/Common"
], function (opaTest) {
	"use strict";

	QUnit.module("App Release");
	var releaseName = "Release " + Math.random().toString(36).substring(2, 7);

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

	opaTest("Pressing add release should show the new release page", function (Given, When, Then) {
		When.onTheEditAppPage.iPress(When.onTheEditAppPage.getPageName(), "idButtonAddRelease");
		Then.onTheAddAppReleasePage
			.iShouldSeeTheAddScreen()
			.iShouldSeeThePageTitle();
	});

	opaTest("Creating a new record", function (Given, When, Then) {
		When.onTheAddAppReleasePage
			.iEnterText(When.onTheAddAppReleasePage.getPageName(), "idInputAppVersion", releaseName)
			.iEnterText(When.onTheAddAppReleasePage.getPageName(), "idDatePicker", "Jun 10, 2020")
			//.iEnterText(When.onTheAddAppReleasePage.getPageName(), "idInputSortOrder", "1")
			.iPressSave(When.onTheAddAppReleasePage.getPageName());
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();

		When.onTheEditAppPage.iWaitUntilTheTableIsLoaded(When.onTheEditAppPage.getPageName(), "idTableReleases");
		Then.onTheEditAppPage.theTableHasEntries(When.onTheEditAppPage.getPageName(), "idTableReleases");

	});

	opaTest("I can view the new record", function (Given, When, Then) {
		When.onTheEditAppPage.iPressCancel(When.onTheEditAppPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();

		When.onTheViewAppPage.iPressOnTheObjectAtPositionInTable(When.onTheViewAppPage.getPageName(), "idTableReleases", 0);
		Then.onTheViewAppReleasePage.iShouldSeeTheReleaseInfoScreen();
		Then.onTheViewAppReleasePage.iShouldSeeTheText(When.onTheViewAppReleasePage.getPageName(), "idTextVersion", releaseName);
	});

	opaTest("I can close the view release screen", function (Given, When, Then) {
		When.onTheViewAppReleasePage.iPressClose(When.onTheViewAppReleasePage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();
	});

	opaTest("I can edit the new record", function (Given, When, Then) {
		When.onTheViewAppPage.iPressOnEditApplication();
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();

		When.onTheEditAppPage.iPressOnTheObjectAtPositionInTable(When.onTheEditAppPage.getPageName(), "idTableReleases", 0);
		Then.onTheEditAppReleasePage.iShouldSeeTheEditScreen();

		var newValue = "v1.0.3";
		When.onTheEditAppReleasePage.iEnterText(When.onTheEditAppReleasePage.getPageName(), "idInputAppVersion", newValue);
		When.onTheEditAppReleasePage.iPressSave(When.onTheEditAppReleasePage.getPageName());
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();

		When.onTheEditAppPage.iPressCancel(When.onTheEditAppPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();

		When.onTheViewAppPage.iPressOnTheObjectAtPositionInTable(When.onTheViewAppPage.getPageName(), "idTableReleases", 0);
		Then.onTheViewAppReleasePage.iShouldSeeTheReleaseInfoScreen();
		Then.onTheViewAppReleasePage.iShouldSeeTheText(When.onTheViewAppReleasePage.getPageName(), "idTextVersion", newValue);
	});

	opaTest("Pressing the Close View Application should show the application table", function (Given, When, Then) {
		When.onTheViewAppPage.iPress(When.onTheViewAppPage.getPageName(), "idButtonCloseApp");
		Then.onTheAppListPage.iShouldSeeTheControl(When.onTheAppListPage.getPageName(), "idTableApps");
	});

});