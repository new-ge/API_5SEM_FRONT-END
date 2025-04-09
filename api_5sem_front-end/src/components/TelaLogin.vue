<template>
  <div class="login-container">
    <div class="logo-container">
      <img :src="logoSrc" alt="Logo Vision" class="logo" />
    </div>

    <div class="login-box">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <input type="text" v-model="username" placeholder="Usuário do Taiga" required />
        <input type="password" v-model="password" placeholder="Senha do Taiga" required />
        <button type="submit">Entrar</button>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import LogoVisionLoginImg from '@/assets/LogoVisionLoginImg.png';

export default defineComponent({
  name: 'TelaLogin',
  setup() {
    const username = ref('');
    const password = ref('');
    const logoSrc = LogoVisionLoginImg;

    const handleLogin = () => {
      console.log('Usuário:', username.value);
      console.log('Senha:', password.value);
    };

    return {
      username,
      password,
      handleLogin,
      logoSrc,
    };
  },
});
</script>

<style scoped>
.login-container {
  height: 96vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-container {
  margin-bottom: -10%;
  margin-top: -12%;
}

.logo {
  width: 100%;
  height: 100%;
  max-width: 100%;
  margin-bottom: -9%;
}

.login-box {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 5%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 20%;
  margin-bottom: 5%;
  text-align: center;
}

.login-box h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.login-box input {
  width: 93%;
  padding: 3%;
  margin-bottom: 5%;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
}

.login-box button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.login-box button:hover {
  background-color: #357ab8;
}
</style>
