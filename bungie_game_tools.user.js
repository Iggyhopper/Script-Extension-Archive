// ==UserScript==
// @name           Bungie Game Tools
// @namespace      Iggyhopper
// @description    1.0 - Allows loading the next page of games effortlessly, also sorts and filters
// @include        http://*bungie.net/stats/PlayerStatsHalo3.aspx*
// @include        http://*bungie.net/stats/PlayerCampaignStatsHalo3.aspx*
// @include        http://*bungie.net/Stats/GameStatsHalo3.aspx*
// @include        http://*bungie.net/stats/halo3/gamehistoryodst.aspx*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @require        http://tablesorter.com/jquery.tablesorter.min.js
// @require        http://central.gsmcms.com/js/jquery/jquery.flydom-3.1.1.js
// ==/UserScript==

function Main()
{
    function LoadPlayerStats()
    {
        var FilterMode = 1; // 1: Normal (Remove All Non-Matches), 2: Remove Single, 3: Remove All Matches
        var $Table = $("#ctl00_mainContent_bnetpgl_recentgames_ctl00 , #ctl00_mainContent_bnetcppgl_recentgames_ctl00");
        $Table.tablesorter({textExtraction: function(N) { return $(N).children("a[id *= 'hypGame']").length > 0 ? $(N).children("a[id *= 'hypGame']").text() : N.innerHTML; }}).andParents("div:lt(2)").css("height", "auto")
        .prevObject.$("thead tr:last th:first").text("Game").siblings(":last").text("Status").parents("table")
        .$("tbody > tr[id *= 'recentgames'] td")
        .mouseover(function() { $(this).css("backgroundColor", "#3D3D4E"); })
        .mouseout(function() { $(this).css("backgroundColor", "transparent"); })
        .click(function(EventArgs)
        {
            if (EventArgs.originalTarget.tagName == "A") return;
            switch (FilterMode)
            {
                case 1:
                    $(this).$X("./../../*/*[" + ($(this).prevAll().length + 1) + "]").each(function()
                    {
                        if ($(EventArgs.currentTarget).text() != $(this).text()) $(this).parent().remove();
                    });
                    break;
                case 2:
                    $(this).parent().remove();
                    break;
                case 3:
                    $(this).$X("./../../*/*[" + ($(this).prevAll().length + 1) + "]").each(function()
                    {
                        if ($(EventArgs.currentTarget).text() == $(this).text()) $(this).parent().remove();
                    });
                    break;
            }
            $Table.trigger("update");
        });
        
        var $Button = $("#ctl00_mainContent_bnetpgl_divGamesContainer, #ctl00_mainContent_bnetpgl_divGamesList, #ctl00_mainContent_bnetcppgl_divGamesList").parent()
        .createAppend("div", {class: "create-post-actions"},
        [
            "ul", {style: "width: 578px;"}, 
            [
                "li", {},
                [
                    "a", {href: "javascript:void(0);", onclick: function(EventArgs)
                    {
                        if (NextPage > MaxPages) return $(this).text("max pages reached");
                        LoadingPages++;
                        NextPage++;
                        $(this).animate({opacity: 0}, 50, function() { $(this).text("loading " + LoadingPages + " page(s)...").animate({opacity: 1}, 50); });
                        var RequestLocation = location.href;
                        var Request = new XMLHttpRequest();
                        if (!$_GET["ctl00_mainContent_bnetpgl_recentgamesChangePage"]) RequestLocation += "&ctl00_mainContent_bnetpgl_recentgamesChangePage=" + CurrentPage;
                        Request.open("get", RequestLocation.replace(/_recentgamesChangePage=[0-9]+/, "_recentgamesChangePage=" + NextPage), true);
                        Request.onreadystatechange = function()
                        {
                            if (Request.readyState != 4) return;
                            $Data.attr("innerHTML", Request.responseText.match(/<body[^>]*>([\S\s]*?)<\/body>/)[1]);
                            var $ImportRows = $Data.$("#ctl00_mainContent_bnetpgl_recentgames_ctl00 > tbody > tr");
                            $ImportRows.find(":last").filter("a").removeAttr("href").css("color", "#FFFFFF");
                            $ImportRows.filter(function() { return $(this).css("background-color") == "rgb(61, 61, 61)"; }).css("background-color", "transparent");
                            $ImportRows.find("td")
                            .mouseover(function() { $(this).css("backgroundColor", "#3D3D4E"); })
                            .mouseout(function() { $(this).css("backgroundColor", "transparent"); })
                            .click(function(EventArgs)
                            {
                                if (EventArgs.originalTarget.tagName == "A") return;
                                $(this).$X("./../../*/*[" + ($(this).prevAll().length + 1) + "]").each(function()
                                {
                                    if ($(EventArgs.currentTarget).text() != $(this).text()) $(this).parent().remove();
                                });
                                $Table.trigger("update");
                            });
                            $ImportRows.appendTo($Table.children("tbody"));
                            $Table.trigger("update");
                            LoadingPages--;
                            var BText = LoadingPages == 0 ? "more" : "loading " + LoadingPages + " page(s)...";
                            $(EventArgs.currentTarget).animate({opacity: 0}, 0, function()
                            {
                                $(EventArgs.currentTarget).text(BText).animate({opacity: 1}, 0);
                            });
                        };
                        Request.send(null);
                    }}, "more"
                ],
                "li", {},
                [
                    "a", {href: "javascript: void(0);", onclick: function(EventArgs)
                    {
                        FilterMode++;
                        if (FilterMode == 4) FilterMode = 1;
                        switch (FilterMode)
                        {
                            case 1:
                                this.textContent = "filter mode: remove all non-matches";
                                break;
                            case 2:
                                this.textContent = "filter mode: remove single";
                                break;
                            case 3:
                                this.textContent = "filter mode: remove all matches";
                                break;
                        }
                    }}, "filter mode: remove non-matches"
                ],
                "li", {},
                [
                    "a", {href: "javascript:void(0);", onclick: function(EventArgs)
                    {
                        var Str = "[quote]";
                        $Table.$("tbody > tr[id *= 'recentgames']").each(function()
                        {
                            var $this = $(this);
                            Str += "[url=http://www.bungie.net" + $this.children("td:first").children("a").attr("href") + "]" + $this.children("td:first").children("a").text() + "[/url] - ";
                            Str += $this.$("td:eq(1)").text().replace(/\n|(  )+/g, "") + " - ";
                            Str += $this.$("td:eq(2)").text().replace(/\n|(  )+/g, "") + " - ";
                            Str += $this.$("td:eq(3)").text().replace(/\n|(  )+/g, "") + " - ";
                            Str += $this.$("td:eq(4)").text().replace(/\n|(  )+/g, "") + "\n";
                        });
                        $TextBox.text(Str + "[/quote]");
                    }}, "generate forum code"
                ]
            ]
        ])
        .$("ul").css("float", "left")
        .$("a:first").css({margin: "-5px -10px 5px 10px"}).parent()
        .next().children().css({margin: "-5px -54px 5px 15px"}).parent()
        .next().children().css({margin: "-5px -54px 5px 59px"});
        
        $TextBox = $("#ctl00_mainContent_bnetpgl_divGamesList, #ctl00_mainContent_bnetcppgl_divGamesList").createAppend("textarea", {readonly: "readonly"}, "");
        //$TextBox.css({float: "right", height: "49px", margin: "-5px 11px 5px 0px"});
        $TextBox.css({float: "right"});
    }
    
    function LoadGameStats()
    {
        
    }
    
    var Url = location.href;
    var IsPlayerStatsPage = Url.search(/Player(Campaign)?StatsHalo3\.aspx|gamehistoryodst\.aspx/i) > -1;
    var IsGameStatsPage = Url.search(/GameStatsHalo3\.aspx/) > -1;
    var CurrentPage = +$X("//thead//div[@class = 'rgWrap rgNumPart']/a[@class = 'rgCurrentPage']").text();
    var NextPage = CurrentPage + 1;
    var MaxPages = +$X("//thead//td[@class = 'rgPagerCell NextPrevAndNumeric rgSEO']/div[@class = 'rgWrap rgInfoPart']/strong[2]").text();
    var LoadingPages = 0;
    var $Data = $("<div />");
    var Request = new XMLHttpRequest();
    var $_GET = eval("({" + location.search.substring(1).replace(/%20/g, " ").replace(/&/g, ",").replace(/([0-9a-zA-Z\_\- ]+)=([0-9a-zA-Z\_\- ]+)/g, "'$1':'$2'") + "})");
    if (IsPlayerStatsPage) LoadPlayerStats();
    else if (IsGameStatsPage) LoadGameStats();
    console.log(IsPlayerStatsPage, IsGameStatsPage);
}

function $X(Selector, Context)
{
    var Evaluation = document.evaluate(Selector, Context != undefined ? Context : document, null, 0, null), Item = null, Result = [];
    while (Item = Evaluation.iterateNext()) Result.push(Item);
    return $(Result);
}

$.fn.$ = function(Selector, Context)
{
    return $(Selector, Context != undefined ? Context : this);
};

$.fn.$X = function(Selector, Context)
{
    var A = [];
    this.each(function()
    {
        var Evaluation = document.evaluate(Selector, Context != undefined ? Context : this, null, 0, null), Item = null;
        while (Item = Evaluation.iterateNext()) A.push(Item);
    });
    return $(A);
};

$.fn.and = function(Func, Arg1, Arg2)
{
    return this.add(this[Func](Arg1, Arg2));
};

$.fn.andParent = function(Selector)
{
    return this.add(this.parent());
};

$.fn.andParents = function(Selector)
{
    return this.add(this.parents(Selector));
};

Main();