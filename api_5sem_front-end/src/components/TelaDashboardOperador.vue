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
      <header class="header-mobile">
      <div class="logo">
        <img src="/VisionLogo.ico" alt="Vision Logo" class="icon-logo">
      </div>
      <button class="btn-menu" @click="toggleMenu" id="btn-menu">
        <span class="linha"></span>
        <span class="linha"></span>
        <span class="linha"></span>
      </button>        
        <span class="user-role">Operador</span>
      </header>
      <div class="menu-mobile" v-show="menuAberto">
        <nav>
          <button class="btn-close" @click="toggleMenu">X</button>
          <a href="#">Exportar</a>
          <router-link to="/" class="logout-link">Logout</router-link>
        </nav>
      </div>
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
        <div class="charts1">
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
          <div class="chart-group4">
            <div class="chart-box2">
              <div class="titulos2">Retrabalhos</div>
              <div class="chart-container2">
                <canvas id="Retrabalhos"></canvas>
              </div>
            </div>
            <div class="chart-box2">
              <p class="titulos2">Tempo Médio de Execução</p>
              <div class="chart-container2">
                <canvas id="TempoMedio"></canvas>
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
import axios from 'axios';

Chart.register(...registerables);

export default {
  setup() {

    const menuAberto = ref(false)

    function toggleMenu() {
      menuAberto.value = !menuAberto.value
    }
    
    const labels = ref([]);
    const data = ref([]);

    const labelsFinalizados = ref([]);
    const dataFinalizados = ref([]);

    const labelsCriados = ref([]);
    const dataCriados = ref([]);  

    const labels2 = ref([]);
    const data2 = ref([]);

    const labelsRetrabalhos = ref([]);
    const dataRetrabalhos = ref([]);

    const labelsTempoMedio = ref(['tasks','teste','teste2','teste3']);
    const dataTempoMedio = ref([9, 3, 2, 5]);

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
                  : ['#00b2cf', '#004a6e'],
                }
              ]
        },
        options: {
          indexAxis: chartId === 'TempoMedio' ? 'y' : 'x',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y:{
              barPercentage: 1,
              categoryPercentage: 1
            }
          }
        }
      });
    }

    const fetchData = async (url, labelsRef, dataRef, transformFunction = null, groupByKey = null) => {
      try {
        const response = await axios.get(url);
        const data = response.data;

        if (transformFunction && typeof transformFunction === 'function') {
          const { labels, dataPoints } = transformFunction(data);
          labelsRef.value = labels;
          dataRef.value = dataPoints;
        } else if (Array.isArray(data)) {
          const groupedCounts = {};

          const keyToGroup = groupByKey ?? (
            'statusName' in data[0] ? 'statusName' :
            'milestoneName' in data[0] ? 'milestoneName' :
            'projectName' in data[0] ? 'projectName' :
            'userName' in data[0] ? 'userName' :
            (data.length >= 2 &&
              'rework' in data[data.length - 1] &&
              'finished' in data[data.length - 2]) ? 'rework-finished' :
              null
          );

          if (keyToGroup) {
            if (keyToGroup === 'rework-finished') {
              let reworkTotal = 0;
              let finishedTotal = 0;

              data.forEach(item => {
                reworkTotal += item.rework ?? 0;
                finishedTotal += item.finished ?? 0;
              });

              groupedCounts['Retrabalho'] = reworkTotal;
              groupedCounts['Concluidas'] = finishedTotal;

              labelsRef.value = ['Retrabalho', 'Concluidas'];
              dataRef.value = [groupedCounts['Retrabalho'], groupedCounts['Concluidas']];
            } else {
              data.forEach(item => {
                const key = item[keyToGroup];
                if (key != null) {
                  const quant = item.quant ?? 0;
                  groupedCounts[key] = (groupedCounts[key] || 0) + quant;
                }
              });

              labelsRef.value = Object.keys(groupedCounts);
              dataRef.value = Object.values(groupedCounts);
            }
          } else {
            labelsRef.value = [];
            dataRef.value = [];
          }
        } else if (typeof data === 'object' && data !== null) {
          const key = groupByKey && groupByKey in data ? data[groupByKey] : null;
          const quant = data.quant ?? 0;

          if (key) {
            labelsRef.value = [key];
            dataRef.value = [quant];
          }
        } else if (typeof data === 'number') {
          dataRef.value = [data];
        }
      } catch (error) {
        console.error(`Erro ao buscar dados de ${url}:`, error);
      }
    };

    onMounted(async () => {
      await axios.get('http://localhost:8080/tasks/sync-all-process'),
      await Promise.all([
        fetchData('http://localhost:8080/tasks/count-tasks-by-tag', labels, data, null, 'tagName'),
        fetchData('http://localhost:8080/tasks/count-tasks-by-status', labels2, data2, null, 'statusName'),
        fetchData('http://localhost:8080/tasks/count-rework', labelsRetrabalhos, dataRetrabalhos, null, 'rework-finished'),
        fetchData('http://localhost:8080/tasks/tasks-per-sprint', labelsCriados, dataCriados, null, 'milestoneName'),
        fetchData('http://localhost:8080/tasks/count-cards-by-status-closed', labelsFinalizados, dataFinalizados, null, 'milestoneName')
      ]),
      await nextTick(); 
      renderChart('cardsPorEtiqueta', 'Visualizar', labels.value, data.value, 'bar');
      renderChart('cardsFinalizados', 'Finalizados', labelsFinalizados.value, dataFinalizados.value, 'line');
      renderChart('cardsCriados', 'Criados', labelsCriados.value, dataCriados.value, 'line');
      renderChart('projetoAtual', 'Projeto Atual', labels2.value, data2.value, 'bar');
      renderChart('Retrabalhos', 'Entregas', labelsRetrabalhos.value, dataRetrabalhos.value, 'pie');
      renderChart('TempoMedio', 'Tempo em Horas', labelsTempoMedio.value, dataTempoMedio.value, 'bar');
    });
    return {
      menuAberto, toggleMenu,
      labels, labels2, data, data2, labelsTempoMedio, dataTempoMedio,
      labelsFinalizados, dataFinalizados, 
      labelsCriados, dataCriados,
      labelsRetrabalhos, dataRetrabalhos,
      fetchData
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

.header-mobile {
  display: none;
}

.bk-charts {
  background: #8080801a;
  display: flex;
  flex-direction: row;
  height: 93%;
  width: 100%;
}

.charts {
  display: flex;
  flex-direction: column;
  padding: 5px;
  width: 50%;
  height: 100%;
  gap: 1%;
}

.charts1{
  width: 49%;
  height: 98%;
  padding: 6px;
  display: flex;
  flex-direction: column;
}

.charts2 {
  display: flex;
  flex-direction: column;
  height: 49%;
  width: 98%;
  background: white;
  border-radius: 10px;
  padding: 1%;
}

.chart-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 98%;
  height: 48%;
  min-width: 460px;
  background: white;
  border-radius: 10px;
  padding: 1%;
}

.chart-group2 {
  border-radius: 10px;
  width: 100%;
  height: 47%;
  margin-top: 1px;
  display: flex;
  flex-direction: row;
  gap: 1vh;
}

#cardsFinalizados {
  width: 95% !important;
  height: 100% !important;
}

#cardsCriados {
  width: 95% !important;
  height: 100% !important;
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

.chart-group4{
  border-radius: 10px;
  width: 100%;
  height: 48%;
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  gap: 1vh;
}

#projetoAtual {
  width: 95% !important;
  height: 100% !important;
}

.chart-box {
  background: white;
  border-radius: 10px;
  width: 100%;
  height: 100%;
}

.chart-box2 {
  background: white;
  border-radius: 10px;
  width: 50%;
  height: 100%;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: nowrap;
  width: 99%;
  height: 25%;
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
  height: 60%;
  width: 99%;
}

#cardsPorEtiqueta {
  width: 95% !important;
  height: 100% !important;
}

.chart-container2 {
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85%;
  width: 94%;
  margin-left: 3%;
}

.chart-container3 {
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(255, 42, 42, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;
  width: 99%;
}

.card{
  height: 100%;
  background: #00779d;
  width: 20%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
}

.titulos {
  width: 100%;
  min-width: 450px;
  margin-top: 0vh;
  margin-bottom: 0vh;
  border-bottom: 1px solid #E0E0EF;
  color: black
}

.titulos2 {
  margin-top: 1vh;
  margin-bottom: 1vh;
  border-bottom: 1px solid #E0E0EF;
  margin-left: 1vh;
  margin-right: 0vh;
  color: black
}

.titulos3 {
  width: 100%;
  margin-top: 0vh;
  margin-bottom: 0vh;
  border-bottom: 1px solid #E0E0EF;
  color: black
}

p {
  color: white;
}

* {
  max-width: 100vw;
  max-height: 100vh;
}

@media screen and (max-width: 768px) {

  .sidebar, .filters, .header{
    display: none;
  }

  .icon-logo {
    width: 6em;
}

  .header-mobile {    
    display: flex;
    flex-direction: row;
    width: 66%;
    height: 7%;
    justify-content: space-between;
  }

  #btn-menu {
    width: 30px;
    height: 30px;
    border: 2px solid #3ab6ff;
    border-radius: 7px;
    background: transparent;
    display: flex;
    margin-top: 7px;
    flex-direction: column;
    justify-content: center;
  }

  .linha {
    width: 15px;
    height: 2px;
    background-color: #3ab6ff;
    display: block;
    margin: 3px auto;
    position: relative;
    transform-origin: center;
  }

  .user-role {
    font-size: 18px;
    color: #3ab6ff;
    margin-right: 10px;
    display: flex;
    align-items: center;  
  }

  .title {
    display: none;
  }

  .bk-charts {
    flex-direction: column;
    height: 100%;
    width: 68%;
    overflow-y: auto;
  }

  .charts {
    width: 98%;
    display: flex;
    flex-direction: column;
  }

  .chart-group {
    width: 76%;
    min-width: 98%;
  }

  .titulos {
    min-width: 0px;
  }
  .cards-container {
    display: flex;
    justify-content: center;
    gap: 4px;
    flex-wrap: nowrap;
    width: 99%;
    height: 25%;
    font-size: 10px;
  }

  .card {
    width: 21%;
    display: flex;
    justify-content: space-around;
  }

  .chart-group2 {
    height: 49%;
  }

  .chart-container2 {
    height: 82%;
  }

  .chart-container3 {
    height: 58%;
  }

  .charts1 {
    width: 98%;
  }

  .charts2 {
    height: 50%;
    width: 98%;
  }

  .chart-group4 {
    width: 100%;
  }

  .chart-box2 {
    font-size: 15px;
  }

  .menu-mobile {
    background-color: #056dff47;
    backdrop-filter: blur(8px);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 45%;
    border-radius: 5px;
  }

  .menu-mobile nav a{
    color: #fff;
    text-decoration: none;
    display: block;
    padding: 50px 25px;
    font-size: 20pt;
  }

  .menu-mobile nav a:hover{
    background-color: #056dff8f;
    border-radius: 5px;
  }

  .btn-close{
    background-color: #00000000;
    color: #fff;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 5px;
    margin-left: 85%;
    margin-top: 2%;
  }

}
</style>