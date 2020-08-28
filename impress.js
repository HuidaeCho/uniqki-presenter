document.getElementById('view').id = 'impress';

if(!getOption('asis')){
	let allowOverlap = false;
	let zFreq = 0.2;
	let xGridFreq = 0.5;
	let yGridFreq = 0.5;

	let rotateXFreq = 0.1;
	let rotateXMin = -180;
	let rotateXMax = 180;
	let rotateXInc = 90;

	let rotateYFreq = 0.1;
	let rotateYMin = -180;
	let rotateYMax = 180;
	let rotateYInc = 90;

	let rotateZFreq = 0.1;
	let rotateZMin = -180;
	let rotateZMax = 180;
	let rotateZInc = 1;

	let scaleFreq = 0;
	let scaleMin = 0.1;
	let scaleMax = 1;

	let sections = [...document.getElementsByTagName('section')];
	let numGrids = Math.ceil(Math.sqrt(sections.length));
	let gridWidth = 1280*3;
	let gridHeight = 1024*3;
	let xs = [], ys = [];

	let hasSlide = getOption('slide');
	if(!hasSlide || !getOption('z'))
	    zFreq = 0;

	sections.forEach(function(section){
		section.classList.add('step');
		if(hasSlide && section.id != 'title')
			section.classList.add('slide');

		let x, y;
		if(allowOverlap){
			if(xGridFreq > 0 && Math.random() < xGridFreq)
				x = Math.round(Math.random()*numGrids)*gridWidth;
			else
				x = Math.round(Math.random()*numGrids*gridWidth);
			if(yGridFreq > 0 && Math.random() < yGridFreq)
				y = Math.round(Math.random()*numGrids)*gridHeight;
			else
				y = Math.round(Math.random()*numGrids*gridHeight);
		}else{
			let overlap;
			do{
				x = Math.round(Math.random()*numGrids)*gridWidth;
				y = Math.round(Math.random()*numGrids)*gridHeight;
				overlap = false;
				for(let i = 0; i < xs.length; i++){
					if(x == xs[i] && y == ys[i]){
						overlap = true;
						break;
					}
				}
			}while(overlap);
			xs.push(x);
			ys.push(y);
		}
		section.setAttribute('data-x', x);
		section.setAttribute('data-y', y);

		if(zFreq > 0 && Math.random() < zFreq){
			let z = -Math.round(Math.random()*numGrids*gridHeight);
			section.setAttribute('data-z', z);
		}
		if(rotateXFreq > 0 && Math.random() < rotateXFreq){
			let rotateX = Math.round((rotateXMin+Math.round(Math.random()*(rotateXMax-rotateXMin)))/rotateXInc)*rotateXInc;
			section.setAttribute('data-rotate-x', rotateX);
		}
		if(rotateYFreq > 0 && Math.random() < rotateYFreq){
			let rotateY = Math.round((rotateYMin+Math.round(Math.random()*(rotateYMax-rotateYMin)))/rotateYInc)*rotateYInc;
			section.setAttribute('data-rotate-y', rotateY);
		}
		if(rotateZFreq > 0 && Math.random() < rotateZFreq){
			let rotateZ = Math.round((rotateZMin+Math.round(Math.random()*(rotateZMax-rotateZMin)))/rotateZInc)*rotateZInc;
			section.setAttribute('data-rotate-z', rotateZ);
		}
		if(scaleFreq > 0 && Math.random() < scaleFreq){
			let scale = scaleMin+Math.round(Math.random()*(scaleMax-scaleMin));
			section.setAttribute('data-scale', scale);
		}
	});

	flattenView();
}

loadCSS('u.tpl/impress/css/impress-demo.css', 'screen');
loadHighlight();
loadMathJax();
loadPseudocode();
loadCommonPresentationCSS();
loadCSS('u.tpl/impress.css', 'screen');

windowOnLoad(function(){
	loadJS('u.tpl/impress/js/impress.js', true, function(){
		impress().init();
	});
});
