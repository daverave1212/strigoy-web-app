
<script>
    import { createEventDispatcher } from "svelte";
    import RoundCardPortrait from "./RoundCardPortrait.svelte";

    export let role

    const dispatch = createEventDispatcher()

</script>

<div class="center-content">
    <RoundCardPortrait role={role} on:click={(evt) => { evt.stopPropagation(); dispatch('role-click', evt) }}></RoundCardPortrait>
    <div class={role.isValid == false? 'title gray-text strikethrough center-text' : 'title center-text'}>{role.name}</div>
</div>