if(!getOption('asis')){
	createSectionsDiv();

	let title = document.getElementById('title');
	['date', 'course', 'author', 'affiliation'].forEach(function(info){
		let infoGroup = document.createElement('div');
		infoGroup.id = info + 's';
		[...document.getElementsByClassName(info)].forEach(function(node){
			infoGroup.appendChild(node);
		});
		title.appendChild(infoGroup);
	});

	loadJS('u.tpl/to-title-case.js', true, function(){
		for(let i = 1; i <= 6; i++){
			[...document.getElementsByTagName('h' + i)].forEach(function(node){
				node.innerText = node.innerText.toTitleCase();
			});
		}
	});
}

loadHighlight();
loadMathJax();
loadPseudocode();
[...document.getElementsByTagName('link')].some(function(link){
	if(link.href.match(reUcss)){
		link.parentNode.removeChild(link);
		return true;
	}
});
loadCSS('u.tpl/screen.css', 'screen, print');
loadCSS('u.tpl/slides.css', 'screen, print');
loadCSS('u.tpl/poster.css', 'screen, print');
