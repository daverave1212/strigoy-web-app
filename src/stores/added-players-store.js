import { get, writable } from 'svelte/store'
import { getLocalStorageObject, hasLocalStorageObject, localStorageWritable, setLocalStorageObject } from '../lib/svelteUtils'
import { NO_PRIORITY, getNightlyRolePriority, getSetupRolePriority } from '../lib/Database'

export const addedPlayers = localStorageWritable('addedPlayers', [])

export function addPlayer(extraProps) {
    let newContact = {
        subtitle: '',
        src: 'images/user.png',
        role: null,

        isPortraitCentered: true,
        isExpanded: false,
        hasSpaceUnderneath: false,
        isEditMode: true
    }
    if (extraProps != null) {
        newContact = {...newContact, ...extraProps}
    }
    addedPlayers.set([...get(addedPlayers), newContact])
}

export function setPlayerStateI(i, newState) {
    const newAddedPlayers = get(addedPlayers)
    newAddedPlayers[i] = newState
    addedPlayers.set(newAddedPlayers)
}

export function removePlayer(i) {
    const newAddedPlayers = get(addPlayers)
    newAddedPlayers.splice(i, 1)
    addedPlayers.set(newAddedPlayers)
}

export function test_addPlayers(nPlayers) {
    addedPlayers.set([])
    for (let i = 0; i < nPlayers; i++) {
        addPlayer({ isEditMode: false, subtitle: 'Player' + i})
    }
}

export function sortCurrentRolesSetup() {
    const addedPlayersSorted = get(addedPlayers)
        .sort((a,b) => getSetupRolePriority(a) - getSetupRolePriority(b))
        .map(player => ({...player, hasSpaceUnderneath: false}))
    const firstPlayerWithNoPriorityI = addedPlayersSorted.findIndex(player => getSetupRolePriority(player.role) == NO_PRIORITY) - 1
    if (firstPlayerWithNoPriorityI >= 0) {
        addedPlayersSorted[firstPlayerWithNoPriorityI].hasSpaceUnderneath = true
    }
    addedPlayers.set(addedPlayersSorted)
}

export function sortCurrentRolesNightly() {
    const addedPlayersSorted = get(addedPlayers)
        .sort((a,b) => getNightlyRolePriority(a) - getNightlyRolePriority(b))
        .map(player => ({...player, hasSpaceUnderneath: false}))
    const firstPlayerWithNoPriorityI = addedPlayersSorted.findIndex(player => getNightlyRolePriority(player.role) == NO_PRIORITY) - 1
    if (firstPlayerWithNoPriorityI >= 0) {
        addedPlayersSorted[firstPlayerWithNoPriorityI].hasSpaceUnderneath = true
    }
    addedPlayers.set(addedPlayersSorted)
}