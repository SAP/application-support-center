sap.ui.define(["sap/ui/test/Opa5","sap/ui/test/actions/Press","sap/ui/test/actions/EnterText","sap/ui/test/matchers/AggregationLengthEquals","sap/ui/test/matchers/AggregationFilled","sap/ui/test/matchers/PropertyStrictEquals","../Common"],function(e,t,s,a,i,r,n){"use strict";var o="app_help.AddAppHelp";e.createPageObjects({onTheAddAppHelpPage:{baseClass:n,pageName:o,actions:{getPageName:function(){return o}},assertions:{iShouldSeeTheAddScreen:function(){return this.waitFor({id:"idFormAdd",viewName:o,success:function(){e.assert.ok("The add screen is visible")},errorMessage:"Did not find the add form"})},iShouldSeeThePageTitle:function(){return this.waitFor({viewName:o,id:"idTitle",matchers:new r({name:"text",value:"New Help Page"}),success:function(){e.assert.ok(true,"The page title is correct")},errorMessage:"The page title is not correct"})}}}})});