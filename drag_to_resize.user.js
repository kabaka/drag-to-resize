// ==UserScript==
// @name          Drag to Resize
// @namespace 	  http://kylej.name/
// @description	  Drag to resize images, based on code in the RES.
// @author        Kabaka
// @version       1.3
// @source        https://github.com/lenethx/drag-to-resize
// @include       *
// @exclude       http://www.chess.com/*
// @exclude       http://chess.com/*
// @exclude       https://neocities.org/*
// ==/UserScript==

/*
 * Drag to Resize - Drag images to resize them no matter where you are.
 *
 * The image resizing code was extracted from honestbleeps's
 * (steve@honestbleeps.com) Reddit Enhancement Suite, a GPL
 * Greasemonkey script. The idea was, as far as I know, all his. What
 * I've done is duplicated that feature in this script and started
 * adding on things to make it useful in different contexts.
 *
 * Because it now runs everywhere, it will likely break some web
 * sites. And it definitely opens up doors for some silliness such as
 * making images hilariously gigantic. If this script causes you to
 * lose data, money, or time, don't hold me responsible!
 *
 *
 * Instructions:
 *
 *   To resize an image, hold the left mouse button and drag. Down and to the
 *   right will expand. Up and to the left will shrink. Images aligned to the
 *   right will expand in an unusual way. Sorry.
 *
 *   To reset an image to original size, right-click it.
 *
 *   To make an image fit the screen (by height), double-click.
 *
 *   To drag an image without resizing (as if the script were not installed),
 *   hold control (or command on Mac) and drag.
 *
 *
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var imageData = Array();

/*
 * Find all img elements on the page and feed them to makeImageZoomable().
 * Also, record the image's original width in imageData[] in case the user
 * wants to restore size later.
 */


function findAllImages() {
  var imgs = document.getElementsByTagName('img');

  for (let i = 0; i < imgs.length; ++i) {

    feedSingleImage(imgs[i], i);
  }
}

function feedSingleImage(image, i=imageData.length) {
  // We will populate this as the user interacts with the image, if they
  // do at all.
  imageData[i] = {};
  imageData[i].resized = false;

  image.dragToResizeId = i;

  makeImageZoomable(image);
}

function findNewImages() {
//Add observer to feed new images to makeImageZoomable
  var mutationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type=='childList'){
        mutation.addedNodes.forEach(function(newnode){
          if (newnode.nodeName=='IMG'){
            feedSingleImage(newnode);
          } else if (newnode.firstChild){
            newnode.querySelectorAll('img').forEach(function(childimg){
              feedSingleImage(childimg);
            });
          }
        });
      }
    });
  });

  mutationObserver.observe(document.documentElement, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
  });
}


/*
 * Calculate the drag size for the event. This is taken directly from
 * honestbleeps's Reddit Enhancement Suite.
 *
 * @param mousedown e or mousemove event.
 * @return Size for image resizing.
 */
function getDragSize(e) {
  return (p = Math.pow)(p(e.clientX - (rc = e.target.getBoundingClientRect()).left, 2) + p(e.clientY - rc.top, 2), .5);
}

/*
 * Get the viewport's vertical size. This should work in most browsers. We'll
 * use this when making images fit the screen by height.
 *
 * @return int Viewport size.
 */
function getHeight() {
  return window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
}

/*
 * Get the imageData entry for the given event's target.
 *
 * @return Object
 */
function getImageData(e) {
  return imageData[e.target.dragToResizeId];
}

/*
  * Try to stop propagation of an event.
  *
  * @param event e Event to stop.
  * @return false
  */
function stopEvent(e) {
  e.preventDefault();
  e.returnValue = false;
  e.stopPropagation();

  return false;
}

/*
 * Set up events for the given img element to make it zoomable via
 * drag to zoom. Most of this is taken directly from honestbleeps's
 * Reddit Enhancement Suite. Event functions are currently written
 * inline. For readability, I may move them. But the code is small
 * enough that I don't yet care.
 *
 * @param Object imgElement Image element.
 */
function makeImageZoomable(imgElement) {
  dragTargetData = {};

  imgElement.addEventListener('mousedown', function(e) {
    /*
     * This is so we can support the command key on Mac. The combination of OS
     * and browser changes how the key is passed to JavaScript. So we're just
     * going to catch all of them. This means we'll also be catching meta keys
     * for other systems. Oh well! Patches are welcome.
     */
    if (e.ctrlKey != 0 || (e.metaKey != null && e.metaKey != 0))
      return true;

    if (e.button !== 0)
      return false;

    // Store some data about the image in case we want to restore size later.

    var myImageData = getImageData(e);

    if (myImageData.position ==  null) {
      myImageData.zIndex   = e.target.style.zIndex;
      myImageData.width    = e.target.style.width;
      myImageData.height   = e.target.style.height;
      myImageData.position = e.target.style.position;
    }

    dragTargetData.image_width = e.target.width;
    dragTargetData.dragSize    = getDragSize(e);

    e.preventDefault();
  }, true);


  // Reset image to original size and unlock for future events.
  imgElement.addEventListener('contextmenu', function(e) {
    var myImageData = getImageData(e);

    if (!myImageData.resized)
      return true;

    myImageData.resized = false;

    e.target.style.zIndex    = myImageData.zIndex;
    e.target.style.maxWidth  = e.target.style.width  = myImageData.width;
    e.target.style.maxHeight = e.target.style.height = myImageData.height;
    e.target.style.position  = myImageData.position;

    return stopEvent(e);
  }, true);

  // Expand image to fill screen.
  imgElement.addEventListener('dblclick', function(e) {
    if (e.ctrlKey != 0 || (e.metaKey != null && e.metaKey != 0))
      return true;

    var myImageData = getImageData(e);

    if (myImageData.resized) {
      // If we've already resized it, we have to set this back to the
      // original value. Otherwise, the max size image will keep the
      // original width. Dunno why!
      e.target.style.maxWidth = e.target.style.width = myImageData.width;
    }

    e.target.style.position  = "fixed";
    e.target.style.zIndex    = 1000;
    e.target.style.top       = 0;
    e.target.style.left      = 0;
    e.target.style.maxWidth  = e.target.style.width = "auto";
    e.target.style.maxHeight = e.target.style.height = getHeight() + "px";

    myImageData.resized = true;

    // Most browsers will want to save the image or something. Prevent that.

    return stopEvent(e);
  }, true);

  imgElement.addEventListener('mousemove', function(e) {
    if (!dragTargetData.dragSize)
      return true;

    e.target.style.maxWidth =
      e.target.style.width  =
      ((getDragSize(e)) * dragTargetData.image_width / dragTargetData.dragSize) + "px";

    e.target.style.maxHeight = '';
    e.target.style.height    = 'auto';
    e.target.style.zIndex    = 1000; // Make sure the image is on top.

    if (e.target.style.position == '') {
      e.target.style.position = 'relative';
    }

    getImageData(e).resized = true;
  }, false);

  imgElement.addEventListener('mouseout', function(e) {
    dragTargetData.dragSize = false;

    return !getImageData(e).resized;
  }, false);

  imgElement.addEventListener('mouseup', function(e) {
    dragTargetData.dragSize = false;

    return !getImageData(e).resized;
  }, true);

  imgElement.addEventListener('click', function(e) {
    if (e.ctrlKey != 0 || (e.metaKey != null && e.metaKey != 0))
      return true;

    dragTargetData.dragSize = false;

    if (getImageData(e).resized === false)
      return true;

    return stopEvent(e);
  }, false);
}

findAllImages();
findNewImages();
document.addEventListener('dragstart', function() {return false}, false);





