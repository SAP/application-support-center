sap.ui.define([], function () {
	"use strict";
	return {
		stripHTML: function (sHTML) {
			if (sHTML) {
				return sHTML.replace(/<[^>]*>?/gm, '');
			} else {
				return sHTML;
			}
		},

		stripAndTruncateHTML: function (sHTML) {
			if (sHTML) {
				sHTML = sHTML.replace(/<[^>]*>?/gm, '');
				if (sHTML.length > 50) {
					sHTML = sHTML.substring(0, 50) + " ...";
				}
				return sHTML;
			} else {
				return sHTML;
			}
		},

		momentTimeAgo: function (sDate) {
			return moment.utc(sDate, "YYYY-MM-DD HH:mm").fromNow();
		},

		momentShortDate: function (sDate) {
			if (sDate) {
				return moment.utc(sDate).format("MM/DD/YYYY");
			} else {
				return "";
			}
		},

		momentDate: function (sDate) {
			if (sDate) {
				return moment.utc(sDate).format("MMM Do YYYY");
			} else {
				return "";
			}
		},

		momentDateMonthName: function (sDate) {
			//Receives 05/2020 -> May
			if (sDate) {
				var sNewDate = sDate.split("/")[0] + "/01/" + sDate.split("/")[1];
				return moment(sNewDate).format("MMMM");
			} else {
				return "";
			}
		},

		contentId: function (sDate) {
			return new Date(sDate).getTime();
		},

		statusText: function (sStatus) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sStatus) {
				case "A":
					return resourceBundle.getText("invoiceStatusA");
				case "B":
					return resourceBundle.getText("invoiceStatusB");
				case "C":
					return resourceBundle.getText("invoiceStatusC");
				default:
					return sStatus;
			}
		}
	};
});