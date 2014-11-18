var THREEx = THREEx || {}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

THREEx.WebcamTexture	= function(){
	console.assert(THREEx.WebcamTexture.available === true)
	// create the video element
	var video	= document.createElement('video');
	video.width	= 320;
	video.height	= 240;
	video.autoplay	= true;
	video.loop	= true;
	// expose video as this.video
	this.video	= video

	if (navigator.getUserMedia) {
		navigator.getUserMedia({video: true}, function(stream) {
			video.src = URL.createObjectURL(stream);
		}, function(err) {
			alert('you got no WebRTC webcam');
		});
	} else {
		console.assert(false);
	}

	// create the texture
	var texture	= new THREE.Texture( video );
	// expose texture as this.texture
	this.texture	= texture

	/**
	 * update the object
	 */
	this.update	= function(delta, now){
		if( video.readyState !== video.HAVE_ENOUGH_DATA )	return;
		texture.needsUpdate	= true;		
	}

	/**
	 * destroy the object
	 */
	this.destroy	= function(){
		video.pause()
	}
}


THREEx.WebcamTexture.available	= navigator.getUserMedia ? true : false;
