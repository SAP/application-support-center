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

	var sViewName = "contacts.ContactList";

	Opa5.createPageObjects({
		onTheContactListPage : {
			baseClass : Common,
			pageName : sViewName,
			actions : {

				getPageName : function() {
					return sViewName;
				},

				iWaitUntilTheListIsLoaded : function () {
					return this.waitFor({
						id : "idTableContacts",
						viewName : sViewName,
						matchers : new AggregationFilled({name : "items"}),
						errorMessage : "The app list has not been loaded"
					});
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
				}
			},

			assertions : {

			}

		}

	});

});
