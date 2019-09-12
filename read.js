loadHighlight();
loadMathjax();
loadPseudocode();
loadCSS('u.tpl/screen.css', 'screen');
loadCSS('u.tpl/read.css', 'screen');
loadCSS('u.tpl/print.css', 'print');

ajaxRequest('read-config.html', null, function(xhr){
	let xml = ajaxResponseXML(xhr);
	let view = xml.getElementById('view');
	if(!view) return;
	let config;
	if((config = xml.getElementById('site-title-config'))){
		let items = [...config.getElementsByTagName('li')];
		if(!items.length) return;
		items.forEach(function(item){
			let text = item.firstChild;
			if(!text || text.nodeName.toLowerCase() != '#text') return;
			let value = text.textContent.split(/:/);
			if(value[0] == 'mobile' && window.matchMedia('(max-width:360px)').matches)
				document.getElementById('site-title').style.display = value[1];
		});
	}
	if((config = xml.getElementById('top-menu-config'))){
		let items = [...config.getElementsByTagName('li')];
		if(!items.length) return;
		let menu = document.createElement('div');
		menu.id = 'top-menu';
		let menuItems = [];
		items.forEach(function(item){
			let a = item.firstChild;
			if(!a || a.nodeName.toLowerCase() != 'a') return;
			if(a.href.replace(/\.html(#|$)/, '$1') == window.location.href.replace(/\.html(#|$)/, '$1'))
				a.classList.add('active');
			a.onclick = function(){
				menuItems.forEach(function(i){
					i.classList.remove('active');
				});
				this.classList.add('active');
			};
			menu.appendChild(a);
			menuItems.push(a);
		});
		document.getElementsByTagName('header')[0].appendChild(menu);
	}
});
