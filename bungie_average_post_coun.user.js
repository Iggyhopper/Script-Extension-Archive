// CREATED BY CAVX
// UPDATED BY Iggyhopper

// ==UserScript==
// @name          Bungie Average Post Count
// @namespace     http://www.bungie.net/
// @description   Gives you the option to view a user's average posts per day.
// @include       http://*bungie.net/Account/Profile.aspx*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @require       http://central.gsmcms.com/js/jquery/jquery.flydom-3.1.1.js
// ==/UserScript==

function Main()
{
    var UserName = $("#ctl00_mainContent_header_lblUsername").text();
    var $Container = $("h3:contains('About Me')").createAppend("center", {style: "border: 1px solid white; cssFloat: right; height: 22px; width: 300px;"},
    [
        "div", {style: "background-color: #3B5F79; height: 22px; position: absolute;"}, "",
        "span", {style: "position: relative; top: -2px;"}, "[loading] PPD"
    ]);
    var Request = new XMLHttpRequest();
    Request.open("get", "http://www.bungie.net/Search/default.aspx?q=" + UserName + "&g=5&SR-p=12", true);
    Request.onreadystatechange = function()
    {
        if (Request.readyState != 4) return;
        var NowDate = new Date().getTime();
        var PastDate = Request.responseText.match(/[0-9]+\/[0-9]+\/[0-9]+/g); if (PastDate == null) return; PastDate = new Date(PastDate.pop()).getTime();
        var DayCount = Math.ceil((NowDate - PastDate) / 864e5);
        var PostCount = +Request.responseText.match(/([0-9]+) results/)[1];
        var AveragePostCount = Math.round(PostCount / DayCount * 100) / 100;
        $Container.children("span").text(AveragePostCount + " PPD");
        $Container.children("div").animate({width: Math.min(AveragePostCount * 6, 300)}, 500);
    };
    Request.send(null);
}

Main();