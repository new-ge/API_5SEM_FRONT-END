import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { vitest } from 'vitest';

const app = createApp(App);
app.use(router);
app.use(vitest);
app.mount('#app');
