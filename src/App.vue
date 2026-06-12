<template>
  <div class="h-screen w-screen absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex flex-col bg-purple-950">
    <main class="grow overflow-hidden p-5 pb-0 grid grid-cols-[2fr_1fr] grid-rows-1">
      <StrategyEditor @on-change="e => console.log(e)" />
    </main>

    <footer class="py-2 px-5 w-full text-xs text-white">
      Writen by
      <a href="https://www.github.com/Kr0nox"><FontAwesomeIcon :icon="faGithub" />Kronox</a>,
      <a href="https://github.com/Kr0nox/"
        ><FontAwesomeIcon :icon="faGithub" />Source Code</a
      >.  Many of the graphics used are owned by
      <a href="https://stardewvalleywiki.com/ConcernedApe">ConcernedApe</a> and imported from the
      <a href="https://stardewvalleywiki.com">Stardew Valley Wiki</a>.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import StrategyEditor from './components/StrategyEditor.vue';

</script>

<style scoped>
@reference "./style.css";

a {
  @apply text-blue-300 underline;
}

a:visited {
  @apply text-purple-300;
}
</style>
