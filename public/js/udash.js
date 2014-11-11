$(function(){
  document.addEventListener('polymer-ready', function() {
    var navicon = document.getElementById('navicon');
    var drawerPanel = document.getElementById('nav');
    navicon.addEventListener('click', function() {
      drawerPanel.togglePanel();
    });
  });

  // click deals on the sidebar
  $('#deals').on("click", function(e) {
    // first we want to see if the view is tagged with 'deals-active', indicating
    // that it's already been loaded into the #view div.  we don't wanna reload.
    if (!$('#view').hasClass('.deals-active')) {
      // load the deals.html into #view div
      $('#view').load( "deals.html" );
      // add class that lets us know that deals are active
      $('#view').removeClass();
      $('#view').addClass('.deals-active');
    }
  });
});
