(function (argument) {
  var COLORS;
  var fileSelector = document.querySelector('input');
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  var currentImg = null;

  fileSelector.addEventListener('change', function(){
    var file = this.files[0];
    fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('loadend', function(e){
      var img = new Image();
      img.src = this.result;
      img.addEventListener('load', function(){
        currentImg = this;
        processImage();
      });
    })
  });

  var processImage = function(){
    canvas.height = currentImg.height;
    canvas.width  = currentImg.width;
    ctx.drawImage(currentImg, 0, 0);

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

        var closestColor = Colors.getClosestColor.apply(null, avg);

        ctx.fillStyle = `rgb(${closestColor.r}, ${closestColor.g}, ${closestColor.b})`;
        ctx.fillRect(blockX, blockY, w, h);
      };
    };
  };

  Colors.importColors('legos.json');
})();
