<template>
  <div id="app">
    <Bug_Report />
  </div>
</template>

<script>
import Bug_Report from './components/Bug_Report.vue'

export default {
  name: 'App',
  components: {
    Bug_Report: Bug_Report
  }
}
</script>

<style>
@font-face {
  font-family: "iranSans";
  src: url("@/fonts/iransans.ttf");
  font-weight: 100;
}

#app {
  font-family: iranSans;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
