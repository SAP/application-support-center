/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"../pages/app/AppList",
	"../pages/app/ViewApp",
	"../pages/app/EditApp",
	"../pages/contacts/AddContact",
	"../pages/contacts/ContactList",
	"../pages/contacts/EditContact",
	"../pages/contacts/ViewContact",
	"../pages/Common"
], function (opaTest) {
	"use strict";

	QUnit.module("Contact");

	opaTest("Pressing Manage Contacts should show the Contact List page", function (Given, When, Then) {
		When.onTheAppListPage.iPress(When.onTheAppListPage.getPageName(), "idButtonManageContacts");
		Then.onTheContactListPage
			.iShouldSeeTheControl(When.onTheContactListPage.getPageName(), "idTableContacts");
	});

	opaTest("Pressing add Contacts should show the add contact page", function (Given, When, Then) {
		When.onTheContactListPage.iPress(When.onTheContactListPage.getPageName(), "idButtonAddContact");
		Then.onTheAddContactPage
			.iShouldSeeTheAddScreen();
	});

	opaTest("Creating a new record", function (Given, When, Then) {
		When.onTheAddContactPage
			.iEnterText(When.onTheAddContactPage.getPageName(), "idInputUserID", "s00912090912")
			.iEnterText(When.onTheAddContactPage.getPageName(), "idInputFirstName", "Randy")
			.iEnterText(When.onTheAddContactPage.getPageName(), "idInputLastName", "Johnson")
			.iEnterText(When.onTheAddContactPage.getPageName(), "idInputEmail", "Randy.Johnson@sap.com")
			.iPressSave(When.onTheAddContactPage.getPageName());
		Then.onTheContactListPage
			.iShouldSeeTheControl(When.onTheContactListPage.getPageName(), "idTableContacts");
	});

	opaTest("I can edit the new record", function (Given, When, Then) {
		When.onTheContactListPage.iPressOnTheObjectAtPositionInTable(When.onTheContactListPage.getPageName(), "idTableContacts", 0);
		Then.onTheEditContactPage.iShouldSeeTheEditScreen();
	});

	opaTest("I can close the view help screen", function (Given, When, Then) {
		When.onTheEditContactPage.iPressCancel(When.onTheEditContactPage.getPageName());
		Then.onTheContactListPage
			.iShouldSeeTheControl(When.onTheContactListPage.getPageName(), "idTableContacts");
	});

});