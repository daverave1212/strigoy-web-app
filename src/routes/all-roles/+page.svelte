
<style>

</style>

<script>
    import InspectRoleDrawer from "../../components/InspectRoleDrawer.svelte";
    import RoleCard from "../../components/RoleCard.svelte";
    import RoleList from "../../components/RoleList.svelte";
    import RoleListWithRoles from "../../components/RoleListWithRoles.svelte";
    import { ADVANCED, ALL_EVILS, BEGINNER, BROKEN, COMPLETE, difficultyDescriptions, difficultyNames, EXTRAS, getAllRoleDifficulties, getDifficultyByFirstLetter, getFirstLetterOfDifficulty, getLocationCards, getNormalRolePriority, getRoles, getRolesByDifficulty, getRolesForDifficulty, getSortRolesWithPriorityFunction, INTERMEDIATE, MORNING_COLOR, NIGHTLY_COLOR, WEREWOLVES } from "../../lib/Database";
    import { getMods } from "../../lib/ModsDatabase";
    import { allRolesSettingsCheckboxes, decodeCheckboxesSettings, difficultyCheckboxes, encodeAllCheckboxesSettings, toggleDifficultyCheckbox, toggleRoleSettingCheckbox } from '../../stores/settings-checkboxes-store'

    let currentInspectorObject = null
    let filterValue = ''
    let isShowingSettings = false

    function onClickOnRole(obj) {
        currentInspectorObject = obj
    }

    function getSortedRolesForDifficulty(difficulty) {
        return getSortRolesWithPriorityFunction(getRolesForDifficulty(difficulty), getNormalRolePriority)
    }

    function sortRoles(roles) {
        // +2    +1 no ribbon     +1 reminder   +1 night    0 night     0 other ribbons     0 no ribbon     negative ribbon
        const LOWEST = -1000
        const VERY_LOW = -100
        const LOW = -10
        const NORMAL = 10
        const HIGH = 100
        const VERY_HIGH = 1000
        const HIGHEST = 10000
        function getRoleSortValue(role) {
            const roleBaseValue =
                role.name == 'Peasant'?
                    LOWEST
                :role.locationWorth < 0?
                    VERY_LOW
                :role.locationWorth > 0?
                    HIGHEST
                :role.worth > 0?
                    role.worth * VERY_HIGH
                :role.worth == 0? (
                    role.ribbonColor != null?
                        HIGH
                    :NORMAL
                )
                :LOW
            const roleSecondaryValue =
                role.ribbonColor == null?
                    9
                :role.ribbonColor == MORNING_COLOR?
                    8
                :role.ribbonColor == NIGHTLY_COLOR?
                    7
                :6

            return roleBaseValue + roleSecondaryValue
        }

        let sortedRoles = [...roles]
        sortedRoles.sort((a, b) => getRoleSortValue(b) - getRoleSortValue(a))
        sortedRoles = sortedRoles.map(role => ({...role, roleValue: getRoleSortValue(role)}))
        console.log({sortedRoles})
        return sortedRoles
    }

    function getSortedRolesInDifficulty(difficulty) {
        const rolesInDifficulty = getRoles().filter(role => role.difficulty == difficulty)
        return sortRoles(rolesInDifficulty)
    }

</script>

<InspectRoleDrawer isOpen={currentInspectorObject != null} role={currentInspectorObject} setIsOpen={() => currentInspectorObject = null}/>

<div class="page">

    <h2 class="center-text margin-top-4">Roles & Mods</h2>
    <p class="margin-top-2 center-text">Here you can find all roles and mods for the game.</p>
    <p class="center-text">Green SETUP ribbons indicate roles that wake up on game setup, while purple NIGHT ribbons indicate roles that wake up at night.</p>

    <h3 class="center-text margin-top-4">Filters</h3>
    <input class="search-input" bind:value={filterValue} placeholder="Filter..."/>
    
    <div class="center-content flex-row">
        <button class="btn blue" on:click={() => {
            isShowingSettings = !isShowingSettings
        }}>{ isShowingSettings? 'Hide Settings': 'Show Settings'}</button>
    </div>

    {#if isShowingSettings}
        <div class="flex-row wrap margin-top-2" style="padding: 1rem; justify-content: center;">
            {#each Object.keys($allRolesSettingsCheckboxes) as settingName (settingName)}
                <div class="margin-top-half" style="width: 90%">
                    <input style={`accent-color: ${NIGHTLY_COLOR}`} type="checkbox" checked={$allRolesSettingsCheckboxes[settingName]} on:click={() => toggleRoleSettingCheckbox(settingName)}>
                    <label on:click={() => toggleRoleSettingCheckbox(settingName)}>{settingName}</label>
                </div>
            {/each}
        </div>
        <div class="flex-row wrap margin-top-2" style="padding: 1rem; justify-content: center;">
            {#each Object.keys($difficultyCheckboxes).sort() as difficulty (difficulty)}
                <div class="margin-top-half" style="width: 90%">
                    <input style={`accent-color: ${NIGHTLY_COLOR}`} type="checkbox" checked={$difficultyCheckboxes[difficulty]} on:click={() => toggleDifficultyCheckbox(difficulty)}>
                    <label on:click={() => {
                        toggleDifficultyCheckbox(difficulty)
                        // console.log(`Clicked on difficulty ${difficulty}: "${difficultyNames[difficulty]}"`)
                        // console.log({allDisplayedRoleDifficulties, difficultyNames})
                        // console.log($difficultyCheckboxes)
                        // console.log(encodeAllCheckboxesSettings())

                        const firstLetter = getFirstLetterOfDifficulty(difficulty)
                        const difficultyByLetter = getDifficultyByFirstLetter(firstLetter)
                        console.log({firstLetter, difficultyByLetter})
                    }}>{difficultyNames[difficulty]}</label>
                </div>
            {/each}
        </div>
    {/if}

    {#each getAllRoleDifficulties() as difficulty, i (difficulty)}
        {#if $difficultyCheckboxes[difficulty] == true}
            <h3 class="center-text margin-top-2">{difficultyNames[difficulty]}</h3>
            <p class="center-text margin-top-1">{difficultyDescriptions[difficulty]}</p>
            <RoleListWithRoles
                roles={getSortedRolesInDifficulty(difficulty)}
                hasBadges={$allRolesSettingsCheckboxes['Show Value Badges']}
                hasRibbons={$allRolesSettingsCheckboxes['Show Helper Ribbons']}
                filter={filterValue}
                on:role-click={evt => currentInspectorObject = evt.detail.role}
            />
        {/if}
    {/each}

    <!-- <h2 class="center-text margin-top-4">Mods</h2>
    <RoleListWithRoles roles={getMods()} on:role-click={evt => onClickOnRole(evt.detail.role)}/> -->

    <h2 class="center-text margin-top-4">Events</h2>
    <RoleListWithRoles roles={getLocationCards()} on:role-click={evt => onClickOnRole(evt.detail.role)}/>
</div>