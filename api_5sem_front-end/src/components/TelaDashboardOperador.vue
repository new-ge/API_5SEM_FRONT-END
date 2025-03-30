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
import axios from 'axios';

Chart.register(...registerables);

export default {
  setup() {
    const labels = ref([]);
    const data = ref([]);

    const labelsFinalizados = ref([]);
    const dataFinalizados = ref([]);

    const labelsCriados = ref([]);
    const dataCriados = ref([]);

    const labels2 = ref([]);
    const data2 = ref([]);

    const chartInstances = {};

    function renderChart(chartId, label, labels, data, type) {
      const canvas = document.getElementById(chartId);
      if (!canvas) {
        console.warn(`Canvas com ID '${chartId}' não encontrado.`);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error(`Erro ao obter contexto 2D para '${chartId}'.`);
        return;
      }

      if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
      }

      chartInstances[chartId] = new Chart(ctx, {
        type: type,
        data: {
          labels: labels,
          datasets: Array.isArray(data[0])
            ? [
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
              ]
            : [
                {
                  label: label,
                  data: data,
                  backgroundColor: type === 'bar' 
                    ? ['#004a6e', '#00779d', '#00b2cf'] 
                    : 'rgba(58, 182, 255, 0.2)',
                  borderColor: '#3ab6ff',
                  borderWidth: 2,
                  fill: type !== 'bar'
                }
              ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    const fetchData = async (url, labelsRef, dataRef, isMultiDataset = false) => {
      try {
        const response = await axios.get(url);     
        if (typeof response.data === 'number') {
          dataRef.value = [response.data];
        } else if (typeof response.data === 'object' && response.data !== null) {
          labelsRef.value = Object.keys(response.data);
          dataRef.value = isMultiDataset 
            ? dataRef.value = (Object.values(response.data).map(item => item.values)) 
            : dataRef.value = Object.values(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados de ${url}:", error);
      }
    };

    const fetchData2 = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tasks/count-tasks-by-tag/1641986/758714');
        labels.value = Object.keys(response.data);
        data.value = Object.values(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    onMounted(async () => {
      await Promise.all([
        fetchData2('http://localhost:8080/tasks/count-tasks-by-tag/1641986/758714', labels2, data2),
        fetchData('http://localhost:8080/tasks/count-tasks-by-status/1641986/758714', labels2, data2),
        fetchData('http://localhost:8080/tasks/count-by-labels', labels, data),
        fetchData('http://localhost:8080/tasks/count-cards-by-status-closed/758714/1641986', labelsFinalizados, dataFinalizados),
        fetchData('http://localhost:8080/tasks/tasks-per-sprint/758714/1641986', labelsCriados, dataCriados)
      ]);

      await nextTick();
      renderChart('cardsPorEtiqueta', 'Visualizar', labels.value, data.value, 'bar');
      renderChart('cardsFinalizados', 'Finalizados', labelsFinalizados.value, dataFinalizados.value, 'line');
      renderChart('cardsCriados', 'Criados', labelsCriados.value, dataCriados.value, 'line');
      renderChart('projetoAtual', 'Projeto Atual', labels2.value, data2.value, 'bar');
    });

    return { 
      labels, labels2, data, data2, 
      labelsFinalizados, dataFinalizados, 
      labelsCriados, dataCriados 
    };
  }
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
}

.container {
  display: flex;
  height: 96vh;
  width: 100%;
  background: white;
  overflow: hidden;
}

.sidebar {
  width: auto;
  background: #ffffff;
  border: 4px solid #E0E0EF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 97%;
  margin-left: -3px;
  margin-top: -3px;
}

.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3em;
}

.logo {
  margin-bottom: 20px;
  margin-top: 6px;
}

.icon-logo {
  width: 4em;
  height: 2em;
  margin-bottom: 10vh;
}

.sidebar-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-button img {
  width: 3em;
  height: 3em;
  margin-bottom: 14px;
}

.logout {
  margin-top: 14vh;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: auto;
  min-width: 38em;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  height: 7%;
  width: 98%;
  font-size: 25px;
  color: #3ab6ff;
  border: 4px solid #E0E0EF;
  margin-top: -3px;
  margin-left: -3px;
  margin-right: -4px;
}

.bk-charts {
  background: #8080801a;
  display: flex;
  flex-direction: row;
  height: 92%;
  width: 100%;
  gap: 4px;
}

.charts {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 5px;
  width: 100%;
  height: 97%;
}


.charts2 {
  display: flex;
  flex-direction: column;
  height: 95%;
  width: 91%;
  background: white;
  margin-top: 5px;
  margin-left: 3px;
  margin-right: 6px;
  border-radius: 10px;
  padding: 7px;
}

.chart-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 98%;
  height: 62%;
  min-width: 460px;
  background: white;
  border-radius: 10px;
  padding: 8px;
}

.chart-group2 {
  border-radius: 10px;
  width: 100%;
  height: 42%;
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
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 10px;
  padding: 2px;
}

.chart-box {
  background: white;
  border-radius: 10px;
  width: 100%;
  height: 100%;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: nowrap;
  width: 34em;
  height: 5em;
}

.card {
  display: flex;
  background: #3ab6ff;
  padding: 0px 25px;
  border-radius: 10px;
  text-align: center;
  color: white;
  font-weight: bold;
  width: 20%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
}

.card-value {
  font-size: 24px;
  margin-top: -8px;
}

.chart-container {
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64%;
  width: 99%;
  max-width: 800px;
}

.chart-container2 {
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 81%;
  width: 94%;
  margin-left: 3%;
}

.chart-container3 {
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 78%;
  width: 99%;
}

.titulos {
  width: 100%;
  min-width: 450px;
  margin-top: 0vh;
  margin-bottom: 0vh;
  border-bottom: 1px solid #E0E0EF;
}

.titulos2 {
  margin-top: 1vh;
  margin-bottom: 1vh;
  border-bottom: 1px solid #E0E0EF;
  margin-left: 1vh;
  margin-right: 0vh;
}

.titulos3 {
  width: 100%;
  margin-top: 0vh;
  margin-bottom: 0vh;
  border-bottom: 1px solid #E0E0EF;
}

* {
  max-width: 100vw;
  max-height: 100vh;
}
</style>