import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

async function bootstrap() {
  const config = await fetch('/config.json').then(res => res.json())

  window.__APP_CONFIG__ = config

  const app = createApp(App)
  app.use(router)
  app.mount('#app')
}

bootstrap()