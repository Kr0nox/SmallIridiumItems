<template>
  <ContainerComponent class="bg-white">
    <div class="flex h-full w-full flex-col gap-2">
      <div class="flex gap-5 text-sm">
        <ButtonComponent @click="saveFile()">
          <FontAwesomeIcon :icon="faFloppyDisk" /> Save to File
        </ButtonComponent>

        <ButtonComponent @click="loadFile()">
          <FontAwesomeIcon :icon="faFolderOpen" /> Load File
        </ButtonComponent>

        <div
          class="group relative box-border w-28 rounded-md border-2 border-purple-600 bg-purple-200 hover:rounded-b-none hover:border-b-0"
        >
          <div class="px-1 py-0.5"><FontAwesomeIcon :icon="faPaste" /> Load Preset</div>

          <div
            class="absolute -right-0.5 -left-0.5 z-10 hidden flex-col gap-1 rounded-b-md border-2 border-t-0 border-purple-600 bg-purple-200 group-hover:flex"
          >
            <div
              v-for="p in Object.keys(presets)"
              :key="p"
              class="cursor-pointer pl-2 whitespace-nowrap"
              @click="loadPreset(p)"
            >
              {{ p }}
            </div>
          </div>
        </div>
      </div>
      <div ref="blocklyHolder" class="grow">
        <div ref="blockly" class="blockly-editor w-full" :style="{ height: height }"></div>
      </div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from './ContainerComponent.vue'
import { onMounted, onBeforeUnmount, useTemplateRef, ref, nextTick } from 'vue'
import { inject, type WorkspaceSvg, serialization } from 'blockly'
import { registerBlocks } from '@/blocklyEditor/Blocks.ts'
import { parse } from '@/blocklyEditor/parse.ts'
import type { BlocklyJsonMock } from '@/blocklyEditor/outputMock.ts'
import ButtonComponent from './ButtonComponent.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFloppyDisk, faFolderOpen, faPaste } from '@fortawesome/free-solid-svg-icons'
import replace7Strategy from '@/presets/replace7.json'
import replace13Strategy from '@/presets/replace13.json'
import replaceDailyStrategy from '@/presets/replaceDaily.json'
import friendship488Preset from '@/presets/488friendship.json'

const emit = defineEmits(['onChange'])

const blocklyHolder = useTemplateRef('blocklyHolder')
const height = ref('100%')
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
    { kind: 'block', type: 'sleep' },
    { kind: 'block', type: 'add_row' },
    // Loops
    { kind: 'block', type: 'loop_repeat_n' },
    { kind: 'block', type: 'loop_until_items' }
  ]
}

onMounted(() => {
  if (blocklyHolder.value) {
    setHeight()
    window.addEventListener('resize', () => {
      setHeight()
    })
  }

  if (!blocklyDiv.value) return

  registerBlocks()

  workspace = inject(blocklyDiv.value, {
    toolbox,
    scrollbars: false,
    trashcan: true,
    sounds: false
  })
  workspace.addChangeListener(() => {
    const json = serialization.workspaces.save(workspace!) as BlocklyJsonMock
    emit('onChange', parse(json))
  })
})

onBeforeUnmount(() => {
  workspace?.dispose()
})

function setHeight() {
  if (blocklyHolder.value) {
    let heightPx = blocklyHolder.value.getBoundingClientRect().height
    height.value = heightPx + 'px'
    nextTick(() => {
      workspace?.resize()
      workspace?.resizeContents()
    })
  }
}

// Call this to restore a saved state
function loadFile() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,application/json'

  input.onchange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        if (!workspace) return
        serialization.workspaces.load(json, workspace)
        emit('onChange', parse(json))
      } catch {
        console.error('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  input.click()
}

function saveFile(filename = 'smallIridium.json'): void {
  if (!workspace) return
  const data = serialization.workspaces.save(workspace!)
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

const presets: Record<string, BlocklyJsonMock> = {
  '1 day cycle': replaceDailyStrategy,
  '7 day cycle': replace7Strategy,
  '13 day cycle': replace13Strategy,
  '488 Friendship': friendship488Preset
}

function loadPreset(key: string) {
  if (!workspace) return
  serialization.workspaces.load(presets[key], workspace)
  emit('onChange', parse(presets[key]))
}
</script>
