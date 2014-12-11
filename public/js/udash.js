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
    $('#view').load("deals.html");
  });
  $('#places').on("click", function(e) {
    $('#view').load("bizs.html");
  });
});
