/**
 * author: niepeng
 * data: 2017-4-25
 * description: H5实现图片压缩上传
 */

/* eslint-disable */
import { Indicator } from 'mint-ui';
const imgObj = {};

/**
 * [UploadFile 上传图片并压缩]
 * @type {Object}
 */
const UploadFile = {
	/**
	 * [upload description]
	 * @param  {[string]} options.id        [监听元素id]
	 * @param  {Number} options.maxHeight [最大压缩高度]
	 * @param  {Number} options.quality   [清晰度]
	 * @param  {[function]} options.callback  [回调]
	 * @return {[type]}                   [null]
	 */
	upload: function({id,maxHeight=768,quality=0.92,callback}){
		if(!id) return;
		let el = document.getElementById(id);
		let self = this;
		el.onchange = function(e){
			var file = this;
			var f = file.files[0];
			var size = f.size;
			if(f){
				Indicator.open('上传中...');
				EXIF.getData(f, function() {
			        imgObj.dateTime = EXIF.getTag(this,'DateTime') || '';
			        imgObj.GPSLongitude = EXIF.getTag(this,'GPSLongitude') ? transLongAndLat(EXIF.getTag(this,'GPSLongitude')) : '';
			        imgObj.GPSLatitude = EXIF.getTag(this,'GPSLatitude') ? transLongAndLat(EXIF.getTag(this,'GPSLatitude')) : '' ;
							imgObj.Orientation = EXIF.getTag(this, 'Orientation') || 1;
			    });
				if (window.FileReader) {
					var fr = new FileReader();
		            fr.onload = function(e) {
		                var src = e.target.result;
										self.rotateImg(src,size,maxHeight,quality,callback);
		            }
		            fr.readAsDataURL(f);
			    }
			}
		}
	},
	/**
	 * [description]
	 * @author {[shirunpei]}
	 * @date   {[2017-08-22]}
	 * @param  {[base64]} src [图片base64]
	 * @return {[base64]}     [旋转后的图片]
	 */
	rotateImg: function (src,size,maxHeight,quality,callback) {
		let self = this
		if (/iPhone/i.test(window.navigator.userAgent)) {
			if (!src) return
			let img = new Image()
			img.src = src
			let degree = 0
			img.onload = function () {
				let canvas = document.createElement('canvas')
				let ctx = canvas.getContext('2d')
				let width = img.width
				let height = img.height
				canvas.width = width
				canvas.height = height
				switch (imgObj.Orientation) {
					case 6: // 需要顺时针旋转 90 度
						canvas.width = height
					  canvas.height = width
					  ctx.translate(height, 0)
						ctx.rotate(1 * 90 * Math.PI / 180)
						break;
					case 3: // 需要顺时针旋转 180 度
						canvas.width = width
			      canvas.height = height
			      ctx.translate(width, height)
						ctx.rotate(2 * 90 * Math.PI / 180)
						break;
					case 8: // 需要顺时针旋转 270 度
						canvas.width = height
			      canvas.height = width
			      ctx.translate(0, width)
						ctx.rotate(3 * 90 * Math.PI / 180)
						break;
				}
				ctx.clearRect(0, 0, canvas.width, canvas.height)
				ctx.drawImage(img, 0, 0)
				let newSrc = canvas.toDataURL('image/jpeg', quality)
				self.compressImg(newSrc,size,maxHeight,quality,callback)
			}
		} else {
			self.compressImg(src,size,maxHeight,quality,callback)
		}
	},
	/**
	 * [compressImg description]
	 * @param  {[base64]}   src       [图片base64]
	 * @param  {[number]}   maxHeight [最大压缩高度]
	 * @param  {[number]}   quality   [清晰度]
	 * @param  {Function} callback  [回调]
	 * @return {[type]}             [description]
	 */
	compressImg: function(src,size,maxHeight,quality,callback){
		if(!src) return;
		let img = document.createElement('img');
		img.src = src;
		img.onload = function(){
		    var canvas = document.createElement('canvas');
		    var context = canvas.getContext('2d');
		    //压缩率设置
		    let s = size / 1024;
		    if(s < 200){
		    	maxHeight = img.height;
		    }else if(s >= 200 && s < 500){
		    	maxHeight = 1024;
		    }else if(s >= 500 && s < 1024){
		    	maxHeight = 900;
		    }else if(s >= 1024 && s < 2*1024){
		    	maxHeight = 850;
		    } else if(s >= 2*1024 && s < 3*1024) {
		    	maxHeight = 750;
		    } else{
		    	maxHeight = 650;
		    }

		    if(img.height > maxHeight) {//按最大高度等比缩放
				img.width *= maxHeight / img.height;
				img.height = maxHeight;
			}
		    // canvas drawImage 参数
		    var sx = 0;
		    var sy = 0;
		    var sWidth = img.width;
		    var sHeight = img.height;
		    canvas.width = img.width;
		    canvas.height = img.height;

		    // canvas清屏
		    context.clearRect(0, 0, canvas.width, canvas.height);
		    context.drawImage(img, sx, sy, sWidth, sHeight);

		    var dataUrl = canvas.toDataURL('image/jpeg',quality);
		    imgObj.imgUrl = dataUrl;
		    callback && callback(imgObj);
		    Indicator.close();
		}
	}
};
/**
 * [转化经纬度信息 arr to string]
 * @param  {[Array]} arr [经纬度]
 * @return {[type]}     [description]
 */
function transLongAndLat(arr){
	if(Object.prototype.toString.call(arr) !== '[object Array]') return;
	let tempArr = [];
	arr.map((item,index) => {
		tempArr.push(item.numerator / item.denominator);
	})
	return tempArr.join(',');
}

export default UploadFile;
/* eslint-enable */
