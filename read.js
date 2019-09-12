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
	/* XXX: UNUSED; REFERENCE ONLY
	if((config = xml.getElementById('site-title-config'))){
		let items = [...config.getElementsByTagName('li')];
		items.forEach(function(item){
			let text = item.firstChild;
			if(!text || text.nodeName.toLowerCase() != '#text') return;
			let value = text.textContent.split(/:/);
			if(value[0] == 'mobile-display' && window.matchMedia('(max-width:360px)').matches)
				document.getElementById('site-title').style.display = value[1];
		});
	}
	*/
	if((config = xml.getElementById('top-menu-config'))){
		let items = [...config.getElementsByTagName('li')];
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
			menuItems.push(a);
		});
		if(menuItems.length){
			let header = document.getElementsByTagName('header')[0];
			let lastChild = header.lastChild;
			if(lastChild.nodeName.toLowerCase() == '#text' && lastChild.textContent == '\n')
				header.removeChild(lastChild);
			let topMenu = document.createElement('div');
			topMenu.id = 'top-menu';
			topMenu.style.display = 'inline-block';
			header.appendChild(topMenu);

			let maxWidth = 0;
			menuItems.forEach(function(a){
				topMenu.appendChild(a);
				if(a.offsetWidth > maxWidth)
					maxWidth = a.offsetWidth;
			});
			let bodyWidth = document.body.offsetWidth;
			let totalWidth = menuItems.length * maxWidth;
			if(totalWidth > bodyWidth)
				maxWidth = bodyWidth / menuItems.length;
			let aStyle = window.getComputedStyle(menuItems[0]);
			let extraWidth = parseFloat(aStyle.paddingLeft.replace('px', '')) + parseFloat(aStyle.paddingRight.replace('px', '')) + parseFloat(aStyle.borderLeftWidth.replace('px', '')) + parseFloat(aStyle.borderRightWidth.replace('px', ''));
			menuItems.forEach(function(a){
				a.style.width = (maxWidth - extraWidth) + 'px';
			});
			let siteDesc = document.getElementById('site-description');
			siteDesc.style.display = 'inline-block';
			if(siteDesc.offsetWidth + topMenu.offsetWidth > bodyWidth){
				let siteTitle = document.getElementById('site-title');
				siteTitle.style.display = 'inline-block';
				if(siteTitle.offsetWidth + siteDesc.offsetWidth > bodyWidth)
					header.removeChild(siteDesc);
			}else
				siteDesc.style.width = '0px';
			topMenu.style.width = '100%';
		}
	}
});
