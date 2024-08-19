import { browser } from '$app/environment'
import { get, writable } from 'svelte/store'
import { getNightlyRolePriority, getNormalRolePriority, getRole, getRolesByDifficulty, getSetupRolePriority, setupRoles } from '../lib/Database'
import { getLocalStorageObject, localStorageWritable } from '../lib/svelteUtils'

export const rolesDistribution = localStorageWritable('rolesDistribution', [])

export function autochooseRoles(nPlayers, difficulty) {
    const allAvailableRoles = getRolesByDifficulty(difficulty)
    const isRoleInGame = role => rolesInGame.find(roleInGame => roleInGame.name == role.name) != null
    let rolesInGame = setupRoles(nPlayers, difficulty).map(role => ({...role, isInGame: true}))
        rolesInGame = rolesInGame.sort((a, b) => getNormalRolePriority(a) - getNormalRolePriority(b))
    let rolesNotInGame = allAvailableRoles.filter(role => isRoleInGame(role) == false).map(role => ({...role, isInGame: false}))
    rolesDistribution.set([...rolesInGame, ...rolesNotInGame])
}

if (browser) {
    window.patchRole = function(oldRoleName, newRoleName) {
        const newRolesDistribution = get(rolesDistribution)
        const role = newRolesDistribution.find(role => role.name == oldRoleName)
        const newRole = getRole(newRoleName)
        role.name = newRoleName
        role.effect = newRole.effect
        role.notes = newRole.notes
        role.narratorNotes = newRole.narratorNotes
        role.isValid = true
        console.log({role})
        rolesDistribution.set(newRolesDistribution)
    }
}