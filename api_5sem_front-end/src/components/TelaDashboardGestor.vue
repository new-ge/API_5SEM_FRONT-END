<template>
  <div class="container">
    <aside class="sidebar">
      <div class="logo">
        <img src="/VisionLogo.ico" alt="Vision Logo" class="icon-logo">
      </div>
      <div class="buttons-container">
        <button class="sidebar-button">
          <router-link to="/Home">
            <img src="/homeLogo.ico" alt="Dashboard" class="icon">
          </router-link>  
        </button>
        <button class="sidebar-button">
          <img src="/scoreLogo.ico" alt="Dashboard" class="icon">
        </button>
        <button class="sidebar-button">
          <img src="/workLogo.ico" alt="Dashboard" class="icon">
        </button>
      </div>
      <router-link to="/TelaDeLogin">
      <button class="sidebar-button logout">
        <img src="/logoutLogo.ico" alt="Sair" class="icon">
      </button>
      </router-link>
    </aside>
    <main class="content">
      <header class="header">
        <p class="title">Resultados</p>
        
        <div class="filters">
            <select v-model="selectedProject" @change="onProjectChange">
              <option disabled value="">Selecione um Projeto</option>
              <option v-for="project in projectList" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
            <select  v-model="selectedOperator">
              <option disabled value="">Selecione um Operador</option>
              <option v-for="operator in operatorList" :key= "operator.id" :value="operator.id">
                {{ operator.name }}
              </option>
            </select>
            <select v-model="selectedSprint">
              <option disabled value="">Selecione uma Sprint</option>
              <option v-for="sprint in sprintList" :key="sprint.id" :value="sprint.name">
                {{ sprint.name }}
              </option>
            </select>
        </div>
        <span class="user-role">Gestor</span>
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
    
    const labels = ref([]);
    const data = ref([]);

    const labelsFinalizados = ref([]);
    const dataFinalizados = ref([]);

    const labelsCriados = ref([]);
    const dataCriados = ref([]);  

    const labels2 = ref([]);
    const data2 = ref([]);

    const labelsRetrabalhos = ref(['Retrabalhos', 'Entregas']);
    const dataRetrabalhos = ref([10, 45]);

    const labelsTempoMedio = ref(['tasks','teste','teste2','teste3']);
    const dataTempoMedio = ref([9, 3, 2, 5]);

    const chartInstances = {};
    const selectedProject = ref('');
    const selectedOperator = ref('');
    const selectedSprint = ref('');

    const projectList = ref ([]);
    const operatorList = ref ([]);
    const sprintList = ref ([]);

    const userId = 758714; // Substituir pelo ID real que você tiver

    const fetchProjects = async () => {
      const res = await axios.get(`http://localhost:8080/projects/get-all-projects/${userId}`);
      projectList.value = res.data;
    }

    const fetchOperators = async (projectId) => {
      const res = await axios.get(`http://localhost:8080/users/users-and-tasks/project/${projectId}`);
      operatorList.value = res.data.map(op => ({
        id: op.user.userCode,
        name: op.user.userName
      }));
    }

  const fetchSprints = async (projectId) => {
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ1NjQ3MTY2LCJqdGkiOiIwNmZhMzRmZWYyOTg0YmQ4OTJhMGExNDhhYmYyMWVjMCIsInVzZXJfaWQiOjc1ODcxNH0.fSVoDQAkgl683EbvwiUJVCaWXvjtxoYWm-QcKhADRUuN_YAalnGbjjJDsuRbtydcQUyPnIWxCYX4yVkASVHeH5Do3sFrdutrfyjzJ0hkazFICAzZpvgtN4Rk_rBZR3IwFMPQWD7zpZoO_0GkH2J90xq5Py9q9L0ZYq52J3PFFhgXtxS5Az3ijTGFi1MfjSqXixhehlEPco5CDzHRHqvsvMaey0bw8oJQSqkK9gSBEc7Qs1379uHchzajIQGQWNiovrrS3wqOSjZhX4zgOEgxaIIef4JExJ-YBBlYOputNJJkIkOJIyV0Ty6jUO0iIfejDxe49Kg5wr6GKdvxaWqWXg'; // ou localStorage.getItem('token'), etc.
    //alterar aqui - verificar o token e colocar outro se necessário para testar.
    const res = await axios.get(`https://api.taiga.io/api/v1/milestones?project=${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    sprintList.value = res.data.map(s => ({
      id: s.id,
      name: s.name
    }));
  }
    const onProjectChange = async () => {
      await Promise.all([
        fetchOperators(selectedProject.value),
        fetchSprints(selectedProject.value)
      ]);
    };

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

    const fetchData = async (url, labelsRef, dataRef, isMultiDataset = false) => {
      try {
        const response = await axios.get(url,{
          params:{
            projeto: selectedProject.value,
            operador: selectedOperator.value,
            sprint: selectedSprint.value
          }
        });     
        if (typeof response.data === 'number') {
          dataRef.value = [response.data];
        } else if (typeof response.data === 'object' && response.data !== null) {
          labelsRef.value = Object.keys(response.data);
          dataRef.value = isMultiDataset 
            ? Object.values(response.data).map(item => item.values) 
            : Object.values(response.data);
        }
      } catch (error) {
        console.error(`Erro ao buscar dados de ${url}:`, error);
      }
    };

    onMounted(async () => {
      await fetchProjects();
      await Promise.all([
      fetchData('http://localhost:8080/tasks/tempo-medio', labelsTempoMedio, dataTempoMedio),
        fetchData('http://localhost:8080/tasks/count-tasks-by-status', labels2, data2),
        fetchData('http://localhost:8080/tasks/count-tasks-by-tag', labels, data),
        fetchData('http://localhost:8080/tasks/count-cards-by-status-closed', labelsFinalizados, dataFinalizados),
        fetchData('http://localhost:8080/tasks/tasks-per-sprint', labelsCriados, dataCriados)
      ]);

      await nextTick(); 
      renderChart('cardsPorEtiqueta', 'Visualizar', labels.value, data.value, 'bar');
      renderChart('cardsFinalizados', 'Finalizados', labelsFinalizados.value, dataFinalizados.value, 'line');
      renderChart('cardsCriados', 'Criados', labelsCriados.value, dataCriados.value, 'line');
      renderChart('projetoAtual', 'Projeto Atual', labels2.value, data2.value, 'bar');
      renderChart('Retrabalhos', 'Entregas', labelsRetrabalhos.value, dataRetrabalhos.value, 'pie');
      renderChart('TempoMedio', 'Tempo em Horas', labelsTempoMedio.value, dataTempoMedio.value, 'bar');
    });

    return {
      labels, labels2, data, data2, labelsTempoMedio, dataTempoMedio,
      labelsFinalizados, dataFinalizados, 
      labelsCriados, dataCriados,
      labelsRetrabalhos, dataRetrabalhos,
      selectedProject, selectedOperator, selectedSprint, 
      projectList, operatorList, sprintList,
      onProjectChange
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
  background-color: #ffffff; /* Fundo branco */
  filter: brightness(1.1) contrast(1.2); /* Filtro aplicado no header */

}
.filters select{
  border:2px solid #00779d;
  border-radius: 5px;
  padding: 8px;
  background-color: #f9f9f9;
  transition: filter 0.3s ease-in-out;
}
.filters select:hover {
  filter: brightness(1.2) contrast(1.3); /* Filtro para quando o select for hover */
}

.filters {
  display: flex;
  gap: 15px;
}

.user-role {
  font-size: 18px;
  color: #3ab6ff;
  margin-left: 15px;
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
</style>