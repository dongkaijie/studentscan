// 这个文件可以不用了，改成vite代理了

const isDev = import.meta.env.MODE === 'development';

// 开发环境走代理前缀，生产环境走真实地址
const baseUrl = isDev ? '/api' : 'http://192.168.1.202:8090/basic';

const ip = 'http://192.168.1.35:8080';// api接口请求域名
// const baseUrl = ip + '/basic';// api接口请求域名

export default {
    ip,baseUrl
} 
