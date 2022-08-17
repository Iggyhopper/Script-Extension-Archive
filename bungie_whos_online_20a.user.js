// ==UserScript==
// @name           Bungie Who's Online 2.0
// @namespace      Iggyhopper
// @description    See who's online in bungie.net, only works with people who also have the script
// @include        http://*bungie.net/*
// @exclude        http://*bungie.net/*createpost.aspx*
// ==/UserScript==

function Main()
{
    var Myself = unsafeWindow.getCookie("BungieDisplayName"); Myself = Myself == null ? "0" : Myself.replace("&nbsp;", " ");
    //X("//script[contains(text(), 'NameFromCookie')]"); Myself = Myself.length != 0 ? Myself[0].nextSibling.textContent.substring(1) : "0";
    if (Url.search(/posts\.aspx/) == -1)
    {
        GM.LastPostTime = +GM.Get("LastPostTime", new Date().getTime());
        var TimePassed = new Date().getTime() - GM.LastPostTime;
        if (TimePassed > 300000 || !GM.Get("LastPostTime"))
        {
            GM.Set("LastPostTime", new Date().getTime().toString());
            var RequestData =
            {
                method: "get",
                url:  "http://new.iggyhopper.dyndns.org/Greasemonkey/BWO/Index.php?Users=" + Myself
            };
            GM.Request(RequestData);
        }
    }
    else
    {
        var Users = [Myself]; X("//li[@class = 'login']/a").map(function(I) { if (Users.indexOf(I.textContent) == -1) Users.push(I.textContent); });
        var Status = {};
        var Now = new Date().getTime();
        var RequestData =
        {
            method: "get",
            url:  "http://new.iggyhopper.dyndns.org/Greasemonkey/BWO/Index.php?Users=" + Users.join(","),
            onload: function(Response)
            {
                Response.responseText.replace(/"(.+)":"(.+)"/g, function(S, M1, M2) { Status[M1] = { Date: new Date(M2), Time: new Date(M2).getTime() }; });
                X("//li[@class = 'login']").map(function(I)
                {
                    var Name = null;
                    var Time = null;
                    var Avatar = null;
                    if (Data = Status[Name = X("a", I)[0].textContent])
                    {
                        Time = Data.Time;
                        var MaxSaturation = 600000;
                        var Saturation = Math.round(255 - (Math.min(Now - Time, MaxSaturation) / (MaxSaturation / 255))).toString(16);
                        Saturation += Saturation.length == 1 ? "0" : "";
                        Avatar = X("../../../div[@class = 'forumavatar']/a/img", I)[0];
                        Avatar.style.borderBottom = "2px ridge #0000" + Saturation;
                        /*var Bar = document.createElement("img");
                        Bar.style.border = "3px ridge black";
                        Bar.style.position = "absolute";
                        Bar.style.height = "4px";
                        Bar.style.left = "0px";
                        Bar.style.top = "98px";
                        Bar.style.width = "84px";
                        Avatar.parentNode.appendChild(Bar);*/
                        //(Avatar = X("../../../div[@class = 'forumavatar']/a/img", I)[0]).style.border = "ridge 2px #0000" + Saturation;
                        //(Avatar = X("../../../div[@class = 'forumavatar']/a/img", I)[0]).style.borderBottom = "ridge 4px #0000" + Saturation;
                        //Avatar.style.marginRight = "-4px";
                        Avatar.style.marginBottom = "-2px";
                        Avatar.parentNode.title = Name + " is " + (Saturation == "00" ? "off" : "on") + "line. Last activity: " + Data.Date.toLocaleString();
                    }
                });
            }
        };
        GM.Request(RequestData);
    }
}

function X(Selector, Context)
{
    var Evaluation = document.evaluate(Selector, Context != undefined ? Context : document, null, 0, null), Item = null, Result = [];
    while (Item = Evaluation.iterateNext()) Result.push(Item);
    return Result;
}

var GM =
{
    Get: GM_getValue,
    Set: GM_setValue,
    Request: GM_xmlhttpRequest
};

var Url = location.href;

Main();