// 引入mongoose模块
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// 数据库连接URL - 使用本地MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/todolist';
// 如果您有其他可用的MongoDB地址，也可以使用那个

// 连接数据库
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB连接成功');
  } catch (error) {
    logger.error('MongoDB连接失败:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 