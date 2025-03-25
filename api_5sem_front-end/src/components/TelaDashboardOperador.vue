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
        <div class="charts2">
          <div class="chart-group3">
          <p class="titulos3">Projeto Atual</p>
            <div class="cards-container">
              <div class="card" v-for="(label2, index) in labels2" :key="index">
                <p>{{ label2 }}</p>
                <p class="card-value">{{ data2[index] }}</p>
              </div>
            </div>
            <div class="chart-container3">
              <canvas id="projetoAtual"></canvas>
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

    const labelsFinalizados = ref(['Sprint 1', 'Sprint 2', 'Sprint 3']);
    const dataPlanejado = ref([5, 10, 7]);
    const dataRealizado = ref([2, 6, 12]);

    const labelsCriados = ref(['Sprint 1', 'Sprint 2', 'Sprint 3']);
    const dataCriados = ref([2, 8, 12]);

    const labels2 = ref(['To do', 'In progress', 'Done']);
    const data2 = ref([2, 9, 5]);

    const chartInstances = {};

    onMounted(async () => {
      await nextTick();
      renderChart('cardsPorEtiqueta', 'Etiquetas', labels.value, data.value, 'bar');
      renderChart(
        'cardsFinalizados', 
        '', 
        labelsFinalizados.value, 
        [dataPlanejado.value, dataRealizado.value],
        'line'
      );
      renderChart('cardsCriados', 'Criados', labelsCriados.value, dataCriados.value, 'line');
      renderChart('projetoAtual', 'Visualizar', labels2.value, data2.value, 'bar');
    });

    function renderChart(chartId, label, labels, data, type) {
      const canvas = document.getElementById(chartId);
      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
      }

      chartInstances[chartId] = new Chart(ctx, {
        type: type,
        data: {
          labels: labels,
          datasets: Array.isArray(data[0]) ? 
            [
              {
                label: `${label} - Planejado`,
                data: data[0],
                borderColor: '#004a6e',
                borderWidth: 2,
                fill: false
              },
              {
                label: `${label} - Realizado`,
                data: data[1],
                borderColor: '#FF5733',
                borderWidth: 2,
                fill: false
              }
            ] : 
            [{
              label: label,
              data: data,
              backgroundColor: type === 'bar' 
                ? ['#004a6e', '#00779d', '#00b2cf']
                : 'rgba(58, 182, 255, 0.2)',
              borderColor: '#3ab6ff',
              borderWidth: 2,
              fill: type !== 'bar'
            }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    return { 
      labels, labels2, data, data2, 
      labelsFinalizados, dataPlanejado, dataRealizado, 
      labelsCriados, dataCriados 
    };
  }
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100em;
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
  width: 5em;
  background: #ffffff;
  border: 4px solid #E0E0EF;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em 0em;
  justify-content: space-between;
  min-height: 97%;
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
    width: 4em;
    height: 6em;
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
  height: 63em;
  min-width: 38em;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  height: 2em;
  font-size: 25px;
  color: #3ab6ff;
  border: 4px solid #E0E0EF;
  margin-top: -3px;
  margin-left: -3px;
  margin-right: -4px;
}

.bk-charts{
  background: #8080801a;
  display: flex;
  flex-direction: row;
  height: 59em;
  width: 117em;
  gap: 5px;
}

.charts {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 11px;
}

.charts2 {
  display: flex;
  flex-direction: column;
  height: 57em;
  width: 56em;
  min-width: 500px;
  background: white;
  margin-top: 1vh;
  border-radius: 10px;
}

.chart-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 57em;
  min-width: 460px;
  background: white;
  border-radius: 10px;
  padding: 8px;
}

.chart-group2 {
  border-radius: 10px;
  width: 58em;
  height: 24em;
  margin-top: 1px;
  display: flex;
  flex-direction: row;
  gap: 1vh;
}

.chart-group3 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 55em;
  min-width: 460px;
  background: white;
  border-radius: 10px;
  padding: 8px;
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
  width: 45em;
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
  height: 20em;
  width: 0em;
  min-width: 27em;
  margin-left: 3%;
}

.chart-container3 {
  background: #f9f9f9;
  padding: 19px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 43em;
  width: 52em;
}

.titulos {
  width: 57em;
  min-width: 450px;
  margin-top: 0vh;
  margin-bottom: 0vh;
  border-bottom: 1px solid #E0E0EF;
}

.titulos2 {
  min-width: 29em;
  margin-top: 1vh;
  margin-bottom: 1vh;
  border-bottom: 1px solid #E0E0EF;
  margin-left: 1vh;
  margin-right: 0vh;
}

.titulos3 {
  width: 55em;
  min-width: 450px;
  margin-top: 0vh;
  margin-bottom: 0vh;
  border-bottom: 1px solid #E0E0EF;
}

* {
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
}
</style>
