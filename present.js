const presenters = [
	'read',
	'impress',
	'reveal',
	'minislides',
	'poster',
	'random'
];
const defaultPresenter = 'reveal';
const rePresenter = /^\??([a-z]+)(?:(:.*))?$/;
const titleInfoClasses = [
	'course',
	'affiliation'
];

function addPresenterSelectors(){
	let nestedSections = hasNestedSections();
	addPresenterSelector('read', 'read');
	addPresenterSelector('minislides', 'light');
	addPresenterSelector('reveal', 'flat', ['flat']);
	if(nestedSections)
		addPresenterSelector('reveal', 'down');
	addPresenterSelector('impress', 'deep');
	addPresenterSelector('poster', 'poster');
	addPresenterSelector('random', 'random', [], true);
}

function addPresenterSelector(selector, name, opts, last){
	if(presenter == 'random' || presenter != selector || !hasSameOptions(opts)){
		let a = document.createElement('a');
		a.href = '?' + selector + (opts && opts.length ? ':' + opts.join(':') : '');
		a.innerHTML = name;
		presenterSelector.appendChild(a);
		if(!last){
			let text = document.createTextNode(' . ');
			presenterSelector.appendChild(text);
		}
	}
}

function hasSameOptions(opts){
	if(!opts || !opts.length){
		if(!options.length)
			return true;
		if(options.length == 1 && getOption('asis'))
			return true;
		return false;
	}
	if(getOption('asis')){
		if(opts.length != options.length - 1)
			return false;
	}else if(opts.length != options.length)
		return false;

	return opts.every(function(opt){
		return getOption(opt);
	});
}

function getOption(opt){
	const reOpt = new RegExp('^' + opt + '(?:=(.*))?$');
	for(let i = 0; i < options.length; i++){
		let found = options[i].match(reOpt);
		if(found)
			return found[1] || true;
	}
	return false;
}

function hasNestedSections(){
	return [...view.childNodes].some(function(node){
		if(node.nodeName.toLowerCase() == 'section'){
			return [...node.childNodes].some(function(subnode){
				return subnode.nodeName.toLowerCase() == 'section';
			});
		}
	});
}

function flattenView(){
	let flatten = function(parentNode){
		[...parentNode.childNodes].reverse().forEach(function(node){
			if(node.nodeName.toLowerCase() == 'section'){
				flatten(node);
				if(node.id == '' && node.innerText.replace(/^[0-9]+\u00a0*/, '') == '')
					parentNode.removeChild(node);
				else
					lastNode = view.insertBefore(node, lastNode);
			}
		});
	}
	let lastNode = document.getElementById('presenter');
	flatten(view);
}

function createSectionsDiv(){
	let sections = document.createElement('div');
	sections.id = 'sections';
	[...view.childNodes].forEach(function(node){
		if(node.nodeName.toLowerCase() == 'section' && node.id != 'title')
			sections.appendChild(node);
	});
	view.insertBefore(sections, document.getElementById('presenter'));
}

function loadCSS(css, media){
	let link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = css;
	if(media)
		link.media = media;
	myHead.appendChild(link);
}

function loadCommonPresentationCSS(){
	const reUcss = /\/u\.css$/;
	[...document.getElementsByTagName('link')].some(function(link){
		if(link.href.match(reUcss)){
			link.media = 'print';
			return true;
		}
	});
	loadCSS('u.tpl/screen.css', 'screen');
	loadCSS('u.tpl/slides.css', 'screen');
	loadCSS('u.tpl/print.css', 'print');
}

function loadJS(js, async, callback){
	let script = document.createElement('script');
	script.src = js;
	if(async)
		script.async = true;
	if(callback)
		script.onload = callback;
	myHead.appendChild(script);
}

function loadHighlightCSS(){
	//loadCSS('u.tpl/highlight.js/styles/atom-one-light.css');
	loadCSS('u.tpl/hljs.css');
}


function loadHighlightJS(){
	loadJS('u.tpl/highlight/highlight.pack.js', false, function(){
		hljs.initHighlightingOnLoad();
	});
}

function loadHighlight(){
	loadHighlightCSS();
	loadHighlightJS();
}

function loadMathjaxConfig(){
	let script = document.createElement('script');
	script.type = 'text/x-mathjax-config';
	script.innerHTML = "MathJax.Hub.Config({'CommonHTML': {scale: 85}, 'HTML-CSS': {scale: 85}, TeX: {equationNumbers: {autoNumber: 'AMS'}}, tex2jax: {inlineMath: [['$','$'], ['\\\\(','\\\\)']], processEscapes: true}});";
	myHead.appendChild(script);
}

function loadMathjaxJS(){
	loadJS('u.tpl/MathJax/MathJax.js?config=TeX-AMS_CHTML', true);
}

function loadMathjax(){
	loadMathjaxConfig();
	loadMathjaxJS();
}

function loadPseudocodeCSS(){
	loadCSS('u.tpl/katex/katex.min.css');
	loadCSS('u.tpl/pseudocode/pseudocode.min.css');
}

function loadPseudocodeJS(){
	loadJS('u.tpl/katex/katex.min.js');
	loadJS('u.tpl/pseudocode/pseudocode.min.js');
}

function loadPseudocode(){
	loadPseudocodeJS();
	loadPseudocodeCSS();
}

function presentOnLoad(){
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
}

windowOnLoad(function(){
	presentOnLoad();
});

let myHead = document.getElementsByTagName('head')[0];
let view = document.getElementById('view');
let presenter = presenters[0];
let options = [];
let courseSelector;
let presenterSelector;

if(view){
	let foundURL = window.location.search.match(rePresenter);
	let removeAsis = foundURL != null;
	let foundData = document.currentScript.getAttribute('data-presenter').match(rePresenter);

	let found = foundURL || foundData;
	if(found){
		if(found[1] == 'present')
			found = (defaultPresenter + (found[2] || '')).match(rePresenter);
		presenters.some(function(p){
			if(found[1] == p){
				presenter = p;
				if(found[2]){
					let opts = found[2];
					if(removeAsis)
						opts = opts.replace(':asis', '');
					options = opts.substr(1).split(':');
				}
				return true;
			}
		});
	}

	if(presenter != presenters[0] && !getOption('asis')){
		let overview = document.createElement('section');
		let lastNode = null;
		[...view.childNodes].reverse().forEach(function(node){
			let nodeName = node.nodeName.toLowerCase();
			if(nodeName != '#comment' && nodeName != 'script' && nodeName != 'section')
				lastNode = overview.insertBefore(node, lastNode);
		});
		if(!overview.textContent.match(/^[ \t\n]*$/)){
			overview.id = 'title';
			view.insertBefore(overview, view.childNodes[0]);
		}
	}

	let navSelectors = document.createElement('nav');
	document.getElementById('main').insertBefore(navSelectors, view);
	presenterSelector = document.createElement('div');
	presenterSelector.id = 'presenter-selector';
	navSelectors.appendChild(presenterSelector);
	addPresenterSelectors();

	let courses = [];
	[...document.getElementsByClassName('course')].forEach(function(node){
		let course = node.innerHTML.replace(/\.\.\./, ', ');
		courses.push(course);
	});
	if(presenter != 'read' && courses.length){
		courseSelector = document.createElement('div');
		courseSelector.id = 'course-selector';
		navSelectors.insertBefore(courseSelector, presenterSelector);

		for(let i = 0; i < courses.length; i++){
			courseSelector.innerHTML += courses[i];
			if(i < courses.length - 1)
				courseSelector.innerHTML += ' . ';
		}
	}
}

let separator = presenter == 'poster' ? ', ' : '<br />';
titleInfoClasses.forEach(function(infoClass){
	[...document.getElementsByClassName(infoClass)].forEach(function(node){
		node.innerHTML = node.innerHTML.replace(/\.\.\./, separator);
	});
});

loadJS('u.tpl/' + presenter + '.js');
