var log4js = require('log4js');
log4js.configure({
  appenders: [
    { 
      type: 'console'
    },
    {
      type: 'file',
      filename: 'logs/fankick-messenger.log',
      category: 'messenger',
      maxLogSize: 1024 * 1024 * 10, // 10MB size
      backups: 3
    }
  ]
});
var logger = log4js.getLogger('messenger');
logger.setLevel('DEBUG');
exports = module.exports = logger;