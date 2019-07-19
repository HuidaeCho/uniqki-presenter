const themes = [
	'beige',
	'black',
	'blood',
	'league',
	'moon',
	'night',
	'serif',
	'simple',
	'sky',
	'solarized',
	'white',
];
const darkThemes = [
	'black',
	'blood',
	'league',
	'moon',
	'night',
];
const transitions = [
	'none',
	'fade',
	'slide',
	'convex',
	'concave',
	'zoom'
];
let theme = getOption('theme') || themes[Math.floor(Math.random()*themes.length)]; console.log(theme);
let transition = transitions[Math.floor(Math.random()*transitions.length)];

document.getElementById('main').classList.add('reveal');
document.getElementById('view').classList.add('slides');

if(!getOption('asis')){
	if(getOption('flat'))
		flattenView();
	else
		[...document.getElementsByTagName('section')].forEach(function(section){
			let firstSection;
			if([...section.childNodes].some(function(node){
				if(node.nodeName.toLowerCase() == 'section'){
					firstSection = node;
					return true;
				}
			})){
				let sec = document.createElement('section');
				sec.id = section.id;
				section.removeAttribute('id');
				section.insertBefore(sec, firstSection);
				let lastNode = null;
				[...section.childNodes].reverse().forEach(function(node){
					if(node.nodeName.toLowerCase() != 'section'){
						sec.insertBefore(node, lastNode);
						lastNode = node;
					}
				});
			}
		});
/*
	[...document.getElementsByTagName('section')].forEach(function(section){
		let separateParagraphs = function(parentNode){
			[...parentNode.childNodes].reverse().forEach(function(node){
				let currTag = node.nodeName.toLowerCase();
				let prevTag = node.previousElementSibling && node.previousElementSibling.nodeName.toLowerCase();
				if((currTag == 'p' ||
				    (node.classList && node.classList.contains('fragment'))) &&
				   (prevTag == 'p' ||
				    prevTag == 'ul' ||
				    prevTag == 'ol' ||
				    prevTag == 'dl')){
					let separator = document.createElement('div');
					separator.innerHTML = '&#x25CF';
					separator.style.color = 'red';
					separator.style.fontSize = '75%';
					parentNode.insertBefore(separator, node);
				}else
					separateParagraphs(node);
			});
		}
		separateParagraphs(section);
	});
*/
}

/*
function onHashchange(){
	if(window.location.hash == '#/title'){
		if(courseSelector)
			courseSelector.classList.add('selector-on-title');
		if(presenterSelector)
			presenterSelector.classList.add('selector-on-title');
	}else{
		if(courseSelector)
			courseSelector.classList.remove('selector-on-title');
		if(presenterSelector)
			presenterSelector.classList.remove('selector-on-title');
	}
}

window.addEventListener('hashchange', function(){
	onHashchange();
});
onHashchange();
*/

loadCSS('u.tpl/reveal/css/reveal.css', 'screen');
loadCSS('u.tpl/reveal/css/theme/' + theme + '.css', 'screen');
loadHighlight();
loadMathjaxConfig();
loadPseudocode();
loadCommonPresentationCSS();
loadCSS('u.tpl/reveal.css', 'screen');

if(darkThemes.includes(theme)){
	[...document.getElementsByTagName('img')].forEach(function(img){
		if(img.src.match(/\.svg$/)){
			img.style.background = 'white';
			//img.style.border = '0.5em solid white';
		}
	});
	loadCSS('u.tpl/pseudocode-dark-themes.css');
}

let sections = [...document.getElementsByTagName('section')]
let background = getOption('background');
if(background){
	sections.forEach(function(section){
		section.setAttribute('data-background', background);
	});
}
let color = getOption('color');
if(color){
	sections.forEach(function(section){
		[...section.childNodes].forEach(function(node){
			if(node.nodeName.toLowerCase().match(/^h[0-9]$/))
				node.style.color = color;
		});
		section.style.color = color;
	});
}

let title = document.getElementById('title');
let titleBackground = getOption('title-background');
let titleBackgroundOpacity = getOption('title-background-opacity');
if(titleBackground){
	title.setAttribute('data-background', titleBackground);
	if(titleBackgroundOpacity)
		title.setAttribute('data-background-opacity', titleBackgroundOpacity);
}

let titleColor = getOption('title-color');
if(titleColor){
	[...title.childNodes].forEach(function(node){
		if(node.nodeName.toLowerCase() == 'h1')
			node.style.color = titleColor;
	});
	title.style.color = titleColor;
}else if(titleBackground && !titleBackgroundOpacity){
	loadJS('u.tpl/getAverageRGB.js');
	windowOnLoad(function(){
		let img = new Image();
		img.src = titleBackground;
		img.addEventListener('load', function(){
			let averageRGB = getAverageRGB(img);
			let averageR = averageRGB.r;
			let averageG = averageRGB.g;
			let averageB = averageRGB.b;
			let dark = averageR < 128 && averageG < 128 && averageB < 128;
			[...document.styleSheets].forEach(function(styleSheet){
				if(!styleSheet.href.match(/\/theme\//)) return;
				let addNewRule = false;
				let thresh = 50;
				let r = 128 + (dark ? -1 : 1) * thresh;
				let g = 128 + (dark ? -1 : 1) * thresh;
				let b = 128 + (dark ? -1 : 1) * thresh;
				[...styleSheet.cssRules].forEach(function(cssRule){
					if(!cssRule.selectorText || !cssRule.selectorText.match(/h1/)) return;
					let rgb = cssRule.style.color.match(/rgb\( *([0-9]+), *([0-9]+) *, *([0-9]+) *\)/);
					if(!rgb) return;
					let rr = Number(rgb[1]);
					let gg = Number(rgb[2]);
					let bb = Number(rgb[3]);
					if((dark && rr < r && gg < g && bb < b) || (!dark && rr > r && gg > g && bb > b)){
						addNewRule = true;
						r = rr;
						g = gg;
						b = bb;
					}
				});
				if(addNewRule)
					styleSheet.insertRule('.reveal h1, .course, .course a, .author, .affiliation { color: rgb(' + (255-r) + ', ' + (255-g) + ', ' + (255-b) + '); }', styleSheet.cssRules.length);
			});
		});
	});
}

let minScale = 0.2;
let maxScale = 2.0;

if(getOption('scale')){
	let scales = getOption('scale').match(/^([0-9.]+)(?:,([0-9.]+))?$/);
	if(scales){
		minScale = maxScale = scales[1];
		if(scales[2])
			maxScale = scales[2];
		if(minScale > maxScale){
			let tmp = minScale;
			minScale = maxScale;
			maxScale = tmp;
		}
	}
}

windowOnLoad(function(){
	loadJS('u.tpl/reveal/lib/js/head.min.js', false, function(){
		loadJS('u.tpl/reveal/js/reveal.js', false, function(){
			let mathjaxConfig = window.location.href.match(/^file:/) ? 'TeX-AMS_SVG-full' : 'TeX-AMS_HTML-full';
			Reveal.initialize({
				width: '100%',
				height: '100%',
				minScale: minScale,
				maxScale: maxScale,
				history: true,
				mouseWheel: true,
				transition: transition,
				math: {
					mathjax: 'u.tpl/MathJax/MathJax.js',
					config: mathjaxConfig
				},
				dependencies: [
					{ src: 'u.tpl/reveal/plugin/markdown/marked.js' },
					{ src: 'u.tpl/reveal/plugin/markdown/markdown.js' },
					{ src: 'u.tpl/reveal/plugin/notes/notes.js', async: true },
					{ src: 'u.tpl/reveal/plugin/math/math.js', async: true }
				]
			});
		});
	});
});
