let layoutGridPlugin;

$(function(){
  layoutGridPlugin = new LayoutGridPlugin();
  layoutGridPlugin.getAllLimits();

  $('.layout-grid-item').on('mousedown', function(e){
    layoutGridPlugin.triggerMouseDown($(this)[0], e);
  });

  $(document).on('mousemove', function(e){
    layoutGridPlugin.triggerMouseMove(e);
  });

  $(document).on('mouseup', function(e){
    layoutGridPlugin.triggerMouseUp(e);
  });
});
