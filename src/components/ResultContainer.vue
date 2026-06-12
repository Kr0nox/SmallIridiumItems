<template>
  <ContainerComponent>
    <div v-if="results" class="flex h-full max-h-full w-full flex-col text-sm">
      <div class="result-row h-fit border-b border-purple-300">
        <span>Day</span>
        <span>Item Chance</span>
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
    <div v-else>Loading</div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import type { Day } from '@/model/Day.ts'
import ContainerComponent from './ContainerComponent.vue'
import ResultRow from './ResultRow.vue'
import type { PropType } from 'vue'

defineProps({
  results: {
    type: Object as PropType<Array<Day> | undefined>,
    required: true
  }
})
</script>

<style>
@reference "../style.css";
.result-row {
  @apply flex;
}

.result-row span {
  @apply block h-6 max-h-6 grow-0 border-r border-purple-300 px-1;
}

.result-row span:last-child {
  @apply border-none;
}

.result-row span:nth-child(1) {
  @apply w-16;
}

.result-row span:nth-child(3),
.result-row span:nth-child(4),
.result-row span:nth-child(5),
.result-row span:nth-child(7) {
  @apply w-20;
}

.result-row span:nth-child(2) {
  @apply w-24;
}

.result-row span:nth-child(6) {
  @apply w-28;
}
</style>
