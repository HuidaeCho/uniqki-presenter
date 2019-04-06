const presenters = [
	'read',
	'impress',
	'reveal',
	'minislides',
	'random',
];
const default_presenter = 'reveal';
const re_presenter = /^\??([a-z]+)(?:(:.*))?$/;

function add_presenter_selectors(){
	let nested_sections = has_nested_sections();
	add_presenter_selector('read', 'read');
	add_presenter_selector('minislides', 'light');
	add_presenter_selector('reveal', 'flat', ['flat']);
	if(nested_sections)
		add_presenter_selector('reveal', 'down');
	add_presenter_selector('impress', 'deep');
	add_presenter_selector('random', 'random', [], true);
}

function add_presenter_selector(selector, name, opts, last){
	if(presenter == 'random' || presenter != selector || !has_same_options(opts)){
		let a = document.createElement('a');
		a.href = '?' + selector + (opts && opts.length ? ':' + opts.join(':') : '');
		a.innerHTML = name;
		presenter_selector.appendChild(a);
		if(!last){
			let text = document.createTextNode(' . ');
			presenter_selector.appendChild(text);
		}
	}
}

function has_same_options(opts){
	if(!opts || !opts.length){
		if(!options.length)
			return true;
		if(options.length == 1 && get_option('asis'))
			return true;
		return false;
	}
	if(get_option('asis')){
		if(opts.length != options.length - 1)
			return false;
	}else if(opts.length != options.length)
		return false;

	return opts.every(function(opt){
		return get_option(opt);
	});
}

function get_option(opt){
	const re_opt = new RegExp('^' + opt + '(?:=(.*))?$');
	for(let i = 0; i < options.length; i++){
		let found = options[i].match(re_opt);
		if(found)
			return found[1] || true;
	}
	return false;
}

function has_nested_sections(){
	return [...view.childNodes].some(function(node){
		if(node.nodeName.toLowerCase() == 'section'){
			return [...node.childNodes].some(function(subnode){
				return subnode.nodeName.toLowerCase() == 'section';
			});
		}
	});
}

function flatten_view(){
	let flatten = function(parent_node){
		[...parent_node.childNodes].reverse().forEach(function(node){
			if(node.nodeName.toLowerCase() == 'section'){
				flatten(node);
				if(node.id == '' && node.innerText.replace(/^[0-9]+\u00a0*/, '') == '')
					parent_node.removeChild(node);
				else
					last_node = view.insertBefore(node, last_node);
			}
		});
	}
	let last_node = document.getElementById('presenter');
	flatten(view);
}

function load_css(css, media){
	let link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = css;
	if(media)
		link.media = media;
	my_head.appendChild(link);
}

function load_common_presentation_css(){
	const re_ucss = /\/u\.css$/;
	[...document.getElementsByTagName('link')].some(function(link){
		if(link.href.match(re_ucss)){
			link.media = 'print';
			return true;
		}
	});
	load_css('u.tpl/screen.css', 'screen');
	load_css('u.tpl/slides.css', 'screen');
	load_css('u.tpl/print.css', 'print');
}

function load_js(js, async, callback){
	let script = document.createElement('script');
	script.src = js;
	if(async)
		script.async = true;
	if(callback)
		script.onload = callback;
	my_head.appendChild(script);
}

function load_highlight_css(){
	//load_css('u.tpl/highlight.js/styles/atom-one-light.css');
	load_css('u.tpl/hljs.css');
}


function load_highlight_js(){
	load_js('u.tpl/highlight/highlight.pack.js', false, function(){
		hljs.initHighlightingOnLoad();
	});
}

function load_highlight(){
	load_highlight_css();
	load_highlight_js();
}

function load_mathjax_config(){
	let script = document.createElement('script');
	script.type = 'text/x-mathjax-config';
	script.innerHTML = "MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: 'AMS'}}, tex2jax: {inlineMath: [['$','$'], ['\\\\(','\\\\)']], processEscapes: true}});";
	my_head.appendChild(script);
}

function load_mathjax_js(){
//	load_js('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML', true);
	load_js('u.tpl/MathJax/MathJax.js?config=TeX-AMS_CHTML', true);
}

function load_mathjax(){
	load_mathjax_config();
	load_mathjax_js();
}

function load_pseudocode_css(){
	load_css('u.tpl/katex/katex.min.css');
	load_css('u.tpl/pseudocode/pseudocode.min.css');
}

function load_pseudocode_js(){
	load_js('u.tpl/katex/katex.min.js');
	load_js('u.tpl/pseudocode/pseudocode.min.js');
}

function load_pseudocode(){
	load_pseudocode_js();
	load_pseudocode_css();
}

window_onload(function(){
	[...document.getElementsByClassName('language-pseudocode')].forEach(function(node){
		let code = node.textContent;
		let template = document.createElement('template');
		template.innerHTML = pseudocode.renderToString(code, {lineNumber: true});
		node.parentNode.parentNode.insertBefore(template.content, node.parentNode);
		node.parentNode.parentNode.removeChild(node.parentNode);
	});
	[...document.getElementsByTagName('code')].forEach(function(code){
		if(code.classList.length == 0)
			code.classList.add('language-plaintext');
		else
			hljs.highlightBlock(code);
	});
});

let my_head = document.getElementsByTagName('head')[0];
let view = document.getElementById('view');
let presenter = presenters[0];
let options = [];
let has_slides = false;
let courses = [];

if(!document.getElementById('preview')){
	let found_url = window.location.search.match(re_presenter);
	let remove_asis = found_url != null;
	let found_data = document.currentScript.getAttribute('data-presenter').match(re_presenter);
	has_slides = found_data && found_data[1] == 'present';

	let found = found_url || found_data;
	if(found){
		if(found[1] == 'present')
			found = (default_presenter + (found[2] || '')).match(re_presenter);
		presenters.some(function(p){
			if(found[1] == p){
				presenter = p;
				if(found[2]){
					let opts = found[2];
					if(remove_asis)
						opts = opts.replace(':asis', '');
					options = opts.substr(1).split(':');
				}
				return true;
			}
		});
	}
	[...document.getElementsByClassName('course')].forEach(function(course){
		courses.push(course.innerHTML);
	});
}

if(presenter != presenters[0] && !get_option('asis')){
	let overview = document.createElement('section');
	let last_node = null;
	[...view.childNodes].reverse().forEach(function(node){
		let node_name = node.nodeName.toLowerCase();
		if(node_name != '#comment' && node_name != 'script' && node_name != 'section')
			last_node = overview.insertBefore(node, last_node);
	});
	if(!overview.textContent.match(/^[ \t\n]*$/)){
		overview.id = 'title';
		view.insertBefore(overview, view.childNodes[0]);
	}
}

let nav_selectors;
let presenter_selector;
if(has_slides || presenter != 'read'){
	nav_selectors = document.createElement('nav');
	document.getElementById('main').insertBefore(nav_selectors, view);

	presenter_selector = document.createElement('div');
	presenter_selector.id = 'presenter-selector';
	nav_selectors.appendChild(presenter_selector);

	if(has_slides)
		add_presenter_selectors();
	else
		add_presenter_selector('read', 'read', [], true);
}

let course_selector;
if(presenter != 'read' && courses.length){
	course_selector = document.createElement('div');
	course_selector.id = 'course-selector';
	nav_selectors.insertBefore(course_selector, presenter_selector);

	for(let i = 0; i < courses.length; i++){
		course_selector.innerHTML += courses[i];
		if(i < courses.length - 1)
			course_selector.innerHTML += ' . ';
	}
}

load_js('u.tpl/' + presenter + '.js');
