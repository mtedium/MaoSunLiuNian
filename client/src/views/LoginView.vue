<template>
  <div class="login-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>{{ isLogin ? '用户登录' : '注册账号' }}</h2>
        <p>Mortise & Tenon Chronicles</p>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="form.username" required />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input type="password" v-model="form.password" required />
        </div>
        
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? '处理中...' : (isLogin ? '登 录' : '注 册') }}
        </button>
      </form>

      <div class="auth-footer">
        <span @click="toggleMode">{{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}</span>
      </div>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    </div>

    <!-- User Profile (Shown if logged in - simplified for demo, usually redirects) -->
    <div v-if="user" class="profile-card">
      <h3>欢迎, {{ user.username }}</h3>
      <p>您的收藏夹暂为空。</p>
      <button @click="logout" class="logout-btn">退出登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const isLogin = ref(true);
const loading = ref(false);
const errorMsg = ref('');
const user = ref(null);

const form = ref({
  username: '',
  password: ''
});

// Axios instance with base URL (assuming proxy is set up or direct call)
const api = axios.create({
  baseURL: '/api/auth'
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  errorMsg.value = '';
};

const handleSubmit = async () => {
  loading.value = true;
  errorMsg.value = '';
  
  try {
    const endpoint = isLogin.value ? '/login' : '/register';
    const res = await api.post(endpoint, form.value);
    
    if (isLogin.value) {
      // Login Success
      const { token, username, userId } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username, userId }));
      user.value = { username, userId };
    } else {
      // Register Success
      isLogin.value = true;
      alert('注册成功，请登录');
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.error || '请求失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  user.value = null;
};

// Check login status on mount
const storedUser = localStorage.getItem('user');
if (storedUser) {
  user.value = JSON.parse(storedUser);
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiBvcGFjaXR5PSIwLjEiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjAgMjBMMCAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==');
}

.auth-card, .profile-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.profile-card {
  position: absolute; /* Overlay for demo */
  z-index: 10;
}

.auth-header h2 {
  color: var(--color-lacquer, #2b333e);
  margin-bottom: 5px;
  font-family: 'Noto Serif SC', serif;
}

.auth-header p {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 30px;
}

.form-group {
  text-align: left;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: var(--color-cinnabar, #b13b2e);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #8a2a20;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 20px;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
}

.auth-footer span:hover {
  text-decoration: underline;
}

.error-msg {
  color: red;
  margin-top: 15px;
  font-size: 0.9rem;
}

.logout-btn {
  margin-top: 20px;
  padding: 8px 20px;
  background: #eee;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
