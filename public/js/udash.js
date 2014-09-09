var gridster;

$(function(){

  gridster = $(".gridster ul").gridster({
    widget_base_dimensions: [100, 120],
    widget_margins: [5, 5],
    draggable: {
      handle: 'header'
    },
    max_cols: 8
  }).data('gridster');

  $('#addwidget').on('click', function(e) {
    $('#widgetmodal').modal('show');
  });

  $('.addwidget-btn').on('click', function(e) {
    var numwidgets = $('.widgetnum').val();
    for (i = 0; i < numwidgets; i++) {
      gridster.add_widget("<li class='new'><header>|||</header><p>I am a brand new widget.  Gosh, I feel so fresh and so clean.  Won't you drag me around?</p></li>", 1, 2);
    }
    $('.gs_w').css('background-color', '#DDD');
    $('#widgetmodal').modal('hide');
  });

  // awful hacky shit because the god damn css provided with the gridster demo
  // apparently does not fucking work and cannot get my own css to apply
  // because apparently im a moron
  $('.gs_w').css('background-color', '#DDD');
});
