sap.ui.define(["../BaseController","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/Sorter","sap/ui/core/Fragment"],function(e,t,i,s,n){return e.extend("asc.admin.controller.app.AppList",{onInit:function(){this.oRouter=this.getOwnerComponent().getRouter();this._bDescendingSort=false},onAfterRendering:function(){this.filterList('{"technology":[],"status":["InDevelopment","InReview","New","Productive"],"category":[],"app_keywords":[]}')},onListItemPress:function(e){var t=e.getSource().getBindingContext("apps").getPath();var i=t.split("/").slice(-1).pop();this.oRouter.navTo("viewapp",{app:i});var s=new sap.ui.model.json.JSONModel;s.setData(e.getSource().getBindingContext("apps").getObject());this.getOwnerComponent().setModel(s,"selected_app")},onSearch:function(e){var s=[],n=e.getParameter("query");if(n&&n.length>0){s=[new t("app_name",i.Contains,n)]}this.getView().byId("idTableApps").getBinding("items").filter(s,"Application")},onFilterPress:function(e){if(!this._oDialog){n.load({name:"asc.admin.view.AppFilter",controller:this}).then(function(e){this._oDialog=e;this._oDialog.setModel(this.getView().getModel("options"),"options");this._oDialog.open()}.bind(this))}else{this._oDialog.setModel(this.getView().getModel("options"),"options");this._oDialog.open()}},onAddAppPress:function(e){this.oRouter.navTo("addapp")},onManageContactPress:function(e){this.oRouter.navTo("viewcontacts")},onSortPress:function(e){this._bDescendingSort=!this._bDescendingSort;var t=this.getView(),i=t.byId("idTableApps"),n=i.getBinding("items"),r=new s("app_name",this._bDescendingSort);n.sort(r)},onExit:function(){if(this._oDialog){this._oDialog.destroy()}},filterAllApps:function(e){var t=this;this.api.getApps().done(function(e){var i=new sap.ui.model.json.JSONModel(e);i.setSizeLimit(1e3);t.getOwnerComponent().setModel(i,"apps")})},handleConfirmFilter:function(e){var t=e.getSource();var i={};var s=t.getFilterItems();var n=e.getParameters();for(var r=0;r<s.length;r++){var o=s[r].mAggregations.items;i[s[r].mProperties.key]=[];for(var a=0;a<o.length;a++){var l=o[a].mProperties.key;var p=o[a].mProperties.selected;if(p===true){i[s[r].mProperties.key].push(l)}}}var g=[];var d=e.getParameter("sortItem");if(d.getKey()!=="None"){g.push(new sap.ui.model.Sorter(d.getKey(),e.getParameter("sortDescending"),false))}if(g.length>0){this.getView().byId("idTableApps").getBinding("items").sort(g)}else{this.getView().byId("idTableApps").getBinding("items").sort()}this.filterList(JSON.stringify(i));if(e.getParameters().filterString){this.byId("idFilterBar").setVisible(true);this.byId("idFilterLabel").setText(n.filterString+" ("+this.getView().byId("idTableApps").getItems().length+")")}else{this.byId("idFilterBar").setVisible(false);this.byId("idFilterLabel").setText("")}},onClearFilters:function(){var e=[];this.filterList(JSON.stringify(e));this.getView().byId("idTableApps").getBinding("items").filter([]);this.byId("idFilterBar").setVisible(false);this.byId("idFilterLabel").setText("")},handleFilterClear:function(){var e=[];this.filterList(JSON.stringify(e));this.filterAllApps();this.getView().byId("idTableApps").getBinding("items").sort();if(this._oDialog){this._oDialog.destroy();this._oDialog=null}},filterList:function(e){var t=[];if(e){var i=jQuery.parseJSON(e);var s=Object.getOwnPropertyNames(i);for(var n in s){var r=[];var o=s[n];var a=i[o];for(var l in a){var p=a[l];r.push(new sap.ui.model.Filter(o,sap.ui.model.FilterOperator.Contains,p));if(a.length-1==l&&r.length>0){t.push(new sap.ui.model.Filter(r,false))}}}if(t.length>0){this.getView().byId("idTableApps").getBinding("items").filter(new sap.ui.model.Filter(t,true))}else{this.getView().byId("idTableApps").getBinding("items").filter([])}}}})},true);