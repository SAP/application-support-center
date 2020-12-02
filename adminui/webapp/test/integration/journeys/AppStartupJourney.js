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

	QUnit.module("App Startup");

	opaTest("Should see the apps list on startup", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Assertions
		Then.onTheAppListPage.iShouldSeeTheControl(When.onTheAppListPage.getPageName(), "idTableApps");
	});

	opaTest("If the user is an admin, they should see the Add application footer", function (Given, When, Then) {
		// If the user is a admin
		Then.onTheAppListPage.iShouldSeeTheControl(When.onTheAppListPage.getPageName(), "idButtonAddNewApplication");
	});
});