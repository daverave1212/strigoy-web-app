
<style>

</style>

<script>
    import InspectRoleDrawer from "../../components/InspectRoleDrawer.svelte";
    import RoleCard from "../../components/RoleCard.svelte";
    import RoleList from "../../components/RoleList.svelte";
    import RoleListWithRoles from "../../components/RoleListWithRoles.svelte";
    import { ADVANCED, BEGINNER, COMPLETE, difficultyDescriptions, difficultyNames, getAllRoleDifficulties, getNormalRolePriority, getRoles, getRolesByDifficulty, getRolesForDifficulty, getSortRolesWithPriorityFunction, INTERMEDIATE, WEREWOLVES } from "../../lib/Database";
    import { getMods } from "../../lib/ModsDatabase";

    let currentInspectorObject = null
    let filterValue = ''

    function onClickOnRole(obj) {
        currentInspectorObject = obj
    }

    function getSortedRolesForDifficulty(difficulty) {
        return getSortRolesWithPriorityFunction(getRolesForDifficulty(difficulty), getNormalRolePriority)
    }

</script>

<InspectRoleDrawer isOpen={currentInspectorObject != null} role={currentInspectorObject} setIsOpen={() => currentInspectorObject = null}/>

<div class="page">

    <h2 class="center-text margin-top-4">Roles & Mods</h2>
    <p class="margin-top-2">Here you can find all roles and mods for the game.</p>
    <p>Green SETUP ribbons indicate roles that wake up on game setup, while purple NIGHT ribbons indicate roles that wake up at night. A 🔇 icon indicates there's something special about that role, which the narrator should pay close attention to.</p>

    <h2 class="center-text margin-top-4">All Roles (By Sets)</h2>

    <input class="search-input" bind:value={filterValue} placeholder="Filter..."/>
    {#each getAllRoleDifficulties() as difficulty, i (difficulty)}
        <h3 class="center-text margin-top-2">{difficultyNames[difficulty]}</h3>
        <p class="center-text margin-top-1">{difficultyDescriptions[difficulty]}</p>
        <RoleListWithRoles filter={filterValue} roles={getRoles().filter(role => role.difficulty == difficulty)} on:role-click={evt => currentInspectorObject = evt.detail.role}/>
    {/each}

    <h2 class="center-text margin-top-4">Mods</h2>
    <RoleListWithRoles roles={getMods()} on:role-click={evt => onClickOnRole(evt.detail.role)}/>
</div>