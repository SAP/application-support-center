/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"../pages/app/AppList",
	"../pages/app/ViewApp",
	"../pages/app/EditApp",
	"../pages/app_contacts/AddAppContact",
	"../pages/app_contacts/EditAppContact",
	"../pages/app_contacts/ViewAppContact",
	"../pages/Common"
], function (opaTest) {
	"use strict";

	QUnit.module("App Contact");

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

	opaTest("Pressing add contact should show the new contact page", function (Given, When, Then) {
		When.onTheEditAppPage.iPress(When.onTheEditAppPage.getPageName(), "idButtonAddContact");
		Then.onTheAddAppContactPage
			.iShouldSeeTheAddScreen()
			.iShouldSeeThePageTitle();
	});

	opaTest("Creating a new record", function (Given, When, Then) {

		When.onTheAddAppContactPage.iEnterSuggestionText(When.onTheAddAppContactPage.getPageName(), "idUser", "Randy");

		When.onTheAddAppContactPage.iPressSave(When.onTheAddAppContactPage.getPageName());
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();

		When.onTheEditAppPage.iWaitUntilTheTableIsLoaded(When.onTheEditAppPage.getPageName(), "idTableContacts");
		Then.onTheEditAppPage.theTableHasEntries(When.onTheEditAppPage.getPageName(), "idTableContacts");

	});

	opaTest("I can view the new record", function (Given, When, Then) {
		When.onTheEditAppPage.iPressCancel(When.onTheEditAppPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();

		//When.onTheViewAppPage.iPressOnTheObjectAtPositionInTable(When.onTheViewAppPage.getPageName(), "idTableContacts", 0);
		//Then.onTheViewAppContactPage.iShouldSeeTheContactInfoScreen();
		//Then.onTheViewAppContactPage.iShouldSeeTheText(When.onTheViewAppContactPage.getPageName(), "idTextFirstname", "Randy");
	});

	opaTest("I can close the view contact screen", function (Given, When, Then) {
		//When.onTheViewAppContactPage.iPressClose(When.onTheViewAppContactPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();
	});

	opaTest("Pressing the Close View Application should show the application table", function (Given, When, Then) {
		When.onTheViewAppPage.iPress(When.onTheViewAppPage.getPageName(), "idButtonCloseApp");
		Then.onTheAppListPage.iShouldSeeTheControl(When.onTheAppListPage.getPageName(), "idTableApps");
	});
});