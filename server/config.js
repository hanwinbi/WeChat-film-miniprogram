const CONF = {
  port: '5757',
  rootPathname: '',

  // 微信小程序 App ID
  appId: 'wx8d91d8d9f112f184',

  // 微信小程序 App Secret
  appSecret: '',

  // 是否使用腾讯云代理登录小程序
  useQcloudLogin: true,

  /**
   * MySQL 配置，用来存储 session 和用户信息
   * 若使用了腾讯云微信小程序解决方案
   * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
   */
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    db: 'cAuth',
    pass: 'wx8d91d8d9f112f184',
    char: 'utf8mb4'
  },

  // 微信登录态有效期
  wxLoginExpires: 7200,
  wxMessageToken: 'abcdefgh'
}

module.exports = CONF