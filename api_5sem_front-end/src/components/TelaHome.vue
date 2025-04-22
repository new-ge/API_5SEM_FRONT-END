<template>
  <div class="home-container">
    <h1>Bem-vindo</h1>
    <router-link to="/ResultadosDoOperador">
      <button class="btn-resultados">Operador</button>
    </router-link>
    <router-link to="/ResultadosDoGestor">
      <button class="btn-resultados">Gestor</button>
    </router-link>
    <router-link to="/ResultadosDoAdmin">
      <button class="btn-resultados">Administrador</button>
    </router-link>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: #f0f0f0;
  gap: 10px;
}

.btn-resultados {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  background-color: #3ab6ff;
  color: white;
  border: none;
  border-radius: 5px;
  transition: 0.3s;
  width: 150px;
}

.btn-resultados:hover {
  background-color: #007acc;
}
</style>
