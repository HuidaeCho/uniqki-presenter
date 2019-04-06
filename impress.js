document.getElementById('view').id = 'impress';

if(!get_option('asis')){
	let allow_overlap = false;
	let z_freq = 0.2;
	let x_grid_freq = 0.5;
	let y_grid_freq = 0.5;

	let rotate_x_freq = 0.1;
	let rotate_x_min = -180;
	let rotate_x_max = 180;
	let rotate_x_inc = 90;

	let rotate_y_freq = 0.1;
	let rotate_y_min = -180;
	let rotate_y_max = 180;
	let rotate_y_inc = 90;

	let rotate_z_freq = 0.1;
	let rotate_z_min = -180;
	let rotate_z_max = 180;
	let rotate_z_inc = 1;

	let scale_freq = 0;
	let scale_min = 0.1;
	let scale_max = 1;

	let sections = [...document.getElementsByTagName('section')];
	let num_grids = Math.ceil(Math.sqrt(sections.length));
	let grid_width = 1024;
	let grid_height = 768;
	let xs = [], ys = [];
	sections.forEach(function(section){
		section.classList.add('step');
		if(section.id != 'title')
			section.classList.add('slide');

		let x, y;
		if(allow_overlap){
			if(x_grid_freq > 0 && Math.random() < x_grid_freq)
				x = Math.round(Math.random()*num_grids)*grid_width;
			else
				x = Math.round(Math.random()*num_grids*grid_width);
			if(y_grid_freq > 0 && Math.random() < y_grid_freq)
				y = Math.round(Math.random()*num_grids)*grid_height;
			else
				y = Math.round(Math.random()*num_grids*grid_height);
		}else{
			let overlap;
			do{
				x = Math.round(Math.random()*num_grids)*grid_width;
				y = Math.round(Math.random()*num_grids)*grid_height;
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

		if(z_freq > 0 && Math.random() < z_freq){
			let z = -Math.round(Math.random()*num_grids*grid_height);
			section.setAttribute('data-z', z);
		}
		if(rotate_x_freq > 0 && Math.random() < rotate_x_freq){
			let rotate_x = Math.round((rotate_x_min+Math.round(Math.random()*(rotate_x_max-rotate_x_min)))/rotate_x_inc)*rotate_x_inc;
			section.setAttribute('data-rotate-x', rotate_x);
		}
		if(rotate_y_freq > 0 && Math.random() < rotate_y_freq){
			let rotate_y = Math.round((rotate_y_min+Math.round(Math.random()*(rotate_y_max-rotate_y_min)))/rotate_y_inc)*rotate_y_inc;
			section.setAttribute('data-rotate-y', rotate_y);
		}
		if(rotate_z_freq > 0 && Math.random() < rotate_z_freq){
			let rotate_z = Math.round((rotate_z_min+Math.round(Math.random()*(rotate_z_max-rotate_z_min)))/rotate_z_inc)*rotate_z_inc;
			section.setAttribute('data-rotate-z', rotate_z);
		}
		if(scale_freq > 0 && Math.random() < scale_freq){
			let scale = scale_min+Math.round(Math.random()*(scale_max-scale_min));
			section.setAttribute('data-scale', scale);
		}
	});

	flatten_view();
}

load_css('u.tpl/impress/css/impress-demo.css', 'screen');
load_highlight();
load_mathjax();
load_common_presentation_css();
load_css('u.tpl/impress.css', 'screen');

window_onload(function(){
	load_js('u.tpl/impress/js/impress.js', true, function(){
		impress().init();
	});
});
