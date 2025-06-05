<template>
  <div class="container">
    <div class="logo-container">
      <img :src="logoSrc" alt="Logo Vision" class="logo" />
    </div>
    <div class="login-box">
      <h1>Login</h1>
      <div v-if="showPopup" class="popup">
        {{ popupMessage }}
      </div>
      <form class="form" @submit.prevent="handleLogin">
        <input type="text" v-model="username" placeholder="Usuário do Taiga" />
        <input type="password" v-model="password" placeholder="Senha do Taiga" />
        <button type="submit">Entrar</button>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import LogoVisionLoginImg from '@/assets/LogoVisionLoginImg.png';

export default defineComponent({
  name: 'TelaLogin',
  setup() {
    const showPopup = ref(false);
    const popupMessage = ref('');
    const username = ref('');
    const password = ref('');
    const logoSrc = LogoVisionLoginImg;
    const router = useRouter();
    const backendUrl = window.__APP_CONFIG__?.VITE_URL_BACKEND;

    const handleLogin = async () => {
      if (!username.value || !password.value) {
        popupMessage.value = 'Preencha todos os campos!';
        showPopup.value = true;

        setTimeout(() => {
          showPopup.value = false;
        }, 3000);
        return;
      }

      try {
        const response = await axios.post(`${backendUrl}/users/login`, null, {
          params: {
            username: username.value,
            password: password.value
          },
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const { token, role } = response.data;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username.value);
        localStorage.setItem('role', role);

        if (role === 'Product Owner') {
          router.push('/ResultadosDoAdmin');
        } else if (role === 'Stakeholder') {
          router.push('/ResultadosDoGestor');
        } else if (['UX', 'Back', 'Front', 'Design'].includes(role)) {
          router.push('/ResultadosDoOperador');
        } else {
          alert('Role não reconhecida: ' + role);
        }
      } catch (error) {
        console.error('Erro no login:', error);
        popupMessage.value = 'Usuário ou senha inválidos!';
        showPopup.value = true;
        setTimeout(() => {
          showPopup.value = false;
        }, 3000);
      }
    };

    return {
      username,
      password,
      handleLogin,
      logoSrc,
      showPopup,
      popupMessage,
    };
  },
});
</script>

<style scoped>
.container {
  width: 98vw;
  height: 97vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.logo {
  width: 25vw;
  margin-top: -14vw;
  margin-bottom: -10vh;
}

.logo-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.login-box {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 27%;
  height: 40%;
  max-width: 314px;
  max-height: 293px;
  text-align: center;
}

.login-box h1 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-box input {
  width: 92%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.login-box button {
  width: 100%;
  margin-top: 6%;
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

.container {
  width: 98vw;
  height: 97vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.logo {
  width: 25vw;
  margin-top: -14vw;
  margin-bottom: -10vh;
}

.login-box {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 27%;
  height: 40%;
  max-width: 314px;
  max-height: 293px;
  text-align: center;
}

.login-box h1 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.login-box input {
  width: 92%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.login-box button {
  width: 100%;
  margin-top: 6%;
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

.popup {
  background-color: #c51205;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

@media screen and (max-width: 768px) {
  .login-box {
    width: 66%;
    height: 50%;
  }

  .login-box input {
    width: 90%;
  }

  .login-box h1 {
    font-size: 1.2rem;
  }

  .logo {
    width: 50vw;
    margin-top: -14vw;
    margin-bottom: -10vh;
  }
}
</style>