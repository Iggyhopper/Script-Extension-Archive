// ==UserScript==
// @name        Bungie Enhancement Suite
// @namespace   http://iggyhopper.strangled.net/
// @description Enhances bungie.net with numerous features.
// @include     http*://*.bungie.net/*

// @version     0.32

// ==/UserScript==

var XT = (function()
{
    // package
    var api = {};
    
    // private
    var prefix = '';
    
    // public
    api.get = function(name, defval)
    {
        var result = JSON.parse(localStorage.getItem(prefix + name));
        return result !== null ? result : defval;
    };
    
    api.getAll = function(asArray)
    {
        var result = asArray ? [] : {};
        for (var key in localStorage)
            if (key.substr(0, prefix.length) === prefix)
                if (asArray)
                    result.push({key: key, value: api.get(key.substr(prefix.length))});
                else
                    result[key] = api.get(key.substr(prefix.length));
        return result;
    };
    
    api.init = function(name)
    {
        prefix = name + '.';
    };
    
    api.remove = function(name)
    {
        localStorage.removeItem(name);
    };
    
    api.set = function(name, value)
    {
        localStorage.setItem(prefix + name, JSON.stringify(value));
    };
    
    return api;
})();

var BungieNet = (function()
{
    var __filter = Array.prototype.filter;
    var __map = Array.prototype.map;
    var __pop = Array.prototype.pop;
    var __slice = Array.prototype.slice;
    
    var api =
    {
    };
    
    var LAZY_DATA =
    {
        html:
        {
            forum:
            {
                threads:
                {
                    new: function()
                    {
                        return (__pop.call(document.getElementsByClassName('grid')) || {}).rows;
                    },
                    pinned: function()
                    {
                        return getFirstElementByClassName('pinned_topic_grid');
                    },
                    top: function()
                    {
                        return document.getElementsByClassName('grid')[1] ? getFirstElementByClassName('pinned_topic_grid') : null;
                    }
                }
            },
            group:
            {
                events: function()
                {
                    var tmp = document.getElementById('ctl00_groupHeaderPanel');
                    return tmp && tmp.nextElementSibling.lastElementChild.firstElementChild.children;
                },
                members: function()
                {
                    var tmp = getFirstElementByClassName('group_member_table');
                    return tmp && __slice(tmp.rows, 2);
                },
                navbar: function()
                {
                    var tmp = document.getElementById('ctl00_groupHubPanel');
                    return tmp && tmp.lastElementChild.firstElementChild;
                }
            },
            message:
            {
                body: function()
                {
                    return document.getElementById('PostBlock');
                },
                senderbio: function()
                {
                    var tmp = document.getElementById('ctl00_mainContent_msgDisplay_skin_UserNameBlock');
                    return tmp && tmp.parentNode;
                },
                subject: function()
                {
                    return document.getElementById('ctl00_mainContent_msgDisplay_skin_subject');
                }
            },
            navbar: function()
            {
                return document.getElementById('ctl00_dashboardNav_navigationMenuList');
            },
            profile:
            {
                about: function()
                {
                    var tmp = document.getElementById('ctl00_mainContent_profilePanel');
                    return tmp && tmp.firstElementChild.children[1];
                },
                groups: function()
                {
                    return document.getElementsByClassName('arrow4');
                },
                messages: function()
                {
                    var tmp = getFirstElementByClassName('grid');
                    return tmp && __slice.call(tmp.rows, 1);
                },
                threads: function()
                {
                    var tmp = document.getElementsByClassName('grid');
                    return tmp ? __filter.call(__pop.call(tmp).rows, function(i) { return i.className; }) : null;
                }
            },
            thread:
            {
                posts: function()
                {
                    var tmp = document.getElementById('ctl00_mainContent_spamReportLoadingPanel');
                    return tmp && __slice.call(tmp.parentNode.children, 3, tmp.parentNode.children.length - 1).map(function(i)
                    {
                        return i.firstElementChild.firstElementChild.firstElementChild;
                    });
                }
            },
            userbar: function()
            {
                return getFirstElementByClassName('utilityNav');
            }
            
        },
        isSignedIn: function()
        {
            return !!document.getElementById('ctl00_dashboardNav_passportSignOutLink');
        },
        group:
        {
            id: function()
            {
                var tmp = (document.getElementById('ctl00_groupForumsLink')
                        || document.getElementById('ctl00_forumHeader_groupForumsLink')
                        || location)
                        .href.match(/fanclub\/([0-9a-z]+)/i);
                return tmp && [tmp[1], +tmp[1]];
            }
        },
        user:
        {
            avatar: function()
            {
                var tmp = getFirstElementByClassName('imgAvatar');
                return tmp && tmp[0].children[0].src;
            },
            messages: function()
            {
                var tmp = getFirstElementByClassName('messages');
                return tmp && +tmp.children[0].textContent;
            },
            name: function()
            {
                return unescape((document.cookie.match('BungieDisplayName=(.*?)(;|$)') || [,''])[1]).replace(/&nbsp;/g, ' ') || null;
            }
        }
    };
    
    initGetterData(LAZY_DATA);
    
    return LAZY_DATA;
    
    function getFirstElementByClassName(name)
    {
        var e = document.getElementsByClassName(name);
        return e.length ? e[0] : null;
    }
    
    function defineLazyGetter(parent, name, fn)
    {
        parent.__defineGetter__(name, function()
        {
            var v = fn();
            parent.__defineGetter__(name, function()
            {
                return v;
            });
            return v;
        });
    }
    
    function initGetterData(root, transfer)
    {
        var queue = [root];
        var count = 0;
        while (queue.length !== 0)
        {
            if (++count > 512)
            {
                console.log('initGetterData: infinite loop detected; exiting');
                return false;
            }
            var node = queue.shift();
            for (var child in node)
            {
                if (typeof node[child] === 'object')
                {
                    if (transfer)
                    {
                        transfer[child] = {};
                        transfer = transfer[child];
                    }
                    queue.push(node[child]);
                }
                else if (typeof node[child] === 'function' && !node[child].length)
                {
                    if (transfer)
                        defineLazyGetter(transfer, child, node[child]);
                    defineLazyGetter(node, child, node[child]);
                }
            }
        }
        return true;
    }
})();

// unsafeWindow hack for chrome and console hack for firefox
window.unsafeWindow = (function()
               {
                   var e = document.createElement('p');
                   e.setAttribute('onclick', 'return window;');
                   return e.onclick();
               })();
console = unsafeWindow.console;

const VERSION = '0.32';
const CACHE_FLUSH_THRESHOLD = 1000 * 60 * 60 * 24 * 3; // 3 days

var $ = unsafeWindow.$telerik.$;
var url = location.href;
var defaultOptions = { fixPageTitles: true, enableGroupStyling: true, newMessageColor: 'orange', collapseDeepQuotes: true };
defaultOptions.clearLocalData = function() {
    confirm('Are you sure you want to clear BES data?') && XT.getAll(true).forEach(function(i) { localStorage.removeItem(i.key); }); };
    
XT.init('bes');

// Fix the footer.
$('#footer').insertAfter('#aspnetForm');

//// -- Option: Fix Page Titles --
if (XT.get('fixPageTitles', defaultOptions.fixPageTitles))
    document.title = document.title.split(' : ').reverse().join(' : ');

// glowy mail
if (BungieNet.isSignedIn && BungieNet.user.messages > 0)
{
    var newMessageColor = XT.get('newMessageColor', defaultOptions.newMessageColor);
    if (newMessageColor !== '')
        $(BungieNet.html.userbar).append(
            $('<div/>').css({
                'background-color': newMessageColor,
                'box-shadow': '0 0 11px 6px ' + newMessageColor,
                height: 8,
                left: Math.min(92 + ($('li.messages').prev().children().text().length - 1) * 6, 113),
                opacity: 0.6,
                position: 'relative',
                top: -10,
                width: 12,
                'z-index': 9999
            })
        );
}

//// -- group styling functionality --
/*// if we are in a private group, try to load the style from localStorage (the cache)
     compare the time of the last successful http request to right now
*/// if time has not been reached, display from cache, else, flush and retrieve via http request
if (~url.search(/\/fanclub\//i) && BungieNet.isSignedIn && XT.get('enableGroupStyling', defaultOptions.enableGroupStyling))
{
    var now = Date.now();
    var cacheKey = template('groups.{id}.style', {id: BungieNet.group.id[0]});
    var cacheVal = XT.get(cacheKey, {});
    if (now - cacheVal.time < CACHE_FLUSH_THRESHOLD)
        $('head').append($('<style/>').attr('type', 'text/css').text(cacheVal.data));
    else
    {
        var styleUrl = template('http://www.bungie.net/fanclub/{id}/group/news.aspx?type=news&link=bes', {id: BungieNet.group.id[0]});
        $.ajax(styleUrl).done(function(data)
        {
            var responseBody = data.split(/(<body.+>|<\/body>)/gi)[2];
            var styleData = $(data).find('#topStoryPreviewDiv').text();
            cacheVal.data = styleData.replace(/;/g, ' !important;') || null;
            cacheVal.time = now;
            XT.set(cacheKey, cacheVal);
            $('head').append($('<style/>').attr('type', 'text/css').text(cacheVal.data));
        });
    }
}

//group homepage additions
if (~url.search(/fanclub\/[^\/]+\/group\/grouphome\.aspx/i))
{
    $('#ctl00_groupHeaderPanel').siblings(':last').clone().attr('id', 'bes_groupmenu').html('').appendTo($('#ctl00_groupHeaderPanel').parent());
    $('#bes_groupmenu').append(
        $('<a/>').attr('href', 'javascript:;').text('BES - Update Group Style').click(function()
        {
            var now = Date.now();
            var cacheKey = template('groups.{id}.style', {id: BungieNet.group.id[0]});
            var cacheVal = XT.get(cacheKey, {});
            var styleUrl = template('http://www.bungie.net/fanclub/{id}/group/news.aspx?type=news&link=bes', {id: BungieNet.group.id[0]});
            $.ajax(styleUrl).done(function(data)
            {
                var responseBody = data.split(/(<body.+>|<\/body>)/gi)[2];
                var styleData = $(data).find('#topStoryPreviewDiv').text();
                cacheVal.data = styleData.replace(/;/g, ' !important;') || null;
                cacheVal.time = now;
                XT.set(cacheKey, cacheVal);
                if (cacheVal.data === null)
                    alert('There was an error updating the group style, please try again in a few minutes.');
                else
                    $('head').append($('<style/>').attr('type', 'text/css').text(cacheVal.data));
            });
            XT.set('enableGroupStyling', true);
        })
    );
}

// group admin additions
if (~url.search(/fanclub\/[^\/]+\/tools\/default\.aspx/i))
{
    $('div.list-c > ul.arrow2').append(
        $('<li/>').append(
            $('<a/>').attr('href', template('http://www.bungie.net/fanclub/{id}/group/news.aspx?type=news&link=bes', {id: BungieNet.group.id[0]})).append(
                $('<strong/>').text('Group Styling Management'),
                ' - View or edit the custom CSS of this group.'
            )
        )
    );
}

//// -- profile dashboard functionality --
if (~url.search(/account\/profile\.aspx$/i))
{
    // clone
    var $container = $('#ctl00_mainContent_profilePanel :first .boxD_outer:nth(1)').clone();
    // set title
    var $bes = $container.find('h3:first').text(template('Bungie Enhancement Suite {v}', {v: VERSION})).parent();
    // remove main content
    $bes.children(':last').remove();
    // ...
    for (var key in defaultOptions)
    {
        if (typeof defaultOptions[key] === 'string')
            $bes.append(
                $('<span/>').text(camelToTitleCase(key) + ': '),
                $('<input/>').attr({value: XT.get(key, defaultOptions[key]), optlink: key}).keyup(function()
                {
                    XT.set(this.attributes['optlink'].value, this.value);
                }),
                '<br/>'
            );
        else if (typeof defaultOptions[key] === 'function')
        {
            // add a button
            $bes.append(
                '<br/>',
                $('<input type="button"/>').attr({value: camelToTitleCase(key)}).click(defaultOptions[key]),
                '<br/>'
            );
        }
        else
            // add check/label for each option
            $bes.append(
                $('<input type="checkbox"/>').attr({checked: XT.get(key, defaultOptions[key]), optlink: key}).click(function()
                {
                    XT.set(this.attributes['optlink'].value, this.checked);
                }),
                $('<span/>').text(camelToTitleCase(key)),
                '<br/>'
            );
    }
    
    // reveal
    $container.appendTo('#ctl00_mainContent_profilePanel :first');
}

//// -- other functionailty --

// list "last post"s
if (~url.search(/profile\.aspx\?page=chapters/i))
{
    var linkstamps = XT.get('groups.general.linkstamps', {});
    var $groups = $('#ctl00_mainContent_chaptersPanel .arrow4');
    for (var i = 0, c = $groups.length; i < c; ++i)
    {
        var $list = $groups.eq(i).find(':first');
        var id = $list.find(':first :first').attr('href').match(/fanclub\/([^\/]+)\/group/i)[1];
        $list.append('<br/><strong>Last post: </strong>');
        if (linkstamps[id])
            $list.append($('<a/>').attr('href', linkstamps[id].link).css('padding', '0').text(relativeTime(linkstamps[id].time)));
        else
            $list.append('N/A');
    }
}

// capture post event
if (~url.search(/fanclub\/[^\/]+\/forums\/createpost\.aspx/i))
{
    var linkstamps = XT.get('groups.general.linkstamps', {});
    var $link = $('#ctl00_backToIndexLink');
    var id = $link.attr('href').match(/fanclub\/([^\/]+)\/forums/i)[1];
    $('#ctl00_mainContent_postForm_skin_submitButton').click(function()
    {
        linkstamps[id] = {time: Date.now(), link: ''};
        XT.set('groups.general.linkstamps', linkstamps);
        XT.set('groups.general.capturepost', true);
    });
}

// capture message event
// add collapsible quotes
if (~url.search(/\/forums\/posts\.aspx/i))
{
    var $post = null;
    var i = 1;
    while (($post = $('#ctl00_mainContent_postRepeater1_ctl' + pad(i++) + '_ctl00_postControl_skin_author_header')).length)
    {
        (function(_$post)
        {
            // message event
            _$post.find(':last').click(function()
            {
                var $name = $(this).parent().parent().parent().find(':first');
                if ($name.attr('name') === 'end')
                    $name = $name.next();
                XT.set('messages.general.returnlink', url.replace('#end', '') + '#' + $name.attr('name'));
                var title = $('#ctl00_mainContent_subjectBar :first :first').text();
                (title = title.split(':')).shift();
                title = title.join(' : ');
                XT.set('messages.general.returnsubject', 're:' + title);
            });
            
            // collapse quotes at level 2
            if (XT.get('collapseDeepQuotes', defaultOptions.collapseDeepQuotes))
            {
                _$post.siblings(':last').parent().find('p > span.IBBquotedtable > span.IBBquotedtable').each(function()
                {
                    this.style.height = this.style.height ? '' : '18px';
                    this.style.boxShadow = this.style.boxShadow ? '' : 'inset ' + this.style.borderColor + ' 0px 0px 10px 0px';
                });
            }
            
            var anchor = document.getElementsByName(location.hash.substr(1));
            if (anchor.length)
                window.scrollTo(0, $(anchor).offset().top);
            
            // toggle image links
            _$post.siblings(':last').find('a').each(function()
            {
                if (~this.href.search(/\.(gif|jpe?g|png|bmp)(?:[?&#_].*|$)/i))
                {
                    var link = this;
                    var $link = $(this);
                    $('<a/>').attr({href: 'javascript:;'}).css({fontWeight: 'bold', textDecoration: 'none'}).text(' [+]').insertAfter(this).click(function(ev)
                    {
                        ev.stopPropagation();
                        this.textContent = this.textContent === ' [+]' ? ' [-]' : ' [+]';
                        var $this = $(this);
                        var $img = $(this).next();
                        if ($img.eq(0).attr('tagName') === 'IMG')
                        {
                            $img.toggle();
                        }
                        else
                        {
                            $('<img/>').attr('src', link.href).css('width', '100%').insertAfter(this);
                        }
                    });
                }
            });
        })($post);
    }
    
    // set "last post" according to capture state
    var capturepost = XT.get('groups.general.capturepost', false);
    if (capturepost && ~url.search(/fanclub\/[^\/]+\/forums\/posts\.aspx/i))
    {
        var linkstamps = XT.get('groups.general.linkstamps', {});
        var id = document.getElementsByName('end')[0].nextElementSibling.name;
        var gid = $('#ctl00_backToIndexLink').attr('href').match(/fanclub\/([^\/]+)\/forums/i)[1];
        linkstamps[gid].link = url.replace('#end', '') + '#' + id;
        XT.set('groups.general.linkstamps', linkstamps);
        XT.set('groups.general.capturepost', false);
    }
    
    // collabsible quotes
    $('span.IBBquotedtable').each(function()
    {
        $(this).css('overflow', 'hidden').prepend(
            $('<a/>').css({float: 'right', 'font-size': '14px'}).attr('href', 'javascript:;').text(this.style.height ? 'v' : '^').click(function()
            {
                this.parentNode.style.height = this.parentNode.style.height ? '' : '18px';
                this.parentNode.style.boxShadow = this.parentNode.style.boxShadow ? '' : 'inset ' + this.parentNode.style.borderColor + ' 0px 0px 10px 0px';
                $(this).text(this.parentNode.style.height ? 'v' : '^');
            })
        );
        /*
        $(this).css({cursor: 'pointer', overflow: 'hidden'}).click(function(ev)
        {
            if (ev.target.tagName == 'A')
                return;
            ev.stopPropagation();
            this.style.height = this.style.height ? '' : '18px';
            this.style.boxShadow = this.style.boxShadow ? '' : 'inset ' + this.style.borderColor + ' 0px 0px 10px 0px';
        }, false);
        */
    });
}


// message improvements
if (~url.search(/profile\.aspx\?postid=[0-9]+\&act=msg/i))
{
    // set group message subject
    $('#ctl00_mainContent_messageForm_skin_subject').attr('value', XT.get('messages.general.returnsubject', ''));
    
    // add "Return to thread" after sending message
    $('#ctl00_mainContent_messageForm p:last').append(
        '<br/><br/>',
        $('<strong/>').append(
            $('<a/>').attr('href', XT.get('messages.general.returnlink')).text('Return to thread')
        )
    );
}

function relativeTime(time)
{
    var SECOND = 1000;
    var MINUTE = 60 * SECOND;
    var HOUR = 60 * MINUTE;
    var DAY = 24 * HOUR;
    var MONTH = 30 * DAY;   
    var delta = Date.now() - time;
    if (delta < 1 * MINUTE)
    {
        var seconds = Math.floor(delta / SECOND);
        return seconds <= 1 ? "1 second ago" : seconds + " seconds ago";
    }
    if (delta < 2 * MINUTE)
    {
        return "1 minute ago";
    }
    if (delta < 45 * MINUTE)
    {
        return Math.floor(delta / MINUTE) + " minutes ago";
    }
    if (delta < 90 * MINUTE)
    {
        return "1 hour ago";
    }
    if (delta < 24 * HOUR)
    {
        return Math.floor(delta / HOUR) + " hours ago";
    }
    if (delta < 48 * HOUR)
    {
        return "yesterday";
    }
    if (delta < 30 * DAY)
    {
        return Math.floor(delta / DAY) + " days ago";
    }
    if (delta < 12 * MONTH)
    {
        var months = Math.floor(delta / DAY / 30);
        return months <= 1 ? "1 month ago" : months + " months ago";
    }
    else
    {
        var years = Math.floor(delta / DAY / 365);
        return years <= 1 ? "1 year ago" : years + " years ago";
    }
}

function camelToTitleCase(str)
{
    return str[0].toUpperCase() + str.substr(1).replace(/([a-z])([A-Z]|[0-9])/g, '$1 $2');
}

function pad(i)
{
    return i < 10 ? '0' + i : i;
}

function template(str, dat)
{
    for (var prop in dat)
        str = str.replace(new RegExp('{' + prop + '}','g'), dat[prop]);
    return str;
}