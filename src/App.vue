<template>
  <div id="app" class="principal">
    {{titulo}}
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      titulo: "¡Hola, yo sí soy Vue.js!"
    }
  }
}
</script>

<style>
  .principal {
    border-color: #A851F1;
    border-style: solid;
    border-width: 10px;
    background-color: lightgray;
    width: 800px;
    border-radius: 3px;
    padding: 10px;
  }
</style>
