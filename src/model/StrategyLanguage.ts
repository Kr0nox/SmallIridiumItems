interface BaseNode<S extends string> {
  type: S
  next?: Node
}

type DoAction = BaseNode<
  | 'placePetter'
  | 'removePetter'
  | 'pet'
  | 'sleep'
  | 'takeProfession'
  | 'removeProfession'
  | 'addRow'
>

export interface FeedAction extends BaseNode<'feed'> {
  hay: number
}

interface Loop<S extends string> extends BaseNode<S> {
  do?: Node
}

export interface ItemLoop extends Loop<'itemLoop'> {
  limit: number
}

export interface RepeatLoop extends Loop<'repeat'> {
  n: number
  counter?: number
}

export type LoopNodes = ItemLoop | RepeatLoop

export type Node = DoAction | FeedAction | ItemLoop | RepeatLoop
