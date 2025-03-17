<template>
  <div class="container">
    <aside class="sidebar">
      <div class="logo">
        <img src="/VisionLogo.ico" alt="Vision Logo" class="icon-logo">
      </div>
      <button class="sidebar-button">
        <img src="/Scores.ico" alt="Dashboard" class="icon">
      </button>
      <button class="sidebar-button logout">
        <img src="/LogoutBtn.ico" alt="Sair" class="icon">
      </button>
    </aside>

    <main class="content">
      <header class="header">
        <h1 class="title">Resultados</h1>
        <span class="user-role">Operador</span>
      </header>

      <div class="chart-container">
        <canvas id="resultChart"></canvas>
      </div>
    </main>
  </div>
</template>

<script>
//import { Chart, registerables } from 'chart.js';
//Chart.register(...registerables);

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
}

.sidebar {
  width: 80px;
  background: #ffffff;
  border: 2px solid #3ab6ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
  transition: width 0.3s ease;
  justify-content: space-between;
  height: 96vh;
}

.logo {
  margin-bottom: 20px;
}

.icon-logo {
  width: 82px;
  height: auto;
}

.sidebar-button {
  background: none;
  border: none;
  margin: 15px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-top: auto;
  margin-bottom: 0px;
}

.sidebar-button img {
  width: 40px;
  height: auto;
}

.logout {
  margin-top: auto;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 23px;
  font-weight: bold;
  color: #3ab6ff;
}

.chart-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
}
</style>
