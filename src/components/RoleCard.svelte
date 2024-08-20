
<script>
    import { createEventDispatcher } from "svelte";
    import RoundCardPortrait from "./RoundCardPortrait.svelte";


    export let name
    export let isValid
    export let src

    const dispatch = createEventDispatcher()

</script>

<div class="center-content">
    <RoundCardPortrait name={name} isValid={isValid == false? false: true} on:click={(evt) => { evt.stopPropagation(); dispatch('role-click', evt) }}  src={src}></RoundCardPortrait>
    <div class={isValid == false? 'title gray-text strikethrough center-text' : 'title center-text'}>{name}</div>
</div>