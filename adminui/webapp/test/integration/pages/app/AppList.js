sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"../Common"
], function(Opa5, Press, EnterText, AggregationLengthEquals, AggregationFilled, PropertyStrictEquals, Common) {
	"use strict";

	var sViewName = "app.AppList",
		sSomethingThatCannotBeFound = "*#-Q@@||";

	Opa5.createPageObjects({
		onTheAppListPage : {
			baseClass : Common,
			pageName : sViewName,
			actions : {

				getPageName : function() {
					return sViewName;
				},

				iWaitUntilTheListIsLoaded : function () {
					return this.waitFor({
						id : "idTableApps",
						viewName : sViewName,
						matchers : new AggregationFilled({name : "items"}),
						errorMessage : "The app list has not been loaded"
					});
				},

				iRememberTheSelectedItem : function () {
					return this.waitFor({
						id : "idTableApps",
						viewName : sViewName,
						matchers : function (oList) {
							return oList.getSelectedItem();
						},
						success : function (oListItem) {
							this.iRememberTheListItem(oListItem);
						},
						errorMessage : "The list does not have a selected item so nothing can be remembered"
					});
				},

				iRememberTheIdOfListItemAtPosition : function (iPosition) {
					return this.waitFor({
						id : "idTableApps",
						viewName : sViewName,
						matchers : function (oList) {
							return oList.getItems()[iPosition];
						},
						success : function (oListItem) {
							this.iRememberTheListItem(oListItem);
						},
						errorMessage : "The list does not have an item at the index " + iPosition
					});
				},

				iSearchFor : function (sSearch){
					return this.waitFor({
						id : "idTableApps",
						viewName : sViewName,
						matchers: new AggregationFilled({name : "items"}),
						success : function () {
							return this.iSearchForValue(new EnterText({text: sSearch}), new Press());
						},
						errorMessage : "Did not find list items while trying to search for " + sSearch
					});
				},

				iTypeSomethingInTheSearchThatCannotBeFoundAndTriggerRefresh : function () {
					return this.iSearchForValue(function (oSearchField) {
						oSearchField.setValue(sSomethingThatCannotBeFound);
						oSearchField.fireSearch({refreshButtonPressed : true});
					});
				},

				iSearchForValue : function (aActions) {
					return this.waitFor({
						id : "idSearchField",
						viewName : sViewName,
						actions: aActions,
						errorMessage : "Failed to find search field in Master view.'"
					});
				},

				iClearTheSearch : function () {
					//can not use 'EnterText' action to enter empty strings (yet)
					var fnClearSearchField = function(oSearchField) {
						oSearchField.clear();
					};
					return this.iSearchForValue([fnClearSearchField]);
				},

				iSearchForSomethingWithNoResults : function () {
					return this.iSearchForValue([new EnterText({text: sSomethingThatCannotBeFound}), new Press()]);
				},

				iRememberTheListItem : function (oListItem) {
					var oBindingContext = oListItem.getBindingContext();
					this.getContext().currentItem = {
						bindingPath: oBindingContext.getPath(),
						id: oBindingContext.getProperty("app_id"),
						title: oBindingContext.getProperty("app_id")
					};
				},

				iFilterTheListOn : function (sField) {
					return this.iMakeASelection("filterButton", "apps", sField);
				},

				iMakeASelection : function (sSelect, sItem, sOption) {
					return this.waitFor({
						id : sSelect,
						viewName : sViewName,
						actions : new Press(),
						success : function () {
							this.waitFor({
								controlType: "sap.m.StandardListItem",
								matchers: new PropertyStrictEquals({name: "title", value: sItem}),
								searchOpenDialogs: true,
								actions: new Press(),
								success: function () {
									this.waitFor({
										controlType: "sap.m.StandardListItem",
										matchers : new PropertyStrictEquals({name: "title", value: sOption}),
										searchOpenDialogs: true,
										actions : new Press(),
										success: function () {
											this.waitFor({
												controlType: "sap.m.Button",
												matchers: new PropertyStrictEquals({name: "text", value: "OK"}),
												searchOpenDialogs: true,
												actions: new Press(),
												errorMessage: "The ok button in the dialog was not found and could not be pressed"
											});
										},
										errorMessage : "Did not find the" +  sOption + "in" + sItem
									});
								},
								errorMessage : "Did not find the " + sItem + " element in select"
							});
						},
						errorMessage : "Did not find the " + sSelect + " select"
					});
				},

				iPressAddNewApplication: function () {
					return this.waitFor({
						id: "idButtonAddNewApplication",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the add new application button on the view " + sViewName
					});
				},
			},

			assertions : {

				theListShowsOnlyObjectsWithTheSearchString : function (sSearch) {
					this.waitFor({
						id : "idTableApps",
						viewName : sViewName,
						matchers : new AggregationFilled({name : "items"}),
						check : function(oList) {
							var bEveryItemContainsTheTitle = oList.getItems().every(function (oItem) {
									return oItem.getAttributes()[0].getText().indexOf(sSearch) !== -1;
								});
							return bEveryItemContainsTheTitle;
						},
						success : function () {
							Opa5.assert.ok(true, "Every item did contain the title");
						},
						errorMessage : "The list did not have items"
					});
				},

				theListShouldHaveAllEntries : function () {
					var aAllEntities,
						iExpectedNumberOfItems;
					// retrieve all Orders to be able to check for the total amount
					this.waitFor(this.createAWaitForAnEntitySet({
						entitySet : "apps",
						success : function (aEntityData) {
							aAllEntities = aEntityData;
						}
					}));

					return this.waitFor({
						id : "idTableApps",
						viewName : sViewName,
						matchers : function (oList) {
							// If there are less items in the list than the growingThreshold, only check for this number.
							iExpectedNumberOfItems = Math.min(oList.getGrowingThreshold(), aAllEntities.length);
							return new AggregationLengthEquals({name : "items", length : iExpectedNumberOfItems}).isMatching(oList);
						},
						success : function (oList) {
							Opa5.assert.strictEqual(oList.getItems().length, iExpectedNumberOfItems, "The growing list displays all items");
						},
						errorMessage : "List does not display all entries."
					});
				},

				iShouldSeeTheNoDataTextForNoSearchResults : function () {
					return this.waitFor({
						id : "idTableApps",
						viewName : sViewName,
						success : function (oList) {
							Opa5.assert.strictEqual(oList.getNoDataText(), "No data", "the list should show the no data text for search and filter");
						},
						errorMessage : "list does not show the no data text for search and filter"
					});
				},

				theHeaderShouldDisplayAllEntries : function () {
					return this.waitFor({
						id : "idTableApps",
						viewName : sViewName,
						success : function (oList) {
							var iExpectedLength = oList.getBinding("items").getLength();
							this.waitFor({
								id : "masterHeaderTitle",
								viewName : sViewName,
								matchers : new PropertyStrictEquals({name : "text", value : "Orders (" + iExpectedLength + ")"}),
								success : function () {
									Opa5.assert.ok(true, "The master page header displays " + iExpectedLength + " items");
								},
								errorMessage : "The  master page header does not display " + iExpectedLength + " items."
							});
						},
						errorMessage : "Header does not display the number of items in the list"
					});
				},

				theListShouldHaveNoSelection : function () {
					return this.waitFor({
						id : "idTableApps",
						viewName : sViewName,
						matchers : function(oList) {
							return !oList.getSelectedItem();
						},
						success : function (oList) {
							Opa5.assert.strictEqual(oList.getSelectedItems().length, 0, "The list selection is removed");
						},
						errorMessage : "List selection was not removed"
					});
				},

				theRememberedListItemShouldBeSelected : function () {
					this.waitFor({
						id : "idTableApps",
						viewName : sViewName,
						matchers : function (oList) {
							return oList.getSelectedItem();
						},
						success : function (oSelectedItem) {
							Opa5.assert.strictEqual(oSelectedItem.getTitle(), "Order " + this.getContext().currentItem.title, "The list selection is incorrect");
						},
						errorMessage : "The list has no selection"
					});
				}
			}

		}

	});

});
