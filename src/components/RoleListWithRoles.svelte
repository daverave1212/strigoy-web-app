<script>
    import { createEventDispatcher } from "svelte";
    import RoleCard from "./RoleCard.svelte";

    export let roles
    export let includeEmojis = true
    export let filter = null
    export let hasRibbons = true
    export let hasBadges = true
    
    const dispatch = createEventDispatcher()

    $:filteredRoleIndices = Object.keys(roles).filter(i => filter == null? true: (
        roles[i].name.toLowerCase().indexOf(filter.toLowerCase()) != -1
    ))

</script>

<div class="role-list">
    {#each filteredRoleIndices as i (roles[i].name + i)}
        <RoleCard hasRibbon={hasRibbons} hasBadge={hasBadges} role={roles[i]} on:role-click={_ => dispatch('role-click', { role: roles[i], i: i })}/>
    {/each}
</div>
