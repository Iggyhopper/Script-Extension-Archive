// ==UserScript==
// @name           Bungie Moderator Tracker
// @namespace      Iggyhopper
// @description    Tracks down moderators, makes threads where they posted have an orange background.
// @include        http://*bungie.net/forums/posts.aspx*
// @include        http://*bungie.net/forums/topics.aspx*
// ==/UserScript==

Object.Extend = function(Destination, Source)
{
    for (var Property in Source)
    {
        Destination[Property] = Source[Property];
    }
};

Object.Extend(Array.prototype,
{
    Add: function(Arr)
    {
        return this.concat(Arr);
    },
    Contains: function(O)
    {
        var A = this;
        var H = A.length, L = -1, M;
        while (H - L > 1)
            if (A[M = H + L >> 1] < O) L = M
            else H = M
        return A[H] == O ? H : -1;
    },
    IsUnique: function()
    {
        var Arr = this.sort(), Boo = true;
        for (var I = 0; I < Arr.length; I++)
        {
            if (Arr[I] == Arr[I + 1])
            {
                Boo = false;
                break;
            }
        }
        return Boo;
    },
    Unique: function()
    {
        var A = [], I, L = this.length;
        for (I = 0; I < L; I++)
        {
            if (A.indexOf(this[I], 0) < 0) A.push(this[I]);
        }
        return A;
    }
});

/*
    A = Array
    B = Boolean
    D = Date
    E = Error
    F = Function
    I = Integer
    N = Number
    O = Object
    R = RegExp
    S = String
*/

var GCL = unsafeWindow.GCL ? unsafeWindow.GCL : null;

var BMT =
{
    Initialize: function()
    {
        if (!GCL) { alert("Moderator Tracker Error\n\nRequires: \"Bungie GM Framework\""); return; }
        var Get = "Get=", Set = "Set=", GetArray = [], SetArray = [], Url = "http://new.iggyhopper.dyndns.org/Greasemonkey/BMT/?";
        if (GCL.Page.IsForum)
        {
            var ThreadList = GCL.XPath.Evaluate("//*[contains(@id, \"topicRepeater\") and (contains(@id, \"_hUser\") or contains(@id, \"_postedBy\"))]/../../../div");
            var CheckUserString = "";
            for (var I = 0; I < ThreadList.length; I++)
            {
                GetArray.push(parseInt(GCL.XPath.Evaluate("h5/a", ThreadList[I])[0].href.split("=")[1]).toString(36));
                //console.log(I);
                //GetArray.push(ThreadList[I].childNodes[1].childNodes[1].href.split("=")[1]);
                //if (ThreadList[I].childNodes[3].childNodes[1]) 
                //if (ThreadList[I].childNodes[3].childNodes[3]) {}
                //if (ThreadList[I].childNodes[3]) CheckUserString += ThreadList[I].childNodes[1].nodeValue;
                //if (ThreadList[I].childNodes[3]) CheckUserString += "," + ThreadList[I].childNodes[3].nodeValue;
                //if (true) {}
                
                //indexOf
                
                
                
                /*for (var J = 0; J < BMT.Oranges.length; J++)
                {
                    var ThreadText = ThreadList[I].textContent;
                    console.log(ThreadText);
                    /*if (ThreadText)
                    {
                        var InnerText = GCL.XPath.Evaluate("h5/a/@href", ThreadsList[I])[0].nodeValue;
                        SetArray.push(InnerText.substring(InnerText.indexOf("="), InnerText.length));
                    }*/
                //}
                //console.log(ThreadList);
            }
            Get += GetArray.toString();
            Set += SetArray.toString();
            //console.log(GCL.XPath.Evaluate("p/a/text() | ", ThreadList[0]));
            //console.log(ThreadList);
            BMT.Request(Url + Get + (Set != "Set=" ? "&" + Set : ""), function(Response) { console.log(Response); });
            
        }
        else if (GCL.Page.IsThread)
        {
            var UserNameList = GCL.XPath.Evaluate("//*[contains(@id, \"_usernameLink\")]/text()");
            for (var I = 0; I < UserNameList.length; I++)
            {
                if (BMT.Oranges.Contains(UserNameList[I].nodeValue) > -1)
                {
                    Set += BMT.Query("postID");
                    break;
                }
            }
            BMT.Request(Url + Set, function(Response) { console.log(Response); });
        }
        else
        {
            return;
        }
        
        /*
            Stuff:
                http://new.iggyhopper.dyndns.org/Greasemonkey/BMT/?Get=40,40&Set=105,30
                GCL.XPath.Evaluate("//*[contains(@id, \"_usernameLink\")]")
                GCL.XPath.Evaluate("//*[contains(@id, \"topicRepeater\") and (contains(@id, \"_hUser\") or contains(@id, \"_postedBy\"))]")
                document.evaluate("//div[@class=\"h-list\"]/*[contains(@id, \"topicRepeater\") and (contains(@id, \"_hUser\") or contains(@id, \"_postedBy\"))]", document, null, 0, null)
                Get & Set In Same Request
            
            BrainStorm:
                User Array (String)
                Orange Array (String)
                Thread Array (Integer)
                Thread Jagged Array [User Array, ID Array]
                
                this.Id, this.Author
                
                Compare Oranges[I] To Threads[J][0]; Get Threads[J][1]
                Linear Loop To Oranges, Binary To Threads via Contains()
                Fastest Method (I Think)
                
                
                
            Page Load:
                Load Control Panel
                Retrieve Thread ID & User Name List
                Create [[], []] From User & Thread ID
                Iterate Class To Find Matches
                Extract Matches' ID
                Export ID List To URL
                //BMT.Oranges.Add(GCL.XPath.Evaluate([Thread ID])).Unique().Send()
                
                
        */
    },
    Oranges:
    [
        "Achilles1108",
        "BobBQ",
        "Butane123",
        "Captain K Mart",
        "Duardo",
        "El Roboto",
        "Gods Prophet",
        "Great_Pretender",
        "Nedus",
        "Nosferatu_Soldie",
        "Pezz",
        "Qbix89",
        "Recon Number 54",
        "Senor Leche",
        "Sir Fragula",
        "Skibur",
        "Skiptrace",
        "THE DON WAN",
        "The Slayer",
        "Yoozel",
        "ash55",
        "odmichael",
        "runningturtle",
        "stosh",
        "urk",
        "x Foman123 x"
    ],
    Query: function(Parameter)
    {
        var Search = location.search.substring(1, location.search.length);
        var Value = false;
        var Parameters = Search.split("&");
        for (var I = 0; I < Parameters.length; I++)
        {
            var Name = Parameters[I].substring(0, Parameters[I].indexOf("="));
            if (Name == Parameter) Value = Parameters[I].substring(Parameters[I].indexOf("=") + 1);
        }
        return Value;
    },
    Request: function(Url, OnLoad)
    {
        GM_xmlhttpRequest({ method: "GET", onload: OnLoad, url: Url });
    },
    Version: "Public Beta 1.0"
};

BMT.Initialize();