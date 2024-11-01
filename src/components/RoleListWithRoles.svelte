<script>
    import { createEventDispatcher } from "svelte";
    import RoleCard from "./RoleCard.svelte";
    import RoleList from "./RoleList.svelte";


    export let roles
    export let includeEmojis = true
    export let filter = null
    
    const dispatch = createEventDispatcher()

    $:filteredRoleIndices = Object.keys(roles).filter(i => filter == null? true: (
        roles[i].name.toLowerCase().indexOf(filter.toLowerCase()) != -1
    ))

</script>

<RoleList>
    {#each filteredRoleIndices as i (roles[i].name + i)}
        <RoleCard role={roles[i]} on:role-click={_ => dispatch('role-click', { role: roles[i], i: i })}/>
    {/each}
</RoleList>