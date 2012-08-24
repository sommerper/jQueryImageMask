;
(function ($, window, undefined)
{
	var pluginName = 'imageMask',
		document = window.document,
		defaults = {
			propertyName:"value"
		};

	function Plugin (element, options)
	{
		this.element = element;

		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Plugin.prototype.init = function ()
	{

		// Place initialization logic here
		// You already have access to the DOM element and the options via the instance,
		// e.g., this.element and this.options
		$(this.element).find("img[data-mask]").each(function (i, ele)
		{
			var imgNormal = new Image();
			var imgAlpha = new Image();
			createImgageAlpha(ele, imgNormal, imgAlpha);
			//$(".textformat").append("<li>" + $(ele).attr("alt") + "</li>");
		});
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function (options)
	{
		return this.each(function ()
		{
			if (!$.data(this, 'plugin_' + pluginName))
			{
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	}

	var createImgageAlpha = function (ele, imgNormal, imgAlpha)
	{


		// wrap our new image in jQuery, then:
		$(imgNormal)
			// once the image has loaded, execute this code
			.load(function ()
			{
				normalLoaded(ele, imgNormal, imgAlpha);
			})

			// if there was an error loading the image, react accordingly
			.error(function ()
			{
				// notify the user that the image could not be loaded
			})

			// *finally*, set the src attribute of the new image to our image
			.attr('src', $(ele).attr("src"));

		$(ele).attr("src", "")
	}

	var normalLoaded = function (ele, imgNormal, imgAlpha)
	{

		$(imgAlpha)
			// once the image has loaded, execute this code
			.load(function ()
			{
				alphaLoaded(ele, imgNormal, imgAlpha);
			})

			// if there was an error loading the image, react accordingly
			.error(function ()
			{
				// notify the user that the image could not be loaded
			})

			// *finally*, set the src attribute of the new image to our image
			.attr('src', $(ele).attr("data-mask"));
	}

	var alphaLoaded = function (ele, imgNormal, imgAlpha)
	{
		alphaCombine(ele, imgNormal, imgAlpha);
	}

	var alphaCombine = function (ele, normalImage, alphaImage)
	{
		var cWidth = normalImage.width;
		var cHeight = normalImage.height;
		//var can = document.getElementById('mycanvas');
		var can = document.createElement('canvas');
		can.width = cWidth;
		can.height = cHeight;
		var ctx = can.getContext('2d');

		//ALPHA IMAGE
		var canAlpha = document.createElement('canvas');
		canAlpha.width = cWidth;
		canAlpha.height = cHeight;
		var ctxAlpha = canAlpha.getContext('2d');
		ctxAlpha.drawImage(alphaImage, 0, 0);
		var imgdAlpha = ctxAlpha.getImageData(0, 0, cWidth, cHeight);
		var pixAlpha = imgdAlpha.data;

		// NORMAL IMAGE
		var canNormal = document.createElement('canvas');
		canNormal.width = cWidth;
		canNormal.height = cHeight;
		var ctxNormal = canNormal.getContext('2d');
		ctxNormal.drawImage(normalImage, 0, 0);
		var imgdNormal = ctxNormal.getImageData(0, 0, cWidth, cHeight);
		var pixNormal = imgdNormal.data;

		for (var i = 0, n = pixNormal.length; i < n; i += 4)
		{
//		pixNormal[i  ] = 255 - pixNormal[i  ]; // red
//		pixNormal[i+1] = 255 - pixNormal[i+1]; // green
//		pixNormal[i+2] = 255 - pixNormal[i+2]; // blue
			pixNormal[i + 3] = (pixAlpha[i] + pixAlpha[i + 1] + pixAlpha[i + 2]) / 3; // blue
			// i+3 is alpha (the fourth element)
		}
		ctx.putImageData(imgdNormal, 0, 0);
		var dataUrl = can.toDataURL();

		$(ele).replaceWith("<img src='" + dataUrl + "'/>");

		can = null;
		canAlpha = null;
		canNormal = null;
		normalImage = null;
		alphaImage = null;
	}

}(jQuery, window));