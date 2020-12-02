sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/f/FlexibleColumnLayoutSemanticHelper"
], function (jQuery, UIComponent, JSONModel, FlexibleColumnLayoutSemanticHelper) {

	var Component = UIComponent.extend("asc.admin.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
			jQuery.sap.require("asc.admin.resources.scripts.moment");

			var oLayoutModel = new JSONModel({
				layout: "OneColumn"
			});
			// set the default layout
			this.setModel(oLayoutModel, "layout");
			this.getRouter().initialize();

			/* SAP Specific Code */
			/* Mobile Usage Reporting */
			/* Version v3 */
			sap.git=sap.git||{},sap.git.usage=sap.git.usage||{},sap.git.usage.Reporting={_lp:null,_load:function(a){this._lp=this._lp||sap.ui.getCore().loadLibrary("sap.git.usage",{url:"https://trackingshallwe.hana.ondemand.com/web-client/v3",async:!0}),this._lp.then(function(){a(sap.git.usage.MobileUsageReporting)},this._loadFailed)},_loadFailed:function(a){jQuery.sap.log.warning("[sap.git.usage.MobileUsageReporting]","Loading failed: "+a)},setup:function(a){this._load(function(b){b.setup(a)})},addEvent:function(a,b){this._load(function(c){c.addEvent(a,b)})},setUser:function(a,b){this._load(function(c){c.setUser(a,b)})}};
			sap.git.usage.Reporting.setup(this);
			/* SAP Specific Code */
		},

		createContent: function () {
			return sap.ui.view({
				viewName: "asc.admin.view.Container",
				type: "XML"
			});
		},

		/**
		 * Returns an instance of the semantic helper
		 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
		 */
		getHelper: function () {
			var oFCL = this.getRootControl().byId("fcl"),
				oParams = jQuery.sap.getUriParameters(),
				oSettings = {
					defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsMidExpanded,
					mode: oParams.get("mode"),
					initialColumnsCount: 1,
					maxColumnsCount: 3
				};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		},

		loadASC: function () {
			try {
				jQuery.sap.registerModulePath("sap.asc", "/asc_ui5_lib");
				jQuery.sap.require("sap.asc");
				sap.asc.setHelpServer("");
				sap.asc.setAppId("421");
				sap.asc.setAppVersion("");
				sap.asc.setAppIconUrl("./resources/images/icon_default.svg");
				sap.asc.setAccessToken("fd6c38f9");
				sap.asc.setFeedbackId("1b4f1291-e818-4d2d-892b-d8073b065a50")
				sap.asc.setSupportEmail("DL_55A6CA597BCF842464000002@global.corp.sap");

				sap.asc.init();
				sap.asc.open();
			} catch (err) {
				jQuery.sap.log.error("Could not load ASC");
			}
		}
	});
	return Component;
}, true);
