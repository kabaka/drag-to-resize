# Drag to Resize

This is Greasemonkey script which allows you to drag images to resize them on
almost any web site.

*[View and install the script on userscripts.org.](https://userscripts.org/scripts/show/105403)*


It is based on the drag to resize feature in the Reddit Enhancement Suite, a
GPL project by honestbleeps, which can be found
[here](https://redditenhancementsuite.com/).

# Instructions

* To resize an image, hold the left mouse button and drag toward the
bottom-right.
* To reset an image to its original size, simply right-click it.
* If you want to see an image at the full size of your browser window (by
height), double-click it. If the image is also a link, you'll need to drag to
resize it a little, first. Otherwise, the first click will activate the link.
* Hold control (command on Mac) to disable the script, allowing you to drag
images as normal — as though the script is not enabled. This allows you t
drag images to your URL bar to open them, or to some application to save them,
etc. depending on your system configuration and features.

## Potential Problems

It may interfere with some web sites' functionality, especially if lots of
JavaScript is used. At this time, the script is configured to run almost
everywhere. If you're having trouble using it on such a site, hold down the
control key (or command on Mac) and try dragging the image again. Holding this
key down disables the script.

Please report any web sites which break as a result of this script and I will
update the default exclude list. I have also not tested in on all platforms and
browsers, so please report any incompatibilities.

# Change Log

* 2011-06-23: Resized images are brought to the front.
* 2011-06-24: Double-clicks now make images fit your screen (vertically). 
Right-clicks restore any resized images to their original size. Chess.com added
to excludes.
* 2011-07-06: Holding control (or command on Mac) now prevents dragging from
resizing images. The image will be dragged as if the script is not installed.
* 2011-07-06: Holding control now correctly prevents the script from working.
Clicks are also now correctly permitted when holding control, making using this
with a tablet much easier (clicking with a tablet almost always results in a
tiny amount of dragging). The control key modifier is preserved for the click
and will used however the browser is configured to use it.
