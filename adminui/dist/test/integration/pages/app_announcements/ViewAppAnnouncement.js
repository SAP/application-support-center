sap.ui.define(["sap/ui/test/Opa5","sap/ui/test/actions/Press","sap/ui/test/actions/EnterText","sap/ui/test/matchers/AggregationLengthEquals","sap/ui/test/matchers/AggregationFilled","sap/ui/test/matchers/PropertyStrictEquals","../Common"],function(e,n,t,s,a,i,o){"use strict";var r="app_announcements.ViewAppAnnouncement";e.createPageObjects({onTheViewAppAnnouncementPage:{baseClass:o,pageName:r,actions:{getPageName:function(){return r}},assertions:{iShouldSeeTheAnnouncementInfoScreen:function(){return this.waitFor({id:"idFormViewAnnouncement",viewName:r,success:function(){e.assert.ok("The app info is visible")},errorMessage:"Did not find any app info"})}}}})});