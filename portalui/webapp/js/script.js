var urlParams;

(window.onpopstate = function () {
	var match,
		pl = /\+/g, // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) {
			return decodeURIComponent(s.replace(pl, " "));
		},
		query = window.location.search.substring(1);

	urlParams = {};
	while (match = search.exec(query))
		urlParams[decode(match[1])] = decode(match[2]);
})();

if ("appid" in urlParams) {
	$.ajax({
		type: "GET",
		url: "/api/v1/apps/" + urlParams.appid
	})
	.done(function (oData) {
		loadAppData(oData);
	});

	$.ajax({
		type: "GET",
		url: "/api/v1/apps/" + urlParams.appid + "/bulkdata"
	})
	.done(function (oData) {
		loadAppHelp(oData.help);
		loadAppReleases(oData.releases);
		loadAnnouncements(oData.announcements);
		loadAppContacts(oData.contacts);
	});
}

// SAP Specific Code
try {
	var tracking = new GlobalITTracking("ASCv2", "1.0.0");
	tracking.postEvent("Load Help Portal");
} catch (e) {
	if (console)
		console.log("Error: " + e);
}
// SAP Specific Code

function loadAppHelp(oData) {
	$.each(oData, function (i) {
		if (oData[i] !== undefined) {
			var html = '<div class="card">';
				html += '<div class="card-header">';
					html += '<h5 class="mb-0">';
						html += '<button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseHelp' + oData[i].help_id + '" aria-expanded="true" aria-controls="collapseHelp' + oData[i].help_id + '">';
							html += oData[i].title;
						html += '</button>';
					html += '</h5>';
				html += '</div>';

				html += '<div id="collapseHelp' + oData[i].help_id + '" class="collapse" data-parent="#accordion">';
					html += '<div class="card-body">';
						html += oData[i].description;
					html += '</div>';
				html += '</div>';
			html += '</div>';
			$("#helpAccordion").append(html);
		}
	});
}

function loadAnnouncements(oData) {
	if (oData && oData.length > 0) {
		$('#announcementContainer').show();
	}
	$.each(oData, function (i) {
		var html = '<tr>';
				html += '<td>';
					html += "<b>" + oData[i].title + "</b><br />" + oData[i].description;
					html += '</td>';
				html += '</tr>';
		$('#announcementTable > tbody:last-child').append(html);
	});
}


function loadAppReleases(oData) {
	$.each(oData, function (i) {
		var html = '<div class="card">';
				html += '<div class="card-header">';
					html += '<h5 class="mb-0">';
						html += '<button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseRelease' + oData[i].release_id + '" aria-expanded="true" aria-controls="collapseRelease' + oData[i].release_id + '">';
							html += moment(oData[i].release_date).format('L') + "  -  "  + oData[i].version;
						html += '</button>';
					html += '</h5>';
				html += '</div>';

				html += '<div id="collapseRelease' + oData[i].release_id + '" class="collapse" data-parent="#accordion">';
					html += '<div class="card-body">';
						html += oData[i].description;
					html += '</div>';
				html += '</div>';
			html += '</div>';
			$("#releaseAccordion").append(html);
	});
}

function loadAppContacts(oData) {
	var emailAddresses = '';
	$.each(oData, function (i) {
		emailAddresses += oData[i].email + ";";	
	});
	$("#supportEmail").append("<a href='mailto:" + emailAddresses + "' target='_blank'>Contact Us</a>");
}

function loadAppData(oData) {
	$("#appName").html(oData.app_name + ' - Support Center');
	$("#appName2").html(oData.app_name);
	$("#appStatus").html(oData.status);
	$("#technology").html(oData.technology);
	$("#storeCategory").html(oData.category);

	$("#goLiveDate").html(moment(oData.go_live).format('L'));
	
	if (oData.go_live == null) {
		$("#tr-golive").hide();
	}

	$("tr:visible").each(function (index) {
		$(this).css("background-color", !!(index & 1)? "rgba(0,0,0,.05)" : "rgba(0,0,0,0)");
	});

	// SAP Specific Code
	$("#feedbackService").attr("href", 'https://sap-it-cloud-sapitcf-feedback-feedback-approuter.cfapps.eu10.hana.ondemand.com/cp.portal/site?sap-ushell-config=standalone#feedback-Display&/topic/' + oData.feedback_service_id);
	// SAP Specific Code
}