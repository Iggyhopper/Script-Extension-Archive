// ==UserScript==
// @name           Bungie Visitor Messages
// @namespace      Iggyhopper
// @description    Adds a visitor message center to all profiles
// @include        http://*bungie.net*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @require        http://central.gsmcms.com/js/jquery/jquery.flydom-3.1.1.js
// ==/UserScript==

//BETA

function Main()
{
    var S = "Greasemonkey Supports:\n";
    if (GM_getValue) S += "    GM_getValue\n";
    if (GM_setValue) S += "    GM_setValue\n";
    if (GM_xmlhttpRequest) S += "    GM_xmlhttpRequest\n";
    if (GM_listValues) S+= "    GM_listValues\n";
    if (GM_deleteValue) S+= "    GM_deleteValue\n";
    S += "\nYou may now disable this script.";
    alert(S);
    console.log(S);
}

Main();

// Update Every 10 Minutes
/*function Main()
{
    unsafeWindow.BVM_Main = BVM_Main;
    L(IsSignedIn, " ", IsProfilePage);
    if (Debug) {BVM_Main();
    unsafeWindow.$ = $;
    unsafeWindow.jQuery = jQuery;
    unsafeWindow.$X = $X;
    }
}

function BVM_Main()
{
    if (IsSignedIn) LoadVisitorUtility(); else return; 
    if (IsProfilePage) LoadVisitorTab();
    if (IsVisitorPage) LoadVisitorSystem();
    
    function LoadVisitorUtility()
    {
        $("#ctl00_dashboardNav_loggedInNormal div div ul li a.list-db-messages").parent().append(" | ").createAppend("a", {id: "BVM_VisitorLink", href: "/Account/Profile.aspx?page=Visitors"}, "Visitors");
        if (!IsVisitorPage)
        {
            //R("GET", "http://new.iggyhopper.dyndns.org/Greasemonkey/BVM/Index.php", {Name: "Iggyhopper", LastCheckTime})
        }
    }
    
    function LoadVisitorTab()
    {
        var VisitorTab = $("#ctl00_mainContent_hypMain").parent().clone().appendTo($("#ctl00_mainContent_hypMain").parent().parent()).children().attr("id", "ctl00_mainContent_lbVisitors").attr("href", 
        ($_GET["uid"] ? "?uid=" + $_GET["uid"] + "&" : $_GET["memberID"] ? "?memberID=" + $_GET["memberID"] + "&" : $_GET["player"] ? "?player=" + $_GET["player"] + "&" : "?") + "page=Visitors")
        .text("Visitor Messages").attr("class", "tab160");
        
    }
    
    function LoadVisitorSystem()
    {
        var TabLinks = $("#ctl00_mainContent_hypMain").parent().parent().children("li").children("a[class *= 'active']").each(function(I, N) { N.className = N.className.replace("_active", ""); });
        var ProfileInfo = $("#ctl00_mainContent_overviewh3_pnlNoGames,#ctl00_mainContent_overviewh3_pnlGameDetail").parent().next();
        if (ProfileInfo.length == 0) ProfileInfo = $("#ctl00_mainContent_profilePanel > div:first-child > div:first-child").parent().next();
        L(ProfileInfo);
        if (ProfileInfo.length == 0) ProfileInfo = $X("id('ctl00_mainContent_profilePanel')/div[2]");
        L(ProfileInfo);
        var ProfileBoxes = $X("./div/div/div/div", ProfileInfo);
        var ProfileName = $("#ctl00_mainContent_lblUsername").text();
        var UserName = $X("/html/body/div/form/div[4]/div/div/div/div[2]/ul/li/div/div[3]/ul/li[2]/a").text().split(" "); UserName.shift(); UserName.join(" ");
        $("#ctl00_mainContent_lbVisitors")[0].className += "_active";
        $("#ctl00_mainContent_overviewh3_pnlNoGames,#ctl00_mainContent_overviewh3_pnlGameDetail").parent().animate({opacity: 0}, 1000, function() { $(this).hide("slow") });
        ProfileInfo.animate({opacity: 0}, 1000, function()
        {
            this.style.visibility = "hidden";
            ProfileBoxes.eq(0).children("h3").text("Message").nextAll().remove();
            ProfileBoxes.css("backgroundColor", "#161617").css("width", "580px");
            ProfileBoxes.eq(0).createAppend(
            "p", {style: "margin: 10px 0 0 10px"},
            [
                "textarea", {id: "BVM_Message", cols: "67", rows: "3"}, [],
                "br", {}, [],
                "div", {class: "forumgroup3"},
                [
                    "div", {class: "create-post-actions"},
                    [
                        "ul", {},
                        [
                            "li", {class: "right-actions"},
                            [
                                "img", {id: "BVM_AjaxLoader", style: {opacity: 0, height: "20px", width: "20px", position: "relative", top: "8px"}, src: AjaxLoaderSimonGif}, [],
                                "a", {id: "BVM_Submit", class: "forum_post_submit_button", href: "javascript:void(0);", style: "margin-top: 7px; margin-bottom: 7px;", onclick: function(EventArgs)
                                {
                                    $("#BVM_AjaxLoader").animate({opacity: 1}, 450);
                                    $("#BVM_Submit").animate({opacity: 0}, 450, function() {this.style.visibility = "hidden";});
                                    setTimeout(function() { R("POST", "http://new.iggyhopper.dyndns.org/Greasemonkey/BVM/Message.php", {Message: $("#BVM_Message").val().replace(/\r|\n|\r\n/g, "<br />"), To: ProfileName, From: UserName.toString(), Time: new Date().getTime(), Avatar: $X("//img[@alt='avatar']").attr("src")}, function(Response)
                                    {
                                        if (Response.readyState == 4)
                                        {
                                            if (Response.status == 200) alert(Response.responseText);
                                            else alert("There was an error sending your message.");
                                            $("#BVM_AjaxLoader").animate({opacity: 0}, 500);
                                            $("#BVM_Submit").css("visibility", "visible").animate({opacity: 1}, 1000);
                                            $("#BVM_Message").val("");
                                        }
                                    }); }, 500);
                                }}, "submit"
                            ]
                        ]
                    ]
                ]
                
            ]);
            $("#BVM_AjaxLoader").css("float", "left");
            ProfileBoxes.eq(1).children("h3").text("Showing Messages").nextAll().remove();
            ProfileBoxes.eq(1).createAppend(
            "p", {id: "BVM_Messages"}, []
            );
            R("GET", "http://new.iggyhopper.dyndns.org/Greasemonkey/BVM/Index.php", {Name: ProfileName}, function(Response)
            {
                if (Response.readyState == 4)
                {
                    var BVM_MessageData = [];
                    if (Response.status == 200)
                    {
                        BVM_MessageData = Response.responseText;
                        for (var MSG in BVM_MessageData)
                        {
                            $("#BVM_Messages").append("<span>" + BVM_MessageData[MSG] + "</span><br />");
                        }
                    }
                    else alert("There was an error sending your message.");
                    
                }
            });
            this.style.visibility = "visible";
            $(this).animate({opacity: 1}, 1000);
        });
    }
}

function $X(Selector, Context)
{
    var Evaluation = document.evaluate(Selector = Selector, Context ? Context[0] : document, null, 0, null), Item = null, Result = [];
    while (Item = Evaluation.iterateNext()) Result.push(Item);
    return $(Result);
}

function GM(Name, Value, Default)
{
    var A = arguments, L = A.length;
    if (L == 0) return GM_listValues();
    else if (L == 1) return GM_getValue(Name);
    else if (L == 2) return GM_setValue(Name, Value);
    else return GM_getValue(Name, Default);
}

function L()
{
    console.log.apply(this, arguments);
}

function R(Type, Url, Data, Callback)
{
    var D = Data;
    if (D.constructor == Object)
    {
        var A = [];
        for (var K in D)
        {
            var V = D[K];
            A.push(K + "=" + V);
        }
        D = A.join("&");
    }
    var reqObj = {
	    method: Type,
	    url: Url + "?" + (Type.toLowerCase() == "get" ? D : ""),
	    data: D,
	    onreadystatechange: Callback
	};
	if (Type.toLowerCase() == "post") reqObj.headers = {'Content-type': 'application/x-www-form-urlencoded'};
    GM_xmlhttpRequest(reqObj);
}

var Debug = true;
var $_GET = eval("({" + location.search.substring(1).replace(/&/g, ",").replace(/([0-9a-zA-Z\_\-]+)=([0-9a-zA-Z\_\-]+)/g, "'$1':'$2'") + "})");
var IsProfilePage = location.href.match(/profile.aspx/i);
var IsVisitorPage = location.href.match(/page=Visitors/);
var IsSignedIn = $("#ctl00_dashboardNav_passportSignOutLink").length > 0;
//var LastCheckTime = GM("LastCheckTime", null, 0);
var AjaxLoaderSimonGif = "data:image/gif;base64,R0lGODlhHwAfAPUAABYWFwCj3BQiKBIuORA6Sg9CVA5JXRMoMA87TA1NYxMjKhIqMw5DVw1JXw9BUhExPRUaHA5FWRIsNxMiKASEsQONvgZ1nRA1QwlkhAxRagdymBUXGQlpigZ8pRE0QRUYGwZ6owSGtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAKAAAAIf4aQ3JlYXRlZCB3aXRoIGFqYXhsb2FkLmluZm8AIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAHwAfAAAG%2FkCAcEgUDAgFA4BiwSQexKh0eEAkrldAZbvlOD5TqYKALWu5XIwnPFwwymY0GsRgAxrwuJwbCi8aAHlYZ3sVdwtRCm8JgVgODwoQAAIXGRpojQwKRGSDCRESYRsGHYZlBFR5AJt2a3kHQlZlERN2QxMRcAiTeaG2QxJ5RnAOv1EOcEdwUMZDD3BIcKzNq3BJcJLUABBwStrNBtjf3GUGBdLfCtadWMzUz6cDxN%2FIZQMCvdTBcAIAsli0jOHSJeSAqmlhNr0awo7RJ19TJORqdAXVEEVZyjyKtE3Bg3oZE2iK8oeiKkFZGiCaggelSTiA2LhxiZLBSjZjBL2siNBOEBU4LxHA%2BmYEiRJzBO7ZCQIAIfkEAAoAAAAsAAAAAB8AHwAABv5AgHBIFAwIBQPAUCAMBMSodHhAJK5XAPaKOEynCsIWqx0nCIrvcMEwZ90JxkINaMATZXfju9jf82YAIQxRCm14Ww4PChAAEAoPDlsAFRUgHkRiZAkREmoSEXiVlRgfQgeBaXRpo6MOQlZbERN0Qx4drRUcAAJmnrVDBrkVDwNjr8BDGxq5Z2MPyUQZuRgFY6rRABe5FgZjjdm8uRTh2d5b4NkQY0zX5QpjTc%2FlD2NOx%2BWSW0%2B%2B2RJmUGJhmZVsQqgtCE6lqpXGjBchmt50%2BhQKEAEiht5gUcTIESR9GhlgE9IH0BiTkxrMmWIHDkose9SwcQlHDsOIk9ygiVbl5A2YLuV4HUmypMkTOkEAACH5BAAKAAAALAAAAAAfAB8AAAb%2BQIBwSBQMCAUDwFAgDATEqHR4QCSuVwD2ijhMpwrCFqsdJwiK73DBMGfdCcZCDWjAE2V347vY3%2FNmdXNECm14Ww4PChAAEAoPDltlDGlDYmQJERJqEhGHWARUgZVqaWZeAFZbERN0QxOeWwgAAmabrkMSZkZjDrhRkVtHYw%2B%2FRA9jSGOkxgpjSWOMxkIQY0rT0wbR2LQV3t4UBcvcF9%2FeFpdYxdgZ5hUYA73YGxruCbVjt78G7hXFqlhY%2FfLQwR0HIQdGuUrTz5eQdIc0cfIEwByGD0MKvcGSaFGjR8GyeAPhIUofQGNQSgrB4IsdOCqx7FHDBiYcOQshYjKDxlgPlZRjunCjdSTJkiZP6AQBACH5BAAKAAAALAAAAAAfAB8AAAb%2BQIBwSBQMCAUDwFAgDATEqHR4QCSuVwD2ijhMpwrCFqsdJwiK73DBMGfdCcZCDWjAE2V347vY3%2FNmdXNECm14Ww4PChAAEAoPDltlDGlDYmQJERJqEhGHWARUgZVqaWZeAFZbERN0QxOeWwgAAmabrkMSZkZjDrhRkVtHYw%2B%2FRA9jSGOkxgpjSWOMxkIQY0rT0wbR2I3WBcvczltNxNzIW0693MFYT7bTumNQqlisv7BjswAHo64egFdQAbj0RtOXDQY6VAAUakihN1gSLaJ1IYOGChgXXqEUpQ9ASRlDYhT0xQ4cACJDhqDD5mRKjCAYuArjBmVKDP9%2BVRljMyMQBwcfuBlBooSCBQwJiqkJAgAh%2BQQACgAAACwAAAAAHwAfAAAG%2FkCAcEgUDAgFA8BQIAwExKh0eEAkrlcA9oo4TKcKwharHScIiu9wwTBn3QnGQg1owBNld%2BO72N%2FzZnVzRApteFsODwoQABAKDw5bZQxpQ2JkCRESahIRh1gEVIGVamlmXgBWWxETdEMTnlsIAAJmm65DEmZGYw64UZFbR2MPv0QPY0hjpMYKY0ljjMZCEGNK09MG0diN1gXL3M5bTcTcyFtOvdzBWE%2B207pjUKpYrL%2BwY7MAB4EerqZjUAG4lKVCBwMbvnT6dCXUkEIFK0jUkOECFEeQJF2hFKUPAIkgQwIaI%2BhLiJAoR27Zo4YBCJQgVW4cpMYDBpgVZKL59cEBEIeU%2BQROQ4bBAoUlTZ7QCQIAIfkEAAoAAAAsAAAAAB8AHwAABv5AgHBIFAwIBQPAUCAMBMSodHhAJK5XAPaKOEynCsIWqx0nCIrvcMEwZ90JxkINaMATZXfju9jf82Z1c0QKbXhbDg8KEAAQCg8OW2UMaUNiZAkREmoSEYdYBFSBlWppZl4AVlsRE3RDE55bCAACZpuuQxJmRmMOuFGRW0djD79ED2NIY6TGCmNJY4zGQhBjStPTFBXb21DY1VsGFtzbF9gAzlsFGOQVGefIW2LtGhvYwVgDD%2B0V17%2B6Y6BwaNfBwy9YY2YBcMAPnStTY1B9YMdNiyZOngCFGuIBxDZAiRY1eoTvE6UoDEIAGrNSUoNBUuzAaYlljxo2M%2BHIeXiJpRIbNMaq%2BJSFCpsRJEqYOPH2JQgAIfkEAAoAAAAsAAAAAB8AHwAABv5AgHBIFAwIBQPAUCAMBMSodHhAJK5XAPaKOEynCsIWqx0nCIrvcMEwZ90JxkINaMATZXfjywjlzX9jdXNEHiAVFX8ODwoQABAKDw5bZQxpQh8YiIhaERJqEhF4WwRDDpubAJdqaWZeAByoFR0edEMTolsIAA%2ByFUq2QxJmAgmyGhvBRJNbA5qoGcpED2MEFrIX0kMKYwUUslDaj2PA4soGY47iEOQFY6vS3FtNYw%2Fm1KQDYw7mzFhPZj5JGzYGipUtESYowzVmF4ADgOCBCZTgFQAxZBJ4AiXqT6ltbUZhWdToUSR%2FIi1FWbDnDkUyDQhJsQPn5ZU9atjUhCPHVhQYNy%2FRSKsiqKFFbUaQKGHiJNyXIAAh%2BQQACgAAACwAAAAAHwAfAAAG%2FkCAcEh8JDAWCsBQIAwExKhU%2BHFwKlgsIMHlIg7TqQeTLW%2B7XYIiPGSAymY0mrFgA0LwuLzbCC%2F6eVlnewkADXVECgxcAGUaGRdQEAoPDmhnDGtDBJcVHQYbYRIRhWgEQwd7AB52AGt7YAAIchETrUITpGgIAAJ7ErdDEnsCA3IOwUSWaAOcaA%2FJQ0amBXKa0QpyBQZyENFCEHIG39HcaN7f4WhM1uTZaE1y0N%2FTacZoyN%2FLXU%2B%2F0cNyoMxCUytYLjm8AKSS46rVKzmxADhjlCACMFGkBiU4NUQRxS4OHijwNqnSJS6ZovzRyJAQo0NhGrgs5bIPmwWLCLHsQsfhFsSTe9QkOzCwC8sv5Ho127akyRM7QQAAOw%3D%3D";
var AjaxLoaderSnakeGif = "data:image/gif;base64,R0lGODlhIAAgAPUAABYWFwCj3A5DVwtZdAhtkAZ4oAWAqwZ6owdymAlkhAxTbQ1JXwhpjASFsgSGtASDsAV9pwpigQ5GWw9CVAlniQSItg9BUgOLugdulAxQaAONvgKPwQtWcg1OZQpceQd1mwpefQKRxAKQwgKTxQ1LYgGVyRA7SgGYzQ8%2BUBA5SBEvOxIuORIqMxEzQBA1QxMkLBQfJBMiKBQcIRUaHBUWFxMoMACg2ACj3ACc0wAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAHAAAAIf4aQ3JlYXRlZCB3aXRoIGFqYXhsb2FkLmluZm8AIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAIAAgAAAG%2FkCAcEicDBCOS8lBbDqfgAUidDqVSlaoliggbEbX8Amy3S4MoXQ6fC1DM5eNeh0%2BuJ0Lx0YuWj8IEQoKd0UQGhsaIooGGYRQFBcakocRjlALFReRGhcDllAMFZmalZ9OAg0VDqofpk8Dqw0ODo2uTQSzDQ12tk0FD8APCb1NBsYGDxzERMcGEB3LQ80QtdEHEAfZg9EACNnZHtwACd8FBOIKBwXqCAvcAgXxCAjD3BEF8xgE28sS8wj6CLi7Q2PLAAz6GDBIQMLNjIJaLDBIuBCEAhRQYMh4WEYCgY8JIoDwoGCBhRQqVrBg8SIGjBkcAUDEQ2GhyAEcMnSQYMFERQsVLDXCpEFUiwAQIUEMGJCBhEkTLoC2hPFyhhsLGW4K6rBAAIoUP1m6hOEIK04FGRY8jaryBdlPJgQscLpgggmULMoEAQAh%2BQQABwAAACwAAAAAIAAgAAAG%2FkCAcEicDDCPSqnUeCBAxKiUuEBoQqGltnQSTb9CAUMjEo2woZHWpgBPFxDNZoPGqpc3iTvaeWjkG2V2dyUbe1QPFxd%2FciIGDBEKChEEB4dCEwcVFYqLBxmXYAkOm6QVEaFgCw%2BkDQ4NHKlgFA21rlCyUwIPvLwIuV8cBsMGDx3AUwzEBr%2FIUggHENKozlEH19dt1UQF2AfH20MF3QcF4OEACN0FCNroBAUfCAgD6EIR8ggYCfYAGfoICBBYYE%2BAPgwCPfQDgZAAgwTntkkQyIBCggh60HFg8DACiAEZt1kAcTHCgAEKFqT4MoPGJQERYp5UkGGBBRcqWLyIAWNGQ8tQEmSi7LBgggmcOmHI%2BBnKAgeUCogaRbqzJ9NLKEhIIioARYoWK2rwXNrSZSgTC7haOJpTrNIZzkygQMF2RdI9QQAAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBInHAwj0ZI9HggBhOidDpcYC4b0SY0GpW%2BpxFiQaUKKJWLRpPlhrjf0ulEKBMXh7R6LRK933EnNyR2Qh0GFYkXexttJV5fNgiFAAsGDhUOmIsQFCAKChEEF5GUEwVJmpoHGWUKGgOUEQ8GBk0PIJS6CxC1vgq6ugm%2BtbnBhQIHEMoGdceFCgfS0h3PhQnTB87WZQQFBQcFHtx2CN8FCK3kVAgfCO9k61PvCBgYhPJSGPUYBOr5Qxj0I8AAGMAhIAgQZGDsIIAMCxNEEOAQwAQKCSR%2BqghAgcQIHgZIqDhB44ABCkxUDBVSQYYOKg9aOMlBQYcFEkyokInS5kWCCSZcqKgRA8aMGTRoWLOQIQOJBRaCqmDxAoYMpORMLHgaVShVq1jJpbAgoevUqleVynNhQioLokaRqpWnYirctHPLBAEAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBInCgIBsNmkyQMJsSodLggNC5YjWYZGoU0iMV0Kkg8Kg5HdisKuUelEkEwHko%2BjXS%2BctFuRG1ucSUPYmMdBw8GDw15an1LbV6DJSIKUxIHSUmMDgcJIAoKIAwNI3BxODcPUhMIBhCbBggdYwoGgycEUyAHvrEHHnVDCSc3DpgFvsuXw0MeCGMRB8q%2BA87YAAIF3NwU2dgZH9wIYeDOIOXl3%2BfDDBgYCE7twwT29rX0Y%2FcMDBL6%2B%2FoxSPAPoJQECBNEMGSQCAiEEUDkazhEgUIQA5pRFLJAoYeMJjYKsQACI4cMDDdmGMBBQQYSIUVaaPlywYQWIgEsUNBhgUgECyZUiDRBgoRNFClasIix0YRPoC5UsHgBQ8YMGjQAmpgAVSpVq1kNujBhIurUqlcpqnBh9mvajSxWnAWLNWeMGDBm6K2LLQgAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBInCgYB8jlAjEQOBOidDqUMAwNR2V70XhFF8SCShVEDIbHo5GtdL0bkWhDEJCrmCY63V5%2BRSEhIw9jZCQIB0l7aw4NfnGAISUlGhlUEoiJBwZNBQkeGRkgDA8agYGTGoVDEwQHBZoHGB1kGRAiIyOTJQ92QwMFsMIDd0MJIruTBFUICB%2FPCJbFv7qTNjYSQh4YGM0IHNNSCSUnNwas3NwEEeFTDhpSGQTz86vtQtlSAwwEDAzs96ZFYECBQQJpAe9ESMAwgr2EUxJEiAACRBSIZCSCGDDgIsYpFTlC%2BUiFA0cFCnyRJNKBg4IMHfKtrIKyAwkJLmYOMQHz5lYEEzqrkFggAIUJFUEBmFggwYIJFypqJEUxAUUKqCxiBHVhFOqKGjFgzNDZ4qkKFi9gyJhBg8ZMFS3Opl3rVieLu2FnsE0K4MXcvXzD0q3LF4BewAGDAAAh%2BQQABwAAACwAAAAAIAAgAAAG%2FkCAcEicKBKHg6ORZCgmxKh0KElADNiHo8K9XCqYxXQ6ARWSV2yj4XB4NZoLQTCmEg7nQ9rwYLsvcBsiBmJjCwgFiUkHWX1tbxoiIiEXGVMSBAgfikkIEQMZGR4JBoCCkyMXhUMTFAgYCJoFDB1jGQeSISEjJQZQQwOvsbEcdUMRG7ohJSUEdgTQBBi1xsAbI7vMhQPR0ArVUQm8zCUIABYJFAkMDB7gUhDkzBIkCfb2Eu9RGeQnJxEcEkSIAGKAPikPSti4YYPAABAgPIAgcTAKgg0E8gGIOKAjnYp1Og7goAAFyDokFYQycXKMAgUdOixg2VJKTBILJNCsSYTeVwIBFnbyFIJCAlATKVgMHeJCQtAULlQsHWICaVQWL6YCUGHiao0XMLSqULECKwwYM6ayUIE1BtoZNGgsZWFWBly5U1%2B4nQFXq5CzfPH6BRB4MBHBhpcGAQAh%2BQQABwAAACwAAAAAIAAgAAAG%2FkCAcEgEZBKIgsFQKFAUk6J0Kkl8DljI0vBwOB6ExXQ6GSSb2MO2W2lXKILxUEJBID6FtHr5aHgrFxcQYmMLDHZ2eGl8fV6BGhoOGVMCDAQEGIgIBCADHRkDCQeOkBsbF4RDFiCWl5gJqUUZBxcapqYGUUMKCQmWlgpyQxG1IiHHBEMTvcywwkQcGyIiIyMahAoR2todz0URxiHVCAAoIOceIMHeRQfHIyUjEgsD9fUW7LIlxyUlER0KOChQMClfkQf9%2BhUAmKFhHINECCQs0aCDRRILTEAk4mGiCBIYJUhwsXFXwhMlRE6wYKFFSSEKTpZYicJEChUvp5iw6cLFRoqcUnq6UKGCBdAiKloUZVEjxtEhLIrWeBEDxlOoLF7AgCFjxlUAMah2nTGDxtetZGmoNXs1LduvANLCJaJ2rt27ePPKCQIAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBIBHRABMzhgEEkFJOidCoANT%2BF7PJg6DIW06llkGwiCtsDpGtoPBKC8HACYhCSiDx6ue42Kg4HYGESEQkJdndme2wPfxUVBh1iEYaHDHYJAwokHRwgBQaOjxcPg0Mon5WWIKdFHR8OshcXGhBRQyQDHgMDIBGTckIgf7UbGgxDJgoKvb1xwkMKFcbHgwvM2RLRRREaGscbGAApHeYdGa7cQgcbIiEiGxIoC%2FX1KetFGSLvIyEgFgQImCDAQj4pEEIoFIHAgkMTKFwcLMJAYYgRBkxodOFCxUQiHkooLLEhBccWKlh8lFZixIgSJVCqWMHixUohCmDqTMmixkqLGDcBhNQpgkXNGDBgBCWgs8SDFy%2BSwpgR9AOOGzZOfEA6dcYMGkEBTGCgIQGArjTShi3iVe1atl%2FfTokrVwrYunjz6t3Lt%2B%2FbIAAh%2BQQABwAAACwAAAAAIAAgAAAG%2FkCAcEgEdDwMAqJAIEQyk6J0KhhQCBiEdlk4eCmS6dSiSFCuTe2n64UYIBGBeGgZJO6JpBKx9h7cBg8FC3MTAyAgEXcUSVkfH34GkoEGHVMoCgOHiYoRChkkHQogCAeTDw0OBoRFopkDHiADYVMdCIEPDhUVB1FDExkZCsMcrHMAHgYNFboVFEMuCyShohbHRAoPuxcXFawmEuELC9bXRBEV3NwEACooFvAC5eZEHxca%2BBoSLSb9%2FS30imTIt2GDBxUtXCh0EVCKAQ0iCiJQQZHiioZFGGwIEdEAi48fa2AkMiBEiBEhLrxYGeNFjJFDFJwcMUIEjJs4YQqRSbOmVYwZM2TIgKETWQmaJTQAXTqjKIESUEs8oEGValOdDqKWKEBjCI2rIxWcgHriBAgiVHVqKDF2LK2iQ0DguFEWAdwpCW7gMHa3SIK%2BgAMLHky4sOGAQQAAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBIBCw4kQQBQ2F4MsWoFGBRJBNNAgHBLXwSkmnURBqAIleGlosoHAoFkEAsNGU4AzMogdViEB8fbwcQCGFTJh0KiwMeZ3xqf4EHlBAQBx1SKQskGRkKeB4DGR0LCxkDGIKVBgYHh0QWEhKcnxkTUyQElq2tBbhDKRYWAgKmwHQDB70PDQlDKikmJiiyJnRECgYPzQ4PC0IqLS4u0y7YRR7cDhUODAA1Kyrz5OhRCOzsDQIvNSz%2FKljYK5KBXYUKFwbEWNhP4MAiBxBeuEAAhsWFMR4WYVBBg8cDM2bIsAhDI5EBGjakrBCypQyTQxRsELGhJo2bNELCFKJAhF7PmkNyztgJYECIoyIuEKFBFACDECNGhDDQtMiDo1ERVI1ZAmpUEFuFPCgRtYQIWE0TnCjB9oTWrSBKrGVbAtxWAjfmniAQVsiAvCcuzOkLAO%2BITIT9KkjMuLFjmEEAACH5BAAHAAAALAAAAAAgACAAAAb%2BQIBwSARMOgNPIgECDTrFqBRgWmQUgwEosmQQviDJNOqyLDpXThLU%2FWIQCM9kLGyhBJIFKa3leglvHwUEYlMqJiYWFgJ6aR5sCV5wCAUFCCRSLC0uLoiLCwsSEhMCewmAcAcFBx%2BFRCsqsS4piC5TCwkIHwe8BxhzQy8sw7AtKnRCHJW9BhFDMDEv0sMsyEMZvBAG2wtCMN%2FfMTHWRAMH29sUQjIzMzLf5EUE6A8GAu347fFEHdsPDw4GzKBBkOC%2BIh8AOqhAwKAQGgeJJGjgoOIBiBGlDKi48EHGKRkqVLhA8qMUBSQvaLhgMsoAlRo0OGhZhEHMDRoM0CRiYINWzw0IdgrJIKLoBhEehAI4EEJE0w2uWiYIQZVq0J0DRjgNMUJDN5oJSpQYwXUEAZoCNIhdW6KBgJ0XcLANAUWojRNiNShQutRG2698N2B4y1dI1MJjggAAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBIBJgkHQVnwFQsitAooHVcdDIKxcATSXgHAimURUVZJFbstpugEBiDiVhYU7VcJjM6uQR1GQQECBQSYi8sKyoqeCYCEiRZA34JgIIIBE9QMDEvNYiLJqGhKEgDlIEIqQiFRTCunCyKKlISIKgIHwUEckMzMzIymy8vc0IKGKkFBQcgvb6%2BwTDFQx24B8sFrDTbNM%2FTRArLB%2BMJQjRD3d9FDOMHEBBhRNvqRB3jEAYGA%2FTFCPn5DPjNifDPwAeBYjg8MPBgIUIpGRo%2BcNDgYZQMDRo4qFDRYpEBDkJWeOCxSAKRFQ6UJHLgwoUKFwisFJJBg4YLN%2FfNPKBhg1XNC6xKRhAhoqcGmSsHbCAqwmcmjwlEhGAqAqlFBQZKhNi69UE8hAgclBjLdYQGEh4PnBhbYsTYCxlKMrDBduyDpx5trF2L4WtJvSE%2B4F2ZwYNfKEEAACH5BAAHAAAALAAAAAAgACAAAAb%2BQIBwSAS0TBPJIsPsSIrQKOC1crlMFmVGwRl4QAqBNBqrrVRXlGDRUSi8kURCYRkPYbEXa9W6ZklbAyBxCRQRYlIzMzJ4emhYWm%2BDchQMDAtSNDSLeCwqKn1%2BCwqTCQwEqE9RmzONL1ICA6aoBAgUE5mcdkIZp7UICAO5MrtDJBgYwMCqRZvFRArAHx8FEc%2FPCdMF24jXYyTUBwUHCt67BAfpBwnmdiDpEBAI7WMK8BAH9FIdBv39%2BlEy%2BPsHsAiHBwMLFknwoOGDDwqJFGjgoCKBiLwcVNDoQBjGAhorVGjQrWCECyhFMsA44IIGDSkxKUywoebLCxQUChQRIoRETQMln7lJQKBCiZ49a1YgQe9BiadHQ4wY4fNCBn0lTkCVOjWEAZn0IGiFWmLEBgJBzZ1YyzYEArAADZy4UOHDAFxjggAAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBIBLxYKlcKZRFMLMWoVAiDHVdJk0WyyCgW0Gl0RobFjtltV8EZdMJiAG0%2Bk1lZK5cJNVl02AMgAxNxQzRlMTUrLSkmAn4KAx4gEREShXKHVYlIehJ%2FkiAJCRECmIczUyYdoaMUEXBSc5gLlKMMBAOYuwu3BL%2BXu4UdFL8ECB7CmCC%2FCAgYpspiCxgYzggK0nEU1x8R2mIDHx8FBQTgUwrkBwUf6FIdBQfsB%2B9RHfP59kUK%2BfP7RCIYgDAQAcAhCAwoNEDhIIAODxYa4OAQwYOIEaPtA%2BGgY4MGDQFyaNCxgoMHCwBGqHChgksHCfZlOKChZssKEDQWQkAggk4CBREYPBCxoaaGCxdQKntQomnTECFEiNBQVMODDNJuOB0BteuGohBSKltgY2uIEWiJamCgc5cGHCecPh2hAYFYbRI%2BuCxxosIDBIPiBAEAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBIBNBmM1isxlK1XMWotHhUvpouk8WSmnqHVdhVlZ1IFhLTV0qrxsZlSSfTQa2JbaSytnKlUBMLHQqEAndDSDJWTX9nGQocAwMTh18uAguPkhEDFpVfFpADIBEJCp9fE6OkCQmGqFMLrAkUHLBeHK0UDAyUt1ESCbwEBBm%2FUhHExCDHUQrKGBTNRR0I1ggE00Qk19baQ9UIBR8f30IKHwUFB%2BXmIAfrB9nmBAf2BwnmHRAH%2FAen3zAYMACB36tpIAYqzKdNgYEHCg0s0BbhgUWIDyKsEXABYJQMBxxUcOCgwYMDB6fYwHGiAQFTCiIwMKDhwoWRIyWuUXCihETPEiNGhBi6QUPNCkgNdLhz44RToEGFhiha8%2BaBiWs6OH0KVaiIDUVvMkj5ZcGHElyDTv16AQNWVKoQlAwxwiKCSV%2BCAAAh%2BQQABwAAACwAAAAAIAAgAAAG%2FkCAcEgk0mYzGOxVKzqfT9pR%2BWKprtCs8yhbWl2mlEurlSZjVRXYMkmRo8dzbaVKmSaLBer9nHVjXyYoAgsdHSZ8WixrEoUKGXuJWS6EHRkKAySSWiYkl5gDE5tZFgocAx4gCqNZHaggEQkWrE8WA7AJFJq0ThwRsQkcvE4ZCbkJIMNFJAkMzgzKRAsMBNUE0UML1hjX2AAdCBjh3dgDCOcI0N4MHx%2FnEd4kBfPzq9gEBwX5BQLlB%2F%2F%2F4D25lUgBBAgAC0h4AuJEiQRvPBiYeBBCMmI2cJQo8SADlA4FHkyk%2BKFfkQg2bGxcaYCBqgwgEhxw0OCByIkHFjyRsGFlUIkQQEUI1aDhQoUKDWiKPNAhy4IGDkuMGBE0BNGiRyvQLKBTiwAMK6eO2CBiA1GjRx8kMPlmwYcNIahumHv2wgMCXTdNMGczxAaRBDiIyhIEACH5BAAHAAAALAAAAAAgACAAAAb%2BQIBwSCwOabSZcclkImcwWKxJXT6lr1p1C3hCY7WVasV1JqGwF0vlcrXKzJlMWlu7TCgXnJm2p1AWE3tNLG0mFhILgoNLKngTiR0mjEsuApEKC5RLAgsdCqAom0UmGaADAxKjRR0cqAMKq0QLAx4gIAOyQxK3Eb66QhK%2BCcTAABLEycYkCRTOCcYKDATUEcYJ1NQeRhaMCwgYGAQYGUUXD4wJCOvrAkMVNycl0HADHwj3CNtCISfy8rm4ZDhQoGABDKqEYCghr0SJEfSoDDhAkeCBfUImXGg4IsQIA%2BWWdEAAoSJFDIuGdAjhMITLEBsMUACRIQOIBAceGDBgsoBWJiMKRDgc0VHEBg0aLjhY%2BkDnTggQCpBosuBBx44wjyatwHTnTgQJmwggICKE0Q1HL1TgWqFBUwMJ3HH5pgEm0gtquTowwCAsnAkDMOzEW5KBgpRLggAAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBILBqPyGSSpmw2aTOntAiVwaZSGhQWi2GX2pk1Vnt9j%2BEZDPZisc5INbu2UqngxzlL5Urd8UVtfC4mJoBGfCkmFhMuh0QrihYCEoaPQ4sCCx0Sl5gSmx0dnkImJB0ZChmkACapChwcrCiwA7asErYeu0MeBxGAJCAeIBG2Gic2JQ2AAxHPCQoRJycl1gpwEgnb2yQS1uAGcCAMDBQUCRYAH9XgCV8KBPLyA0IL4CEjG%2FVSHRjz8joJIWAthMENwJpwQMAQAQYE%2FIQIcFBihMEQIg6sOtKBQYECDREwmFCExIURFkNs0HDhQAIPGTI4%2B3Cg5oECHxAQEFgkw1AFjCI2rLzgwEGDBw8MGLD5ESSJJAsMBF3JsuhRpQYg1CxwYGcTAQQ0iL1woYJRpFi3giApZQGGCmQryHWQVCmEBDyxTOBAoGbRmxQUsEUSBAAh%2BQQABwAAACwAAAAAIAAgAAAG%2FkCAcEgsGo%2FIpHLJbDqf0CiNNosyp1UrckqdwbRHrBcWAxdnaBjsxTYTZepXjcVyE2Nylqq1sgtjLCt7Li1%2BQoMuJimGACqJJigojCqQFgISBg8PBgZmLgKXEgslJyclJRlgLgusHR0ip6cRYCiuGbcOsSUEYBIKvwoZBaanD2AZHAMDHB0RpiEhqFYTyh7KCxIjJSMjIRBWHCDi4hYACNzdIrNPHQkR7wkKQgsb3NAbHE4LFBQJ%2FgkThhCAdu%2FCOiUKCChk4E%2FeEAEPNkjcoOHCgQ5ISCRAgEEhAQYRyhEhcUGihooOHBSIMMDVABAEEMjkuFDCkQwOTl64UMFBSQNNnA4ILfDhw0wCC5IsgLCzQs%2BfnAwIHWoUAQWbSgQwcOrUwSZOEIYWKIBgQMAmCwg8SPnVQNihCbBCmaCAQYEDnMgmyHAWSRAAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBILBqPyKRyyWw6n9CodEpV0qrLK%2FZIo822w2t39gUDut4ZDAAyDLDkmQxGL5xsp8t7OofFYi8OJYMlBFR%2BgCwsIoQle1IxNYorKo0lClQ1lCoqLoQjJRxULC0upiaMIyElIFQqKSkmsg8lqiEMVC4WKBa9CCG2BlQTEgISEhYgwCEiIhlSJgvSJCQoEhsizBsHUiQZHRnfJgAIGxrnGhFQEgrt7QtCCxob5hoVok0SHgP8HAooQxjMO1fBQaslHSKA8MDQAwkiAgxouHDBgcUPHZBIAJEgQYSPEQYAJEKiwYUKFRo0ePAAAYgBHTooGECBAAEGDDp6FHAkw04DlA5WGhh64EABBEgR2CRAwaOEJAsOOEj5YCiEokaTYlgKgqcSAQkeCDVwFetRBBiUDrDgZAGDoQbMFijwAW1XKRMUJKhbVGmEDBOUBAEAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBILBqPyKRyyWw6n9CodEqFUqrJRQkHwhoRp5PtNPAKJaVTaf0xA0DqdUnhpdEK8lKDagfYZw8lIyMlBFQzdjQzMxolISElHoeLizIig490UzIwnZ0hmCKaUjAxpi8vGqAiIpJTMTWoLCwGGyIhGwxULCu9vQgbwRoQVCotxy0qHsIaFxlSKiYuKdQqEhrYGhUFUiYWJijhKgAEF80VDl1PJgsSAhMTJkILFRfoDg%2BjSxYZJAv%2FElwMoVChQoMGDwy4UiJBgYIMGTp0mEBEwAEH6BIaQNABiQAOHgYMcKiggzwiCww4QGig5QEMI%2F9lUAAiQQQQIQdwUIDiSFEHAxoNQDhwoAACBBgIEGCQwOZNEAMoIllQQCNRokaRKmXaNMIAC0sEJHCJtcAHrUqbJlAAtomEBFcLmEWalEACDgKkTMiQQKlRBgxAdGiLJAgAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBILBqPyKRyyWw6n0yFBtpcbHBTanLiKJVsWa2R4PXeNuLiouwdKdJERGk08ibgQ8mmFAqVIHhDICEjfSVvgQAIhH0GiUIGIiEiIgyPABoblCIDjzQboKAZcDQ0AKUamamIWjMzpTQzFakaFx5prrkzELUaFRRpMMLDBBfGDgdpLzExMMwDFxUVDg4dWi8sLC8vNS8CDdIODQhaKior2doADA7TDwa3Ty0uLi3mK0ILDw7vBhCsS1xYMGEiRQoX%2BIQk6GfAwIFOS1BIkGDBAgoULogIKNAPwoEDBEggsUAiA4kFEwVYaKHmQEOPHz8wGJBhwQISHQYM4KAgQ1mHkxIyGungEuaBDwgwECDAIEEEEDp5ZjBpIokEBB8LaEWQlCmFCE897FTQoaoSASC0bu3KNIFbEFAXmGUiIcEHpFyXNnUbIYMFLRMygGDAAAEBpxwW%2FE0SBAAh%2BQQABwAAACwAAAAAIAAgAAAG%2FkCAcEgsGo9I4iLJZAowuKa0uHicTqXpNLPBnnATLXOxKZnNUfFx8jCPzgb1kfAOhcwJuZE8GtlDA3pGGCF%2BhXmCRBIbIiEiIgeJRR4iGo8iGZJECBudGnGaQwYangyhQw4aqheBpwAXsBcVma6yFQ4VCq4AD7cODq2nBxXEDYh6NEQ0BL8NDx%2BJNNIA0gMODQbZHXoz3dI0MwIGD9kGGHowMN3dQhTk2QfBUzEx6ekyQgvZEAf9tFIsWNR4Qa%2FekAgG%2BvUroKuJihYqVgisEYOIgA8KDxRAkGDJERcmTLhwoSIiiz0FNGpEgIFAggwkBEyQIGHBAgEWQo5UcdIIWIkPBQp8QICAAAMKCUB4GKAgQ4cFEiygMJFCRRIJBDayJGA0QQQQA5jChDrBhFUmE0AQLdo16dKmThegcKFFAggMLRkk2AtWrIQUeix0GPB1b9gOAkwwCQIAIfkEAAcAAAAsAAAAACAAIAAABv5AgHBInAw8xKRymVx8Sqcbc8oUEErYU4nKHS4e2LCN0KVmLthR%2BHQoMxeX0SgUCjcQbuXEEJr3SwYZeUsMIiIhhyIJg0sLGhuGIhsDjEsEjxuQEZVKEhcajxptnEkDn6AagqREGBeuFxCrSQcVFQ4Oi7JDD7a3lLpCDbYNDarADQ4NDw8KwEIGy9C%2FwAUG1gabzgzXBnjOAwYQEAcHHc4C4%2BQHDJU0SwnqBQXNeTM07kkSBQfyHwjmZWTMsOfu3hAQ%2FAogQECAHpUYMAQSxCdkAoEC%2FhgSACGBCQsWNSDCGDhDyYKFCwkwoJCAwwIBJkykcJGihQoWL0SOXEKCAFYGDCoZRADhgUOGDhIsoHBhE2ROGFMEUABKgCWIAQMUdFiQ1IQLFTdDcrEwQGWCBEOzHn2JwquLFTXcCBhwNsFVox1ILJiwdEUlCwsUDOCQdasFE1yCAAA7";
Main();*/