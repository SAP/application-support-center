/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"../pages/Common",
	"../pages/app/AppList",
	"../pages/app/ViewApp",
	"../pages/app/AddApp",
	"../pages/app/EditApp"
], function (opaTest) {
	"use strict";

	QUnit.module("Add App");
	//Assumes the App has started and is on the main split screen

	opaTest("Pressing the New Application button should show the new application screen", function (Given, When, Then) {
		//Actions
		When.onTheAppListPage.iPressAddNewApplication();

		// Assertions
		Then.onTheAddAppPage.iShouldSeeTheAddAppScreen();
	});

	opaTest("Creating a new app", function (Given, When, Then) {
		When.onTheAddAppPage
			.iEnterText(When.onTheAddAppPage.getPageName(), "idInputAppName", When.onTheAppListPage.getAppName())
			.iEnterText(When.onTheAddAppPage.getPageName(), "idInputUsageTrackingId", "1221762761")
			.iEnterText(When.onTheAddAppPage.getPageName(), "idDatePickerGoLive", "Feb 20, 2020")
			.iEnterText(When.onTheAddAppPage.getPageName(), "idDatePickerRetired", "Feb 20, 2020")
			.iEnterText(When.onTheAddAppPage.getPageName(), "idTextNotes", "Test Note")
			.iSelectAKey(When.onTheAddAppPage.getPageName(), "idSelectStatus", "Productive")
			.iSelectAKey(When.onTheAddAppPage.getPageName(), "idSelectTechnology", "iOS")
			.iSelectAKey(When.onTheAddAppPage.getPageName(), "idSelectCategory", "Sales")

			.iPressSave(When.onTheAddAppPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();
	});

	opaTest("Pressing the Cancel New Application button should show the new screen", function (Given, When, Then) {
		When.onTheAppListPage.iPressAddNewApplication();
		Then.onTheAddAppPage.iShouldSeeTheAddAppScreen();
		When.onTheAddAppPage.iPressCancel(When.onTheAddAppPage.getPageName());
		Then.onTheAppListPage.theTableHasEntries(When.onTheAppListPage.getPageName(), "idTableApps");
	});

	QUnit.module("Search App");

	opaTest("Entering something that cannot be found into search field and pressing search field's refresh should leave the list as it was", function (Given, When, Then) {
		When.onTheAppListPage.iTypeSomethingInTheSearchThatCannotBeFoundAndTriggerRefresh();
		Then.onTheAppListPage.theTableHasEntries(When.onTheAppListPage.getPageName(), "idTableApps");
	});

	opaTest("Entering something that cannot be found into search field and pressing 'search' should display the list's 'not found' message", function (Given, When, Then) {
		When.onTheAppListPage.iSearchForSomethingWithNoResults();
		Then.onTheAppListPage.iShouldSeeTheNoDataTextForNoSearchResults();
	});

	opaTest("Should display items again if the searchfield is emptied", function (Given, When, Then) {
		When.onTheAppListPage.iClearTheSearch();
		Then.onTheAppListPage.theTableHasEntries(When.onTheAppListPage.getPageName(), "idTableApps");
	});

	QUnit.module("View App");

	opaTest("Selecting the new application in the app list", function (Given, When, Then) {
		When.onTheAppListPage.iSearchFor(When.onTheAppListPage.getAppName());
		Then.onTheAppListPage.theTableHasEntries(When.onTheAppListPage.getPageName(), "idTableApps");

		When.onTheAppListPage.iPressOnTheObjectAtPositionInTable(When.onTheAppListPage.getPageName(), "idTableApps", 0);
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();
	});

	opaTest("Validate the new data matches the data used to create the records", function (Given, When, Then) {
		Then.onTheAppListPage.theTableHasEntries(When.onTheAppListPage.getPageName(), "idTableApps");
		Then.onTheViewAppPage.iShouldSeeTheText(When.onTheViewAppPage.getPageName(), "usageTrackingId", "1221762761");
		Then.onTheViewAppPage.iShouldSeeTheText(When.onTheViewAppPage.getPageName(), "idTextGoLive", "02/20/2020");
		Then.onTheViewAppPage.iShouldSeeTheText(When.onTheViewAppPage.getPageName(), "idTextRetired", "02/20/2020");
	});

	QUnit.module("Edit App");

	opaTest("Pressing edit app I should see the edit form", function (Given, When, Then) {
		When.onTheViewAppPage.iPressOnEditApplication();
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();
	});

	opaTest("Changing a field should update that field", function (Given, When, Then) {
		When.onTheEditAppPage
			.iEnterText(When.onTheEditAppPage.getPageName(), "idTextNotes", "New Note")
			.iPressSave(When.onTheEditAppPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();
		Then.onTheViewAppPage.iShouldSeeTheText(When.onTheViewAppPage.getPageName(), "idTextNotes", "New Note");
	});

	opaTest("Pressing the Cancel Edit Application button should show the view screen", function (Given, When, Then) {
		When.onTheViewAppPage.iPressOnEditApplication();
		Then.onTheEditAppPage.iShouldSeeTheEditAppScreen();

		When.onTheEditAppPage.iPressCancel(When.onTheEditAppPage.getPageName());
		Then.onTheViewAppPage.iShouldSeeTheAppInfoScreen();
	});

	opaTest("Pressing the Close View Application should show the application table", function (Given, When, Then) {
		When.onTheViewAppPage.iPress(When.onTheViewAppPage.getPageName(), "idButtonCloseApp");
		Then.onTheAppListPage.iShouldSeeTheControl(When.onTheAppListPage.getPageName(), "idTableApps");
	});

});