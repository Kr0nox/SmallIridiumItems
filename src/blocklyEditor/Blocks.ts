import { Blocks, type Block, FieldNumber } from 'blockly'

export function registerBlocks() {
  // ── Actions ──────────────────────────────────────────────────────────────

  Blocks['place_autopetter'] = {
    init(this: Block) {
      this.appendDummyInput().appendField('Place Autopetter')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(4)
      this.setTooltip('Places an autopetter')
    }
  }

  Blocks['remove_autopetter'] = {
    init(this: Block) {
      this.appendDummyInput().appendField('Remove Autopetter')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(4)
      this.setTooltip('Removes an autopetter')
    }
  }

  Blocks['sleep'] = {
    init(this: Block) {
      this.appendDummyInput().appendField('Sleep')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(210)
      this.setTooltip('Sleep')
    }
  }

  Blocks['pet_manually'] = {
    init(this: Block) {
      this.appendDummyInput().appendField('Pet Manually')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(184)
      this.setTooltip('Manually pets all animals')
    }
  }

  Blocks['take_profession'] = {
    init(this: Block) {
      this.appendDummyInput().appendField('Take Profession')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(122)
      this.setTooltip('Take the correct profession (Coopmaster or Shepherd)')
    }
  }

  Blocks['remove_profession'] = {
    init(this: Block) {
      this.appendDummyInput().appendField('Remove Profession')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(122)
      this.setTooltip('Take the wrong profession (not Coopmaster or Shepherd)')
    }
  }

  Blocks['add_row'] = {
    init(this: Block) {
      this.appendDummyInput().appendField('Add Row')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour('#666666')
      this.setTooltip('Adds a row to the table without sleeping')
    }
  }

  Blocks['add_hay'] = {
    init(this: Block) {
      this.appendDummyInput()
        .appendField('Add')
        .appendField(new FieldNumber(1, 1, Infinity, 1), 'AMOUNT')
        .appendField('hay per animal')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(33)
      this.setTooltip('Adds N hay per animal')
    }
  }

  // ── Loops ─────────────────────────────────────────────────────────────────

  Blocks['loop_repeat_n'] = {
    init(this: Block) {
      this.appendDummyInput()
        .appendField('Repeat')
        .appendField(new FieldNumber(7, 1, Infinity, 1), 'TIMES')
        .appendField('times')
      this.appendStatementInput('DO').appendField('do')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(60)
      this.setTooltip('Repeats the contained actions for N days')
    }
  }

  Blocks['loop_until_items'] = {
    init(this: Block) {
      this.appendDummyInput()
        .appendField('Repeat until items ≥')
        .appendField(new FieldNumber(1998, 1, Infinity, 1), 'TARGET')
      this.appendStatementInput('DO').appendField('do')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(269)
      this.setTooltip('Repeats until the total item count reaches the target')
    }
  }
}
