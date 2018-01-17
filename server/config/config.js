const env = process.env.NODE_ENV || 'development'

if(env === 'development') {
   const configKeys = require('./keys')
   Object.keys(configKeys).forEach(key => {
      console.log(key, configKeys[key]);
   })
}