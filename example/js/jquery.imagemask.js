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

		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Plugin.prototype.init = function ()
	{
		$(this.element).each(function (i, ele)
		{
			// Preserve the original image
			$(ele).attr("data-src", $(ele).attr("src"));

			// Check if canvas is available
			if (getBrowser().canvas)
			{
				var imgNormal = new Image();
				var imgAlpha = new Image();
				createImgageAlpha(ele, imgNormal, imgAlpha);
			}
			else
			{
				// If canvas is not available see if fallback is defined.
				var attrFallback = $(this).attr('data-mask-fallback');
				if (typeof attrFallback !== 'undefined' && attrFallback !== false)
				{
					$(ele).attr("src", $(ele).attr("data-mask-fallback"));
				}
			}
		});
	};

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
		$(imgNormal)
			.load(function ()
			{
				normalLoaded(ele, imgNormal, imgAlpha);
			})
			.error(function ()
			{
			})
			.attr('src', $(ele).attr("src"));
		$(ele).attr("src", "")
	}

	var normalLoaded = function (ele, imgNormal, imgAlpha)
	{
		$(imgAlpha)
			.load(function ()
			{
				alphaLoaded(ele, imgNormal, imgAlpha);
			})
			.error(function ()
			{
			})
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
			pixNormal[i + 3] = (pixAlpha[i] + pixAlpha[i + 1] + pixAlpha[i + 2]) / 3; // blue
		}
		ctx.putImageData(imgdNormal, 0, 0);
		var dataUrl = can.toDataURL();

		//$(ele).replaceWith("<img src='" + dataUrl + "'/>");
		$(ele).attr("src", dataUrl);

		can = null;
		canAlpha = null;
		canNormal = null;
		normalImage = null;
		alphaImage = null;
	}

	var getBrowser = function ()
	{
		function testCSS (prop)
		{
			return prop in document.documentElement.style;
		}

		function hasCanvas ()
		{
			var elem = document.createElement('canvas');
			return !!(elem.getContext && elem.getContext('2d'));
		}

		function browserInfo ()
		{
			return {
				ff:testCSS('MozBoxSizing'),
				ie:/*@cc_on!@*/false || testCSS('msTransform'), // At least IE6
				ie6:!window.XMLHttpRequest,
				ie7:document.all && window.XMLHttpRequest && !XDomainRequest && !window.opera,
				ie8:document.documentMode == 8,
				opera:!!(window.opera && window.opera.version),
				safari:Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
				chrome:!(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) && testCSS('WebkitTransform'),
				webkit:testCSS('WebkitTransform'),
				canvas:hasCanvas()
			};
		}

		;

		return browserInfo();
	}

}(jQuery, window));