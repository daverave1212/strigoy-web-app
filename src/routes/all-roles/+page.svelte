
<style>

</style>

<script>
    import InspectRoleDrawer from "../../components/InspectRoleDrawer.svelte";
    import RoleCard from "../../components/RoleCard.svelte";
    import RoleList from "../../components/RoleList.svelte";
    import RoleListWithRoles from "../../components/RoleListWithRoles.svelte";
    import RoleListWithRolesBySelectedDifficulties from "../../components/RoleListWithRolesBySelectedDifficulties.svelte";
    import { ADVANCED, ALL_EVILS, BEGINNER, BROKEN, COMPLETE, difficultyDescriptions, difficultyNames, EXTRAS, getAllRoleDifficulties, getDifficultyByFirstLetter, getFirstLetterOfDifficulty, getLocationCards, getNormalRolePriority, getRoles, getRolesByDifficulty, getRolesForDifficulty, getSortedRolesInDifficulty, getSortRolesWithPriorityFunction, INTERMEDIATE, MORNING_COLOR, NIGHTLY_COLOR, WEREWOLVES } from "../../lib/Database";
    import { getMods } from "../../lib/ModsDatabase";
    import { showQR } from "../../lib/svelteUtils";
    import { allRolesSettingsCheckboxes, difficultyCheckboxes, getCompleteURLWithCheckboxes, toggleDifficultyCheckbox, toggleRoleSettingCheckbox } from '../../stores/settings-checkboxes-store'

    let qrDiv

    let currentInspectorObject = null
    let filterValue = ''
    let isShowingSettings = false

    function onClickOnRole(obj) {
        currentInspectorObject = obj
    }

    async function shareQR() {
        const url = getCompleteURLWithCheckboxes('/custom-difficulties-share')
        await showQR(qrDiv, url)
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
                    <label on:click={() => { toggleDifficultyCheckbox(difficulty) }}>{difficultyNames[difficulty]}</label>
                </div>
            {/each}
        </div>
        <div class="center-content margin-top-2">
            <button class="btn blue" on:click={shareQR}>Share QR</button>
            <div bind:this={qrDiv} style="width: 80%">

            </div>
        </div>
    {/if}

    <RoleListWithRolesBySelectedDifficulties filterValue={filterValue} onClickOnRole={evt => currentInspectorObject = evt.detail.role}/>

    <!-- {#each getAllRoleDifficulties() as difficulty, i (difficulty)}
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
    {/each} -->

    <!-- <h2 class="center-text margin-top-4">Mods</h2>
    <RoleListWithRoles roles={getMods()} on:role-click={evt => onClickOnRole(evt.detail.role)}/> -->

    <h2 class="center-text margin-top-4">Events</h2>
    <RoleListWithRoles roles={getLocationCards()} on:role-click={evt => onClickOnRole(evt.detail.role)}/>
</div>