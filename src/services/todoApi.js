import axios from 'axios'

// 改回本地开发地址
const API_BASE_URL = 'http://localhost:3000/api'

export const getTodos = async () => {
  const response = await axios.get(`${API_BASE_URL}/get-todo`)
  return response.data
}

export const addTodo = async (value) => {
  const response = await axios.post(`${API_BASE_URL}/add-todo`, { value })
  return response.data
}

export const updateTodo = async (id) => {
  const response = await axios.post(`${API_BASE_URL}/update-todo/${id}`)
  return response.data
}

export const deleteTodo = async (id) => {
  const response = await axios.post(`${API_BASE_URL}/del-todo/${id}`)
  return response.data
} 