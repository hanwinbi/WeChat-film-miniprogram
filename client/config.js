/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://fonqkbql.qcloud.la';

var config = {

  Bucket: 'audiorecord-1257225145',//replace with yours
  Region: 'ap-shanghai',//replace with yours
  SecretId: 'AKIDhghilhAC40oR3enTjtBIO1Wpz0pSrZ5P',//replace with yours
  SecretKey: 'T1FKXQC5siYEEFDAlCpEhCkz6FLm9LXY',//replace with yours
  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,

    user: `${host}/weapp/user`,

    filmList: `${host}/weapp/movies`,

    favoriteList: `${host}/weapp/favorite`,

    commentsList: `${host}/weapp/comments/`,

    addToFavorite: `${host}/weapp/favorite`,

    addComments: `${host}/weapp/comments`,

    allComments: `${host}/weapp/comments`,

    delComment: `${host}/weapp/comments`,
  }
};

module.exports = config;