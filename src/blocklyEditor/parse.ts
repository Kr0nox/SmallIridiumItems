import type { BlocklyJsonMock, LoopBlockType, MockBlock } from './outputMock'
import type { ItemLoop, Node, RepeatLoop } from '@/model/StrategyLanguage'

export function parse(blocklyJson: BlocklyJsonMock): Node[] {
  if (!blocklyJson.blocks || !blocklyJson.blocks.blocks) return []
  return blocklyJson.blocks.blocks.map(parseBlocklyNode).filter((n) => n !== undefined)
}

function parseBlocklyNode(blocklyNode: MockBlock): Node | undefined {
  let cur: MockBlock | undefined = blocklyNode
  let last: Node | undefined
  let first: Node | undefined
  while (cur !== undefined) {
    const newNode = parseSingleNode(cur)

    if (last) {
      last.next = newNode
    }
    if (!first) {
      first = newNode
    }
    last = newNode
    cur = cur.next?.block
  }

  return first
}

function parseSingleNode(blocklyNode: MockBlock): Node {
  switch (blocklyNode.type) {
    case 'place_autopetter':
      return {
        type: 'placePetter'
      }
    case 'remove_autopetter':
      return {
        type: 'removePetter'
      }
    case 'pet_manually':
      return {
        type: 'pet'
      }
    case 'add_hay':
      return {
        type: 'feed',
        hay: blocklyNode.fields!['AMOUNT']
      }
    case 'take_profession':
      return {
        type: 'takeProfession'
      }
    case 'remove_profession':
      return {
        type: 'removeProfession'
      }
    case 'sleep':
      return {
        type: 'sleep'
      }
    /*case 'loop_repeat_n':
      return {
        type: 'repeat',
        n: blocklyLoop.fields['TIMES'],
        do: blocklyLoop.inputs ? parseBlocklyNode(blocklyLoop.inputs.DO.block): []
      }
    case 'loop_until_items':
      return {
        type: 'itemLoop',
        limit: blocklyLoop.fields['TARGET'],
        do:
      }*/
  }

  const blocklyLoop = blocklyNode as LoopBlockType
  const loopedNodes = blocklyLoop.inputs ? parseBlocklyNode(blocklyLoop.inputs.DO.block) : undefined
  let loop: RepeatLoop | ItemLoop | undefined
  switch (blocklyLoop.type) {
    case 'loop_repeat_n':
      loop = {
        type: 'repeat',
        n: blocklyLoop.fields!['TIMES'],
        do: loopedNodes
      }
      break
    case 'loop_until_items':
      loop = {
        type: 'itemLoop',
        limit: blocklyLoop.fields!['TARGET'],
        do: loopedNodes
      }
      break
  }
  if (!loop) {
    throw 'unknown blockly node type ' + blocklyNode.type
  }

  if (loop.do !== undefined) {
    let last = loop.do
    while (last.next !== undefined) {
      last = last.next!
    }
    last.next = loop
  }

  return loop
}
