// ==UserScript==
// @name           Bungie Report Admin
// @namespace      Iggyhopper
// @description    Adds a report button to all employees and moderators
// @include        http://*bungie.net/forums/posts.aspx*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// ==/UserScript==

function Main()
{
    unsafeWindow.jQuery = jQuery;
    unsafeWindow.$X = $X;
    
    try
    {
    var $ReportButtonTemplate = $X("id('ctl00_mainColPanel')/div[1]/div[contains(@class, 'item')]/div/div/span/div[2]/div[4]/ul//div[contains(@id, 'report')]").eq(0);
    var $ReportLabelTemplate = $X("id('ctl00_mainColPanel')/div[1]/div[contains(@class, 'item')]/div/div/span/div[2]/div[4]/ul//div[contains(@id, 'spam')]").eq(0);
    var $PostActions = $X("id('ctl00_mainColPanel')/div[1]/div[contains(@class, 'item')]/div/div/span/div[2]/div[4]/ul[count(li[2]/*) = 1]");
    
    
    $PostActions.each(function()
    {
        var $ReplyButton = $(this).find("a[class = 'forum_post_reply_button']");
        var ControlNumber = $ReplyButton.attr("id").match(/r1_(ctl[0-9]+)/)[1];
        var $ReportButton = $ReportButtonTemplate.clone();
        //var $ReportLabel = $ReportLabelTemplate.clone();
        
        
        $ReportButton.attr("id", $ReplyButton.attr("id").replace("replyButton", "reportSpamButtonPanel"));
        $ReportButton.children().attr("id", $ReplyButton.attr("id").replace("reply", "reportSpam"));
        $ReportButton.children().attr("href", $ReportButton.children().attr("href").replace(/r1\$ctl[0-9]+/, "r1$" + ControlNumber));
        
        
        $ReportButton.appendTo($ReplyButton.parent());
    });
    }
    catch (E) { console.log(E); }
    
    /*<div id="ctl00_ctl00_mainContent_postRepeater1_ctl25_ctl00_postControl_skin_reportSpamButtonPanel" style="display: inline;">
			<a href="javascript:__doPostBack('ctl00$mainContent$postRepeater1$ctl25$ctl00$postControl$skin$reportSpamButton','')" class="forum_post_report_button" id="ctl00_mainContent_postRepeater1_ctl25_ctl00_postControl_skin_reportSpamButton" onclick="if (!confirm('Are you sure you wish to report this post as inappropriate to the moderators?')) return false;"><img width="52px" height="20px" style="" src="/images/spacer.gif" alt="report"/></a>
		</div>*/
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

Main();