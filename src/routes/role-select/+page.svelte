
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
    import { ADVANCED, BEGINNER, COMPLETE, getNormalRolePriority, getRoles, getRolesByDifficulty, getRolesForDifficulty, getSortRolesWithPriorityFunction, INTERMEDIATE, WEREWOLVES } from "../../lib/Database";
    import { getMods } from "../../lib/ModsDatabase";
    import { selectedRoles } from '../../stores/selected-roles-store'

    
    let currentInspectorObject = null
    let filterValue = ''
    let allAvailableRoles = getSortRolesWithPriorityFunction(getRoles(), getNormalRolePriority)

    selectedRoles.subscribe(newSelectedRoles => {
        allAvailableRoles = allAvailableRoles.map(role => ({...role, isValid: !isRoleSelected(newSelectedRoles, role)}))
        console.log({allAvailableRoles})
    })

    function isRoleSelected(allRolesToCheck, obj) {
        return allRolesToCheck.find(role => role.name == obj.name) != null
    }

    function onSelectRole(obj) {
        if (!isRoleSelected($selectedRoles, obj)) {
            const isPeasantOrStrigoy = obj.name == 'Strigoy' || obj.name == 'Peasant'
            if (isPeasantOrStrigoy) {
                alert('This role is automatically in the game.')
            } else {
                $selectedRoles = [...$selectedRoles, obj]
            }
        } else {
            currentInspectorObject = {...obj}
        }
    }

    function onClickOnCurrentRole(obj) {
        $selectedRoles = $selectedRoles.filter(role => role.name != obj.name)
    }


</script>

<InspectRoleDrawer isOpen={currentInspectorObject != null} role={currentInspectorObject} setIsOpen={() => currentInspectorObject = null}/>

<div class="page">

    <h2 class="center-text margin-top-4">Select Roles In Game</h2>
    <p class="center-text margin-top-2">Tap on roles you want to include in this game. Tap on included roles to remove them. Tap on gray roles to see details.</p>

    <h2 class="center-text margin-top-2">Current Roles</h2>
    {#if $selectedRoles.length == 0}
        <p class="center-text margin-top-2">No roles selected yet.</p>
    {:else}
        <RoleListWithRoles roles={$selectedRoles} on:role-click={evt => onClickOnCurrentRole(evt.detail.role)}/>
    {/if}

    <br/><br/>
    <hr/>
    <br/><br/>

    <input class="search-input" bind:value={filterValue} placeholder="Filter..."/>

    <h2 class="center-text margin-top-2">Beginner Roles</h2>
    <RoleListWithRoles filter={filterValue} roles={allAvailableRoles} on:role-click={evt => onSelectRole(evt.detail.role)}/>

</div>