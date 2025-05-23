import { get, writable } from 'svelte/store'
import { ALL_EVILS, getAllRoleDifficulties } from "../lib/Database";
import { localStorageWritable } from "../lib/svelteUtils";
import { baseStrToNumber, numberToBaseStr } from '../lib/utils';

export function resetDifficultyCheckboxes() {
    difficultyCheckboxes.set(DEFAULT_CHECKBOXES)
}
export function resetRoleSettingsCheckboxes() {
    allRolesSettingsCheckboxes.set(DEFAULT_ALL_ROLES_SETTINGS_CHECKBOXES)
}

const DEFAULT_CHECKBOXES = getAllRoleDifficulties()
    .reduce((soFar, difficulty) => ({...soFar, [difficulty]: true}), {})
const DEFAULT_ALL_ROLES_SETTINGS_CHECKBOXES = {
    'Show Helper Ribbons': true,
    'Show Value Badges': true
}

export const difficultyCheckboxes = localStorageWritable('difficultyCheckboxes', DEFAULT_CHECKBOXES)
export const allRolesSettingsCheckboxes = localStorageWritable('allRolesSettingsCheckboxes', DEFAULT_ALL_ROLES_SETTINGS_CHECKBOXES)

export function toggleDifficultyCheckbox(difficulty) {
    const newCheckboxes = get(difficultyCheckboxes)
    newCheckboxes[difficulty] = !newCheckboxes[difficulty]
    difficultyCheckboxes.set(newCheckboxes)
    return newCheckboxes[difficulty]
}

export function toggleRoleSettingCheckbox(name) {
    const newCheckboxes = get(allRolesSettingsCheckboxes)
    newCheckboxes[name] = !newCheckboxes[name]
    allRolesSettingsCheckboxes.set(newCheckboxes)
    return newCheckboxes[name]
}


export function encodeAllCheckboxesSettings() {
    const roleCheckboxes = Object.values(get(difficultyCheckboxes))
    const settingsCheckboxes = Object.values(get(allRolesSettingsCheckboxes))

    const binaryArray = [...roleCheckboxes, ...settingsCheckboxes]
    const binaryStr = binaryArray.map(bool => bool? '1': '0').join('')
    const normalNumber = baseStrToNumber(binaryStr, 2)
    const base32Str = numberToBaseStr(normalNumber, 32)
    return base32Str
}

export function decodeCheckboxesSettings(base32Str) {
    const roleCheckboxes = Object.keys(get(difficultyCheckboxes))
    const settingsCheckboxes = Object.keys(get(allRolesSettingsCheckboxes))
    const totalLength = roleCheckboxes.length + settingsCheckboxes.length

    const normalNumber = baseStrToNumber(base32Str, 32)
    const binaryStr = numberToBaseStr(normalNumber, 2).padStart(totalLength, '0')
    const binaryArray = binaryStr.split('').map(bit => bit == '1'? true: false)

    const newRoleCheckboxes = get(difficultyCheckboxes)
    for (let i = 0; i < roleCheckboxes.length; i++) {
        const thisDifficulty = roleCheckboxes[i]
        newRoleCheckboxes[thisDifficulty] = binaryArray[i]
    }
    const newSettingsCheckboxes = get(allRolesSettingsCheckboxes)
    for (let i = roleCheckboxes.length; i < totalLength; i++) {
        const thisSetting = settingsCheckboxes[i]
        newSettingsCheckboxes[thisSetting] = binaryArray[i]
    }

    difficultyCheckboxes.set(newRoleCheckboxes)
    allRolesSettingsCheckboxes.set(newSettingsCheckboxes)
}


'BCEHIMOPSTWZ'

'ADFGJKLNQRUVXY'

// Alphabetical to code
const CODE_MAP = {
    'B': 'B',
    'BI': 'BI',
    'BS': 'BS',
    'BIS': 'BIS',
    'BIH': 'DAMN',
    'BIHS': 'BISH',
    'BIHW': 'BURN',
    'BIHSW': 'CHURCH',
    'BCIHSW': 'MOST',
    'BCIHSWT': 'POP',
    'BCDIHSW': 'JJ',
    'BCDIHSTW': 'LOL',
    'BCDIHMSTW': 'FULL',
    'BCDIHMOSTW': 'WOW',
    'BCDIHMOSTWZ': 'ALL',
}