// CREATED BY CAVX
// UPDATED BY Iggyhopper

// ==UserScript==
// @name           Bungie Textbox Enhancement
// @namespace      http://www.bungie.net/
// @description    Changes the size of the text input box for sending messages and posting threads and replies
// @include        http://*bungie.net*createpost.aspx*
// @include        http://*bungie.net*profile.aspx*act=msg*
// @include        http://*bungie.net*profile.aspx*page=postmsg*
// @include        http://*bungie.net*profile.aspx*act=reply*
// ==/UserScript==

function Main()
{
    var TextBoxReply = document.getElementById("ctl00_mainContent_postForm_skin_body") || document.getElementById("ctl00_mainContent_messageForm_skin_body");
    var ButtonQuote = document.getElementById("ctl00_mainContent_postForm_skin_quoteButton") || document.getElementById("ctl00_mainContent_messageForm_skin_quoteButton");
    
    function Expand()
    {
        TextBoxReply = document.getElementById("ctl00_mainContent_postForm_skin_body") || document.getElementById("ctl00_mainContent_messageForm_skin_body");
        ButtonQuote = document.getElementById("ctl00_mainContent_postForm_skin_quoteButton") || document.getElementById("ctl00_mainContent_messageForm_skin_quoteButton");
        while (TextBoxReply.clientWidth == 506) { TextBoxReply.rows += 6; }
    }
    
    if (TextBoxReply)
    {
        TextBoxReply.addEventListener("keyup", function()
        {
            Expand();
        }, false);
    }
    
    if (ButtonQuote)
    {
        ButtonQuote.addEventListener("blur", function()
        {
            Expand();
            TextBoxReply.addEventListener("keyup", function()
            {
                while (this.clientWidth == 506) { this.rows += 6; }
            }, true);
        }, false);
    }
    
}

Main();