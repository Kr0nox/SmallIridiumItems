import type { Day } from './Day'
import type { LoopNodes, Node } from './StrategyLanguage'

interface State {
  happiness: number
  friendship: number
  autopetterPlaced: boolean
  autoPetToday: boolean
  petManuallyToday: boolean
  hayRemaining: number
  hasProfession: boolean
}

export interface Config {
  initialHappiness: number
  initialFriendship: number
  animalCount: number
  animalCrackers: boolean
  animalType: 'Cow' | 'Chicken'
}

export function evaluate(strategy: Node, config: Config): Day[] {
  const days: Day[] = []
  let state: State = {
    happiness: config.initialFriendship,
    friendship: config.initialFriendship,
    autopetterPlaced: false,
    autoPetToday: false,
    petManuallyToday: false,
    hayRemaining: 0,
    hasProfession: false
  }

  let pointer: Node | undefined = strategy
  while (pointer) {
    if (days.length > 100_000) {
      throw 'Limit of 100,000 days reached'
    }
    if (isLoopToken(pointer)) {
      let enterBody = false
      switch (pointer.type) {
        case 'itemLoop':
          enterBody = days[days.length - 1].itemTotal < pointer.limit
          break
        case 'repeat':
          if (pointer.counter === undefined) {
            pointer.counter = pointer.n
          }
          if (pointer.counter > 0) {
            enterBody = true
            pointer.counter--
          } else {
            pointer.counter = undefined
          }
      }
      if (enterBody) {
        if (pointer.do) {
          pointer = pointer.do
        }
      } else {
        pointer = pointer.next
      }
      continue
    }

    switch (pointer.type) {
      case 'sleep': {
        const r = dayUpdate(state, config)
        const itemChance = r.itemChance
        state = r.newState
        days.push({
          day: (days[days.length - 1]?.day ?? 0) + 1,
          happiness: state.happiness,
          friendship: state.friendship,
          itemChance: itemChance,
          itemTotal:
            (days[days.length - 1]?.itemTotal ?? 0) +
            itemChance * config.animalCount * (config.animalCrackers ? 2 : 1),
          autoPetterPlaced: state.autopetterPlaced,
          hayRemaining: state.hayRemaining
        })
        break
      }
      case 'addRow': {
        days.push({
          day: days[days.length - 1]?.day ?? 0,
          happiness: state.happiness,
          friendship: state.friendship,
          itemChance: getItemChance(state),
          itemTotal: days[days.length - 1]?.itemTotal ?? 0,
          autoPetterPlaced: state.autopetterPlaced,
          hayRemaining: state.hayRemaining
        })
        break
      }
      case 'feed': {
        state.hayRemaining += pointer.hay
        break
      }
      case 'placePetter': {
        state.autopetterPlaced = true
        break
      }
      case 'removePetter': {
        state.autopetterPlaced = false
        break
      }
      case 'pet': {
        if (state.autoPetToday) {
          state.friendship = Math.min(1000, state.friendship + 7)
        } else {
          state.friendship = Math.min(1000, state.friendship + 15)
          if (state.hasProfession) {
            state.friendship = Math.min(1000, state.friendship + 15)
            state.happiness = Math.min(
              255,
              state.happiness + Math.max(5, 30 + getHappinessDrain(config.animalType))
            )
          }
        }
        state.petManuallyToday = true
        break
      }
      case 'takeProfession': {
        state.hasProfession = true
        break
      }
      case 'removeProfession': {
        state.hasProfession = false
        break
      }
    }

    pointer = pointer.next
  }

  return days
}

function dayUpdate(oldState: State, config: Config): { newState: State; itemChance: number } {
  const newState: State = {
    happiness: oldState.happiness,
    friendship: oldState.friendship,
    hayRemaining: 0,
    autoPetToday: false,
    hasProfession: oldState.hasProfession,
    autopetterPlaced: oldState.autopetterPlaced,
    petManuallyToday: false
  }

  // FarmAnimal.cs#966-969
  // We expect the animal is home and doors are always closed
  newState.happiness = Math.min(255, newState.happiness + getHappinessDrain(config.animalType) * 2)
  if (!oldState.autoPetToday && !oldState.petManuallyToday) {
    newState.friendship = Math.max(0, newState.friendship - (10 - newState.friendship / 200))
    newState.happiness = Math.max(0, newState.happiness - 50)
  }

  // for simplicity we use a hay every day
  let fullness = 0
  if (oldState.hayRemaining > 0) {
    newState.hayRemaining = oldState.hayRemaining - 1
    fullness = 255
  }
  if (fullness > 200) {
    newState.happiness = Math.min(
      255,
      newState.happiness + getHappinessDrain(config.animalType) * 2
    )
  }
  if (fullness < 200) {
    newState.happiness = Math.max(0, newState.happiness - 100)
    newState.friendship = Math.max(0, newState.friendship - 20)
  }

  const itemChance = getItemChance(newState)

  if (newState.autopetterPlaced) {
    newState.autoPetToday = true
    newState.friendship = Math.min(1000, newState.friendship + (15 - 7))
  }

  return { itemChance, newState }
}

function getItemChance(state: State): number {
  const DeluxeProduceCareDivisor = 1200
  const DeluxeProduceMinimumFriendship = 200

  const { happiness, friendship } = state

  // FarmAnimal.cs#1025
  const chanceQualityOrDeluxe = happiness / 150 >= 1 ? 1 : happiness / 150

  // FarmAnimal.cs#1027
  let happinessModifier: number
  if (happiness > 200) {
    happinessModifier = happiness * 1.5
  } else if (happiness <= 100) {
    happinessModifier = happiness - 100
  } else {
    happinessModifier = 0
  }

  // FarmAnimal.cs#1029
  let deluxeChance = 0
  if (friendship >= DeluxeProduceMinimumFriendship) {
    const chanceValue = (friendship + happinessModifier) / DeluxeProduceCareDivisor
    deluxeChance = chanceValue >= 1 ? 1 : chanceValue
  }

  // FarmAnimal.cs#1034-1054
  // 0.33 is always added due to the profession
  let chanceForQuality = friendship / 1000 - (1 - happiness / 225)
  if (state.hasProfession) {
    chanceForQuality += 0.33
  }

  let iridiumChance = 0
  if (chanceForQuality >= 0.95) {
    iridiumChance = chanceForQuality / 2 >= 1 ? 1 : chanceForQuality / 2
  }

  return chanceQualityOrDeluxe * (1 - deluxeChance) * iridiumChance
}

function isLoopToken(n: Node): n is LoopNodes {
  return n.type == 'itemLoop' || n.type == 'repeat'
}

function getHappinessDrain(animalType: 'Cow' | 'Chicken') {
  return animalType === 'Chicken' ? 7 : 6
}
