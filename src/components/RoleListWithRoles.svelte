<script>
    import { createEventDispatcher } from "svelte";
    import RoleCard from "./RoleCard.svelte";
    import RoleList from "./RoleList.svelte";


    export let roles
    export let includeEmojis = true
    
    const dispatch = createEventDispatcher()

</script>

<RoleList>
    {#each roles.keys() as i (roles[i].name + i)}
        <RoleCard role={roles[i]} on:role-click={_ => dispatch('role-click', { role: roles[i], i: i })}/>
    {/each}
</RoleList>