<!--
<th>Day</th>
<th>Item Chance</th>
<th>Item Count</th>
<th>Happiness</th>
<th>Friendship</th>
<th>Hay Remaining</th>
<th>Autopetter</th>
-->
<template>
  <div class="h-fit">
    <span>{{ day.day }}</span>
    <span>{{ chance }}</span>
    <span>{{ total }}</span>
    <span>{{ day.happiness.toFixed(0) }}</span>
    <span>{{ day.friendship.toFixed(0) }}</span>
    <span>{{ day.hayRemaining }}</span>
    <span>
      <span v-if="autoPetterBehavior == 'place'">Place</span>
      <span v-if="autoPetterBehavior == 'remove'">Remove</span>
      <FontAwesomeIcon v-if="autoPetterBehavior == 'placed'" :icon="faCheck" />
      <FontAwesomeIcon v-if="autoPetterBehavior == 'removed'" :icon="faX" />
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Day } from '@/model/Day'
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed, type PropType } from 'vue'

const props = defineProps({
  day: {
    type: Object as PropType<Day>,
    required: true
  },
  nextDay: {
    type: Object as PropType<Day | undefined>,
    default: undefined
  }
})

type AutoPetterBehavior = 'place' | 'placed' | 'remove' | 'removed'

const autoPetterBehavior = computed<AutoPetterBehavior>(() => {
  if (props.nextDay) {
    if (!props.nextDay!.autoPetterPlaced && props.day.autoPetterPlaced) {
      return 'remove'
    }
    if (props.nextDay!.autoPetterPlaced && !props.day.autoPetterPlaced) {
      return 'place'
    }
  }

  return props.day.autoPetterPlaced ? 'placed' : 'removed'
})

const chance = computed(() => {
  return `${(props.day.itemChance * 100).toFixed(2)}%`
})
const total = computed(() => {
  return props.day.itemTotal.toFixed(1)
})
</script>
