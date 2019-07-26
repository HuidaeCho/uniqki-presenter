if(!getOption('asis')){
	createSectionsDiv();

	let title = document.getElementById('title');
	['author', 'affiliation', 'course'].forEach(function(info){
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
loadMathjax();
loadPseudocode();
loadCommonPresentationCSS();
loadCSS('u.tpl/poster.css');
