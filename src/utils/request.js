    // src/utils/request.js
    import axios from 'axios';
    import { ElMessage } from 'element-plus'
    // import config from '/public/config/index.js'
    // 创建 axios 实例
    const instance = axios.create({
        // baseURL: import.meta.env.MODE === 'development' ? '/request' : config.baseUrl,
        // baseURL: 'http://192.168.1.202:8090/api',
        baseURL: import.meta.env.VITE_APP_API_BASE_URL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });

    // 一般正常的请求拦截器
    instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // console.error('请求错误:', error);
        const errMsg = error.response?.data?.msg || error.message;
        ElMessage.error(errMsg);
        return Promise.reject(error);
    }
    );

    // 响应拦截器
    instance.interceptors.response.use(
        response => {
            const res = response.data;

            // 假设后端返回 { code: 0, data: {}, msg: "" }
            if (res.code !== 1 ) {
                // 业务错误
                return Promise.reject({
                    code: res.code,
                    msg: res.msg || '请求失败',
                    data: res.data
                });
            }
            if (res.msg && res.msg !== 'OK' && res.msg !== 'Success') {
                ElMessage.success(res.msg);
            }
            return res.data || res; // 成功时返回 data
        },
        error => {
            let errorMsg = '';
            let statusCode = null;

            if (error.response) {
            // 服务器返回了状态码
            statusCode = error.response.status;
            switch (statusCode) {
                case 401:
                localStorage.removeItem('token');
                errorMsg = '未登录或登录已过期';
                // 可在此触发跳转登录页
                break;
                case 403:
                errorMsg = '拒绝访问';
                break;
                case 404:
                errorMsg = '请求地址错误';
                break;
                case 500:
                errorMsg = '服务器内部错误';
                break;
                default:
                errorMsg = '连接错误';
            }
            } else if (!error.request) {
            errorMsg = '网络连接失败';
            } else {
            errorMsg = '未知错误';
            }

            // 不再使用 console.error
            ElMessage.error(errorMsg);
            // 改为抛出一个结构化错误对象
            return Promise.reject({
                code: statusCode || -1,
                msg: errorMsg,
                response: error.response?.data,
                config: error.config
            });
        }
    );

    // 封装请求方法
    export const get = (url, params, config = {}) => {
        return instance({
            method: 'get',
            url,
            params,
            ...config
        });
    };

    export const post = (url, data, config = {}) => {
        return instance({
            method: 'post',
            url,
            data,
            ...config
        });
    };

    export const put = (url, data, config = {}) => {
        return instance({
            method: 'put',
            url,
            data,
            ...config
        });
    };

    export const del = (url, params, config = {}) => {
        return instance({
            method: 'delete',
            url,
            params,
            ...config
    });
    };

    // 上传文件（特殊 Content-Type）
    export const upload = (url, data, config = {}) => {
    return instance({
        method: 'post',
        url,
        data,
        headers: {
        'Content-Type': 'multipart/form-data'
        },
        ...config
    });
    };

    // export const postToCamera = (cameraIP, url, data, config = {}) => {
    //     return cameraInstance({
    //         method: 'post',
    //         url,
    //         data,
    //         baseURL: `http://${cameraIP}`,
    //         ...config // 可传入 username, password
    //     });
    // };

    export const postToCamera = async (ip, path, body, config) => {
        const url = `http://${ip}${path}`;
        const headers = {
            'Content-Type': 'application/sdp',
            ...config.headers,
        };

        try {
            const response = await axios.post(url, body, {
            headers,
            auth: {
                username: config.username,
                password: config.password,
            },
            });

            if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
            }

            return response;
        } catch (error) {
            const errMsg = error.response?.data?.msg || error.message || '摄像头连接失败';
            ElMessage.error(errMsg);
            throw error;
        }
        };

    // 如果你还想保留默认导出，也可以加上
    export default { get, post, put, del, upload, postToCamera };