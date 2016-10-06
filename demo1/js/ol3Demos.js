$(document).ready(function() {
    $('#left ul li a:first').css('color', '#fff');
    $('#right').load('1-TileWMS.html');
    // $('#right').load('prj.html');
    $('#left ul li a').on('click', function(event) {
        $('#left ul li a').css('color', '#ccc');
        $(this).css('color', '#fff');
        console.log($(this).parent().index());
        switch ($(this).parent().index()) {
            case 0:
                $('#right').load('1-TileWMS.html');//ajax
                // $('#right').getScript('js/1-TileWMS.js');

                break;
            case 1:
                $('#right').load('2-ArcGIS-MapServer.html');
                // $.getScript('js/2-ArcGIS-MapServer.js');
                break;
            case 2:
                $('#right').load('3-osm.html');
                break;
            case 3:
                break;
        }
    });


    $('.hide-button').on('click', function(event) {
        // $('#left').css('display', 'none');
        $('#left').animate({
            // left: '-300px',
            opacity: 'toggle'
        }, "slow",'swing');
        // 
        // $('#left').fadeIn();
        // $('#left').fadeToggle();
        	
       
    });
});
