<style>

    .role-wrapper {
        width: 33%;
        margin-top: 2rem;
    }

    .role-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

</style>

<script>
    import { createEventDispatcher } from "svelte";
    import RoleCard from "./RoleCard.svelte";

    export let roles
    export let includeEmojis = true
    export let filter = null
    
    const dispatch = createEventDispatcher()

    $:filteredRoleIndices = Object.keys(roles).filter(i => filter == null? true: (
        roles[i].name.toLowerCase().indexOf(filter.toLowerCase()) != -1
    ))

</script>

<div class="role-list">
    {#each filteredRoleIndices as i (roles[i].name + i)}
        <div class="role-wrapper">
            <RoleCard role={roles[i]} on:role-click={_ => dispatch('role-click', { role: roles[i], i: i })}/>
        </div>
    {/each}
</div>
