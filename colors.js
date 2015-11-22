Colors = (function(){
  var colors = [];
  return {
    importColors: function(filename){
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function(){
        colors = colors.concat(JSON.parse(this.response));
      });
      xhr.open('GET', filename);
      xhr.send();
    },
    getClosestColor: function(r, g, b) {
      var dist = 1000;
      var closestColor;
      for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        var distance = Math.sqrt(
          Math.pow(r - color.r, 2) +
          Math.pow(g - color.g, 2) +
          Math.pow(b - color.b, 2)
        );
        if (distance < dist) {
          dist = distance;
          closestColor = color;
        }
      };
      return closestColor
    }
  };
})();
