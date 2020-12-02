sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/Ancestor"
], function(Opa5, Press, EnterText, AggregationLengthEquals, AggregationFilled, PropertyStrictEquals, Properties, Ancestor) {
	"use strict";

	var appName = "App " + Math.random().toString(36).substring(2, 7);

	return Opa5.extend("asc.admin.test.integration.pages.Common", {
		// Common UI Controls
		getAppName: function () {
			return appName;
		},

		iPress: function (sViewName, idButton) {
			return this.waitFor({
				id: idButton,
				viewName: sViewName,
				actions: new Press(),
				errorMessage: "Did not find the button: " + idButton + " on the view " + sViewName
			});
		},

		iPressSave: function (sViewName) {
			return this.waitFor({
				id: "idButtonSave",
				viewName: sViewName,
				actions: new Press(),
				errorMessage: "Did not find the save button on the view " + sViewName
			});
		},

		iPressCancel: function (sViewName) {
			return this.waitFor({
				id: "idButtonCancel",
				viewName: sViewName,
				actions: new Press(),
				errorMessage: "Did not find the cancel button on the view " + sViewName
			});
		},

		iPressClose : function(sViewName) {
			return this.waitFor({
				id: "idButtonClose",
				viewName: sViewName,
				actions: new Press(),
				errorMessage: "Did not find the close button on the view " + sViewName
			});
		},

		iShouldNotSeeTheControl: function (sViewName, sControlId) {
			return this.waitFor({
				id: sControlId,
				viewName: sViewName,
				visible: false,
				matchers: new PropertyStrictEquals({
					name : "visible",
					value : false}),
				success: function () {
					Opa5.assert.ok(true, "The control (" + sControlId + ") is not visible");
				},
				errorMessage: "Did not find the hidden control: " + sControlId
			});
		},

		iShouldSeeTheControl: function (sViewName, sControlId) {
			return this.waitFor({
				id: sControlId,
				viewName: sViewName,
				visible: false,
				matchers: new PropertyStrictEquals({
					name : "visible",
					value : true}),
				success: function () {
					Opa5.assert.ok(true, "The control (" + sControlId + ") is visible");
				},
				errorMessage: "Did not find the control: " + sControlId
			});
		},


		// Common UI Input/Validation Functions

		iSelectAKey: function(sViewName, sControlId, sKey) {
			return this.waitFor({
				id : sControlId,
				viewName : sViewName,
				actions: new Press(),
				success: function(oSelect) {
					this.waitFor({
						controlType: "sap.ui.core.Item",
						matchers: [
							new Ancestor(oSelect),
							new Properties({ key: sKey})
						],
						actions: new Press(),
						errorMessage: "Cannot select key"
					});
				},
				errorMessage: "Could not find mySelect"
			});
		},


		iEnterText: function(sViewName, sControlId, sText) {
			return this.waitFor({
				id : sControlId,
				viewName : sViewName,
				actions: [
					new EnterText({text: sText})
				],
				errorMessage : "Failed to find the input field"
			});
		},

		iEnterTextAndKeepFocus: function(sViewName, sControlId, sText) {
			return this.waitFor({
				id : sControlId,
				viewName : sViewName,
				actions: [
					new EnterText({
						text: sText,
						clearTextFirst: false,
						keepFocus: true
					})
				],
				errorMessage : "Failed to find the input field"
			});
		},

		iEnterSuggestionText: function(sViewName, sControlId, sText) {
			return this.waitFor({
				id : sControlId,
				viewName : sViewName,
				actions: [
					new EnterText({
						text: sText,
						keepFocus: true
					})
				],
				success: function (oInput) {
					this.waitFor({
						controlType: "sap.m.ColumnListItem",
						matchers: [
							new Ancestor(oInput),
							function(oCandidateListItem) {
                          return true;
                        }],
                        actions: new Press()
					});
				},
				errorMessage : "Failed to find the input field"
			});
		},

		iEnterTextAndPressEnter: function(sViewName, sControlId, sText) {
			return this.waitFor({
				id : sControlId,
				viewName : sViewName,
				actions: [
					new EnterText({
						text: sText,
						keepFocus: true,
						pressEnter: true
					})
				],
				errorMessage : "Failed to find the input field"
			});
		},

		iShouldSeeTheText : function(sViewName, sTextId, sValue) {
			return this.waitFor({
				viewName : sViewName,
				id : sTextId,
				matchers : new PropertyStrictEquals({name : "text", value : sValue}),
				success : function () {
					Opa5.assert.ok(true, "The text is correct");
				},
				errorMessage : "The text is not correct"
			});
		},

		theTableHasEntries : function (sViewName, sTableId) {
			return this.waitFor({
				viewName : sViewName,
				id : sTableId,
				matchers : new AggregationFilled({
					name : "items"
				}),
				success : function () {
					Opa5.assert.ok(true, "The " + sTableId + " table has items");
				},
				errorMessage : "The " + sTableId + " table has no items"
			});
		},

		iPressOnTheObjectAtPositionInTable : function (sViewName, sTableId, iPositon) {
			return this.waitFor({
				id : sTableId,
				viewName : sViewName,
				matchers : function (oList) {
					return oList.getItems()[iPositon];
				},
				actions : new Press(),
				errorMessage : "Table " + sTableId + " in view " + sViewName + " does not contain an ObjectListItem at position " + iPositon
			});
		},

		iWaitUntilTheTableIsLoaded : function (sViewName, sTableId) {
			return this.waitFor({
				id : sTableId,
				viewName : sViewName,
				matchers : new AggregationFilled({name : "items"}),
				errorMessage : "The table has not been loaded"
			});
		}


	});
});