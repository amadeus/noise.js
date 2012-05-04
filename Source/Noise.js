(function(){

// Generate internal stylesheet to allow us to generate specialized rules for noises
new Element('style', { type: 'text/css' }).inject(document.head);

    // The only REAL way to reference a stylesheet
var stylesheet = document.styleSheets[document.styleSheets.length - 1],
	// Internal canvas for drawing, etc
	canvas = new Element('canvas'),
	// Canvas context
	ctx = (canvas.getContext) ? canvas.getContext('2d') : null,
	// Generate a valid CSS rule from a selector and dataURL
	generateRule =  function(selector, dataURL){
		return selector + ' { background-image:url(' + dataURL + '); }';
	};

var Noise = window.Noise = new Class({

	Implements: Options,

	options: {
		selector: '.noise',
		width: 100,
		height: 100,
		opacityClamp: 0.04,
		color: 'rgba(0,0,0,|)',
		imageType: 'image/png'
	},

	initialize: function(options){
		// If CTX does not exist, assume IE and fail silently
		if (!ctx) return null;

		this.setOptions(options);

		var opts       = this.options,
			el         = document.id(opts.selector),
			oc         = opts.opacityClamp * 100,
			colorStart = opts.color.split('|')[0],
			colorEnd   = opts.color.split('|')[1],
			rLen       = opts.height,
			cLen       = opts.width,
			r, c, o;

		// Setup canvas
		canvas.set('width', opts.width);
		canvas.set('height', opts.height);
		ctx.clearRect(0, 0, opts.width, opts.height);

		// Generate noise
		for (r = 0; r < rLen; r++){
			for (c = 0; c < cLen; c++){
				o = Number.random(0, oc) / 100;
				ctx.fillStyle = colorStart + o + colorEnd;
				ctx.fillRect(c, r, 1, 1);
			}
		}

		// If an element is given, apply as a background image to that element, otherwise setup as a CSS rule
		if (el) el.setStyle('background-image', 'url(' + canvas.toDataURL(opts.imageType) + ')');
		else stylesheet.insertRule(generateRule(opts.selector, canvas.toDataURL(opts.imageType)), stylesheet.rules.length);

		// No need return an actual instance
		return null;
	}
});

}).call(this);
