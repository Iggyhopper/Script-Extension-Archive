// ==UserScript==
// @name           Bungie Thread Filter
// @namespace      Iggyhopper
// @description    Includes options to limit displays of unwanted threads.
// @include        http://*bungie.net/forums/topics.aspx*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @require        http://flydom.socianet.com/js/jquery.flydom-3.1.1.js
// ==/UserScript==

jQuery.fn.$ = function(Selector, Context)
{
    return jQuery(Selector, Context || this);
};

jQuery.fn.$$ = function(Type, AttrList, Content)
{
    return this.createAppend.apply(this, arguments).remove();
};

jQuery.fn.log = function() { console.log({"jQuery": this}); };

jQuery.fn.reorder = function() {
 
  // random array sort from
  // http://javascript.about.com/library/blsort2.htm
  function randOrd() { return(Math.round(Math.random())-0.5); }
 
  return($(this).each(function() {
    var $this = $(this);
    var $children = $this.children();
    var childCount = $children.length;
 
    if (childCount > 1) {
      $children.remove();
 
      var indices = [];
      for (i=0;i<childCount;i++) { indices[indices.length] = i; }
      indices = indices.sort(randOrd);
      $.each(indices,function(j,k) { $this.append($children.eq(k)); });
 
    }
  }));
}


jQuery.expr[":"].icontains = function(a, i, m)
{
    return jQuery(a).text().toLowerCase().indexOf(m[3].toLowerCase()) >= 0;
};

jQuery.expr[":"].aicontains = function(a, i, m)
{
    if (m[3] == "") return false;
    var terms = m[3].toLowerCase().split(","), results = [];
    for (var i = 0; i < terms.length; i++)
    {
        if (jQuery(a).text().toLowerCase().indexOf(terms[i]) >= 0) return true;
    }
    return false;
};

function Initialize()
{
    var Filters = GM_getValue("Filters", []);
    $("#ctl00_sidebarColPanel")
    .$$("div", { class: "boxA", id: "BTF_ControlPanel", style: "margin-bottom: -47px; margin-left: " + (location.href.match("posts.aspx") ? "3" : "5") + "px; opacity: 0; width: 220px;" }, [
        "ul", {}, [
            "li", {}, [
                "h3", {}, "Thread Filter"
            ],
            "li", {}, [
                "h4", {}, [
                    "a", { href: "javascript:void(0);", onclick: Add_Click}, "Add",
                    "span", {}, " | ",
                    "a", {href: "javascript:void(0);", onclick: Settings_Click}, "Settings",
                    "span", {}, " | ",
                    "a", {href: "javascript:void(0);", onclick: Clear_Click}, "Clear All"
                ]
            ]
        ],
        "div", {}, [
            "span", {}, "This is the settings!"
        ]
    ])
    .insertAfter("#ctl00_forumSidebarPanel")
    .animate({marginBottom: "-47px"}, 500)
    .animate({marginBottom: "0px", opacity: 1}, 1000)
    //console.log({"jQuery.expr": jQuery.expr});
    if (Filters == []) return;
    $("td div.list-h h5 a:aicontains('" + Filters + "')")
    .closest("tr")
    .animate({opacity: 0.1}, 1000);
}

function Add_Click(EventArgs)
{
    var Filters = GM_getValue("Filters", []);
    if (typeof Filters == "string") Filters = Filters.split(",");
    var Additions = prompt("What filtering word(s) would you like to add? Separate with \",\"");
    if (!Additions) return console.log("Canceled Filter");
    Additions = Additions.replace(/\s?,+\s?/g, ",").replace(/,+$/, "").replace(/^,+/, "").trim().split(",");
    Filters = Filters.concat(Additions).join(",");
    console.log("Added Filter(s): " + Additions);
    GM_setValue("Filters", Filters);
    $("td div.list-h h5 a:aicontains('" + Additions.join(",") + "')")
    .closest("tr")
    .animate({opacity: 0.1}, 1000);
}

function Settings_Click(EventArgs)
{
    $("#BTF_ControlPanel div").slideToggle();
}

function Clear_Click(EventArgs)
{
    var Filters = GM_getValue("Filters", []);
    if (Filters == []) return;
    $("td div.list-h h5 a:aicontains('" + Filters + "')")
    .closest("tr")
    .animate({opacity: 1}, 1000);
    GM_deleteValue("Filters");
}

Initialize();