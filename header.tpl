<!DOCTYPE html>
<html lang="[[LANG]]">
<head>
<title>[[TITLE]]</title>
<meta charset="[[CHARSET]]" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="u.tpl/u.css" />
<link rel="alternate" type="application/rss+xml" title="[[recent_changes]]" href="[[CGI]]?rss" />
<script src="u.tpl/u.js"></script>
<script>
window_onload(function(){
	if(!window.location.href.match(/^file:/))
		ajax_request('[[CGI]]/[[PAGE]]?user_info', null, process_menu,
			'text/plain');
});
</script>
</head>
<body>
<header id="top">
<div id="site-title"><a href="[[DOC_BASE]]">[[SITE_TITLE]]</a></div>
<div id="site-description">[[SITE_DESCRIPTION]]</div>
</header>
<main id="main">
