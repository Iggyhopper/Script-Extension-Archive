// ==UserScript==
// @name           Bungie Tiny Coup
// @namespace      Iggyhopper
// @description    Over-simplified, faster version of Coup D Bungie
// @include        http://*bungie.net*posts.aspx*
// ==/UserScript==

unsafeWindow.BTCMain = BTCMain;
unsafeWindow.BTC_ToggleUserStyle = BTC_ToggleUserStyle;

/*Array.prototype.Contains = function(O)
{
    var A = this;
    var H = A.length, L = -1, M;
    while (H - L > 1)
        if (A[M = H + L >> 1] < O) L = M
        else H = M
    return A[H] == O ? H : -1;
};*/

/*Array.prototype.ContainsInner = function(O, I)
{
    var A = this;
    var H = A.length, L = -1, M;
    while (H - L > 1)
        if (A[M = H + L >> 1][I] < O) L = M;
        else H = M;
    return A[H][I] == O ? H : -1;
};*/

Array.prototype.Unique = function()
{
    var A = [];
    for (var I = 0; I < this.length; I++)
    {
        if (A.indexOf(this[I]) < 0) A.push(this[I]);
    }
    return A;
};



var UseFullOptionIsChecked = GM_getValue("UseFullOptionIsChecked", false);

function Main()
{
    var Names = []; if (Name = document.cookie.match(/BungieDisplayName=(\w+)/)) Names.push(Name[1]);
    var Head = Evaluate("html/head");
    var Script = document.createElement("script");
    var Usernames = Evaluate("//div/ul/li[@class='login']/a", null, true).map(function($this) { return $this.textContent; });
    var Quotes = Evaluate("//span[@class='IBBquotedtable']/b[1 and contains(., 'Posted by:')]", null, true).map(function($this) { return $this.nextSibling.textContent.substring(1); });
    Names = Usernames.concat(Names).concat(Quotes).Unique();
    Script.src = "http://new.iggyhopper.dyndns.org/Greasemonkey/BTC/Index.php?Names=" + Names.join(",");
    Script.type = "text/javascript";
    Head.appendChild(Script);
}

function Main_Full()
{
    Array.prototype.Contains = function(O)
    {
        for (var I = 0; I < this.length; I++)
        {
            if (this[I] == O)
            {
                return true;
            }
        }
        return false;
    };

    
    var Names = [];
    Names.push(getCookie("BungieDisplayName").replace(/&nbsp;/gi, " "));

    if (document.getElementById("ctl00_mainContent_postRepeater1_ctl01_ctl00_postControl_skin_usernameLink")){
    for (var I = 1; I < 25; I++)
    {
        var IString = I < 10 ? "0" + I : I;
        if (document.getElementById("ctl00_mainContent_postRepeater1_ctl" + IString + "_ctl00_postControl_skin_usernameLink"))
        {
            var name = document.getElementById("ctl00_mainContent_postRepeater1_ctl" + IString + "_ctl00_postControl_skin_usernameLink").innerHTML;
            if (!Names.Contains(name))
            {
                Names.push(name);
            }
        }
    }
    }

    var Head = document.getElementsByTagName("head")[0];
    var Scripts = [document.createElement("script"), document.createElement("script")];
    Scripts[0].src = "http://iggyhopper.dyndns.org/CoupDBungie/CoupDBungie.js";
    Scripts[0].type = "text/javascript";
    Scripts[1].src = "http://iggyhopper.dyndns.org/CoupDBungie/CoupDBungie.php?NameList=" + Names.join(",");
    Scripts[1].type = "text/javascript";
    Head.appendChild(Scripts[1]);
    Head.appendChild(Scripts[0]);
    LoadSettingsBox();
}

function BTCMain()
{
    var RTime = null;
    try { RTime = Math.round((microtime(true) - unsafeWindow.BTCServerRequestTime) * 1000) / 1000; console.log("BTC Server Request Time: " + RTime); } catch (E) {}
    var BTCData = null;
    try { BTCData = unsafeWindow.BTCData; } catch(E) {}
    if (!BTCData) return;
    var Posts = Evaluate("id('ctl00_mainColPanel')//span/div[@class='forumpost']", null, true);
    var Quotes = Evaluate("//span[@class='IBBquotedtable']/b[1 and contains(., 'Posted by:')]", null, true);
    var DisabledNames = getCookie("CDB_disableStyles");
    LoadSettingsBox(RTime);
    var Modifiers =
    [
        {Node: "./div[@class='postbody']/ul/li[@class='title']", "1": "innerHTML", "2": "style.color"},
        {Node: "./div[@class='postbody']/ul", "3": "style.backgroundImage", "4": "style.backgroundColor", "5": "style.borderColor"},
        {Node: "./div[@class='postbody']/p", "6": "style.color", "9": "style.fontFamily"},
        {Node: "./div[@class='forumavatar']/a/img", "7": "src"},
        {Node: "./div[@class='postbody']/ul/li[contains(@id, 'showMsgButton')]/a", "8": "style.color", "10": "innerHTML"}
    ];
    var Orange = ["Achilles1108", "ash55", "BobBQ", "Butane123", "Captain K Mart", "chris547", "Duardo", "El Roboto", "GameJunkieJim", "Gods Prophet", "goweb", "Nedus", "odmichael", "Pezz", "Qbix89", "Senor Leche", "Sir Fragula", "Skibur", "THE DON WAN", "The Slayer", "x Foman123 x"].sort();
    for (var I = 0; I < Posts.length; I++)
    {
        var J = -1;
        if ((J = ContainsInner(BTCData, Evaluate("./div[@class='postbody']/ul/li[@class='login']/a", Posts[I]).textContent, 0)) != -1)
        {
            if (DisabledNames.indexOf(BTCData[J][0]) == -1)
            {
                for (var K = 0; K < Modifiers.length; K++)
                {
                    var M = Modifiers[K];
                    var N = Evaluate(M.Node, Posts[I]);
                    AddToggleCheckBox(Posts[I], BTCData[J][0], "");
                    if (N.nodeName == "UL") N.style.border = "1px solid";
                    for (var P in M)
                    {
                        if (P != "Node" && BTCData[J][parseInt(P)] != "_default")
                        {
                            if (M[P].indexOf("style") > -1 && N.style != undefined)
                            {
                                if (M[P] == "style.backgroundImage") N.style[M[P].substring(6)] = "url(" + BTCData[J][parseInt(P)] + ")";
                                else N.style[M[P].substring(6)] = BTCData[J][parseInt(P)];
                            }
                            else N[M[P]] = BTCData[J][parseInt(P)];
                        }
                    }
                }
            }
            else AddToggleCheckBox(Posts[I], BTCData[J][0], "checked");
        }
    }
    
    
    
    for (var I = 0; I < Quotes.length; I++)
    {
        Quotes[I].parentNode.style.color = "#BBBBBB";
        Quotes[I].parentNode.style.fontFamily = "Arial, Helvetica, sans-serif";
        var J = -1;
        if ((J = ContainsInner(BTCData, Quotes[I].nextSibling.textContent.substring(1), 0)) != -1)
        {
            Quotes[I].parentNode.style.color = BTCData[J][6];
            Quotes[I].parentNode.style.fontFamily = BTCData[J][9];
        }
        if (Contains(Orange, Quotes[I].nextSibling.textContent.substring(1)) != -1)
        {
            Quotes[I].parentNode.style.color = "#FF9966";
            Quotes[I].parentNode.style.fontFamily = "Arial, Helvetica, sans-serif";
        }
            
    }
}

function AddToggleCheckBox(Post, Name, IsChecked)
{
    var RightList = Evaluate("./div[@class = 'postbody']/div/ul[@class = 'rightside']", Post);
    var DisableCheck = document.createElement("li");
	DisableCheck.innerHTML = "<input id='UserStyleCheckBox_" + Name + "' type='checkbox' onchange='CDB_ToggleUserStyle(this, \"" + Name + "\");' " + IsChecked + " />" +
	"<label style='position: absolute; margin-top: 3px;' for='UserStyleCheckBox_" + Name + "'>Disable User Style</label>";
	RightList.appendChild(DisableCheck);
}

function getCookie(name) {var results = document.cookie.match(name + "=(.*?)(;|$)");if (results) {return unescape(results[1]);} else {return null;}}

function UseFullOption_Change(EventArgs)
{
    GM_setValue("UseFullOptionIsChecked", EventArgs.currentTarget.checked);
}

function LoadSettingsBox(Rtime)
{
    var SidebarColPanel = document.getElementById("ctl00_sidebarColPanel");
    if (SidebarColPanel)
    {
        var BBCSettingsBox = document.createElement("div");
        BBCSettingsBox.className = "boxA";
        BBCSettingsBox.style.width = "218px";
        BBCSettingsBox.style.marginLeft = "5px";
        BBCSettingsBox.style.marginBottom = "8px";
        BBCSettingsBox.innerHTML = 
        "<ul>" +
            "<li>" +
                "<h3>Tiny Coup 1.1</h3>" +
            "</li>" +
            "<li>" +
                "<h4>Server Request Time: " + Rtime + "</h4>" +
            "</li>" +
        "</ul>" +
        "<div>" +
            "<input id='BTC_UseFullOption' type='checkbox' " + (UseFullOptionIsChecked ? "checked" : "") + "/>" +
            "<label for='BTC_UseFullOption' style='position: relative;'>Use Full Coup</label>" +
        "</div>";
        SidebarColPanel.insertBefore(BBCSettingsBox, document.getElementById("ctl00_forumSidebar_post_ad_rotator").parentNode);
        document.getElementById("BTC_UseFullOption").addEventListener("change", UseFullOption_Change, true);
    }
}

function Evaluate(Selector, Context, Overwrite)
{
    var Evaluation = document.evaluate(Selector, Context ? Context : document, null, 0, null),
        Item = null,
        Result = [];
    while (Item = Evaluation.iterateNext()) Result.push(Item);
    return !Overwrite ? (Result.length == 1 ? Result[0] : Result) : Result;
}

function Contains(A, O)
{
    var H = A.length, L = -1, M;
    while (H - L > 1)
        if (A[M = H + L >> 1] < O) L = M;
        else H = M;
    return A[H] == O ? H : -1;
}

function ContainsInner(A, O, I)
{
    var H = A.length, L = -1, M;
    while (H - L > 1)
        if (A[M = H + L >> 1][I] < O) L = M;
        else H = M;
    if (!A[H]) LogX(20, "Error: A[H] is undefined - ", A, H, M, L, O, I);
    return A[H] ? (A[H][I] == O ? H : -1) : -1;
}

function Log()
{
    var A = arguments, O = {};
    for (var I = 0; I < A.length; I++)
    {
        O[I.toString(36)] = A[I];
    }
    console.log(O);
}

var Logs = 0;
function LogX(X) // Logging in loops is fail, this function is for the win
{
    if (Logs > X) return; else Logs++;
    var A = arguments, O = {};
    for (var I = 1; I < A.length; I++)
    {
        O[I] = A[I];
    }
    console.log(O);
}

function Out()
{
    var A = arguments;
    for (var I = 0; I < A.length; I++)
    {
        unsafeWindow[A[I]] = A[I];
    }
}

function microtime(get_as_float) {
    // http://kevin.vanzonneveld.net
    // +   original by: Paulo Ricardo F. Santos
    // *     example 1: timeStamp = microtime(true);
    // *     results 1: timeStamp > 1000000000 && timeStamp < 2000000000
 
    var now = new Date().getTime() / 1000;
    var s = parseInt(now, 10);
 
    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}

function BTC_ToggleUserStyle(CheckBoxElement, User)
{
	var found = false;
	var i = 0;
	var oldCookie = String(getCookie('CDB_disableStyles'));
	if (oldCookie == 'null')
	{
		oldCookie = '';
	}
	var newCookie = oldCookie.split(',');
	while (!found && i < newCookie.length) 
	{
		if (newCookie[i] == User)
		{
			found = true;
		} else
		{
			i++;
		}
	}
		
	if (CheckBoxElement.checked)
	{
		//add user to cookie
		if (!found) {
			newCookie.push(User);
		}
	} else 
	{
		//remove user from cookie
		newCookieStart = newCookie.slice(0,i);
		newCookieEnd = newCookie.slice(i+1, newCookie.length);
		newCookie = newCookieStart.concat(newCookieEnd);
	}
	
	var cookieExpireDate = new Date();
	cookieExpireDate.setDate(cookieExpireDate.getDate() + 100);
	CDB_SetCookieWithExpires("CDB_disableStyles", newCookie, cookieExpireDate);	
}

function CDB_SetCookieWithExpires(Name, Value, Expires)
{
    document.cookie = Name + "=" + escape(Value) + ";path=/;expires=" + Expires.toUTCString();
}

UseFullOptionIsChecked ? Main_Full() : Main();