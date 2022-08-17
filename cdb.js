// version beta

var http = require('http');
var qs = require('querystring');
var url = require('url');
var fs = require('fs');

var USERDATA = {};
var verdata = '6.1';
var vertime = 0;
var verflush = 1000 * 60 * 60 * 24; // 24h
var srvMsg = null;

fs.readFile('c:\\server\\gm\\cdb\\store.txt', 'utf-8', function(err, dat) {
	var jdat = JSON.parse(dat);
	for (var u in jdat) {
		USERDATA[jdat[u].uid] = jdat[u];
	}
});

var usert = {};

http.createServer(function (req, res) {
	res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
	
	
	
	
	
	
	
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	
	// Cleanup.
	var urlp = url_parts;
	var path = urlp.pathname;

	// Handle the developer version.
	if (query.ver === 'dev') {
		//console.log('Request from developer version.');
		switch (path) {
			case '/get':

				if (query.uids) {
					//console.log('Confirmed uids parameter.');
					var result = {status: 200, users: {}};
					var requestedUsers = query.uids.split(',');
					for (var i in requestedUsers) {
						var user = requestedUsers[i];
						if (usert[user]) {
							result.users[user] = usert[user];
						}
					}
					//console.log(JSON.stringify(result));
					res.write(JSON.stringify(result));
				}
				res.end();
				break;
			case '/set':
				if (req.method === 'POST') {
					//console.log('Incoming POST request...');
					var body = [];
					req.on('data', function(chunk) {
						//console.log('Chunk:', chunk);
						body.push(chunk);
					});
					req.on('end', function() {
						//console.log('POST:', body.join('').toString());
						var pd = qs.parse(body.join('').toString());
						if (pd.uid) {
							usert[pd.uid] = {
								avatar: pd.avatar,
								nameColor: pd.nameColor,
								title: pd.title,
								titleColor: pd.titleColor,
								titleBgColor: pd.titleBgColor,
								titleBdColor: pd.titleBdColor
							};
						}
						res.end(JSON.stringify({status: 200}));
					});
					req.on('error', function() {
						res.end(JSON.stringify({status: 400}));
					});
				} else {
					res.end(JSON.stringify({status: 200}));
				}
				break;
		}
	}
	
	//console.log(url_parts.pathname, url_parts);
	else if (url_parts.pathname === '//ver')
	{
		var now = Date.now();
		if (now - vertime < verflush) {
			res.end(verdata);
		}
		else {
			// read file
			fs.readFile('c:\\server\\gm\\cdb\\ver.txt', 'utf-8', function(err, dat) {
				verdata = dat || '6.1';
				vertime = now;
				res.end(verdata);
			});
		}
	}
	else if (url_parts.pathname === '//admin_setver' && query.ver) {
		verdata = query.ver;
		res.end();
	}
	else if (url_parts.pathname === '//admin_loadstore') {
		fs.readFile('c:\\server\\gm\\cdb\\store.txt', 'utf-8', function(err, dat) {
				var jdat = JSON.parse(dat);
				for (var u in jdat) {
					USERDATA[jdat[u].uid] = jdat[u];
				}
				res.write(JSON.stringify(USERDATA));
				res.end('Data has been loaded sucessfully.');
			});
	}
	else if (url_parts.pathname === '//admin_savestore') {
		fs.writeFile('c:\\server\\gm\\cdb\\store.txt', JSON.stringify(USERDATA), function (err) {
			if (err) {
				res.end(err);
			} else {
				res.end('The file was saved!');
			}
		});
	}
	else if (url_parts.pathname === '//get' && query.ids)
	{
		var result = {ver: verdata, users: {}};
		if (srvmsg) {
			result.srvmsg = srvmsg;
		}
		var requestedUsers = query.ids.split(',');
		for (var u in requestedUsers) {
			if (USERDATA[requestedUsers[u]])
				result.users[USERDATA[requestedUsers[u]].uid] = (USERDATA[requestedUsers[u]]);
		}
		//console.log(result);
		res.write(JSON.stringify(result));
		res.end();
	}
	else if (url_parts.pathname === '//set' && req.method === 'POST' && query.ver !== 'dev')
	{
		var body = [];
        req.on('data', function(chunk) { body.push(chunk); });
        req.on('end', function() {
            var POST = qs.parse(body.join('').toString());
            if (POST.uid) {
				USERDATA[POST.uid] = {uid: POST.uid, avatar: POST.avatar, color: POST.color};
			}
			res.end('{}');
        });
	}
	else if (url_parts.pathname === '//getall_dump')
	{
		res.write(JSON.stringify(USERDATA));
		res.end();
	}
	else {
	//console.log(USERDATA);
		res.end(JSON.stringify({status: 400}));
	}
	
    /*res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.method === 'POST') {
        var body = [];
        var msg;
        req.on('data', function(chunk) { body.push(chunk); });
        req.on('end', function() {
            var POST = qs.parse(body.join('').toString());
            messages.push(POST.msg);
        });
    }
    res.write('<form method="post"><input name="msg"/><input type="submit" value="Post"/></form><a href="">Get Posts (Refresh)</a><br/>');
    res.write(messages.join('<br/>'));
    res.end('<br/>' + ++hits + ' hits.\n');*/
}).listen(1337, "127.0.0.1");