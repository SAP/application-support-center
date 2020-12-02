/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"../pages/app/AppList",
	"../pages/app/ViewApp",
	"../pages/app/EditApp",
	"../pages/app_help/AddAppHelp",
	"../pages/app_help/EditAppHelp",
	"../pages/app_help/ViewAppHelp",
	"../pages/Common"
], function (opaTest) {
	"use strict";

	QUnit.module("App Help");
	var helpName = "Help " + Math.random().toString(36).substring(2, 7);

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

	opaTest("Pressing add help should show the new help page", function (Given, When, Then) {
		When.onTheEditAppPage.iPress(When.onTheEditAppPage.getPageName(), "idButtonAddHelp");
		Then.onTheAddAppHelpPage
			.iShouldSeeTheAddScreen()
			.iShouldSeeThePageTitle();
	});

	opaTest("Creating a new record", function (Given, When, Then) {
		When.onTheAddAppHelpPage
			.iEnterText(When.onTheAddAppHelpPage.getPageName(), "idInputTitle", helpName)
			.iEnterText(When.onTheAddAppHelpPage.getPageName(), "idInputSortOrder", "1")
			.iPressSave(When.onTheAddAppHelpPage.getPageName());
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();

		When.onTheEditAppPage.iWaitUntilTheTableIsLoaded(When.onTheEditAppPage.getPageName(), "idTableHelp");
		Then.onTheEditAppPage.theTableHasEntries(When.onTheEditAppPage.getPageName(), "idTableHelp");

	});

	opaTest("I can view the new record", function (Given, When, Then) {
		When.onTheEditAppPage.iPressCancel(When.onTheEditAppPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();

		When.onTheViewAppPage.iPressOnTheObjectAtPositionInTable(When.onTheViewAppPage.getPageName(), "idTableHelp", 0);
		Then.onTheViewAppHelpPage.iShouldSeeTheHelpInfoScreen();
		Then.onTheViewAppHelpPage.iShouldSeeTheText(When.onTheViewAppHelpPage.getPageName(), "idTextTitle", helpName);
	});

	opaTest("I can close the view help screen", function (Given, When, Then) {
		When.onTheViewAppHelpPage.iPressClose(When.onTheViewAppHelpPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();
	});

	opaTest("I can edit the new record", function (Given, When, Then) {
		When.onTheViewAppPage.iPressOnEditApplication();
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();

		When.onTheEditAppPage.iPressOnTheObjectAtPositionInTable(When.onTheEditAppPage.getPageName(), "idTableHelp", 0);
		Then.onTheEditAppHelpPage.iShouldSeeTheEditScreen();

		var newValue = "2";
		When.onTheEditAppHelpPage.iEnterText(When.onTheEditAppHelpPage.getPageName(), "idInputSortOrder", newValue);
		When.onTheEditAppHelpPage.iPressSave(When.onTheEditAppHelpPage.getPageName());

		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();
		Then.onTheEditAppPage.iPressCancel(When.onTheEditAppPage.getPageName());

		When.onTheViewAppPage.iPressOnTheObjectAtPositionInTable(When.onTheViewAppPage.getPageName(), "idTableHelp", 0);
		Then.onTheViewAppHelpPage.iShouldSeeTheHelpInfoScreen();
		Then.onTheViewAppHelpPage.iShouldSeeTheText(When.onTheViewAppHelpPage.getPageName(), "idTextSortOrder", newValue);
	});

	opaTest("Pressing the Close View Application should show the application table", function (Given, When, Then) {
		When.onTheViewAppPage.iPress(When.onTheViewAppPage.getPageName(), "idButtonCloseApp");
		Then.onTheAppListPage.iShouldSeeTheControl(When.onTheAppListPage.getPageName(), "idTableApps");
	});

});