module.exports = {
    // dev 开发环境  
    // release 上线环境
    dev:{
    	rootUrl:'http://localhost',
    	appPort:'3000',
    	dbAddress:'127.0.0.1'
    },
    release:{
    	rootUrl:'http://120.55.91.133',
    	appPort:'80',
    	dbAddress:'127.0.0.1'
    }
};
