sap.ui.define(["jquery.sap.global","sap/ui/core/UIComponent","sap/ui/model/json/JSONModel","sap/f/FlexibleColumnLayoutSemanticHelper"],function(e,a,t,s){var n=a.extend("asc.admin.Component",{metadata:{manifest:"json"},init:function(){a.prototype.init.apply(this,arguments);e.sap.require("asc.admin.resources.scripts.moment");var s=new t({layout:"OneColumn"});this.setModel(s,"layout");this.getRouter().initialize();sap.git=sap.git||{},sap.git.usage=sap.git.usage||{},sap.git.usage.Reporting={_lp:null,_load:function(e){this._lp=this._lp||sap.ui.getCore().loadLibrary("sap.git.usage",{url:"https://trackingshallwe.hana.ondemand.com/web-client/v3",async:!0}),this._lp.then(function(){e(sap.git.usage.MobileUsageReporting)},this._loadFailed)},_loadFailed:function(a){e.sap.log.warning("[sap.git.usage.MobileUsageReporting]","Loading failed: "+a)},setup:function(e){this._load(function(a){a.setup(e)})},addEvent:function(e,a){this._load(function(t){t.addEvent(e,a)})},setUser:function(e,a){this._load(function(t){t.setUser(e,a)})}};sap.git.usage.Reporting.setup(this)},createContent:function(){return sap.ui.view({viewName:"asc.admin.view.Container",type:"XML"})},getHelper:function(){var a=this.getRootControl().byId("fcl"),t=e.sap.getUriParameters(),n={defaultTwoColumnLayoutType:sap.f.LayoutType.TwoColumnsMidExpanded,defaultThreeColumnLayoutType:sap.f.LayoutType.ThreeColumnsMidExpanded,mode:t.get("mode"),initialColumnsCount:1,maxColumnsCount:3};return s.getInstanceFor(a,n)},loadASC:function(){try{e.sap.registerModulePath("sap.asc","/asc_ui5_lib");e.sap.require("sap.asc");sap.asc.setHelpServer("");sap.asc.setAppId("421");sap.asc.setAppVersion("");sap.asc.setAppIconUrl("./resources/images/icon_default.svg");sap.asc.setAccessToken("fd6c38f9");sap.asc.setFeedbackId("1b4f1291-e818-4d2d-892b-d8073b065a50");sap.asc.setSupportEmail("DL_55A6CA597BCF842464000002@global.corp.sap");sap.asc.init();sap.asc.open()}catch(a){e.sap.log.error("Could not load ASC")}}});return n},true);