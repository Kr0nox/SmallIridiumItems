<template>
  <ContainerComponent class="bg-white">
    <div ref="blockly" class="blockly-editor h-150 w-full"></div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from './ContainerComponent.vue';
import { onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import { inject, type WorkspaceSvg, serialization} from 'blockly'
import { registerBlocks } from '@/blocklyEditor/Blocks.ts';
import { parse } from '@/blocklyEditor/parse.ts';
import type { BlocklyJsonMock } from '@/blocklyEditor/outputMock.ts';

const emit = defineEmits(['onChange'])

const blocklyDiv = useTemplateRef('blockly')
let workspace: WorkspaceSvg | null = null

const toolbox = {
  kind: 'flyoutToolbox',
  contents: [
    // Actions
    { kind: 'block', type: 'place_autopetter' },
    { kind: 'block', type: 'remove_autopetter' },
    { kind: 'block', type: 'pet_manually' },
    { kind: 'block', type: 'add_hay' },
    { kind: 'block', type: 'take_profession' },
    { kind: 'block', type: 'remove_profession' },
    // Loops
    { kind: 'block', type: 'loop_repeat_n' },
    { kind: 'block', type: 'loop_until_items' },
  ],
}

onMounted(() => {
  if (!blocklyDiv.value) return

  registerBlocks()

  workspace = inject(blocklyDiv.value, {
    toolbox,
    scrollbars: true,
    trashcan: true,
  })
  workspace.addChangeListener(() => {
    const json = serialization.workspaces.save(workspace!) as BlocklyJsonMock
    emit('onChange', parse(json))
  })
})

onBeforeUnmount(() => {
  workspace?.dispose()
})
/*
// Call this to get the workspace state as JSON (for saving)
function getWorkspaceJson(): object {
  if (!workspace) return {}
  return Blockly.serialization.workspaces.save(workspace)
}

// Call this to restore a saved state
function loadWorkspaceJson(state: object) {
  if (!workspace) return
  Blockly.serialization.workspaces.load(state, workspace)
}

defineExpose({ getWorkspaceJson, loadWorkspaceJson })*/
</script>