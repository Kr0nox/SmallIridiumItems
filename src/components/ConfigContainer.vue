<template>
  <ContainerComponent>
    <div class="flex flex-col gap-2 p-1 text-sm">
      <div class="row">
        <span>
          <label>Animal Type:</label>
          <select v-model="model.animalType">
            <option value="Chicken" selected>Chicken</option>
            <option value="Cow">Cow</option>
            <option value="Goat">Goat</option>
          </select>
        </span>
        <span>
          <label>Animal Count:</label>
          <input v-model.number="model.animalCount" type="number" />
        </span>
        <span>
          <label>Animal Crackers:</label>
          <input v-model="model.animalCrackers" type="checkbox" />
        </span>
      </div>

      <div class="row">
        <span>
          <label>Initial Happiness:</label>
          <input v-model.number="model.initialHappiness" type="number" />
        </span>
        <span>
          <label>Initial Friendship:</label>
          <input v-model.number="model.initialFriendship" type="number" />
        </span>
        <span>
          <ButtonComponent class="px-2" @click="emit('run')"
            ><FontAwesomeIcon :icon="faPlay" /> Run</ButtonComponent
          >
        </span>
      </div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ButtonComponent from './ButtonComponent.vue'
import ContainerComponent from './ContainerComponent.vue'
import type { Config } from '@/model/StrategyEvaluation'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

const model = defineModel<Config>({
  required: true
})

const emit = defineEmits(['run'])
</script>

<style scoped>
@reference "../style.css";

.row {
  @apply flex justify-between;
}

.row input[type='number'] {
  @apply w-12;
}

.row input,
.row select {
  @apply rounded border border-purple-600 bg-purple-50 px-1;
}

.row span {
  @apply flex items-center gap-2;
}
</style>
