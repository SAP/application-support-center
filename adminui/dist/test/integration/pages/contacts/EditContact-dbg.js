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

	var sViewName = "contacts.EditContact";

	Opa5.createPageObjects({
		onTheEditContactPage : {
			baseClass : Common,
			pageName : sViewName,
			actions : {
				getPageName : function() {
					return sViewName;
				}
			},

			assertions : {

				iShouldSeeTheEditScreen : function () {
					return this.waitFor({
						id: "idFormEdit",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok("The edit form is visible");
						},
						errorMessage: "Did not find the edit form"
					});
				},

				iShouldSeeThePageTitle: function () {
						return this.waitFor({
							viewName : sViewName,
							id : "idTitle",
							matchers : new PropertyStrictEquals({name : "text", value : "Edit Contact Page"}),
							success : function () {
								Opa5.assert.ok(true, "The page title is correct");
							},
							errorMessage : "The page title is not correct"
						});
				}

			}

		}

	});

});
