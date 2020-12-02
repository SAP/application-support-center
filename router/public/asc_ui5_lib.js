jQuery.sap.declare("sap.asc");

var asc_sScreen;
var asc_sSelectedCategoryId;
var asc_sSelectedCategoryName;
var asc_sSelectedItemName;
var asc_sSearchTerm = "";
var asc_sAppName;
var asc_goData;
var asc_sServerUrl;
var asc_AppId;
var asc_sAppUrl;
var asc_sAppVersion;
var asc_oDialog;
var asc_sSupportEmail;
var asc_accessToken;
var asc_sFeedbackId;

sap.asc = {

	// ---------------------- Public Setters ---------------------- //
	setHelpServer: function (sServerUrl) {
		asc_sServerUrl = sServerUrl;
	},

	setAppId: function (sAppId) {
		asc_AppId = sAppId;
	},

	setAccessToken: function (sAccessToken) {
		asc_accessToken = sAccessToken;
	},

	setAppIconUrl: function (sUrl) {
		asc_sAppUrl = sUrl;
	},

	setAppVersion: function (sVersion) {
		asc_sAppVersion = sVersion;
	},

	setFeedbackId: function (sFeedbackId) {
		asc_sFeedbackId = sFeedbackId;
	},

	setSupportEmail: function (sSupportEmail) {
		asc_sSupportEmail = sSupportEmail;
	},

	// ---------------------- "Public" Functions ---------------------- //

	open: function () {
		asc_oDialog.open();
		asc_goData = {};
		this.syncData();
	},

	init: function () {
		try {
			this.buildUIDialog();
			this.loadCustomCss();
		} catch (err) {
			console.log("Error loading ASC: " + err);
		}
	},

	loadCustomCss: function () {
		var css = document.createElement("style");
		css.type = "text/css";
		css.innerHTML =
			"#asc_ASCHelp .sapMDialogScrollCont { padding: 0rem; } " +
			"#asc_likeBox .sapMILILabel { font-size: 0.9rem; color: #999999; } " +
			"#asc_detailContainer { margin: 1rem; font-size: 0.9rem; } " +
			".asc_listSmall .sapMSLITitleOnly, #asc_detailContent { font-size: 0.9rem; } " +
			".asc_listSmall .sapMGHLI { border-bottom-color: #e5e5e5 !important;} " +
			".asc_listSmall .sapMGHLITitle {text-transform: none; } ";

		document.body.appendChild(css);
	},

	// ---------------------- Data Load ---------------------- //

	syncData: async function () {
		sap.ui.getCore().byId("asc_ASCHelp").setBusy(true);
		await $.ajax({
			url: asc_sServerUrl + "/api/v1/apps/" + asc_AppId + "?access_token=" + asc_accessToken + "",
			xhrFields: {
				withCredentials: true
			},
			type: "GET",
			crossDomain: true,
			success: function (data) {
				sap.ui.getCore().byId("asc_ASCHelp").setBusy(false);
				asc_goData.app = data;

			},
			error: function (jqXHR, textStatus, errorThrown) {
				sap.ui.getCore().byId("asc_ASCHelp").setBusy(false);
				console.log(errorThrown);
			}
		});
		await $.ajax({
			url: asc_sServerUrl + "/api/v1/apps/" + asc_AppId + "/bulkdata?access_token=" + asc_accessToken + "",
			xhrFields: {
				withCredentials: true
			},
			type: "GET",
			crossDomain: true,
			success: function (data) {
				sap.ui.getCore().byId("asc_ASCHelp").setBusy(false);
				asc_goData.help = data.help;
				asc_goData.releases = data.releases;
				asc_goData.announcements = data.announcements;
				asc_goData.contacts = data.contacts;

			},
			error: function (help_data, textStatus, errorThrown) {
				sap.ui.getCore().byId("asc_ASCHelp").setBusy(false);
				console.log(errorThrown);
			}
		});
		this.loadMain();
	},

	// ---------------------- After Data Download ---------------------- //

	loadMain: function () {

		asc_sScreen = "Main";
		asc_sAppName = asc_goData.app.app_name;

		this.showElements(asc_sScreen);
		var oList = sap.ui.getCore().byId("asc_listItems");
		oList.removeAllItems();

		if (asc_goData.announcements && asc_goData.announcements.length > 0) {
			var oAnnouncementListItem = new sap.m.StandardListItem({
				title: "Announcements",
				press: this.onAnnouncementItemPress.bind(this),
				type: "Navigation"
			});
			oAnnouncementListItem.data("id", "announcements");
			oList.addItem(oAnnouncementListItem);
		}

		var oHelpListItem = new sap.m.StandardListItem({
			title: "Help Center",
			press: this.onHelpItemPress.bind(this),
			type: "Navigation"
		});
		oHelpListItem.data("id", "help");
		oList.addItem(oHelpListItem);

		var oReleaseListItem = new sap.m.StandardListItem({
			title: "Release Notes",
			press: this.onReleaseItemPress.bind(this),
			type: "Navigation"
		});
		oReleaseListItem.data("id", "releases");
		oList.addItem(oReleaseListItem);

		var oSupportListItem = new sap.m.StandardListItem({
			title: "Support",
			press: this.onSupportItemPress.bind(this),
			type: "Navigation"
		});
		oSupportListItem.data("id", "contacts");
		oList.addItem(oSupportListItem);
	},

	// ---------------------- UI Options helper---------------------- //

	showElements: function (sScreen) {
		if (sScreen === "Main") {
			sap.ui.getCore().byId("asc_dialogTitle").setText(asc_sAppName + " " + asc_sAppVersion);
			sap.ui.getCore().byId("asc_listItems").setVisible(true);
			sap.ui.getCore().byId("asc_infoBox").setVisible(true);
			sap.ui.getCore().byId("asc_btnBack").setVisible(false);
			sap.ui.getCore().byId("asc_detailContent").setVisible(false);
			sap.ui.getCore().byId("asc_listSearch").setVisible(false);
		} else if (sScreen === "List") {
			sap.ui.getCore().byId("asc_dialogTitle").setText(asc_sSelectedCategoryName);
			sap.ui.getCore().byId("asc_infoBox").setVisible(false);
			sap.ui.getCore().byId("asc_detailContent").setVisible(false);
			sap.ui.getCore().byId("asc_btnBack").setVisible(true);
			sap.ui.getCore().byId("asc_listItems").setVisible(true);
			sap.ui.getCore().byId("asc_listSearch").setVisible(false);
		} else if (sScreen === "Detail") {
			sap.ui.getCore().byId("asc_detailContent").setContent(" "); //Required otherwise details shows up blank
			sap.ui.getCore().byId("asc_dialogTitle").setText(asc_sSelectedItemName);
			sap.ui.getCore().byId("asc_listItems").setVisible(false);
			sap.ui.getCore().byId("asc_infoBox").setVisible(false);
			sap.ui.getCore().byId("asc_btnBack").setVisible(true);
			sap.ui.getCore().byId("asc_detailContent").setVisible(true);
			sap.ui.getCore().byId("asc_listSearch").setVisible(false);
		}

	},

	// ---------------------- UI Press Interactions/Functions ---------------------- //

	onBackPress: function () {
		if (asc_sScreen === "List") {
			this.loadMain();
		} else if (asc_sScreen === "Detail") {
			sap.ui.getCore().byId("asc_detailContent").setContent(" ");
			$('#asc_detailContainer').children().not('#asc_detailContent').remove();
			if (asc_sSelectedCategoryId == "help") {
				this.loadHelpItems();
			} else if (asc_sSelectedCategoryId == "releases") {
				this.loadReleaseItems();
			} else if (asc_sSelectedCategoryId == "contacts") {
				this.loadSupportItems();
			} else if (asc_sSelectedCategoryId == "announcements") {
				this.loadAnnouncementItems();
			}
		}
	},

	onClose: function () {
		sap.ui.getCore().byId("asc_ASCHelp").close();
	},

	onFeedbackIdPress: function (oEvent) {
		window.open("https://sap-it-cloud-sapitcf-feedback-feedback-approuter.cfapps.eu10.hana.ondemand.com/cp.portal/site?sap-ushell-config=standalone#feedback-Display&/topic/" + asc_sFeedbackId);
	},

	onSupportEmailPress: function (oEvent) {
		window.open("mailto:" + asc_sSupportEmail);
	},

	onAnnouncementItemPress: function (oEvent) {
		asc_sSelectedCategoryId = oEvent.getSource().data().id;
		asc_sSelectedCategoryName = oEvent.getSource().getProperty("title");
		this.loadAnnouncementItems();
	},

	onHelpItemPress: function (oEvent) {
		asc_sSelectedCategoryId = oEvent.getSource().data().id;
		asc_sSelectedCategoryName = oEvent.getSource().getProperty("title");
		this.loadHelpItems();
	},

	onReleaseItemPress: function (oEvent) {
		asc_sSelectedCategoryId = oEvent.getSource().data().id;
		asc_sSelectedCategoryName = oEvent.getSource().getProperty("title");
		this.loadReleaseItems();
	},

	onSupportItemPress: function (oEvent) {
		asc_sSelectedCategoryId = oEvent.getSource().data().id;
		asc_sSelectedCategoryName = oEvent.getSource().getProperty("title");
		this.loadSupportItems();
	},

	onItemPress: function (oEvent) {
		asc_sScreen = "Detail";

		if (asc_sSelectedCategoryId == "help") {
			asc_sSelectedItemName = oEvent.getSource().data().item.title
		} else if (asc_sSelectedCategoryId == "releases") {
			var sRelease = " - " + new Date(oEvent.getSource().data().item.release_date).toISOString().split('T')[0];
			asc_sSelectedItemName = oEvent.getSource().data().item.version + sRelease;
		} else if (asc_sSelectedCategoryId == "announcements") {
			asc_sSelectedItemName = oEvent.getSource().data().item.title;
		}

		this.showElements(asc_sScreen);
		var oDetailContent = sap.ui.getCore().byId("asc_detailContent");
		var sContent = oEvent.getSource().data().item.description;

		oDetailContent.setContent(sContent);
	},



	// ---------------------- List Search ---------------------- //

	onSearch: function (oEvent) {
		asc_sSearchTerm = sap.ui.getCore().byId("asc_searchText").getValue();
		if (asc_sSelectedCategoryId == 'help') {
			this.loadHelpItems();
		}
	},

	// ---------------------- UI + Data Viewers ---------------------- //

	loadAnnouncementItems: function () {
		asc_sScreen = "List";
		this.showElements(asc_sScreen);
		var oList = sap.ui.getCore().byId("asc_listItems");
		oList.removeAllItems();
		var itemArray;
		sap.ui.getCore().byId("asc_listSearch").setVisible(false);
		itemArray = asc_goData.announcements;
		if (itemArray.length > 0) {
			var oList = sap.ui.getCore().byId("asc_listItems");
			for (var i = 0; i < itemArray.length; i++) {
				var oDetailItem = new sap.m.StandardListItem({
					title: itemArray[i].title,
					press: this.onItemPress.bind(this),
					type: "Navigation"
				});
				oDetailItem.addStyleClass("asc_listSmall");
				oDetailItem.data("item", itemArray[i]);
				oList.addItem(oDetailItem);
			}
		}
	},

	loadHelpItems: function () {
		asc_sScreen = "List";
		this.showElements(asc_sScreen);
		var oList = sap.ui.getCore().byId("asc_listItems");
		oList.removeAllItems();
		var itemArray;
		sap.ui.getCore().byId("asc_listSearch").setVisible(true);

		if (asc_sSearchTerm.length > 0) {
			itemArray = asc_goData.help.filter(
				function (item) {
					return (item.title.match(new RegExp(asc_sSearchTerm, "i")));
				}
			);
		} else {
			itemArray = asc_goData.help;
		}
		if (itemArray.length > 0) {
			var oList = sap.ui.getCore().byId("asc_listItems");
			for (var i = 0; i < itemArray.length; i++) {
				var oDetailItem = new sap.m.StandardListItem({
					title: itemArray[i].title,
					press: this.onItemPress.bind(this),
					type: "Navigation"
				});
				oDetailItem.addStyleClass("asc_listSmall");
				oDetailItem.data("item", itemArray[i]);
				oList.addItem(oDetailItem);
			}
		}
	},

	loadReleaseItems: function () {
		asc_sScreen = "List";
		this.showElements(asc_sScreen);
		var oList = sap.ui.getCore().byId("asc_listItems");
		oList.removeAllItems();
		var itemArray;
		sap.ui.getCore().byId("asc_listSearch").setVisible(false);
		itemArray = asc_goData.releases;
		if (itemArray.length > 0) {
			var oList = sap.ui.getCore().byId("asc_listItems");
			for (var i = 0; i < itemArray.length; i++) {
				var oDetailItem = new sap.m.StandardListItem({
					title: itemArray[i].version,
					press: this.onItemPress.bind(this),
					type: "Navigation"
				});
				oDetailItem.addStyleClass("asc_listSmall");
				oDetailItem.data("item", itemArray[i]);
				oList.addItem(oDetailItem);
			}
		}
	},

	loadSupportItems: function () {
		asc_sScreen = "List";
		this.showElements(asc_sScreen);
		var oList = sap.ui.getCore().byId("asc_listItems");
		oList.removeAllItems();
		var itemArray;
		sap.ui.getCore().byId("asc_listSearch").setVisible(false);
		itemArray = asc_goData.contacts;
		if (itemArray.length > 0) {
			var oList = sap.ui.getCore().byId("asc_listItems");
			for (var i = 0; i < itemArray.length; i++) {
				var oDetailItem = new sap.m.StandardListItem({
					title: itemArray[i].first_name + ' ' + itemArray[i].last_name,
					type: "Active"
				});
				oDetailItem.addStyleClass("asc_listSmall");
				oDetailItem.data("item", itemArray[i]);
				oList.addItem(oDetailItem);
			}
		}
	},

	buildUIDialog: function () {
		if (asc_oDialog === undefined) {
			asc_oDialog = new sap.m.Dialog("asc_ASCHelp", {
				contentWidth: "30rem",
				contentHeight: "25rem",
				stretch: "{device>/isPhone}",
				afterOpen: function (test) {
					$("#asc_chkHide").prependTo("#asc_ASCHelp-footer");
				}
			});

			var oCustomHeader = new sap.m.Bar({
				contentLeft: [new sap.m.Button("asc_btnBack", {
					type: "Back",
					press: this.onBackPress.bind(this)
				})],
				contentMiddle: [new sap.m.Title("asc_dialogTitle")]
			}).addStyleClass("headerBgColor");

			var oIconFlexBox = new sap.m.FlexBox("asc_infoBox", {
				alignItems: "Center",
				justifyContent: "Center",
				visible: false,
				height: "220px"
			});

			var oIcon = new sap.m.Image("asc_appIcon", {
				height: "180px",
				src: asc_sAppUrl
			});

			var oIconVBox = new sap.m.VBox();
			oIconVBox.addItem(oIcon);
			oIconFlexBox.addItem(oIconVBox);

			asc_oDialog.addContent(oIconFlexBox);

			var oSearchToolBar = new sap.m.Toolbar("asc_listSearch", {
				visible: false,
				width: "100%"
			});
			var oSearchField = new sap.m.SearchField("asc_searchText", {
				width: "100%",
				liveChange: this.onSearch.bind(this),
				selectOnFocus: false
			});
			oSearchToolBar.addContent(oSearchField);
			asc_oDialog.addContent(oSearchToolBar);

			var oListItems = new sap.m.List("asc_listItems", {
				visible: false
			});
			asc_oDialog.addContent(oListItems);

			var oItemDetailFlexBox = new sap.m.FlexBox({
				id: "asc_detailContainer",
				direction: "Column",
				justifyContent: "SpaceBetween"
			});

			var oHTMLContent = new sap.ui.core.HTML({
				id: "asc_detailContent",
				visible: true,
				content: " "
			});

			oItemDetailFlexBox.addItem(oHTMLContent);
			asc_oDialog.addContent(oItemDetailFlexBox);

			var oCloseButton = new sap.m.Button("asc_btnClose", {
				text: "Close",
				press: this.onClose.bind(this)
			});
			asc_oDialog.addButton(oCloseButton);

			asc_oDialog.setCustomHeader(oCustomHeader);
		}
	}
};