import { get, writable } from 'svelte/store'
import { ADVANCED, BEGINNER, COMPLETE, INTERMEDIATE } from '../lib/Database'
import { getLocalStorageObject, hasLocalStorageObject, localStorageWritable } from '../lib/svelteUtils'
import { notNullOr, randomizeArray } from '../lib/utils'
import { getMods } from '../lib/ModsDatabase'



const defaultDifficulty = {
    name: 'Beginner',
    difficulty: BEGINNER,
    imageName: 'Strigoy',
    description: 'Cointains some simple townsfolk roles and a Cultist Evil helper role.'
}

export const difficulties = [
    {
        name: 'Kids',
        difficulty: BEGINNER,
        imageName: 'Peasant',
        description: 'Contains only Strigoys, Peasants and a Saint.'
    },
    {
        name: 'Beginner',
        difficulty: BEGINNER,
        imageName: 'Strigoy',
        description: 'Cointains some simple townsfolk roles and a Cultist Evil helper role.'
    },
    {
        name: 'Intermediate',
        difficulty: INTERMEDIATE,
        imageName: 'Seer',
        description: 'Contains a few more standard townsfolk roles and an extra Evil role.'
    },
    {
        name: 'Advanced',
        difficulty: ADVANCED,
        imageName: 'Grandma',
        description: 'Contains all essential good and evil roles, some chaos roles, and more!'
    },
    {
        name: 'Complete',
        difficulty: COMPLETE,
        imageName: 'Fool',
        description: 'Contains all 40+ roles in the game! Some of them may be unbalanced, though.'
    }
]

export const selectedDifficulty = localStorageWritable('selectedDifficulty', defaultDifficulty)