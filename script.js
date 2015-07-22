// ==UserScript==
// @name DMV
// @namespace https://www.dmv.ca.gov/wasapp/foa/findDriveTest.do
// @version 0.1
// @description Refreshes DMV
// @match https://www.dmv.ca.gov/wasapp/foa/findDriveTest.do
// ==/UserScript==

/* Feel free to build on this code and make it better */
var jq = document.createElement('script');
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js";    // add jQuery 1.6.4 to page
document.getElementsByTagName('head')[0].appendChild(jq);

jq.onload = run; //DON'T TYPE PARENTHESIS

//i.e. 'procede()' runs instantly and assigns return value to jq.onload
//     'procede' gives it a function to run when it's ready (what you want!)


function run() {
	var dateRangeContainerHTML = "";
	dateRangeContainerHTML += "<tr>";
	dateRangeContainerHTML +=     "<td bgcolor='#bdbdbd' colspan='2'>";
	dateRangeContainerHTML +=       "Indicate your desired date range";
	dateRangeContainerHTML +=       "From: <input id='from-time' name='from-time ' type='datetime-local'>";
	dateRangeContainerHTML +=       "To: <input id='to-time' name='to-time ' type='datetime-local'>";
	dateRangeContainerHTML +=       "<button id='stop-refresh'>Stop Refresh</button> ";
	dateRangeContainerHTML +=       "<button id='start-refresh'>Set and Start</button>";
	dateRangeContainerHTML +=     "</td>";
	dateRangeContainerHTML += "</tr>";
	$("tbody").first().prepend(dateRangeContainerHTML);

	/* declarations and initializations */
	var fromDate = getCookie("dmv_dt_from");
	var toDate = getCookie("dmv_dt_to");
	var refreshTimeout;

	/* if range defined, proceed with refresh */
	if (fromDate.length && toDate.length) {
		$("input#from-time").val(fromDate);
		$("input#to-time").val(toDate);
		refreshAndCheck();
	}

	function refreshAndCheck() {
		var dateString = getFormattedDate($('p.alert').text());
		console.log("Testing date: " + dateString," From: " + fromDate, " To: " + toDate);    // check in console
		if (isDateWithinRange(dateString, fromDate, toDate))
			alert("DATE DETECTED FOR " + dateString);
		refreshTimeout = setTimeout(function () { location.reload(); }, 10000);
	}

	function stopRefresh() {
		clearTimeout(refreshTimeout);
		alert("Refresh Stopped!");
	}

	/* attach button handlers */
	$("#stop-refresh").unbind().click(function () {
		stopRefresh();
	});
	$("#start-refresh").unbind().click(function () {
		fromDate = $("input#from-time").val();    // (YYYY-MM-DDThh:mm) e.g. "2014-02-05T14:03"
		toDate = $("input#to-time").val();
		setCookie("dmv_dt_from", fromDate, "365");
		setCookie("dmv_dt_to", toDate, "365");
		refreshAndCheck();
	});
}

function setCookie(c_name, value, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value + ";path=/";
}

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	/* if first cookie */
	if (c_start == -1)
		c_start = c_value.indexOf(c_name + "=");
	/* if cookie with name cannot be found */
	if (c_start == -1)
		c_value = null;
	/* else if cookie was found */
	else {
		c_start = c_value.indexOf("=", c_start) + 1;            // start of cookie string value (one afer "=")
		var c_end = c_value.indexOf(";", c_start);              // end of cookie string value
		if (c_end == -1)
			c_end = c_value.length;                				// if no endpoint found (last cookie), return till end of string
		c_value = unescape(c_value.substring(c_start,c_end));   // get unescaped string
	}
	c_value = c_value || "";
	return c_value;
}

/* text: "Wednesday, March 5, 2014 at 2:20 PM", returns (YYYY-MM-DDThh:mm) */
function getFormattedDate(text) {
	var tokenizedText = text.split(",");
	var month = tokenizedText[1].split(" ")[1];  // "March"
	var day = tokenizedText[1].split(" ")[2];    // "5"
	var year = tokenizedText[2].split(" ")[1];   // "2014"
	var time = tokenizedText[2].split(" ")[3];   // "2:20"
	var ampm = tokenizedText[2].split(" ")[4];   // "PM"
	/* format month in numerals */
	switch(month) {
		case "January": 	month = "01"; break;
		case "February":    month = "02"; break;
		case "March":       month = "03"; break;
		case "April":       month = "04"; break;
		case "May":         month = "05"; break;
		case "June":        month = "06"; break;
		case "July":        month = "07"; break;
		case "August":      month = "08"; break;
		case "September":   month = "09"; break;
		case "October":     month = "10"; break;
		case "November":    month = "11"; break;
		case "December":    month = "12"; break;
	}
	/* prepend 0 to day if necessary */
	if (day.length == 1)
		day = "0" + day;

	/* convert to 24 hour format */
	if (ampm == "PM") {
		var timeTokenized = time.split(":");
		var hours = +timeTokenized[0] + 12;
		time = hours + ":" + timeTokenized[1];
	}
	/* prepend 0 to time if necessary */
	if (time.length == 4)
		time = "0" + time;

	return (year + "-" + month + "-" + day + "T" + time);
}

function isDateWithinRange(date, fromDate, toDate) {
	if (date>fromDate && date<todate>
		console.log(date, " is within range!");
		return true;
	}
	else {
		console.log(date, " is not in range!");
		return false;
	}
}