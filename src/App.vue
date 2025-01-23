<template>
  <div class="app" :class="{ 'dark-mode': isDarkMode }">
    <div class="container">
      <header>
        <h1>Todo List</h1>
        <button class="theme-toggle" @click="toggleTheme">
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
      </header>

      <!-- 添加新待办事项 -->
      <div class="add-todo">
        <input 
          v-model="newTodo" 
          @keyup.enter="handleAddTodo"
          placeholder="添加新的待办事项..."
          type="text"
        >
        <button @click="handleAddTodo">
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <!-- 过滤器 -->
      <div class="filters">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          :class="{ active: currentFilter === filter.value }"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- 待办事项列表 -->
      <ul class="todo-list">
        <li v-for="todo in filteredTodos" :key="todo._id" 
            :class="{ completed: todo.isCompleted }">
          <div class="todo-content">
            <input 
              type="checkbox" 
              :checked="todo.isCompleted"
              @change="handleToggleTodo(todo._id)"
            >
            <span>{{ todo.value }}</span>
          </div>
          <button class="delete-btn" @click="handleDeleteTodo(todo._id)">
            <i class="fas fa-trash"></i>
          </button>
        </li>
      </ul>

      <!-- 统计信息 -->
      <div class="stats">
        <span>完成度: {{ completionRate }}%</span>
        <span>总计: {{ todos.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTodos, addTodo, updateTodo, deleteTodo } from './services/todoApi'

// 状态
const todos = ref([])
const newTodo = ref('')
const isDarkMode = ref(false)
const currentFilter = ref('all')

// 过滤器选项
const filters = [
  { label: '全部', value: 'all' },
  { label: '已完成', value: 'completed' },
  { label: '未完成', value: 'active' }
]

// 计算属性
const filteredTodos = computed(() => {
  if (currentFilter.value === 'completed') {
    return todos.value.filter(todo => todo.isCompleted)
  }
  if (currentFilter.value === 'active') {
    return todos.value.filter(todo => !todo.isCompleted)
  }
  return todos.value
})

const completionRate = computed(() => {
  if (!todos.value.length) return 0
  const completed = todos.value.filter(todo => todo.isCompleted).length
  return Math.round((completed / todos.value.length) * 100)
})

// 方法
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}

// 获取所有待办事项
const fetchTodos = async () => {
  try {
    todos.value = await getTodos()
  } catch (error) {
    console.error('获取待办事项失败:', error)
  }
}

// 添加待办事项
const handleAddTodo = async () => {
  if (!newTodo.value.trim()) return
  try {
    const todo = await addTodo(newTodo.value)
    todos.value.unshift(todo)
    newTodo.value = ''
  } catch (error) {
    console.error('添加待办事项失败:', error)
  }
}

// 切换待办事项状态
const handleToggleTodo = async (id) => {
  try {
    const updatedTodo = await updateTodo(id)
    const index = todos.value.findIndex(t => t._id === id)
    if (index !== -1) {
      todos.value[index] = updatedTodo
    }
  } catch (error) {
    console.error('更新待办事项失败:', error)
  }
}

// 删除待办事项
const handleDeleteTodo = async (id) => {
  try {
    await deleteTodo(id)
    todos.value = todos.value.filter(t => t._id !== id)
  } catch (error) {
    console.error('删除待办事项失败:', error)
  }
}

// 页面加载时获取待办事项
onMounted(fetchTodos)

</script>

<style scoped>
.app {
  min-height: 100vh;
  padding: 2rem;
  transition: all 0.3s ease;
  background: var(--bg-color);
  color: var(--text-color);
}

.dark-mode {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #333;
  --hover-color: #2c2c2c;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: var(--card-bg);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

:root {
  --bg-color: #f5f5f5;
  --text-color: #333;
  --border-color: #ddd;
  --hover-color: #f0f0f0;
  --card-bg: #ffffff;
  --primary-color: #4CAF50;
  --danger-color: #f44336;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin: 0;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.add-todo {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.add-todo input {
  flex: 1;
  padding: 0.8rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.add-todo button {
  padding: 0.8rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters button {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.filters button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filters button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.dark-mode .filters button {
  background: var(--card-bg);
  color: #aaa;
  border-color: #444;
}

.dark-mode .filters button:hover {
  color: white;
  border-color: var(--primary-color);
}

.dark-mode .filters button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  font-weight: 500;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.todo-content input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
}

.completed span {
  text-decoration: line-through;
  color: #888;
}

.delete-btn {
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  padding: 0.5rem;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  opacity: 1;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  color: #666;
}

/* 修改亮色主题的一些颜色 */
.app {
  --bg-color: #f5f5f5;
  --text-color: #333;
  --border-color: #ddd;
  --card-bg: #ffffff;
}

/* 修改暗色主题的颜色 */
.dark-mode {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #333;
  --card-bg: #2c2c2c;
}

/* 修改按钮样式，确保图标可见 */
.add-todo button i,
.delete-btn i,
.theme-toggle i {
  color: inherit;
}

.add-todo button {
  background: var(--primary-color);
  color: white;
}

/* 添加选中项的样式 */
.todo-content input[type="checkbox"]:checked {
  accent-color: var(--primary-color);
}

/* 添加hover效果 */
.todo-list li:hover {
  background: var(--hover-color);
}
</style> 