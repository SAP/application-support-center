/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"../pages/app/AppList",
	"../pages/app/ViewApp",
	"../pages/app/EditApp",
	"../pages/app_keywords/AddAppKeyword",
	"../pages/app_keywords/EditAppKeyword",
	"../pages/app_keywords/ViewAppKeyword",
	"../pages/Common"
], function (opaTest) {
	"use strict";

	QUnit.module("App Keyword");

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

	opaTest("Pressing add keyword should show the new keyword page", function (Given, When, Then) {
		When.onTheEditAppPage.iPress(When.onTheEditAppPage.getPageName(), "idButtonAddKeyword");
		Then.onTheAddAppKeywordPage
			.iShouldSeeTheAddScreen()
			.iShouldSeeThePageTitle();
	});

	opaTest("Creating a new record", function (Given, When, Then) {
		When.onTheAddAppKeywordPage
			//.iSelectAKey(When.onTheAddAppKeywordPage.getPageName(), "idSelectKeyword", "iOS 14 Tested")
			.iEnterText(When.onTheAddAppKeywordPage.getPageName(), "idInputDescription", "v1.0.2")
			.iPressSave(When.onTheAddAppKeywordPage.getPageName());
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();

		When.onTheEditAppPage.iWaitUntilTheTableIsLoaded(When.onTheEditAppPage.getPageName(), "idTableKeywords");
		Then.onTheEditAppPage.theTableHasEntries(When.onTheEditAppPage.getPageName(), "idTableKeywords");
	});

	opaTest("I can view the new record", function (Given, When, Then) {
		When.onTheEditAppPage.iPressCancel(When.onTheEditAppPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();

		When.onTheViewAppPage.iPressOnTheObjectAtPositionInTable(When.onTheViewAppPage.getPageName(), "idTableKeywords", 0);
		Then.onTheViewAppKeywordPage.iShouldSeeTheKeywordInfoScreen();
		Then.onTheViewAppKeywordPage.iShouldSeeTheText(When.onTheViewAppKeywordPage.getPageName(), "idTextDescription", "v1.0.2");
	});

	opaTest("I can close the view keyword screen", function (Given, When, Then) {
		When.onTheViewAppKeywordPage.iPressClose(When.onTheViewAppKeywordPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();
	});

	opaTest("I can edit the new record", function (Given, When, Then) {
		When.onTheViewAppPage.iPressOnEditApplication();
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();

		When.onTheEditAppPage.iPressOnTheObjectAtPositionInTable(When.onTheEditAppPage.getPageName(), "idTableKeywords", 0);
		Then.onTheEditAppKeywordPage.iShouldSeeTheEditScreen();

		var newValue = "v1.0.3";
		When.onTheEditAppKeywordPage.iEnterText(When.onTheEditAppKeywordPage.getPageName(), "idInputDescription", newValue);
		When.onTheEditAppKeywordPage.iPressSave(When.onTheEditAppKeywordPage.getPageName());
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();

		When.onTheEditAppPage.iPressCancel(When.onTheEditAppPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();

		When.onTheViewAppPage.iPressOnTheObjectAtPositionInTable(When.onTheViewAppPage.getPageName(), "idTableKeywords", 0);
		Then.onTheViewAppKeywordPage.iShouldSeeTheKeywordInfoScreen();
		Then.onTheViewAppKeywordPage.iShouldSeeTheText(When.onTheViewAppKeywordPage.getPageName(), "idTextDescription", newValue);
	});

	opaTest("Pressing the Close View Application should show the application table", function (Given, When, Then) {
		When.onTheViewAppPage.iPress(When.onTheViewAppPage.getPageName(), "idButtonCloseApp");
		Then.onTheAppListPage.iShouldSeeTheControl(When.onTheAppListPage.getPageName(), "idTableApps");
	});
});