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

	var sViewName = "app.ViewApp";

	Opa5.createPageObjects({
		onTheViewAppPage : {
			baseClass : Common,
			pageName : sViewName,
			actions : {
				getPageName : function() {
					return sViewName;
				},

				iPressOnEditApplication: function () {
					return this.waitFor({
						id: "idButtonEditApp",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the edit application button on the view " + sViewName
					});
				}
			},

			assertions : {

				iShouldSeeTheAppInfoScreen : function () {
					return this.waitFor({
						id: "idFormAppInfo",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok("The app info is visible");
						},
						errorMessage: "Did not find any app info"
					});
				}

			}

		}

	});

});
