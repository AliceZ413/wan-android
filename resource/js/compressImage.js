import Exif from 'exif-js';
/*
src: 暂只支持File类的入参
fixRotate: 暂未开始使用
return 压缩后图片的base64
*/
function compress (src, fixRotate = true) {
  return new Promise((resolve, reject) => {
    if (src instanceof File) {
      if (src.type.match('image')) {
        const fileReader = new FileReader();
        const image = new Image();
        fileReader.readAsDataURL(src);
        fileReader.onload = function () {
          image.src = fileReader.result;
        };
        image.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const initSize = image.src.length;
          const width = image.width;
          const height = image.height;
          let drawWidth = width;
          let drawHeight = height;
          // 基础像素
          const BASE_PIXEL = 400 * 10000;
          //如果图片大于基础像素，计算压缩比并将大小压至基础像素以下
          let ratio = drawWidth * drawHeight / BASE_PIXEL;
          if (ratio > 1) {
            ratio = Math.sqrt(ratio);
            drawWidth /= ratio;
            drawHeight /= ratio;
          } else {
            ratio = 1;
          }
          canvas.width = drawWidth;
          canvas.height = drawHeight;
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // 当前canvas像素大小
          const canvasPixel = canvas.width * canvas.height;

          ctx.drawImage(image, 0, 0, drawWidth, drawHeight);
          // 判断有无方向数据
          let orientation;
          Exif.getData(image, function() {
            orientation = Exif.getTag(image, 'Orientation');
          });

          let ua = navigator.userAgent;
          //兼容IOS 14以下不需要旋转图片
          if(ua.toLowerCase().indexOf('iphone') >= 0) {
            let IOS_VERSION = parseInt(ua.match(/os\s+(\d+)/i)[1]);
            console.log(IOS_VERSION);
            if(!isNaN(IOS_VERSION) && IOS_VERSION >= 14) {
              orientation = 1;
            }
          }

          console.log(orientation);
          let fixedCanvas = canvas;
          if(orientation != undefined) {
            switch(orientation) {
              case 6: //需要顺时针（向左）90度旋转
                console.log('顺时针（向左）90度旋转');
                fixedCanvas = rotateImg(canvas, 'left');
                break;
              case 8: //需要逆时针（向右）90度旋转
                console.log('顺时针（向右）90度旋转');
                fixedCanvas = rotateImg(canvas, 'right');
                break;
              case 3: //需要180度旋转
                console.log('180度旋转');
                fixedCanvas = rotateImg(rotateImg(canvas, 'right'), 'right');
                break;
              case 1:
                console.log('不用转！');
            }
          }

          // 画布转base64, 第二参数为画布输出分辨率压缩
          const compressBase64 = fixedCanvas.toDataURL('image/jpeg', 0.5);
          resolve(compressBase64);

          console.log('压缩前：' + initSize);
          console.log('压缩后：' + compressBase64.length);
          console.log('压缩率：' + ~~(100 * (initSize - compressBase64.length) / initSize) + "%");
        };
      } else {
        reject(new Error('错误的文件类型！', {
          message: '错误的文件类型！'
        }));
      }
    } else {
      reject(new Error('src需要为File类！', {
        message: 'src需要为File类！'
      }));
    }
  });
}

// 画布旋转
function rotateImg(canvas, direction) {
  var rotateCanvas = document.createElement('canvas');
  var rotCtx = rotateCanvas.getContext('2d');

  //最小与最大旋转方向，图片旋转4次后回到原方向
  var min_step = 0;
  var max_step = 3;

  var height = canvas.height;
  var width = canvas.width;
  var step = 2;
  if(step == null) {
    step = min_step;
  }
  if(direction == 'right') {
    step++;
    //旋转到原位置，即超过最大值
    step > max_step && (step = min_step);
  } else {
    step--;
    step < min_step && (step = max_step);
  }
  //旋转角度以弧度值为参数
  var degree = step * 90 * Math.PI / 180;

  switch(step) {
    case 0:
      rotateCanvas.width = width;
      rotateCanvas.height = height;
      rotCtx.drawImage(canvas, 0, 0);
      break;
    case 1:
      rotateCanvas.width = height;
      rotateCanvas.height = width;
      rotCtx.rotate(degree);
      rotCtx.drawImage(canvas, 0, -height);
      break;
    case 2:
      rotateCanvas.width = width;
      rotateCanvas.height = height;
      rotCtx.rotate(degree);
      rotCtx.drawImage(canvas, -width, -height);
      break;
    case 3:
      rotateCanvas.width = height;
      rotateCanvas.height = width;
      rotCtx.rotate(degree);
      rotCtx.drawImage(canvas, -width, 0);
      break;
  }

  return rotateCanvas;
}
// 返回一个二进制类的值
function compressToBlob (src) {
  if(typeof src === 'string' && src.indexOf('base64') >= 0){
    //支持base64图片格式转换
    let mimeString = '';
    if (src.indexOf('image/png') >= 0) {
      mimeString = "image/png";
    }
    if (src.indexOf('image/jpg') >= 0) {
      mimeString = "image/jpg";
    }
    if (src.indexOf('image/jpeg') >= 0) {
      mimeString = "image/jpeg";
    }

    const byteString = atob(src.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
      type: mimeString
    });
  } else {
    return compress(src).then(base64 => {
      const byteString = atob(base64.split(',')[1]);
      const mimeString = "image/jpeg"; //由于canvas中读取的必然为jpeg格式，所以这里可以写固定
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], {
        type: mimeString
      });
    });
  }
}

// export default compress;
export {
  compress,
  compressToBlob
};
