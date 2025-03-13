
<template>
  <div>
  <h1>Olá Mundo!</h1>
  <p> Olá, {{ cargo }}</p>
  </div>
</template>

<script>
  export default {
    name: 'TelaDashboardOperador',
    data() {
      return{
        cargo: "Operador"
      }
    }
  }
</script>
