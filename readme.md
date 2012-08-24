# jQuery ImageMask plugin

ImageMask makes it possible to get Flash like image compression with alpha/transparency and small file sizes.

## How it works

By adding a "data-mask" attribute to an img tag with a reference to an image that contains the mask will mask the src image.

<code>
\<img src="path-to-main-image.jpg" data-mask="path-to-mask-image.jpg">
</code>

Then run the plugin:

<code>
$(document).ready(function ()
{
	$(".container").imageMask();
});
</code>

and it will find all images with a data-mask attribute in the image container.

It combines the two images using canvas and replaces the original image with the generated one.

## Example

![Example Image](https://raw.github.com/sommerper/jQueryImageMask/master/exampleimage.jpg)

## Is it worth it?
It requires a bit more work because one has to save two images. It also helps to have a solid background on the original image for better compression. There may be circumstances where a normal png with transparency is preffered, but with larger photos it does have a considerable effect.

The example images included show a reduction in file size of __82.6%__.

Normal image: 24.4bk

Mask image: 9.2 kb

Combined: __33.6kb__

Png image with transparency __584.4 kb__



### Credits
[ImageMask author (Per Sommer)](http://www.persommer.com)

[Example Image by thrumyeye](http://thrumyeye.deviantart.com/art/Big-Fish-180038065)

[jQuery](http://jquery.com)
