interface MockBlockType {
  type: string
  id: string
  next?: {block: MockBlockType},
  fields: Record<string, number>
}

export interface LoopBlockType extends MockBlockType {
  inputs?: {
    DO: {
      block: MockBlockType
    }
  }
}

export type MockBlock = MockBlockType | LoopBlockType

export interface BlocklyJsonMock {
  blocks: {
    languageVersion: number
    blocks: MockBlock[]
  }
}