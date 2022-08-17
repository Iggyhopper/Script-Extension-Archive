// ==UserScript==
// @name           Bungie OP Highlighter
// @namespace      Iggyhopper
// @description    Highlights the topic starter in a light blue
// @include        http://*bungie.net/forums/topics.aspx*
// @include        http://*bungie.net/forums/posts.aspx*
// @include        http://*bungie.net/fanclub/*/forums/topics.aspx*
// @include        http://*bungie.net/fanclub/*/forums/topics.aspx*
// ==/UserScript==

// Idea By Wolverfrog

function Initialize()
{
    if (location.href.match(/topics\.aspx/))
    {
        // Run Forum Code | 95% Finished
        Extend(X("//div/p/a[contains(@id, 'hLastPost')]"),
        {
            Click: function(Handler)
            {
                for (var I = 0; I < this.length; I++)
                {
                    this[I].addEventListener("click", Handler, true);
                }
            }
        }).Click(LastPostLink_Click);
    }
    else
    {
        // Run Thread Code | 40% Finished
        var FirstPageTest = location.href.match(/postRepeater1-p=([0-9]+)/);
        var IsFirstPage = FirstPageTest ? FirstPageTest[1] == "1" : true;
        var ThreadID = location.href.match(/postID=([0-9]+)/)[1];
        
    }
    
}

function LastPostLink_Click(EventArgs)
{
    GM_setValue(EventArgs.currentTarget.href.match(/postID=([0-9]+)/)[1], EventArgs.currentTarget.parentNode.childNodes[1].innerHTML + "|" + (new Date().getTime() + 864e5));
}

function X(Selector, Context)
{
    var Evaluation = document.evaluate(Selector, Context ? Context : document, null, 0, null),
        Item = null,
        Result = [];
    while (Item = Evaluation.iterateNext()) Result.push(Item);
    return Result;
}

function Extend(Destination, Source)
{
    for (var Property in Source)
    {
        Destination[Property] = Source[Property];
    }
    return Destination;
}

Initialize();