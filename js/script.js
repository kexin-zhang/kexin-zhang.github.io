$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

$(document).ready(function() {

	$('#scroll-down i').mouseenter(function(){
		$(this).animateCss('bounce');
	});

	$("#scroll-down i").click(function() {
	    $('html,body').animate({
	        scrollTop: $("#main").offset().top},
	        'slow');
	});
})