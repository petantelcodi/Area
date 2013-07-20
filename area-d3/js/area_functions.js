
// Function to get distinc values of a parameter:
function distinc(data, param) {
	var dupes = {};	
	var singles = [];
	$.each(data, function(i, el) {
	if (!dupes[el[param]]) {
			dupes[el[param]] = true;
			singles.push(el[param]);
		}
	});
	return singles;
}

// Count values of an object
function countValues(values, column, search) {
	var total = 0;
	for(var i  = 0; i < values.length; i++) {
		if(values[i][column] === search) { total++; }
	}
	return total;
}

// Order data by any param values:
function sortJSON(data, key, order) {
	order = order || "asc"; //defining default parameters in JS
	return data.sort(function(a, b) {
		var x = a[key]; var y = b[key];
		if (order=="asc") { n=-1; /*ASC*/} else { n=1; /*DESC*/}
		return ((x < y) ? n : ((x > y) ? -n : 0)); 
	});
}


//////////////////////////////////////////////
//////  COLORS

function hsvToRgb(h, s, v) {
	/**
	 * HSV to RGB color conversion
	 *
	 * H runs from 0 to 360 degrees
	 * S and V run from 0 to 100
	 * 
	 * Ported from the excellent java algorithm by Eugene Vishnevsky at:
	 * http://www.cs.rit.edu/~ncs/color/t_convert.html
	 */
	var r, g, b;
	var i;
	var f, p, q, t;
	
	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));
	
	// We accept saturation and value arguments from 0 to 100 because that's
	// how Photoshop represents those values. Internally, however, the
	// saturation and value are calculated from a range of 0 to 1. We make
	// That conversion here.
	s /= 100;
	v /= 100;
	
	if(s == 0) {
		// Achromatic (grey)
		r = g = b = v;
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
	
	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));

	switch(i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
			
		case 1:
			r = q;
			g = v;
			b = p;
			break;
			
		case 2:
			r = p;
			g = v;
			b = t;
			break;
			
		case 3:
			r = p;
			g = q;
			b = v;
			break;
			
		case 4:
			r = t;
			g = p;
			b = v;
			break;
			
		default: // case 5:
			r = v;
			g = p;
			b = q;
	}
	
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Approach 2: generate random colors
function get_random_colors(num_colors)  {
	colors = [];
	for (var i=0;i<num_colors;i++) {
		r = Math.floor( 100+(Math.random()*(0, 155)));
		g = Math.floor( 75+(Math.random()*(100, 155)));
		b = Math.floor( 50 +(Math.random()*(0, 205)));
		bgcolorc = "rgb("+r+","+g+","+b+")";
		colors.push(bgcolorc);
	}
	return colors;
}


// Approach 3: gradient and HSV2RGB
function get_random_hsv(h, v, num_colors)  {
	colors = []; s = 0;
	chunk = 100/num_colors;
	h = Math.floor(Math.random()*(0, 255));
	for (var i=0;i<num_colors;i++) {
		//s = Math.floor(Math.random()*(0, 100));
		s += chunk;
		bgcolorc = "rgb("+hsvToRgb(h, 100-s, v-(s/1.5))+")";
		colors.push(bgcolorc);
	}
	return colors;
}