// ==UserScript==
// @name           Bungie Game History Sorter
// @namespace      Iggyhopper
// @description    Automatically loads the next set of games when you reach the bottom of the page, also sorts and filters
// @include        http://*bungie.net/stats/PlayerStatsHalo3.aspx*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @require        http://tablesorter.com/jquery.tablesorter.min.js
// ==/UserScript==

function Main()
{
    $("#ctl00_mainContent_bnetpgl_recentgames_ctl00 thead tr:last th:first").text("Game").siblings(":last").text("Status");
    RecentGames.parent().tablesorter();
    RecentGames.children().children().click(function()
    {
        var Target = $(this);
        var Data = Target.text();
        RemovedCount = 0;
        $X("./../../*/*[" + (Target.prevAll().length + 1) + "]", Target).each(function(I, A)
        {
            if ($(this).text() != Data)
            {
                $(this).parent().animate({opacity: 0}, 0, function() { RemovedCount++; });
                $(this).parent().remove();
            }
            //if (I == $(this).)
        });
        var H = GamesContainer.height() - 18.47 * RemovedCount;
        GamesContainer.animate({height: H}, RemovedCount * 75);
        $("#ctl00_mainContent_bnetpgl_recentgames").height(H);
        RecentGames.parent().tablesorter();
        console.log(Data, arguments);
    });
    
    Request.onreadystatechange = function()
    {
        if (Request.readyState != 4) return;
        PageData.attr("innerHTML", Request.responseText.match(/<body[^>]*>([\S\s]*?)<\/body>/)[1]);
        var Games = $("#ctl00_mainContent_bnetpgl_recentgames_ctl00 > tbody > tr[id *= 'recentgames']", PageData);
        var H = GamesContainer.height() + 18.47 * Games.length;
        GamesContainer.animate({height: H}, Games.length * 75);
        //$("#ctl00_mainContent_bnetpgl_recentgames").height(H);
        RecentGames.append(Games);
        RecentGames.parent().tablesorter();
        RecentGames.children().children().click(function()
        {
            var Target = $(this);
            var Data = Target.text();
            RemovedCount = 0;
            $X("./../../*/*[" + (Target.prevAll().length + 1) + "]", Target).each(function(I, A)
            {
                if ($(this).text() != Data)
                {
                    $(this).parent().animate({opacity: 0}, 0, function() { RemovedCount++; });
                    $(this).parent().remove();
                }
                //if (I == $(this).)
            });
            GamesContainer.animate({height: GamesContainer.height() - 18.47 * RemovedCount}, RemovedCount * 75);
            //$("#ctl00_mainContent_bnetpgl_recentgames").height(GamesContainer.height());
            RecentGames.parent().tablesorter();
            console.log(Data, arguments);
        });
        //Games.each(function(I, A)
        //{
            $(A).height(16).appendTo(RecentGames);
            //setTimeout(function() { $(A).animate({opacity: 1}, 100); }, I * 250);
        //});
            //var F = function() { Games.eq(I).css('opacity', 0).appendTo(RecentGames).animate({opacity: 1}, I * 200); };
            //unsafeWindow.setTimeout(function() { console.log(Games[I]); }, I * 250);
        
        //GameTableBody.append($X("id('ctl00_mainContent_bnetpgl_recentgames_ctl00')/tbody/tr", PageData));
        //GameTableBody[0].innerHTML += '<tr style="display: block;"><td>Data</td></tr>';
        
        //$("html body")[0].innerHTML += PageData[0].innerHTML;
        //$X("id('ctl00_mainContent_bnetpgl_recentgames_ctl00')/tbody")[0].innerHTML += $("#ctl00_mainContent_bnetpgl_recentgames_ctl00 tbody", PageBody)[0].innerHTML;
        
        //unsafeWindow.$PageData = PageData;
        //PageData.attr("innerHTML", Request.responseText.match(/<body[^>]*>([\S\s]*?)<\/body>/)[1]);
        //var Games = $X("id('ctl00_mainContent_bnetpgl_recentgames_ctl00')/tbody/tr", PageData);
        //for (var I = 0; I < Games.length; I++)
        //{
            //Games[I].parentNode.appendChild(Games[I]);
            
            //Games.eq(I).appendTo($X("id('ctl00_mainContent_bnetpgl_recentgames_ctl00')/tbody")).css("opacity", 0).css("display", "table-row").animate({opacity: 1}, I * 25);
        //}
        //L(Games);
        //L($X("id('ctl00_mainContent_bnetpgl_recentgames_ctl00')/tbody"));
        
        //PageData.html(Request.responseText.split(/(<body>|<\/body>)/i));
        //console.log({PageData: PageData, "r": Request});
        IsLoadingPage = false;
        NextPage++;
    };
    
    
    $(window).scroll(function()
    {
        if (scrollY / scrollMaxY < 0.875 || IsLoadingPage || NextPage > MaxPages) return;
        IsLoadingPage = true;
        var RequestLocation = location.href;
        if (!$_GET["ctl00_mainContent_bnetpgl_recentgamesChangePage"]) RequestLocation += "&ctl00_mainContent_bnetpgl_recentgamesChangePage=" + CurrentPage;
        Request.open("get", RequestLocation.replace(/_recentgamesChangePage=[0-9]+/, "_recentgamesChangePage=" + NextPage), true);
        Request.send(null);
    });
}

function $X(Selector, Context)
{
    var Evaluation = document.evaluate(Selector, Context ? Context[0] : document, null, 0, null), Item = null, Result = [];
    while (Item = Evaluation.iterateNext()) Result.push(Item);
    return $(Result);
}

var L = console.log;

var MaxPages = +$X("//td[@class = 'rgPagerCell NextPrevAndNumeric rgSEO']/div[@class = 'rgWrap rgInfoPart']/strong[2]").eq(0).text();
var IsLoadingPage = false;
var CurrentPage = +$X("//div[@class = 'rgWrap rgNumPart']/a[@class = 'rgCurrentPage']").eq(0).text();
var NextPage = CurrentPage + 1;
var PageData = $("<div />");
var Request = new XMLHttpRequest();
var $_GET = eval("({" + location.search.substring(1).replace(/&/g, ",").replace(/([0-9a-zA-Z\_\-]+)=([0-9a-zA-Z\_\-]+)/g, "'$1':'$2'") + "})");
var GamesContainer = $X("id('ctl00_mainContent_bnetpgl_divGamesContainer')");
var RecentGames = $X("id('ctl00_mainContent_bnetpgl_recentgames_ctl00')/tbody");
var RemovedCount = 0;

Main();