// ==UserScript==
// @name        Coup'd Bungie
// @description Personalize your bungie.net experience.
// @namespace   http://iggyhopper.strangled.net/
// @include     http://*.bungie.net/*
// @include     https://*.bungie.net/*
// @version     6.2.99
// @resource    SPECTRUM_CSS http://iggyhopper.strangled.net/gm/cdb/resources/spectrum.css
// @require     http://iggyhopper.strangled.net/gm/cdb/resources/spectrum.js
// ==/UserScript==

var VERSION = "6.2.99";
var ERROR_CACHE_FLUSH_THRESHOLD         = 1000 * 60 * 60 * 3;       // 03h
var GROUP_CACHE_FLUSH_THRESHOLD         = 1000 * 60 * 60 * 24 * 10; // 10d
var USER_CACHE_FLUSH_THRESHOLD_EXPIRED  = 1000 * 60 * 15;           // 15m
var USER_CACHE_FLUSH_THRESHOLD_UNCACHED = 1000 * 60 * 60 * 24;      // 24h
var USER_CACHE_FLUSH_THRESHOLD_SET      = {expired: USER_CACHE_FLUSH_THRESHOLD_EXPIRED, uncached: USER_CACHE_FLUSH_THRESHOLD_UNCACHED};
var SERVER_URL                          = 'http://iggyhopper.us.to:8080';
var APP_URL                             = SERVER_URL + '/gm/cdb/app';
var XT = (function() {
    
    // package
    var api = {};
    
    // private
    var prefix = '';
    
    var get = function(name, dvalue) {
        var result = JSON.parse(localStorage.getItem(name));
        return result !== null ? result : dvalue;
    };
    
    // public
	api.clear = function() {
		for (var key in localStorage) {
            if (key.substring(0, prefix.length) === prefix) {
                localStorage.removeItem(prefix + name);
            }
        }
	};
	
    api.get = function(name, dvalue) {
        var result = JSON.parse(localStorage.getItem(prefix + name));
        return result !== null ? result : dvalue;
    };
    
    api.getAll = function(asObject) {
        var result = asObject ? {} : [];
        if (asObject) {
            for (var key in localStorage) {
                if (key.substring(0, prefix.length) === prefix) {
                    result[key] = get(key);
                }
            }
        }
		else {
            for (var key in localStorage) {
                if (key.substring(0, prefix.length) === prefix) {
                    result.push({key: key, value: get(key)});
                }
            }
        }
        return result;
    };
    
    api.init = function(name) {
        prefix = name + '.';
    };
    
    api.remove = function(name) {
        localStorage.removeItem(prefix + name);
    };
    
    api.set = function(name, value) {
        localStorage.setItem(prefix + name, JSON.stringify(value));
    };
    
    return api;
})();
var Locache = (function() {
	
    // package
    var api = {};
    
    // private
	
    // public
	
	api.get = function(key, threshold, callback) {
		// Retrieve the cache from localStorage, default to null.
		var cache = XT.get(key, null);
		
		// Does the cache exist?
		if (cache) {
			// Always send it out, because the callback will need to have a fallback.
			callback(cache);
			
			// Does it still taste good?
			if (Date.now() - cache.time > threshold) {
				// It's stale.
				callback(null);
			}
		}
		else {
			// It doesn't exist.
			callback(null);
		}
	};
	
	api.update = function(key, subkeys, thresholds, callback)
	{
		// Get current time for timestamping purposes.
		var now = Date.now();
		
		// Retrieve the cache from localStorage, default to object.
		var cache = XT.get(key, null);
		
		if (cache === null) {
			log('Locache: Cache is empty.');
			cache = {};
		}
		
		// Create the cache status object.
		var results = {cached: {}, expired: {}, uncached: {}};
		
		// Main process determines subkey cache status.
		for (var subkeyKey in subkeys)
		{
			var subkeyValue = subkeys[subkeyKey];
			var cacheValue = cache[subkeyValue];
			// Does it exist? Have we chacked before?
			// TODO: Clean A
			if (cacheValue && mSign(cacheValue.time) === 1)
			{
				// Is it fresh?
				if (now - cacheValue.time < thresholds.expired)
				{
					// It's fresh.
					results.cached[subkeyValue] = cacheValue;
				}
				else
				{
					// It's stale.
					results.expired[subkeyValue] = cacheValue;
				}
			}
			else
			{
				cacheValue = cacheValue || {time: 0};
				
				// Do we need to trigger a request for new data on a non-existent subkey?
				// TODO: Clean A
				if (now - +cacheValue.time > thresholds.uncached)
				{
					results.uncached[subkeyValue] = {time: -now};
				}
			}
		}
		
		// Send results, and wait for the update callback.
		callback(results, function(things)
		{
			log('Loback:', things);
			var now = Date.now();
			for (var thing in things)
			{
				var data = things[thing];
				data.time = data.time < 0 ? -now : now;
				cache[thing] = data;
			}
			XT.set(key, cache);
		});
	};
	
	return api;
})();
var Coup = (function()
{
	// package
    var api = {};
    
    // private
	var $;
	
    var urls =
	{
		server: '',
		get: '',
		set: ''
	};
	
	var APP_GET_URL = APP_URL + '/get?';
    var APP_SET_URL = APP_URL + '/set?';
    
    // public
	api.get = function(userIds, callback, errback) {
		if (userIds.length === 0) {
			log('Coup.get: No users requested.');
			return;
		}
		log('Coup.get:', userIds);
		$.getJSON(APP_GET_URL + $.param({version: VERSION, uids: userIds.join(',')})).done(callback).fail(errback);
    };
	
	api.init = function(_$) {
		$ = _$;
	};
	
	api.set = function()
	{
		
	};
	
	api.idSelector = 'article > div > a > img';
	api.idAction = 'data';
	api.idAttr = 'membershipid';
	
	api.mods =
	[
		{
			name: 'Avatar',
			type:'url',
			info: '',
			key: 'avatar',
			selector: 'a.avatar > img',
			action: 'attr',
			args: ['src']
		},
		{
			name: 'Name Color',
			type:'color',
			info: '',
			key: 'nameColor',
			selector: 'h1 > a',
			fn: function(value)
			{
				this.style.setProperty('color', value, 'important');
				this.classList.add('nodark');
			}
		},
		{
			name: 'Title Text',
			type: 'text',
			info: '',
			key: 'title',
			selector: 'div.content a[data-membershipid]',
			fn: function(value)
			{
				
			}
		},
		{
			name: 'Title Color',
			type: 'color',
			info: '',
			key: 'titleColor',
			selector: 'div.content a[data-membershipid]',
			fn: function(value)
			{
				
			}
		},
		{
			name: 'Title Background Color',
			type: 'color',
			info: '',
			key: 'titleBgColor',
			selector: 'div.content a[data-membershipid]',
			fn: function(value)
			{
				
			}
		},
		{
			name: 'Title Border Color',
			type: 'color',
			info: '',
			key: 'titleBdColor',
			selector: 'div.content a[data-membershipid]',
			fn: function(value)
			{
				
			}
		}
	];
	
	api.groupMods =
	[
		
	];
	
	api.pageModMemory = {};
	
	api.pageMods =
	[
		{
			name: 'User Titles',
			key: 'titles',
			// TODO: Clean up.
			fn: function(data, selfKey)
			{
				if (!data || !data.users) return;
				
				// Do not stack styles.
				this.appliedUsers = this.appliedUsers || {};
				this.runOnce = this.runOnce || false;
				
				
				var users = data.users;
				// TODO: Remove duplicate users when appending styles.
				var styleString = [];
				if (this.runOnce === false) {
					styleString.push('h1 > a[data-membershipid]:after {',
					'display: inline-block !important;',
					'font-family: "OpenSansSemiBold", Arial, sans-serif !important;',
					'font-size: 11px !important;',
					'line-height: 14px !important;',
					'margin-left: 5px !important;',
					'padding: 0 3px 0 2px !important;',
					'position: relative !important;',
					'top: -1px !important;',
					'vertical-align: middle !important;',
					'}');
					this.runOnce = true;
				}
				$(document.body).append($('<style type="text/css"></style>').text(htmlDecode(styleString.join(''))));
				
				for (var userId in users) {
					if (!this.appliedUsers[userId]) {
						var userData = users[userId];
						var $userStyle = $('<style type="text/css"/>')
							.text('h1 > a[data-membershipid="' + userId + '"]:after { }')
							.appendTo(document.body);
						var userRule = $userStyle[0].sheet.cssRules[0];
						userRule.style.backgroundColor = userData.titleBgColor;
						userRule.style.border = '1px solid ' + userData.titleBdColor;
						userRule.style.color = userData.titleColor;
						if (userData.title) {
							userRule.style.content = '"' + userData.title + '"';
						}
						this.appliedUsers[userId] = true;
					}
				}
			}
		}
	];
	
	api.options =
	[
		{
			name: 'Disable Group Styling',
            type: 'option',
            info: '',
            key: 'disableGroupStyling',
            defval: false
		},
		{
			name: 'Group Style Banlist',
			type: 'list',
			info: '',
			key: 'groupStyleBanlist',
			size: 3,
			init: function($select) {
				log($select);
				var select = $select.get(0);
				var groups = unsafeWindow.viewModels.myFollowedGroupsModel();
				for (var i = 0, ic = groups.length; i < ic; ++i) {
					var group = groups[i];
					var id = group.following.identifier;
					var name = group.detail.displayName;
					log(id, name);
					select.add($('<option/>').text(name).val(id)[0], null);
				}
				return $select;
			},
			add: function() {
				var $select = $('#cdb_groupStyleBanlist');
				alert('Not working!');
			},
			remove: function() {
				var $select = $('#cdb_groupStyleBanlist');
			}
		},
		{
			name: 'Clear Local Data',
			type: 'action',
			info: '',
			key: 'clearLocalData',
			text: 'Clear',
			fn: function() {
				confirm('Are you sure you want to clear local data?')
					&& XT.getAll().forEach(function(e) { XT.remove(e.key); })
                    && alert('Local data has been cleared.');
			}
		}
	];
	
	return api;
})();
try {

var pop = Array.prototype.pop;
var push = Array.prototype.push;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;
var partial = function(fn) {
    var args = slice.call(arguments, 1);
    return function() {
        return fn.apply(null, args.concat(slice.call(arguments)));
    };
};
var wrap = function(fn, wrapper) {
    return function() {
        var args = [fn];
        push.apply(args, arguments);
        return wrapper.apply(this, args);
    };
};
var patch = function(fn, patcher) {
	return function() {
		return fn.apply(null, arguments).done(patcher);
	};
};
var mapProperty = function(array, property, sub, unique) {
	var result = isObject(property) ? {} : [];
	if (isObject(property)) {
		for (var i in property) {
			result[i] = [];
			for (var j = 0, c = array.length; j < c; ++j) {
				result[i].push(array[j][property[i]]);
			}
		}
	} else {
		if (sub) {
			if (unique) {
				var u = {};
				for (var i = 0, c = array.length; i < c; ++i) {
					u[array[i][property] && array[i][property][sub]] = true;
				}
				for (var i in u) {
					result.push(i);
				}
			} else {
				for (var i = 0, c = array.length; i < c; ++i) {
					result.push(array[i][property] && array[i][property][sub]);
				}
			}
		} else {
			for (var i = 0, c = array.length; i < c; ++i) {
				result.push(array[i][property]);
			}
		}
	}
	return result;
};
var isArray = function(obj) {
	return toString.call(obj) === '[object Array]';
};
var isObject = function(obj) {
	return obj === Object(obj);
};

if (window.chrome || window.opera)
{
    // This is an unsafeWindow hack for Chrome.
	unsafeWindow = (function()
    {
        var e = document.createElement('p');
        e.setAttribute('onclick', 'return window;');
        return e.onclick();
    })();
    
    // Bring in variables because Opera doesn't do it.
    console      = unsafeWindow.console;
    localStorage = unsafeWindow.localStorage;
}

var logt = Date.now();
var logf = partial(console.log.bind(console), 'cdb:');
var log = function() {
	var td = Date.now() - logt;
	var m = td / 60000 >> 0 % 60;
	var s = ('0' + (td / 1000 >> 0 % 60)).slice(-2);
	var ms = (td / 1000 % 1).toFixed(4).substr(2, 4);
	var t = [['[', m, ':', s, '.', ms, ']'].join('')];
	push.apply(t, arguments);
	logf.apply(null, t);
};

var jlog = function(arg) {
	logf(JSON.stringify(arg));
};

var dbg = {
    on: false,
    msgs: ['Coup d\'Bungie Log']
};

log('Script loaded.');

// Pass a function f to be called when conditions are met.
(function(f) {
    var start = Date.now();
    var t = setInterval(function() {
        if (unsafeWindow.currentRequests.length === 0 || ~unsafeWindow.location.href.search(/\?context\=settings/i))
        {
			clearInterval(t);
            f(start);
        }
    }, 500);
})
// f
(function(tstart) {
	log('Script started.');
    var fstart = Date.now();
    var $ = unsafeWindow.$;
	var bnet = unsafeWindow.bungieNetPlatform;
    var url = unsafeWindow.location.href;
    var myUserId = unsafeWindow.myID_cookie;
    var isSignedIn = myUserId !== 0;
    var isFirefox = typeof InstallTrigger !== 'undefined';
    console.log($, bnet, url, myUserId, isSignedIn, isFirefox);
	
	// Fix weird JSON error, I don't know, WTF.
	$.ajaxSetup({mimeType: "text/plain"});
    
    // Attach event listener for debugging log.
    window.addEventListener('keydown', function(ke) {
        // Exclude events where the active element is in a text field.
        if (ke.which === 191 && ke.shiftKey
                             && ke.target.localName !== 'input'
                             && ke.target.localName !== 'textarea')
            uAlert(dbg.msgs.join('<br/>'));
    }, false);
    
    // Initialize localStorage wrapper library with namespace "cdb".
    XT.init('cdb');
	
	// Initialize server API-thing with URLs.
	Coup.init($, {server: SERVER_URL, get: 'get', set: 'set'});
    
    // Fix page titles.
    if (~url.search(/\/forum\/topics/i))
        document.title += ' : ' + $('#searchedTag, #searchedTag > span').last().text();
    else if (~url.search(/\/view\/profile/i))
        document.title += ' : ' + $('h1.displayName > a').text();
    document.title = document.title.split(' : ').reverse().join(' : ');
    
	function uAlert() {
        var a = new unsafeWindow.LightBox(null, $('#alert'));
        a.showLightbox();
        var b = $('<div/>');
        b.append.apply(b, arguments);
        a.clearContent();
        a.loadLightbox(b, true);
    }
    
	if (isSignedIn) {
		// Hijack the notifications function and additionally display a count in the page title.
        //unsafeWindow.viewModels.newNotifications = wrap(unsafeWindow.viewModels.newNotifications, function(fn, n) {
		//	if (+n) {
		//		document.title = '(' + n + ') ' + document.title.split(/^\([0-9]+\) /).pop();
		//	}
		//	return fn(n);
		//});
		
		if (~url.search(/\?context\=settings/i)) {
			log('Loading profile settings...');
			if (typeof GM_getResourceText !== 'undefined') {
				$('head').append($('<style type="text/css"/>').text(GM_getResourceText('SPECTRUM_CSS')));
            }
			var $cdbPanel = $('#AccountSettings > :first').clone();
			$cdbPanel.find('div.collapsible').css({paddingTop: 10, paddingBottom: 0});
			var $ctPanel = $cdbPanel.find('div.container_form').html('');
			// $.append workaround to append an array of jQuery elements
			var colorNodes = [];
			$ctPanel.append.apply($ctPanel, (function() {
				var nodes = [];
				for (var i = 0, ic = Coup.mods.length; i < ic; ++i) {
					var mod = Coup.mods[i];
					switch (mod.type) {
						case 'url':
							nodes.push(
								$('<label/>').attr({for: 'cdb_' + mod.key, title: mod.name}).text(mod.name + ':'),
								$('<div/>').addClass('container_textbox container_textfield').append(
									$('<input/>').attr({id: 'cdb_' + mod.key, key: mod.key, type: 'text'})
								)
							);
							break;
						case 'color':
							var tmp;
							nodes.push(
								$('<label/>').attr({for: 'cdb_' + mod.name, title: mod.name}).text(mod.name + ':'),
								$('<div/>').addClass('container_textbox container_textfield').css('background', 'none').append(
									tmp = $('<input/>').attr({id: 'cdb_' + mod.key, key: mod.key, type: 'text'})
								)
							);
							colorNodes.push(tmp[0]);
							break;
						case 'text':
							nodes.push(
								$('<label/>').attr({for: 'cdb_' + mod.name, title: mod.name}).text(mod.name + ':'),
								$('<div/>').addClass('container_textbox container_textfield').append(
									$('<input/>').attr({id: 'cdb_' + mod.key, key: mod.key, type: 'text'}).keydown(function() {
										if (this.value.length > 50) {
											this.parentNode.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
										} else {
											this.parentNode.style.backgroundColor = '';
										}
									})
								)
							);
							break;
					}
				}
				for (var i = 0, ic = Coup.options.length; i < ic; ++i) {
					var opt = Coup.options[i];
					var optStoreValue = XT.get(opt.key, opt.defval);
					switch (opt.type) {
						case 'option':
							nodes.push(
								$('<label/>').attr({for: 'cdb_' + opt.key, title: opt.name}).text(opt.name + ':'),
								$('<div/>').css({background: 'none', lineHeight: '25px', minHeight: 25}).append(
									$('<input/>').attr({id: 'cdb_' + opt.key, key: opt.key, type: 'checkbox'}).attr('checked', optStoreValue).click(function() {
										log('Setting', this.attributes.key.value, 'to', this.checked, '...');
										XT.set(this.attributes.key.value, this.checked);
									})
								)
							);
							break;
						case 'list':
							nodes.push(
								$('<label/>').attr({for: 'cdb_' + opt.key, title: opt.name}).text(opt.name + ':'),
								$('<div/>').addClass('container_textbox container_textfield').css('background', 'none').append(
									opt.init($('<select/>').attr({id: 'cdb_' + opt.key, key: opt.key}))
								),
								$('<input/>').attr({type: 'button', value: 'Add'}).click(opt.add),
								$('<input/>').attr({type: 'button', value: 'Remove'}).click(opt.remove),
								'<br/>',
								'<br/>'
							);
							break;
						case 'action':
							nodes.push(
								$('<label/>').attr({for: 'cdb_' + opt.key, title: opt.name}).text(opt.name + ':'),
								$('<div/>').css({background: 'none', lineHeight: '25px', minHeight: 25}).append(
									$('<input/>').attr({id: 'cdb_' + opt.key, key: opt.key, type: 'button', value: opt.text}).click(opt.fn)
								)
							);
							break;
					}
				}
				return nodes;
			})());
			$(colorNodes).spectrum({
				showInput: true,
				showInitial: true,
				showAlpha: true,
				preferredFormat: 'rgb',
                clickoutFiresChange: true
			});
			$cdbPanel.find('a').attr({href: 'javascript:;', id: 'btn_saveCoup'}).end()
            .find('h3').css('background-color', 'rgba(15, 0, 40, 0.40)').click(function()
            {
                $(this).parent().toggleClass('open');
            }).end()
            .find('strong.heading').text("Coup'd Bungie " + VERSION).end()
            .find('span.description').html('Show who you really are. <a id="btnUpdateCoup" href="http://iggyhopper.strangled.net/gm/cdb/download/coup_d_bungie.user.js"></a>');
			
			$cdbPanel.appendTo('#AccountSettings');
			
			Coup.get([myUserId], function(data) {
				log('Response:', data);
                var currentVersion = data.version;
                if (currentVersion > VERSION) {
                    $('#btnUpdateCoup').text('(Update Available: ' + currentVersion + ')');
                }
				var users = data.users;
				var user;
				if (user = users[myUserId]) {
					for (var i = 0, ic = Coup.mods.length; i < ic; ++i) {
						var mod = Coup.mods[i];
						if (mod.type === 'color') {
							$('#cdb_' + mod.key).spectrum('set', user[mod.key]);
						}
						else {
							$('#cdb_' + mod.key).val(user[mod.key]);
						}
					}
				}
			}, function() {
				uAlert('Server error.');
			});
            
            $('#btn_saveCoup').click(function() {
                var $cdb = $(this).parent().parent();
                if (!$cdb.hasClass('open')) return;
                var pd = {ver: VERSION, uid: myUserId};
				var cd = {};
                for (var i = 0, ic = Coup.mods.length; i < ic; ++i) {
					var mod = Coup.mods[i];
					if (mod.type === 'color') {
						cd[mod.key] = pd[mod.key] = $('#cdb_' + mod.key).spectrum('get').toString();
					} else if (mod.type === 'text') {
						var $el = $('#cdb_' + mod.key);
						if ($el.val().length > 50) {
							uAlert(mod.name, ' is too long.');
							return;
						}
						cd[mod.key] = pd[mod.key] = $('#cdb_' + mod.key).val();
					} else {
						cd[mod.key] = pd[mod.key] = $('#cdb_' + mod.key).val();
					}
				}
				var userCache = XT.get('users.cache', {});
				cd.time = Date.now();
				userCache[pd.uid] = cd;
				XT.set('users.cache', userCache);
                $.post(APP_URL + '/set', pd, function(res) {
					uAlert(res.status === 200 ? res.message : 'Error! I don\'t know!');
				}, 'json').fail(function() {
                    console.log(arguments);
					uAlert('Something went wrong!');
				});
            });
		}
		
		// Load and apply group styles.
		if (~url.search(/\/clan\//i) && !XT.get('disableGroupStyling', false)) {
			var gid = unsafeWindow.groupId;
			var ckey = template('groups.{id}.cache', {id: gid});
			log('Locaching group style...');
			Locache.get(ckey, GROUP_CACHE_FLUSH_THRESHOLD, function(cache) {
				log(cache ? 'Cache found...' : 'Cache not found; requesting new data...');
				if (cache) {
					// TODO: Deal with forums and pinned topics. Make nice replace function. Remove jQuery dependency?
					$('body').append($('<style type="text/css"/>').text(htmlDecode(cache.style).replace(/;/g, ' !important;')));
				}
				else {
					bnet.forumService.GetTopicsPaged(0, 10, gid, 0, 0, 32, '', function(data) {
						log('Bnet Response:', data);
						var styleString = '';
						var forums = [];
						var pinnedTopics = [];
						for (var i = 0, c = data.results.length; i < c; ++i) {
							var currentPost = data.results[i];
							if (currentPost.subject === 'CSS') {
								log('CSS found...');
								bnet.forumService.GetPostAndParent(currentPost.postId, '', function processPostData(postData) {
									currentPost = postData.results[postData.results.length - 1];
									var tags = currentPost.tags;
									if (tags) {
										for (var j = 0, d = tags.length; j < d; ++j) {
											var prefix = tags[j].substr(1,2);
											if (prefix === 'P_') {
												// TODO: Get thread data from thread ID and store it.
											}
											else if (prefix === 'F_') {
												forums.push(tags[j].substr(3));
											}
										}
									}
									styleString += currentPost.body;
									if (currentPost.parentPostId) {
										log('Parent post found; requesting...');
										bnet.forumService.GetPostAndParent(currentPost.parentPostId, '', processPostData);
									}
									else {
										var cval = {
											style: styleString,
											forums: forums,
											pins: pinnedTopics,
											time: Date.now()
										};
										log('Updating style cache...');
										XT.set(ckey, cval);
										log('Applying style...');
										$('body').append($('<style type="text/css"/>').text(htmlDecode(styleString).replace(/;/g, ' !important;')));
										// TODO: Add subforum and pin code.
									}
								});
							}
						}
					});
				}
			});
		}
    }
	
    if (~url.search(/\/profile\//i)) {
        log('Loading recent messages...');
        var mid = +url.match(/&mid=([0-9]+)/i)[1];
        log(mid);
        //var userName = unsafeWindow.viewModels.loggedInUserModel().user.displayName() || $('div.signedIn span').text();
        //log(userName);
        log($('div.signedIn span').text());
        var userName = $('div.signedIn span').text() || 'Anonymous';
        
        // Initialize message module.
        var $home = $('#home');
        var $msgModule = $home.find('div.subcolumn.main > div.container_section:first').before(
            '<div id="cdb_msgs"><h2>Recent Messages</h2><input id="cdb_msgText" maxlength="256" style="color: black !important;"/><input type="submit" id="cdb_postMsg" value="Post" style="color: black !important;"/></div>'
        ).prev();
        log(mid, userName, $home, $msgModule, APP_URL + '/get/messages');
        $.getJSON(APP_URL + '/get/messages', $.param({uids: mid})).done(function(responseData) {
            log(arguments);
            for (var uid in responseData.messages) {
                for (var imsg in responseData.messages[uid]) {
                    if (responseData.messages[uid][imsg].from) $msgModule.children().first().after(template('<span>{from}: {msg}</span><br/>', {from: responseData.messages[uid][imsg].from, msg: responseData.messages[uid][imsg].message}));
                }
            }
        }).fail(function() { log(arguments); });
        $('#cdb_postMsg').click(function() {
            $this = $(this);
            $this.hide();
            $.post(APP_URL + '/post/message', {to: mid, from: $('div.signedIn span').text(), message: $('#cdb_msgText').val()}, function(res) {
				uAlert(res.status === 200 ? res.message : 'Error! I don\'t know!');
                $this.show();
                $('#cdb_msgText').val('');
                $this.prev().before('<span>...</span><br/>');
            }, 'json').fail(function() {
                uAlert('Something went wrong!');
                $(this).show();
            });
        });
        
    }
    
	if (~url.search(/\/forum\/post/i) || ~url.search(/\/clan\/post/i)) {
		// Apply styles to initial posts.
		// TODO: Users are cached individually. Fix this code.
		// TODO: Use solution #2.
		
		// TODO-L2: Wrap in locache call.
				
		// What do we want? A callback for cached users, and a callback for uncached users?
		// If I pass cache to callback, callback is expected to manage storage.
		// If I don't pass it, function is expected to manage storage. Function name `update` fits.
		
		
		function applyLocache(users, loback) {
			function applyUserData(data) {
				if (!data || !data.users) return;
				for (var i = 0, ic = Coup.pageMods.length; i < ic; ++i) {
					Coup.pageMods[i].fn.call(Coup.pageModMemory, data, Coup.pageMods[i].key);
				}
				for (var i = 0, ic = $posts.length; i < ic; ++i) {
					var userId = $posts.eq(i).find(Coup.idSelector)[Coup.idAction](Coup.idAttr);
					var userData = data.users[userId];
					if (userData) {
						for (var j = 0, jc = Coup.mods.length; j < jc; ++j) {
							var mod = Coup.mods[j];
							var $el = $posts.eq(i).find(' > article > div.post').find(mod.selector);
							if (mod.fn) {
								$el[0] && userData[mod.key] && mod.fn.call($el[0], userData[mod.key]);
							} else {
								userData[mod.key] && $el[mod.action].apply($el, mod.args.concat(userData[mod.key]));
							}
						}
					}
				}
			}
			var appliedUsers = $.extend(users.cached, users.expired);
			var requestedUsers = $.extend(users.expired, users.uncached);
			// TODO: Filter negative times.
			var requestedUserIds = Object.keys(requestedUsers).filter(function(e) { return users.uncached[e] && users.uncached[e].time < 0; });
			Locache.get('server.lastError', ERROR_CACHE_FLUSH_THRESHOLD, function(error) {
				if (!error) {
					Coup.get(requestedUserIds, function(responseData) {
						log('Coup Response:', responseData);
						applyUserData(responseData);
						loback($.extend(users.uncached, responseData.users));
					}, function() {
						XT.set('server.lastError', {time: Date.now()});
						uAlert('Coup d\'Bungie: Server cannot be reached. Retrying in 30 minutes.');
					});
				} else {
					log('Last server error was', (Date.now() - error.time) / 60000 >> 0 % 60,
						'minutes ago; retrying in', (error.time + ERROR_CACHE_FLUSH_THRESHOLD - Date.now()) / 60000 >> 0 % 60, 'minutes');
				}
			});
			log('Applying user styles...');
			applyUserData({users: appliedUsers});
		}
		
		// Solution #2
		var $posts = $('#forum_post, ul > li.cf[id]');
		var userIds = mapProperty($posts.find(Coup.idSelector), 'dataset', 'membershipid', true);
		log('Locaching initial users...', userIds);
		Locache.update('users.cache', userIds, USER_CACHE_FLUSH_THRESHOLD_SET, applyLocache);
		
		// Hijack PopulateReply, but only manage calls for the own user's new comments.
		unsafeWindow.Post.prototype.PopulateReply = wrap(unsafeWindow.Post.prototype.PopulateReply, function(fn, data, u1, u2) {
			log('PopulateReply:', arguments);
			// I do not know the API details of PopulateReply, but 2 additional boolean arguments are passed when
			// the user themself makes a new comment. 3 are passed if it is a question topic. For now, since
			// all these end with true, that is how I'm going to check for the source of the call to PopulateReply.
			//if (pop.call(arguments) === true && data.parentPostId === data.topicId) {
				// fn obj false true
				// fn obj false false true
			
			//} else {
				var args = slice.call(arguments, 1);
				fn.apply(this, args);
			//}
		});
	
		// Hijack dynamic loading of replies and apply styles to new comments.
		bnet.forumService.GetPostsThreadedPaged = patch(bnet.forumService.GetPostsThreadedPaged, function(bnetData) {
			log('Bnet Response:', bnetData);
			var info = mapProperty(bnetData.results, {userIds: 'authorMembershipId', postIds: 'postId'});
			$posts = $.call(null, info.postIds.map(function(i) { return '#' + i; }).toString());
			log('Locaching loaded users...');
			Locache.update('users.cache', info.userIds, USER_CACHE_FLUSH_THRESHOLD_SET, applyLocache);
		});
		
		
	}
});

}
catch (e) {
	dbg.msgs.push('Error: ' + e.message);
}

function template(str, dat)
        {
            for (var prop in dat)
                str = str.replace(new RegExp('{' + prop + '}','g'), dat[prop]);
            return str;
        }

		function htmlDecode(value) { 
        return unsafeWindow.$('<div/>').html(value).text(); 
    }

function mSign(i) {
	return (i > 0) - (i < 0);
}
	
	