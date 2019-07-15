if(!getOption('asis'))
	flattenView();

loadCSS('u.tpl/minislides/dist/minislides.min.css', 'screen');
loadCSS('u.tpl/minislides/src/example.css', 'screen');
loadHighlight();
loadMathjax();
loadPseudocode();
loadCommonPresentationCSS();
loadCSS('u.tpl/minislides.css', 'screen');

listenToEvent('load', function(){
	loadJS('u.tpl/minislides/src/minislides.js', true);
});
