<script>if(window==window.top) {
    window.location.href = "unauth.php";
    }
 </script>

<html>
<body style="margin: 0px !important;" oncontextmenu="return false;">

<video oncontextmenu="return false;" poster="image.png" playsinline fullscreen width="100%" height="100%" loop="false" autoplay="autoplay" controls muted controlsList="nodownload" poster="PATH-TO-STILL-IMAGE" preload="auto" id="videoElementID">
	<source src="<?php echo getEncodedVideoString('mp4','video.mp4');?>" type="video/mp4">
	<!-- <source src="http://www.example.com/CorporateVideo.ogv" type="video/ogv" />
	<source src="http://www.example.com/CorporateVideo.webm" type="video/webm" /> -->
	Your browser does not support the video tag or the file format of this video.
</video>

</body>
</html>

<?php

function getEncodedVideoString($type, $file) {
	$filename= 'data:video/' . $type . ';base64,' . base64_encode(file_get_contents('assets/videos/'.$file)); 
	echo $filename;
}

?>
