<style>
    :root {
        --role-chooser-image-size: 20vw;
        --role-chooser-image-size-big: 20vh;
    }
    .image-wrapper {
        width: var(--role-chooser-image-size);
        height: var(--role-chooser-image-size);
        overflow: hidden;
        border-radius: 50%;
        position: relative;
    }
    .image-wrapper.big {
        width: var(--role-chooser-image-size-big);
        height: var(--role-chooser-image-size-big);
    }
    .image-wrapper img {
        --width: calc(2 * var(--role-chooser-image-size));
        width: var(--width);
        margin-left: calc(-0.25 * var(--width));
        margin-top: calc(-0.07 * var(--width));
    }
    .image-wrapper.big img {
        --width: calc(2 * var(--role-chooser-image-size-big));
    }
    .grayscale {
        -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
        filter: grayscale(100%);
    }
    .ribbon {
        position: absolute;
        
        color: white;
        background-color: rgb(46, 46, 46);

        text-align: center;
        font-family: SingleDay;

        font-size: 0.85rem;
        height: 1.25rem;
        line-height: 1.25rem;
        width: calc(1.25 * var(--role-chooser-image-size));
        
        bottom: 0.25rem;
        left: calc(-0.05 * var(--role-chooser-image-size));
        transform: rotate(-15deg);
    }
    .ribbon.evil {
        top: 0.5rem;
        left: calc(-0.25 * var(--role-chooser-image-size));
        transform: rotate(-25deg);
    }
</style>

<script>
    import { createEventDispatcher } from "svelte";
    import { isSecretBOTCT } from "../stores/secret-botct-store";
    import { NIGHTLY, OTHER_CATEGORY, REGULAR, SETUP, SPECIAL_NIGHTLY, SPECIAL_SETUP, WEREWOLVES } from "../lib/Database";

    const categoryToRibbon = {
        [REGULAR]: null,
        [SETUP]: { text: 'SETUP', color: 'rgb(90, 138, 0)' },
        [SPECIAL_SETUP]: { text: '🔇SETUP', color: 'rgb(90, 138, 0)' },
        [NIGHTLY]: { text: 'NIGHT', color: 'rgb(88, 50, 255)' },
        [SPECIAL_NIGHTLY]: { text: '🔇NIGHT', color: 'rgb(88, 50, 255)' },
        [OTHER_CATEGORY]: { text: 'OTHER', color: '#444444' }
    }

    const dispatch = createEventDispatcher();

    export let name
    export let isValid
    export let team
    export let isBig = false
    export let src = null
    export let category
    export let ribbonText
    export let ribbonColor

    $: imagePath = src != null? src : `images/roles/${name}.png`
    $: ribbon = category != null && categoryToRibbon[category] != null?
        categoryToRibbon[category] :
        null
</script>

<div class="image-wrapper {isBig? 'big': ''}" on:click={(evt) => dispatch('click', evt)}>
    {#if isBig != true}
        {#if team == WEREWOLVES}
            <div class="ribbon evil" style="background-color: rgb(194, 5, 30)">EVIL</div>
        {/if}
        {#if ribbon != null}
            <!-- <div class="ribbon">{ribbonText}</div> -->
            <div class="ribbon" style="background-color: {ribbon.color}">
                { ribbonText != null ? ribbonText : ribbon.text}
            </div>
        {/if}
    {/if}
    <img src={imagePath} class="{isValid == false? 'grayscale': ''}"/>
</div>