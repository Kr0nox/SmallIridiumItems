<template>
  <ContainerComponent>
    <div v-if="results === undefined">No Results yet</div>
    <div v-else-if="results instanceof Error">{{ results.message }}</div>
    <div v-else-if="resultArray(results)" class="flex h-full max-h-full w-full flex-col text-sm">
      <div class="result-row h-fit border-b border-purple-300">
        <span>Day ({{ results.length }} total)</span>
        <span>Item Chance (avg: {{ (averageChance * 100).toFixed(2) }}%)</span>
        <span>Item Count</span>
        <span>Happiness</span>
        <span>Friendship</span>
        <span>Hay Remaining</span>
        <span>Autopetter</span>
      </div>

      <div class="grow overflow-auto">
        <ResultRow
          v-for="i in results.length"
          :key="i"
          :day="results[i - 1]"
          :next-day="results[i]"
          class="result-row"
        />
      </div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import type { Day } from '@/model/Day.ts'
import ContainerComponent from './ContainerComponent.vue'
import ResultRow from './ResultRow.vue'
import { computed, type PropType } from 'vue'

const props = defineProps({
  results: {
    type: Object as PropType<Array<Day> | undefined | Error>,
    required: true
  }
})

function resultArray(a: Array<Day> | undefined | Error): a is Array<Day> {
  return a !== undefined && !(a instanceof Error)
}

const averageChance = computed(() => {
  if (!resultArray(props.results)) return 0
  const sum = props.results.map((d) => d.itemChance).reduce((a, b) => a + b, 0)
  return sum / props.results.length
})
</script>

<style>
@reference "../style.css";
.result-row {
  @apply flex;
}

.result-row span {
  @apply block grow-0 border-r border-purple-300 px-1;
}

.result-row span:last-child {
  @apply border-none;
}

.result-row span:nth-child(1) {
  @apply w-32 min-w-32;
}

.result-row span:nth-child(3),
.result-row span:nth-child(4),
.result-row span:nth-child(5),
.result-row span:nth-child(7) {
  @apply w-20 min-w-20;
}

.result-row span:nth-child(2) {
  @apply w-46;
}

.result-row span:nth-child(6) {
  @apply w-28;
}
</style>
