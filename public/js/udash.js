$(function(){
  document.addEventListener('polymer-ready', function() {
    var navicon = document.getElementById('navicon');
    var drawerPanel = document.getElementById('nav');
    navicon.addEventListener('click', function() {
      drawerPanel.togglePanel();
    });
  });

  // click eat on the sidebar
  $('#eat').on("click", function(e) {
    // load the eat.html into #view div
    $('#view').load( "eat.html" );
  });
});
