
<style>

</style>

<script>
    import InspectRoleDrawer from "../../components/InspectRoleDrawer.svelte";
    import RoleCard from "../../components/RoleCard.svelte";
    import RoleList from "../../components/RoleList.svelte";
    import RoleListWithRoles from "../../components/RoleListWithRoles.svelte";
    import { ADVANCED, BEGINNER, BROKEN, COMPLETE, difficultyDescriptions, difficultyNames, EXTRAS, getAllRoleDifficulties, getLocationCards, getNormalRolePriority, getRoles, getRolesByDifficulty, getRolesForDifficulty, getSortRolesWithPriorityFunction, INTERMEDIATE, MORNING_COLOR, NIGHTLY_COLOR, WEREWOLVES } from "../../lib/Database";
    import { getMods } from "../../lib/ModsDatabase";

    let currentInspectorObject = null
    let filterValue = ''

    function onClickOnRole(obj) {
        currentInspectorObject = obj
    }

    function getSortedRolesForDifficulty(difficulty) {
        return getSortRolesWithPriorityFunction(getRolesForDifficulty(difficulty), getNormalRolePriority)
    }

    $:allDisplayedRoles = getAllRoleDifficulties().filter(difficulty => [
        BROKEN, EXTRAS
    ].includes(difficulty) == false)

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
    <p class="margin-top-2">Here you can find all roles and mods for the game.</p>
    <p>Green SETUP ribbons indicate roles that wake up on game setup, while purple NIGHT ribbons indicate roles that wake up at night. A 🔇 icon indicates there's something special about that role, which the narrator should pay close attention to.</p>

    <h2 class="center-text margin-top-4">All Roles (By Sets)</h2>

    <input class="search-input" bind:value={filterValue} placeholder="Filter..."/>
    {#each allDisplayedRoles as difficulty, i (difficulty)}
        <h3 class="center-text margin-top-2">{difficultyNames[difficulty]}</h3>
        <p class="center-text margin-top-1">{difficultyDescriptions[difficulty]}</p>
        <RoleListWithRoles filter={filterValue} roles={getSortedRolesInDifficulty(difficulty)} on:role-click={evt => currentInspectorObject = evt.detail.role}/>
    {/each}

    <!-- <h2 class="center-text margin-top-4">Mods</h2>
    <RoleListWithRoles roles={getMods()} on:role-click={evt => onClickOnRole(evt.detail.role)}/> -->

    <h2 class="center-text margin-top-4">Events</h2>
    <RoleListWithRoles roles={getLocationCards()} on:role-click={evt => onClickOnRole(evt.detail.role)}/>
</div>