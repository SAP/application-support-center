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

	var sViewName = "app.EditApp";

	Opa5.createPageObjects({
		onTheEditAppPage : {
			baseClass : Common,
			pageName : sViewName,
			actions : {

				getPageName : function() {
					return sViewName;
				},

				iPressOnCancel: function () {
					return this.waitFor({
						id: "idButtonCancel",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the cancel button on the view " + sViewName
					});
				}
			},

			assertions : {

				iShouldSeeTheEditAppScreen : function () {
					return this.waitFor({
						id: "idFormEditApp",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok("The edit app is visible");
						},
						errorMessage: "Did not find any app info"
					});
				}
			}

		}

	});

});
