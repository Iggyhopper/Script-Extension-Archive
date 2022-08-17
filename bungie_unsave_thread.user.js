// ==UserScript==
// @name           Bungie Unsave Thread
// @namespace      Iggyhopper
// @description    Allows you to unsave the current thread
// @include        http://*bungie.net*posts.aspx*
// ==/UserScript==

// ThreadSavedButton: button with text of "[Thread Saved]"
// UnsaveThreadButton: button with text of "Unsave Thread"
// SaveThreadButton: button with text of "Save Thread"
// Request: XMLHttpRequest used to post data

function Initialize()
{
    var ThreadSavedButton = document.getElementById("ctl00_trackTopicText");
    var IsThreadSaved = !!ThreadSavedButton;
    if (IsThreadSaved) // If the thread is saved, add an "Unsave" button
    {
        var UnsaveThreadButton = document.createElement("a");
        UnsaveThreadButton.href = "javascript:void(0);";
        UnsaveThreadButton.id = "ctl00_trackTopicLinkButton";
        UnsaveThreadButton.innerHTML = "Unsave Thread";
        UnsaveThreadButton.addEventListener("click", UnsaveThreadButton_Click, true);
        document.getElementById("ctl00_showSaveThreadButton").appendChild(UnsaveThreadButton);
        ThreadSavedButton.parentNode.removeChild(ThreadSavedButton);
    }
}

function UnsaveThreadButton_Click()
{
    var Request = new XMLHttpRequest();
    var $this = this; // trap $this as this to avoid collision with the request's readystate function
    Request.open("POST", "http://www.bungie.net/Forums/MyTopics.aspx", true);
    Request.onreadystatechange = function()
    {
        if (Request.readyState == 4)
        {
            $this.parentNode.removeChild($this);
            var SaveThreadButton = document.createElement("a");
            SaveThreadButton.href = "javascript:__doPostBack('ctl00$trackTopicLinkButton','');"
            SaveThreadButton.id = "ctl00_trackTopicLinkButton";
            SaveThreadButton.innerHTML = "Save Thread";
            document.getElementById("ctl00_showSaveThreadButton").appendChild(SaveThreadButton);
        }
    };
    Request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    Request.send("__EVENTTARGET=ctl00$mainContent$topicRepeater1$ctl01$ctl00$lbRemoveTopic&ctl00$mainContent$topicRepeater1$ctl01$ctl00$cbRemove=" + location.search.match(/postID=([0-9]+)/)[1]);
}

Initialize();

/*
<a href="javascript:__doPostBack('ctl00$trackTopicLinkButton','')" id="ctl00_trackTopicLinkButton">Save Thread</a>
*/