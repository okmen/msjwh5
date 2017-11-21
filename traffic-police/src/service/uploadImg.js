/* eslint-disable */
/**
* 使用七牛云SDK上传图片添加水印
* @author niepeng
* @date 2017-4-18
* @param {string} upToken 必传
* @return {Array<object>} [{imgUrl:'图片地址',dateTime:'拍照时间',GPSLongitude:'经度',GPSLatitude:'纬度'}]
*/
import { Indicator } from 'mint-ui';
let domain = 'http://oojgfm8c9.bkt.clouddn.com/';
export default function uploadImgFun({selfId,parentId,upToken,fileUploaded,error}){
	var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',      // 上传模式，依次退化
        browse_button: selfId,         // 上传选择的点选按钮，必需
        uptoken:upToken,
        get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
        unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
        domain: domain,     // bucket域名，下载资源时用到，必需
        container: parentId,             // 上传区域DOM ID，默认是browser_button的父元素
        max_file_size: '100mb',             // 最大文件体积限制
        flash_swf_url: '',  //引入flash，相对路径
        max_retries: 3,                     // 上传失败最大重试次数
        dragdrop: false,                     // 开启可拖曳上传
        drop_element: parentId,          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                  // 分块上传时，每块的体积
        auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
        multi_selection: false,
        deleteAfterDays:'1', 
        init: {
          'FilesAdded': function(up, files) {
            plupload.each(files, function(file) {
              // 文件添加进队列后，处理相关的事情
              Indicator.open('上传中...');
            });
          },
          'BeforeUpload': function(up, file) {
            // 每个文件上传前，处理相关的事情
          },
          'UploadProgress': function(up, file) {
            // 每个文件上传时，处理相关的事情
          },
          'FileUploaded': function(up, file, info) {
            let domain = up.getOption('domain');
            let res = JSON.parse(info); //图片信息
            let url = domain +"/"+ res.key;
            let exifOjb = Qiniu.exif(res.key);//图片exif信息
            console.log(exifOjb);
          	let obj = {};
          	obj.dateTime = exifOjb && exifOjb.DateTime ? exifOjb.DateTime.val : '';
          	obj.GPSLongitude = exifOjb && exifOjb.GPSLongitude ? exifOjb.GPSLongitude.val : '';
          	obj.GPSLatitude = exifOjb && exifOjb.GPSLatitude ? exifOjb.GPSLatitude.val : '';
            let waterStr = `纬度:${obj.GPSLatitude}，经度:${obj.GPSLongitude}\n${obj.dateTime}`;
            let watermarkImgUrl = watermark({
              text:waterStr,
              gravity:'SouthEast',
              key:res.key
            }); //添加水印
            obj.imgUrl = watermarkImgUrl;
          	fileUploaded && fileUploaded(obj);
          },
          'Error': function(up, err, errTip) {
            //上传出错时，处理相关的事情
            error && error(errTip);
          },
          'UploadComplete': function() {
            //队列文件处理完毕后，处理相关的事情
            Indicator.close();
          },
          'Key': function(up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在unique_names: false，save_key: false时才生效
            var key = "";
            // do something with key here
            return key
          }
        }
      });
}

/**
 * @param  {string} text 显示的文字
 * @param  {string} gravity 显示的位置
 * @param  {string} key 上传成功后图片的key值
 * @return {string} 添加水印后图片的地址
 */
function watermark({text,gravity,key}){
  var imgLink = Qiniu.watermark({
         mode: 2,  // 文字水印
         text: text, // 水印文字，mode = 2时，必需
         dissolve: 85,          // 透明度，取值范围1-100，非必需，下同
         gravity: gravity,  // 水印位置，同上
         fontsize: 3000,         // 字体大小，单位：缇
         font : '宋体',          // 水印文字字体
         dx: 20,  // 横轴边距，单位：像素(px)
         dy: 20,  // 纵轴边距，单位：像素(px)
         fill: 'black'        // 水印文字颜色，RGB格式，可以是颜色名称
  }, key);
  return imgLink;
}
/* eslint-enable */
