
<style>

    h3 {
        margin-left: 2rem;
    }

</style>

<script>
    import InspectRoleDrawer from "../../components/InspectRoleDrawer.svelte";
    import RoleCard from "../../components/RoleCard.svelte";
    import RoleList from "../../components/RoleList.svelte";
    import RoleListWithRoles from "../../components/RoleListWithRoles.svelte";
    import { ADVANCED, BEGINNER, COMPLETE, getRoles, getRolesByDifficulty, getRolesForDifficulty, INTERMEDIATE, WEREWOLVES } from "../../lib/Database";
    import { getMods } from "../../lib/ModsDatabase";

    let currentInspectorObject = null

    function onClickOnRole(obj) {
        currentInspectorObject = obj
    }

</script>

<InspectRoleDrawer isOpen={currentInspectorObject != null} role={currentInspectorObject} setIsOpen={() => currentInspectorObject = null}/>

<div class="page">

    <h2 class="center-text margin-top-4">Roles & Mods</h2>
    <p class="margin-top-2">Here you can find all roles and mods for the game.</p>
    <p>Green SETUP ribbons indicate roles that wake up on game setup, while purple NIGHT ribbons indicate roles that wake up at night. A 🔇 icon indicates there's something special about that role, which the narrator should pay close attention to.</p>

    <h2 class="center-text margin-top-2">Beginner Roles</h2>
    <RoleListWithRoles roles={getRolesForDifficulty(BEGINNER)} on:role-click={evt => onClickOnRole(evt.detail.role)}/>

    <h2 class="center-text margin-top-4">Intermediate Roles</h2>
    <RoleListWithRoles roles={getRolesForDifficulty(INTERMEDIATE)} on:role-click={evt => onClickOnRole(evt.detail.role)}/>

    <h2 class="center-text margin-top-4">Advanced Roles</h2>
    <RoleListWithRoles roles={getRolesForDifficulty(ADVANCED)} on:role-click={evt => onClickOnRole(evt.detail.role)}/>

    <h2 class="center-text margin-top-4">Complete Roles</h2>
    <RoleListWithRoles roles={getRolesForDifficulty(COMPLETE)} on:role-click={evt => onClickOnRole(evt.detail.role)}/>

    <h2 class="center-text margin-top-4">Mods</h2>
    <RoleListWithRoles roles={getMods()} on:role-click={evt => onClickOnRole(evt.detail.role)}/>
</div>