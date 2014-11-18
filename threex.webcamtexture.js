/* global THREE */
'use strict';
var THREEx = THREEx || {};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

THREEx.WebcamTexture	= function(direction){
	console.assert(THREEx.WebcamTexture.available === true);
	// create the video element
	var video	= document.createElement('video');
	video.width	= 1920;
	video.height	= 1080;
	video.autoplay	= true;
	video.loop	= true;
	// expose video as this.video
	this.video	= video;

	if (navigator.getUserMedia) {
		if (direction) {
			window.MediaStreamTrack.getSources(function(srcs) {
				var cams = srcs.filter(function(stream) {
					return stream.kind == 'video' && stream.facing == direction;
				});

				if (cams.length < 1) {
					navigator.getUserMedia({video: true}, function(stream) {
						video.src = window.URL.createObjectURL(stream);
					}, function(err) {
						console.log(err);
					});

					return;
				}

				navigator.getUserMedia({
					video: {
						optional: [{ sourceId: cams[0].id }]
					}
				}, function(stream) {
					video.src = window.URL.createObjectURL(stream);
				}, function(err) {
					console.log(err);
				});
			});
		} else {
			navigator.getUserMedia({video: true}, function(stream) {
				video.src = window.URL.createObjectURL(stream);
			}, function(err) {
				console.log(err);
			});
		}
	}

	// create the texture
	var texture	= new THREE.Texture( video );
	// expose texture as this.texture
	this.texture	= texture;

	/**
	 * update the object
	 */
	this.update	= function(delta, now){
		if( video.readyState !== video.HAVE_ENOUGH_DATA )	return;
		texture.needsUpdate	= true;		
	};

	/**
	 * destroy the object
	 */
	this.destroy	= function(){
		video.pause();
	};
};


THREEx.WebcamTexture.available	= navigator.getUserMedia ? true : false;
