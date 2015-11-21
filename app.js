(function (argument) {
  var COLORS;
  var fileSelector = document.querySelector('input');
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');

  fileSelector.addEventListener('change', function(){
    var file = this.files[0];
    fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('loadend', function(e){
      var img = new Image();
      img.src = this.result;
      img.addEventListener('load', function(){
        processImage(this);
      });
    })
  });

  var processImage = function(img){
    canvas.height = img.height;
    canvas.width  = img.width;
    ctx.drawImage(img, 0, 0);

    mosaicize(20, 20);
  };

  var mosaicize = function(h, w){
    for (var blockX = 0; blockX < canvas.width; blockX += w) {
      for (var blockY = 0; blockY < canvas.height; blockY += h) {
        var myImageData = ctx.getImageData(blockX, blockY, w, h);
        var totals = [0, 0, 0, 0]
        for (var i = 0; i < myImageData.data.length; i++) {
          totals[i % 4] += myImageData.data[i];
        }
        var numPixels = w * h;
        var avg = totals.map(function(n){return Math.floor(n / numPixels)});
        avg[3] /= 255;
        var rgb = avg.join(',');

        var closestColor = getClosestColor.apply(null, avg);

        ctx.fillStyle = `rgb(${closestColor.r}, ${closestColor.g}, ${closestColor.b})`;
        ctx.fillRect(blockX, blockY, w, h);
      };
    };
  };

  var getClosestColor = function(r, g, b) {
    var dist = 1000;
    var closestColor;
    for (var i = 0; i < COLORS.length; i++) {
      var color = COLORS[i];
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
  };

  (function(filename){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(){
      COLORS = JSON.parse(this.response);
    });
    xhr.open('GET', filename);
    xhr.send();
  })('colors.json');
})();
