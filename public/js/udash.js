var gridster;

$(function(){

  gridster = $(".gridster ul").gridster({
    widget_base_dimensions: [100, 120],
    widget_margins: [5, 5],
    draggable: {
      handle: 'header'
    }
  }).data('gridster');

  // awful hacky shit because the god damn css provided with the gridster demo
  // apparently does not fucking work and cannot get my own css to apply
  // because apparently im a moron
  $('.gs_w').css('background-color', '#DDD');
});
