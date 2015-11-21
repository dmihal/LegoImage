(function (argument) {
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
      processImage(img);
    })
  });

  var processImage = function(img){
    canvas.height = img.height;
    canvas.width  = img.width;
    ctx.drawImage(img, 0, 0);
  };
})();
