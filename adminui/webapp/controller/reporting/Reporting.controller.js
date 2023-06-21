sap.ui.define([
		"../BaseController"
], function (BaseController) {
	'use strict';
	return BaseController.extend("asc.admin.controller.reporting.Reporting", {
		onInit: function () {
		},

		// UI //
		onSelectReportChange: function (oEvent) {
			var oCurrentUser = this.getOwnerComponent().getModel("user");
			this.api.getReportData(this.getView().byId("sReportName").getSelectedKey(), oCurrentUser.getData().userId)
				.done(this.onGetReportDataDone.bind(this));
		},

		// Service Responses //
		onGetReportDataDone: function(oData) {
			// This dynamically populates the table with the columns and rows returned from the API
			var oTable = this.getView().byId("idReportTable");
			oTable.removeAllColumns();
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				rows: oData.rows,
				columns: oData.columns
			});
			oTable.setModel(oModel);
			oTable.bindColumns("/columns", function(sId, oContext) {
				var columnName = oContext.getObject().columnName;
				return new sap.ui.table.Column({
					label: columnName,
					template: columnName,
					sortProperty: columnName,
					filterProperty: columnName
				});
			});
			oTable.bindRows("/rows");
		},

		onDataExport: function(oEvent) {
			var oTable = this.getView().byId("idReportTable");
			var oExport = oTable.exportData();
			oExport.saveFile(this.getView().byId("sReportName").getSelectedKey() + moment().format("_MM_DD_YYYY"));
		}

	});
}, true);
