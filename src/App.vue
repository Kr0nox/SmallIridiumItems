<template>
  <div
    class="absolute top-0 right-0 bottom-0 left-0 flex h-screen w-screen flex-col overflow-hidden bg-purple-950"
  >
    <main class="grid grow grid-cols-[1fr_1fr] grid-rows-[auto_1fr] gap-3 overflow-hidden p-5 pb-0">
      <StrategyEditor
        class="col-start-1 row-span-2 row-start-1"
        @on-change="(e) => (strategy = e)"
      />
      <ConfigContainer v-model="config" class="col-start-2 row-start-1" @run="run()" />
      <ResultContainer class="col-start-2 row-start-2" :results="results" />
    </main>

    <footer class="w-full px-5 py-2 text-xs text-white">
      Writen by
      <a href="https://www.github.com/Kr0nox"><FontAwesomeIcon :icon="faGithub" />Kronox</a>,
      <a href="https://github.com/Kr0nox/SmallIridiumItems/"
        ><FontAwesomeIcon :icon="faGithub" />Source Code</a
      >. Many of the graphics used are owned by
      <a href="https://stardewvalleywiki.com/ConcernedApe">ConcernedApe</a> and imported from the
      <a href="https://stardewvalleywiki.com">Stardew Valley Wiki</a>.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import StrategyEditor from './components/StrategyEditor.vue'
import ConfigContainer from './components/ConfigContainer.vue'
import { nextTick, ref } from 'vue'
import { evaluate, type Config } from './model/StrategyEvaluation.ts'
import ResultContainer from './components/ResultContainer.vue'
import type { Day } from './model/Day.ts'
import type { Node } from '@/model/StrategyLanguage.ts'

const strategy = ref<Node[]>([])
const config = ref<Config>({
  animalCount: 12,
  animalCrackers: true,
  animalType: 'Chicken',
  initialFriendship: 0,
  initialHappiness: 0
})
const results = ref<Day[] | undefined | Error>(undefined)

function run() {
  if (strategy.value.length != 1) return
  results.value = []
  nextTick(() => {
    try {
      results.value = evaluate(strategy.value[0], config.value)
    } catch (e) {
      results.value = e as Error
    }
  })
}
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
