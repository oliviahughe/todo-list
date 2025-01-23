// 引入必要的模块
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');

// 创建Express应用实例
const app = express();

// 中间件配置
app.use(cors({
  origin: '*',  // 在 Vercel 环境中允许所有来源
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// 日志中间件
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// 使用内存数组存储待办事项
let todos = [];
let nextId = 1;

// API路由处理

// 1. 获取所有待办事项
app.get('/api/get-todo', (req, res) => {
  try {
    res.json(todos);
  } catch (error) {
    logger.error('获取待办事项失败:', error);
    res.status(500).json({ error: '获取待办事项失败' });
  }
});

// 2. 添加新的待办事项
app.post('/api/add-todo', (req, res) => {
  try {
    const { value } = req.body;
    if (!value) {
      return res.status(400).json({ error: '待办事项内容不能为空' });
    }
    
    const todo = {
      _id: nextId++,
      value,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    todos.push(todo);
    res.status(201).json(todo);
  } catch (error) {
    logger.error('添加待办事项失败:', error);
    res.status(500).json({ error: '添加待办事项失败' });
  }
});

// 3. 更新待办事项状态
app.post('/api/update-todo/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t._id === id);
    
    if (!todo) {
      return res.status(404).json({ error: '待办事项不存在' });
    }
    
    todo.isCompleted = !todo.isCompleted;
    todo.updatedAt = new Date();
    res.json(todo);
  } catch (error) {
    logger.error('更新待办事项失败:', error);
    res.status(500).json({ error: '更新待办事项失败' });
  }
});

// 4. 删除待办事项
app.post('/api/del-todo/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t._id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: '待办事项不存在' });
    }
    
    const deletedTodo = todos.splice(index, 1)[0];
    res.json({
      message: '删除成功',
      deletedTodo
    });
  } catch (error) {
    logger.error('删除待办事项失败:', error);
    res.status(500).json({ error: '删除待办事项失败' });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`服务器运行在端口 ${PORT}`);
});

module.exports = app; 