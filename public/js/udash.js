$(function(){
  document.addEventListener('polymer-ready', function() {
    var navicon = document.getElementById('navicon');
    var drawerPanel = document.getElementById('nav');
    navicon.addEventListener('click', function() {
      drawerPanel.togglePanel();
    });
  });
});
