<template>
  <div class="container">
    <aside class="sidebar">
      <div class="logo">
        <img src="/VisionLogo.ico" alt="Vision Logo" class="icon-logo">
      </div>
      <div class="buttons-container">
        <button class="sidebar-button">
          <img src="/homeLogo.ico" alt="Dashboard" class="icon">
        </button>
        <button class="sidebar-button">
          <img src="/scoreLogo.ico" alt="Dashboard" class="icon">
        </button>
        <button class="sidebar-button">
          <img src="/workLogo.ico" alt="Dashboard" class="icon">
        </button>
      </div>
      <router-link to="/">
      <button class="sidebar-button logout">
        <img src="/logoutLogo.ico" alt="Sair" class="icon">
      </button>
      </router-link>
    </aside>
    <main class="content">
      <header class="header">
        <p class="title">Resultados</p>
        <span class="user-role">Operador</span>
      </header>
      <div class="bk-charts">
        <div class="charts">
          <div class="chart-group">
          <p class="titulos">Cards por Etiqueta</p>
            <div class="cards-container">
              <div class="card" v-for="(label, index) in labels" :key="index">
                <p>{{ label }}</p>
                <p class="card-value">{{ data[index] }}</p>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="cardsPorEtiqueta"></canvas>
            </div>
          </div>
          <div class="chart-group2">
            <div class="chart-box">
              <p class="titulos2">Cards Finalizados</p>
              <div class="chart-container2">
                <canvas id="cardsFinalizados"></canvas>
              </div>
            </div>
            <div class="chart-box">
              <p class="titulos2">Cards Criados</p>
              <div class="chart-container2">
                <canvas id="cardsCriados"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import { onMounted, ref, nextTick } from 'vue';

Chart.register(...registerables);

export default {
  setup() {
    const labels = ref(['Etiqueta 1', 'Etiqueta 2', 'Etiqueta 3']);
    const data = ref([3, 1, 10]);
    
    const labelsFinalizados = ref(['Sprint1', 'Sprint2', 'Sprint3']);
    const dataFinalizados = ref([5, 10, 7]);

    const labelsCriados = ref(['Jan', 'Fev', 'Mar']);
    const dataCriados = ref([2, 8, 12]);

    onMounted(async () => {
      await nextTick(); // Garante que os elementos <canvas> estão disponíveis no DOM
      
      renderChart('cardsPorEtiqueta', 'Etiquetas', labels.value, data.value, 'bar');
      renderChart('cardsFinalizados', 'Finalizados', labelsFinalizados.value, dataFinalizados.value, 'line');
      renderChart('cardsCriados', 'Criados', labelsCriados.value, dataCriados.value, 'line');
    });

    function renderChart(chartId, label, labels, data, type) {
      const ctx = document.getElementById(chartId);
      if (!ctx) return;
      
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels,
          datasets: [{
            label: label,
            data: data,
            backgroundColor: type === 'bar' ? ['#1E90FF', '#6495ED', '#87CEFA'] : 'rgba(58, 182, 255, 0.2)',
            borderColor: '#3ab6ff',
            borderWidth: 2,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    return { labels, data, labelsFinalizados, dataFinalizados, labelsCriados, dataCriados };
  }
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.container {
  display: flex;
  height: 98vh;
  background: white;
  overflow: hidden;
  min-width: 1000px;
}

.sidebar {
  width: 85px;
  background: #ffffff;
  border: 4px solid #E0E0EF;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 2px;
  justify-content: space-between;
  height: 95vh;
  min-height: 700px;
  margin-left: -3px;
  margin-top: -3px;
}

.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 65px;
}

.logo {
  margin-bottom: 20px;
}

.icon-logo {
  width: 82px;
  height: 3vh;
  margin-bottom: 10vh;
}

.sidebar-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
}

.sidebar-button img {
  width: 40px;
  height: auto;
}

.logout {
  margin-top: 14vh;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  min-width: 900px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  height: 6vh;
  font-size: 25px;
  color: #3ab6ff;
  border: 4px solid #E0E0EF;
  margin-top: -3px;
  margin-left: -3px;
  margin-right: -4px;
}

.bk-charts{
  background: #8080801a
}

.charts {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  height: 90vh;
  width: 50%;
  min-width: 500px;
}

.chart-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 98%;
  min-width: 460px;
  background: white;
  border-radius: 10px;
  padding: 10px
}

.chart-group2 {
  border-radius: 10px;
  width: 100%;
  height: 40%;
  margin-top: -1vh;
  display: flex;
  flex-direction: row;
  gap: 1%;
}

.chart-box {
  background: white;
  border-radius: 10px;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: nowrap;
  width: 85%;
}

.card {
  background: #3ab6ff;
  padding: 10px 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
  font-weight: bold;
  min-width: 100px;
  width: 28%;
}

.card-value {
  font-size: 24px;
  margin-top: 5px;
}

.chart-container {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 29vh;
  width: 95%;
  min-width: 430px;
}

.chart-container2 {
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
  width: 94%;
  min-width: 430px;
  margin-left: 3%;
}

.titulos {
  width: 98%;
  min-width: 450px;
  margin-top: 0vh;
  margin-bottom: 0vh;
  border-bottom: 1px solid #E0E0EF;
}

.titulos2 {
  width: 98%;
  min-width: 450px;
  margin-top: 1vh;
  margin-bottom: 1vh;
  border-bottom: 1px solid #E0E0EF;
  margin-left: 1vh;
  margin-right: 0vh;
}

* {
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
}
</style>
