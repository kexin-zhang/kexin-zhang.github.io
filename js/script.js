AOS.init({duration: 1200});

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

$(document).ready(function() {
    $('#pic-wrapper').particleground({
        dotColor: 'rgba(189,195,199,.4)',
        lineColor: 'rgba(189,195,199,.4)'
    });

	$('#scroll-down i').mouseenter(function(){
		$(this).animateCss('bounce');
	});

	$("#scroll-down i").click(function() {
	    $('html,body').animate({
	        scrollTop: $("#main").offset().top},
	        'slow');
	});

	$("img").hover(function(){
      $(this).next('.content').show();
    },function(){
      $(this).next('.content').hide();
    });

    $('.content').hover(function(){
        $(this).show();
    }, function(){
        $(this).hide();
    });

    function switchWord() {
        var words = ['student', 'developer', 'researcher', 'hacker', 'data enthusiast'];
        var randomWord = words[Math.floor(Math.random()*words.length)];
        while (randomWord == $('#word').text()) {
            var randomWord = words[Math.floor(Math.random()*words.length)];
        }
        $('#word').text(randomWord);
    }


    // $(document).scroll(function() {
    //     var y = $(document).scrollTop();
    //     if (y > 951) {
    //         $('#nav').addClass('sticky');
    //         $('.container .row:first-of-type').css('padding-top', '10rem');
    //     } else {
    //         $('#nav').removeClass('sticky');
    //         $('.container .row:first-of-type').css('padding-top', '5rem');
    //     }
    // });
})
