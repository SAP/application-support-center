sap.ui.define(["../BaseController"],function(t){return t.extend("asc.admin.controller.contacts.ViewContact",{onInit:function(){this.oRouter=this.getOwnerComponent().getRouter();this.oRouter.getRoute("viewcontact").attachPatternMatched(this._onContactMatched,this)},_onContactMatched:function(t){this._contact=t.getParameter("arguments").contact||this._contact||"0";this.getView().bindElement({path:"/"+this._contact,model:"contacts"})},onClosePress:function(){this.oRouter.navTo("viewcontacts")}})},true);