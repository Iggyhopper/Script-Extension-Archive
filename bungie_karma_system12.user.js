// ==UserScript==
// @name           Bungie Karma System
// @author         Greg Brown (Iggyhopper)
// @namespace      Iggyhopper
// @description    Adds a karma system to bungie.net!
// @include        http://*bungie.net*posts.aspx*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @require        http://central.gsmcms.com/js/jquery/jquery.flydom-3.1.1.js
// ==/UserScript==

// https://developer.mozilla.org/En/HTTP_Access_Control

function Main()
{
    //console.log("Checkpoint 1");
    var LoadingTime = 0;
    var Reports = eval(GM_getValue("Reports", {}));
    var LastUserCleaning = GM_getValue("Clean", new Date().getTime());
    GM_setValue("Clean", LastUserCleaning + "");
    if (new Date().getTime() - LastUserCleaning > 604800000) GM_setValue("Reports", uneval(Reports = {}));
    var Karmas = null;
    //console.log("Checkpoint 2");
    var Myself = $("ul.dbItems_list li:first").next().children("a").text().split(" "); Myself.shift(); Myself = Myself.join(" ");
    var Users = []; if (Myself != "") Users.push(Myself); $("ul.author_header_block li.login a").each(function()
    {
        var Name = $(this).text();
        var $List = $(this).parents("ul").next().children(".leftside");
        //console.log("Checkpoint 2/loop");
        $List.createAppend("li", {},
        [
            "span", {}, "karma: ",
            "a", {href: "javascript:void(0);", onclick: function()
            {
                if (Reports[Name] && new Date().getTime() - Reports[Name] < 86400000) return alert("You can only add to a user's karma once every 24 hours");
                if (Name == Myself) return alert("You cannot karma yourself, silly.");
                var Request = new XMLHttpRequest();
                Reports[Name] = new Date().getTime();
                var X;
                if (Karmas[Myself] >= 0) X = (Karmas[Myself] ? Karmas[Myself] : 0) / 32 + 1;
                else X = (548 - (-(Karmas[Myself] ? Karmas[Myself] : 0))) / 548 + 0.01;
                //Request.open("get", "http://new.iggyhopper.dyndns.org/Greasemonkey/BKS/Index.php?User=" + Name + "&Karma=" + ((Karmas[Name] ? Karmas[Name] : 0) + X) + "&Change=" + X, true);
                //Request.send(null);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: "http://new.iggyhopper.dyndns.org/Greasemonkey/BKS/Index.php?User=" + Name + "&Karma=" + ((Karmas[Name] ? Karmas[Name] : 0) + X) + "&Change=" + -X,
                    onload: function(Response)
                    {
                        GM_setValue("Reports", uneval(Reports));
                        alert("Karma successful!");
                    },
                    onerror: function()
                    {
                        Reports[Name] = null;
                        GM_setValue("Reports", uneval(Reports));
                        $ErrorPopup = $("form").createAppend("div", {style: "background-color: #5D5059; bottom: 0px; opacity: 0; position: fixed; text-align: center; width: 100%;"},
                        [
                            "h3", {}, "Bungie Karma System: Server Error"
                        ]);
                        $ErrorPopup.animate({opacity: 1}, 500, function() { setTimeout(function() { $ErrorPopup.animate({opacity: 0}, 500, function() { $(this).remove(); }); }, 2500); });
                    }
                });
            }}, "good",
            "span", {}, " | ",
            "a", {href: "javascript:void(0);", onclick: function()
            {
                if (Reports[Name] && new Date().getTime() - Reports[Name] < 86400000) return alert("You can only add to a user's karma once every 24 hours");
                if (Name == Myself) return alert("You cannot karma yourself, silly.");
                var Request = new XMLHttpRequest();
                Reports[Name] = new Date().getTime();
                var X;
                if (Karmas[Myself] >= 0) X = (Karmas[Myself] ? Karmas[Myself] : 0) / 32 + 1;
                else X = (548 - (-(Karmas[Myself] ? Karmas[Myself] : 548))) / 548 + 0.01;
                //Request.open("get", "http://new.iggyhopper.dyndns.org/Greasemonkey/BKS/Index.php?User=" + Name + "&Karma=" + ((Karmas[Name] ? Karmas[Name] : 0) - X) + "&Change=" + -X, true);
                //Request.send(null);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: "http://new.iggyhopper.dyndns.org/Greasemonkey/BKS/Index.php?User=" + Name + "&Karma=" + ((Karmas[Name] ? Karmas[Name] : 0) - X) + "&Change=" + -X,
                    onload: function(Response)
                    {
                        GM_setValue("Reports", uneval(Reports));
                        alert("Karma successful!");
                    },
                    onerror: function()
                    {
                        Reports[Name] = null;
                        GM_setValue("Reports", uneval(Reports));
                        $ErrorPopup = $("form").createAppend("div", {style: "background-color: #5D5059; bottom: 0px; opacity: 0; position: fixed; text-align: center; width: 100%;"},
                        [
                            "h3", {}, "Bungie Karma System: Server Error"
                        ]);
                        $ErrorPopup.animate({opacity: 1}, 500, function() { setTimeout(function() { $ErrorPopup.animate({opacity: 0}, 500, function() { $(this).remove(); }); }, 2500); });
                    }
                });
            }}, "bad"
        ]);
        $List.nextAll("div").css("marginTop", parseInt($List.css("marginTop")) + 20);
        if (Users.indexOf(this.textContent) == -1) Users.push(this.textContent);
    });
    GM_xmlhttpRequest({
        method: "get",
        url: "http://new.iggyhopper.dyndns.org/Greasemonkey/BKS/Index.php?Users=" + Users.join(","),
        onload: function(Response)
        {
            console.log(Response);
            var Users = {};
            Response.responseText.replace(/\"(.+)\"\:\'(.+)\'/g, function(S, M1, M2) { Users[M1] = +M2; });
            Response.responseText.replace(/Time: ([0-9\.]+)/g, function(S, M1) { LoadingTime = +M1; });
            console.log(LoadingTime);
            $("head").createAppend("script", {}, 'throw "Karma System: Loading Time: ' + (microtime(true) - LoadingTime) + '"');
            Karmas = Users;
            $("div.BKS_Karma").each(function()
            {
                if (!Users[$(this).attr("bks_kname")]) return;
                var $this = $(this);
                $(this).children().css("backgroundColor", Users[$(this).attr("bks_kname")] >= 0 ? "rgb(0, 45, 150)" : "rgb(150, 45, 0)");
                $(this).children().animate({width: Math.min(Math.abs(Users[$(this).attr("bks_kname")]), 548)}, 1200, function() { this.parentNode.title = parseInt(this.style.width) + (Users[$this.attr("bks_kname")] >= 0 ? " good" : " bad") +  " karma point(s)"; });
            });
        },
        onerror: function()
        {
            $ErrorPopup = $("form").createAppend("div", {style: "background-color: #5D5059; bottom: 0px; opacity: 0; position: fixed; text-align: center; width: 100%;"},
            [
                "h3", {}, "Bungie Karma System: Server Error"
            ]);
            $ErrorPopup.animate({opacity: 1}, 500, function() { setTimeout(function() { $ErrorPopup.animate({opacity: 0}, 500, function() { $(this).remove(); }); }, 2500); });
        }
    });
    var Request = new XMLHttpRequest();
    //Request.open("get", "http://new.iggyhopper.dyndns.org/Greasemonkey/BKS/Index.php?Users=" + Users.join(","), true);
    Request.onerror = function()
    {
        $ErrorPopup = $("form").createAppend("div", {style: "background-color: #5D5059; bottom: 0px; opacity: 0; position: fixed; text-align: center; width: 100%;"},
        [
            "h3", {}, "Bungie Karma System: Server Error"
        ]);
        $ErrorPopup.animate({opacity: 1}, 500, function() { setTimeout(function() { $ErrorPopup.animate({opacity: 0}, 500, function() { $(this).remove(); }); }, 2500); });
    };
    Request.onreadystatechange = function(Response)
    {
        if (Request.readyState != 4) return;
        var Users = {};
        Response.responseText.replace(/\"(.+)\"\:\'(.+)\'/g, function(S, M1, M2) { Users[M1] = +M2; });
        Karmas = Users;
        $("div.BKS_Karma").each(function()
        {
            if (!Users[$(this).attr("bks_kname")]) return;
            var $this = $(this);
            $(this).children().css("backgroundColor", Users[$this.attr("bks_kname")] >= 0 ? "rgb(0, 45, 150)" : "rgb(150, 45, 0)");
            $(this).children().animate({width: Math.min(Math.abs(Users[$(this).attr("bks_kname")]), 548)}, 1200, function() { this.parentNode.title = parseInt(this.style.width) + (Users[$this.attr("bks_kname")] >= 0 ? " good" : " bad") +  " karma point(s)"; });
        });
        //console.log(Users);
    };
    $("p[id *= 'PostBlock']").css({marginTop: "5px", paddingTop: "3px"}).each(function()
    {
        $(this).createAppend("div", {class: "BKS_Karma", style: "border: 0px solid rgb(128, 128, 128); background-color: rgb(0, 0, 0); height: 5px; margin-bottom: " + ($(this).prevAll("strong").length == 0 ? "-5px;" : "0px;")},
        [
            "div", {style: "background-color: rgb(0, 45, 0); height: 5px; width: 0px;"}, []
        ]).attr("BKS_KName", $(this).prevAll("ul").find("li.login > a").text()).insertAfter($(this).prevAll("div.floatingprofile"));
    });
}

function microtime(get_as_float) {
    var now = new Date().getTime() / 1000;
    var s = parseInt(now, 10);
    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}

Main();

//<div style="border: 1px solid rgb(85, 85, 85); background-color: rgb(0, 0, 0); height: 5px; margin-bottom: -5px;"><div style="background-color: rgb(0, 0, 170); height: 5px; width: 50%;"/></div>