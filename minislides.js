if(!get_option('asis'))
	flatten_view();

load_css('u.tpl/minislides/dist/minislides.min.css', 'screen');
load_css('u.tpl/minislides/src/example.css', 'screen');
load_highlight();
load_mathjax();
load_pseudocode();
load_common_presentation_css();
load_css('u.tpl/minislides.css', 'screen');

window_onload(function(){
	load_js('u.tpl/minislides/src/minislides.js', true);
});
