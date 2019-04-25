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
const dark_themes = [
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
let theme = get_option('theme') || themes[Math.floor(Math.random()*themes.length)]; console.log(theme);
let transition = transitions[Math.floor(Math.random()*transitions.length)];

document.getElementById('main').classList.add('reveal');
document.getElementById('view').classList.add('slides');

if(!get_option('asis')){
	if(get_option('flat'))
		flatten_view();
	else
		[...document.getElementsByTagName('section')].forEach(function(section){
			let first_section;
			if([...section.childNodes].some(function(node){
				if(node.nodeName.toLowerCase() == 'section'){
					first_section = node;
					return true;
				}
			})){
				let sec = document.createElement('section');
				sec.id = section.id;
				section.removeAttribute('id');
				section.insertBefore(sec, first_section);
				let last_node = null;
				[...section.childNodes].reverse().forEach(function(node){
					if(node.nodeName.toLowerCase() != 'section'){
						sec.insertBefore(node, last_node);
						last_node = node;
					}
				});
			}
		});
/*
	[...document.getElementsByTagName('section')].forEach(function(section){
		let separate_paragraphs = function(parentNode){
			[...parentNode.childNodes].reverse().forEach(function(node){
				let curr_tag = node.nodeName.toLowerCase();
				let prev_tag = node.previousElementSibling && node.previousElementSibling.nodeName.toLowerCase();
				if((curr_tag == 'p' ||
				    (node.classList && node.classList.contains('fragment'))) &&
				   (prev_tag == 'p' ||
				    prev_tag == 'ul' ||
				    prev_tag == 'ol' ||
				    prev_tag == 'dl')){
					let separator = document.createElement('div');
					separator.innerHTML = '&#x25CF';
					separator.style.color = 'red';
					separator.style.fontSize = '75%';
					parentNode.insertBefore(separator, node);
				}else
					separate_paragraphs(node);
			});
		}
		separate_paragraphs(section);
	});
*/
}

/*
function on_hashchange(){
	if(window.location.hash == '#/title'){
		if(course_selector)
			course_selector.classList.add('selector-on-title');
		if(presenter_selector)
			presenter_selector.classList.add('selector-on-title');
	}else{
		if(course_selector)
			course_selector.classList.remove('selector-on-title');
		if(presenter_selector)
			presenter_selector.classList.remove('selector-on-title');
	}
}

window.addEventListener('hashchange', function(){
	on_hashchange();
});
on_hashchange();
*/

load_css('u.tpl/reveal/css/reveal.css', 'screen');
load_css('u.tpl/reveal/css/theme/' + theme + '.css', 'screen');
load_highlight();
load_mathjax_config();
load_pseudocode();
load_common_presentation_css();
load_css('u.tpl/reveal.css', 'screen');

if(dark_themes.includes(theme)){
	[...document.getElementsByTagName('img')].forEach(function(img){
		if(img.src.match(/\.svg$/)){
			img.style.background = 'white';
			//img.style.border = '0.5em solid white';
		}
	});
	load_css('u.tpl/pseudocode-dark-themes.css');
}

let sections = [...document.getElementsByTagName('section')]
let background = get_option('background');
if(background){
	sections.forEach(function(section){
		section.setAttribute('data-background', background);
	});
}
let color = get_option('color');
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
let title_background = get_option('title-background');
let title_background_opacity = get_option('title-background-opacity');
if(title_background){
	title.setAttribute('data-background', title_background);
	if(title_background_opacity)
		title.setAttribute('data-background-opacity', title_background_opacity);
}

let title_color = get_option('title-color');
if(title_color){
	[...title.childNodes].forEach(function(node){
		if(node.nodeName.toLowerCase() == 'h1')
			node.style.color = title_color;
	});
	title.style.color = title_color;
}else if(title_background && !title_background_opacity){
	load_js('u.tpl/getAverageRGB.js');
	window_onload(function(){
		let img = new Image();
		img.src = title_background;
		img.addEventListener('load', function(){
			let average_rgb = getAverageRGB(img);
			let average_r = average_rgb.r;
			let average_g = average_rgb.g;
			let average_b = average_rgb.b;
			let dark = average_r < 128 && average_g < 128 && average_b < 128;
			[...document.styleSheets].forEach(function(styleSheet){
				if(!styleSheet.href.match(/\/theme\//)) return;
				let add_new_rule = false;
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
						add_new_rule = true;
						r = rr;
						g = gg;
						b = bb;
					}
				});
				if(add_new_rule)
					styleSheet.insertRule('.reveal h1, .course, .course a, .author, .affiliation { color: rgb(' + (255-r) + ', ' + (255-g) + ', ' + (255-b) + '); }', styleSheet.cssRules.length);
			});
		});
	});
}

let min_scale = 0.2;
let max_scale = 2.0;

if(get_option('scale')){
	let scales = get_option('scale').match(/^([0-9.]+)(?:,([0-9.]+))?$/);
	if(scales){
		min_scale = max_scale = scales[1];
		if(scales[2])
			max_scale = scales[2];
		if(min_scale > max_scale){
			let tmp = min_scale;
			min_scale = max_scale;
			max_scale = tmp;
		}
	}
}

window_onload(function(){
	load_js('u.tpl/reveal/lib/js/head.min.js', false, function(){
		load_js('u.tpl/reveal/js/reveal.js', false, function(){
			let mathjax_config = window.location.href.match(/^file:/) ? 'TeX-AMS_SVG-full' : 'TeX-AMS_HTML-full';
			Reveal.initialize({
				width: '100%',
				height: '100%',
				minScale: min_scale,
				maxScale: max_scale,
				history: true,
				mouseWheel: true,
				transition: transition,
				math: {
					mathjax: 'u.tpl/MathJax/MathJax.js',
					config: mathjax_config
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
