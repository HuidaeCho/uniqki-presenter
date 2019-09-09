loadHighlight();
loadMathjax();
loadPseudocode();
loadCSS('u.tpl/screen.css', 'screen');
loadCSS('u.tpl/read.css', 'screen');
loadCSS('u.tpl/print.css', 'print');

ajaxRequest('top-menu.html', null, function(xhr){
	let view = ajaxResponseXML(xhr).getElementById('view');
	if(!view) return;
	let items = [...view.getElementsByTagName('a')];
	if(!items.length) return;
	let menu = document.createElement('div');
	menu.id = 'top-menu';
	items.forEach(function(item){
		item.onclick = function(){
			items.forEach(function(i){
				i.classList.remove('active');
			});
			this.classList.add('active');
		};
		menu.appendChild(item);
	});
	document.getElementsByTagName('header')[0].appendChild(menu);
});
