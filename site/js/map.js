

mstrans = 1000; // milliseconds for transtions

/*
To do
- Legend
X image magnifying glass
- text of reg on the right - scroll up and down - could make that interactive also
xmove to list of opinions - maybe with subjective grading-
X Move text to front? http://bl.ocks.org/eesur/4e0a69d57d3bfc8a82c2
- Assign classes with BeautifulSoup when make svg
- make script to do update page, not notebook
- make it strt in right place so when grab it it doesn't jump
- fix zoom 
- make opinions into a big list or grid, then move them into the page
- make tricky terms into a big list or grid, then move them into the page

- click on boxes to get the term, show
	- definition
	- what from
	- what to

- box mouseover: definition in mouseover

X font: make sans serif
X font color: keep black
- zoom: https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
	... to propogate events below, had no luck wiht thata
	... https://bl.ocks.org/nitaku/6545ba8d7146a4843e4bd1b0fa9f1268
*/

// loading the body , assigning events
function loader() {
	(function() {
	svg = d3.select('svg');
	// get h, w of screen
	// https://stackoverflow.com/questions/2242086/how-to-detect-the-screen-resolution-with-javascript
	pr = 1.; //  window.devicePixelRatio; // having problems with this
	h = pr * 0.90 * window.innerHeight; // * window.screen.height * 0.75; 
	w = pr * 0.65 * window.innerWidth; // window.screen.width * 0.65;
	//d3.select('#txt').html('pr h w '+pr+' '+h+' '+w)
	svg.attr('height', h);
	svg.attr('width', w);
	d3.select('#tdsvg').attr('width', w);
	//svg.attr('viewBox', '0.00 0.00 '+w+' '+h);
	width = svg.node().getBoundingClientRect().width;
	height = svg.node().getBoundingClientRect().height;
	zoomable_layer = svg.select('g');

	zoom = d3.behavior.zoom().scaleExtent([0.1, 10]).on('zoom'
		, function() {
			return zoomable_layer.attr({
					transform: "translate(" + (zoom.translate()) + ") scale(" + (zoom.scale()) + ")"
				});
			});

	svg.call(zoom);
	}).call(this);
	
	// Generated by CoffeeScript 1.10.0
	var height, svg, width, zoom, zoomable_layer;
	
	d3.selectAll('text') // to emphasize text
		.on('mouseover', hndMouseoverText)
		.on('mouseout', hndMouseoutText)
		.on('click', hndClickText)
		.style('font-family', 'Arial');

	d3.selectAll('g')
		.on('mouseover', hndMouseoverg)
		.on('mouseout',  hndMouseoutg);
		
	}

		
// when click text, show the reg.
function hndClickText(d, i) {
	t = d3.select(this).text() // the text that was clicked
	// build the html, a string 's'
	s = '<h1>'+t+'</h1>'
	// is reg text then show that.
	if (reg.hasOwnProperty(t)) {s += reg[t];}
	// if is an abbr then show its meaning
	if (abbr.hasOwnProperty(t)) { s += '\n<h2>' + abbr[t] + '</h2>'; }
	
	d3.select('#txt').html(s)
}

// ##############################################################################
/*
Mouseover for box:
Make big going in and out
*/	
function strokewidth(id, sw) {
	if (id!='graph0') {
		// get paths to or from this id: is groups with an id like 'a->b'
		ps = d3.selectAll('g').filter(
			function() {return id == d3.select(this).attr('id').split('->')[0]
							 | id == d3.select(this).attr('id').split('->')[1];});
		ps.selectAll('path').transition().duration(mstrans).attr('stroke-width', sw);
		
	}
}
function hndMouseoverg(d, i) {strokewidth( d3.select(this).attr('id'), 8);}
function hndMouseoutg(d, i)  {strokewidth(d3.select(this).attr('id'), 1);}

// ##############################################################################

/*  mouseover for citations:
1. Make all of that kind bold, large,  red
2. make edge thick, red: is parent group's path child

*/

function hndText(t, fs, sw) {
	// https://stackoverflow.com/questions/42500357/d3-selecting-based-on-text-value-of-node?rq=1
	ts = d3.selectAll("text").filter(function(){ return d3.select(this).text() == t})
	ts.transition().duration(mstrans).attr('font-size', fs);
	// paths containing this section: group's path child: only change width; diff edges have diff colors, thicknesses
	gs = ts.select(function() { return this.parentNode; });
	gs.select('path').transition().duration(mstrans).attr('stroke-width', sw);
}

function hndMouseoverText(d, i) {
	hndText(d3.select(this).text(), 50, 8)
}

function hndMouseoutText(d, i) {
	hndText(d3.select(this).text(), 10.00, 1)
}
