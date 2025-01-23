// 引入mongoose模块
const mongoose = require('mongoose');

// 定义Todo项目的数据结构
const todoSchema = new mongoose.Schema({
  // 待办事项内容
  value: {
    type: String,
    required: true,
    trim: true
  },
  // 完成状态
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  // 自动添加创建时间和更新时间字段
  timestamps: true
});

// 导出Todo模型
module.exports = mongoose.model('Todo', todoSchema, 'list'); 