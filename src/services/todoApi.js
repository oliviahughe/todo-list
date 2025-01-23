import axios from 'axios'

// 使用相对路径，这样会自动使用当前域名
const API_BASE_URL = '/api'

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