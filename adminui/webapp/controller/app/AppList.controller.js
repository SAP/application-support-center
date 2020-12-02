sap.ui.define([
	"../BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	'sap/ui/core/Fragment'
], function (BaseController, Filter, FilterOperator, Sorter, Fragment) {


	return BaseController.extend("asc.admin.controller.app.AppList", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this._bDescendingSort = false;
		},

		onAfterRendering: function () {
			// Defalut filter
			this.filterList("{\"technology\":[],\"status\":[\"InDevelopment\",\"InReview\",\"New\",\"Productive\"],\"category\":[],\"app_keywords\":[]}");
			this.byId("idFilterBar").setVisible(true);
			this.byId("idFilterLabel").setText("Filtered by: Status (InDevelopment, InReview, New, Productive)" + " (" + this.getView().byId("idTableApps").getItems().length + ")");
		},

		// UI //

		onListItemPress: function (oEvent) {
			var appPath = oEvent.getSource().getBindingContext("apps").getPath();
			var app = appPath.split("/").slice(-1).pop();

			this.oRouter.navTo("viewapp", {app: app});
			//this.setLayout("TwoColumnsMidExpanded");

			//Create and set the selected_app model
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oEvent.getSource().getBindingContext("apps").getObject());

			this.getOwnerComponent().setModel(oModel, "selected_app");
		},
		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("app_name", FilterOperator.Contains, sQuery)];
			}

			this.getView().byId("idTableApps").getBinding("items").filter(oTableSearchState, "Application");
		},

		onFilterPress: function (oEvent) {
			if (!this._oDialog) {
				Fragment.load({
					name: "asc.admin.view.AppFilter",
					controller: this
				}).then(function(oDialog){
					this._oDialog = oDialog;
					this._oDialog.setModel(this.getView().getModel("options"), "options");
					this._oDialog.open();
				}.bind(this));
			} else {
				this._oDialog.setModel(this.getView().getModel("options"), "options");
				this._oDialog.open();
			}
		},

		onAddAppPress: function (oEvent) {
			this.oRouter.navTo("addapp");
		},
		onManageContactPress: function (oEvent) {
			this.oRouter.navTo("viewcontacts");
		},

		onSortPress: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("idTableApps"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("app_name", this._bDescendingSort);

			oBinding.sort(oSorter);
		},


		onExit : function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		// App Filter Functions

		filterAllApps: function (oEvent) {
			var that = this;
			this.api.getApps()
				.done(function (oData) {
					var oAppsModel = new sap.ui.model.json.JSONModel(oData);
					oAppsModel.setSizeLimit(1000);
					that.getOwnerComponent().setModel(oAppsModel, "apps");
				});
		},

		handleConfirmFilter: function(oEvent) {
			var dialog = oEvent.getSource();
			var oFilter = {};
			var filterItems = dialog.getFilterItems();
			var mParams = oEvent.getParameters();

			// Filtering
			for (var k = 0; k < filterItems.length; k++) {
				var filteredItem = filterItems[k].mAggregations.items;
				oFilter[filterItems[k].mProperties.key] = [];
				for (var i = 0; i < filteredItem.length; i++) {
					var keySelected = filteredItem[i].mProperties.key;
					var itemSelected = filteredItem[i].mProperties.selected;
					if (itemSelected === true) {
						oFilter[filterItems[k].mProperties.key].push(keySelected);
					}
				}
			}

			// Sorting
			var aSorters = [];
			var selectedSortItem = oEvent.getParameter("sortItem");
			if (selectedSortItem.getKey() !== "None") {
				aSorters.push(new sap.ui.model.Sorter(selectedSortItem.getKey(), oEvent.getParameter("sortDescending"), false));
			}

			// Update list binding
			if (aSorters.length > 0) {
				this.getView().byId("idTableApps").getBinding("items").sort(aSorters);
			} else {
				this.getView().byId("idTableApps").getBinding("items").sort();
			}

			this.filterList(JSON.stringify(oFilter));

			if (mParams.filterString) {
				// update filter bar
				this.byId("idFilterBar").setVisible(true);
				this.byId("idFilterLabel").setText(mParams.filterString + " (" + this.getView().byId("idTableApps").getItems().length + ")");
			} else {
				this.byId("idFilterBar").setVisible(false);
				this.byId("idFilterLabel").setText("");
			}

		},

		onClearFilters: function() {
			var oFilter = [];
			this.filterList(JSON.stringify(oFilter));
		},

		filterList: function(sFilterString) {
			var filters = [];
			if (sFilterString) {
				var oFilter = jQuery.parseJSON(sFilterString);
				var aOptions = Object.getOwnPropertyNames(oFilter);
				for (var i in aOptions) {
					var tempArray = [];
					var sOption = aOptions[i];

					var aSelectedItems = oFilter[sOption];
					for (var x in aSelectedItems) {
						var sSelectedItem = aSelectedItems[x];
						tempArray.push(new sap.ui.model.Filter(sOption, sap.ui.model.FilterOperator.Contains, sSelectedItem));

						if (aSelectedItems.length - 1 == x && tempArray.length > 0) {
							filters.push(new sap.ui.model.Filter(tempArray, false));
						}
					}
				}
			}
		}

		// Service Responses //

	});
}, true);
