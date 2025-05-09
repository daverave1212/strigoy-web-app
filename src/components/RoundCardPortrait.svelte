<style>
    :root {
        --role-chooser-image-size: 20vw;
        --role-chooser-image-size-big: 20vh;
        --badge-size: 4vw;
    }
    .image-wrapper {
        width: var(--role-chooser-image-size);
        height: var(--role-chooser-image-size);
        position: relative;
    }
    .image-wrapper .content {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        position: inherit;
    }
    .image-wrapper.big {
        width: var(--role-chooser-image-size-big);
        height: var(--role-chooser-image-size-big);
    }
    .image-wrapper img {
        --width: calc(1.75 * var(--role-chooser-image-size));
        width: var(--width);
        margin-left: calc(-0.2 * var(--width));
        margin-top: calc(-0.05 * var(--width));
    }
    .image-wrapper.big img {
        --width: calc(1.5 * var(--role-chooser-image-size-big));
        margin-left: calc(-0.15 * var(--width));
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

    .badge {
        position: absolute;
        width: var(--badge-size);
        height: var(--badge-size);
        border-radius: 50%;

        color: white;
        background-color: rgb(46, 46, 46);
        transform: rotate(15deg);

        text-align: center;
        font-family: SingleDay;

        font-size: 0.85rem;
        line-height: var(--badge-size);

        top: calc(0.15 * var(--role-chooser-image-size));
        right: calc(-0.05 * var(--role-chooser-image-size));
    }
</style>

<script>
    import { createEventDispatcher } from "svelte";
    import { isSecretBOTCT } from "../stores/secret-botct-store";
    import { EVIL_COLOR, MORNING_COLOR, NIGHTLY, NIGHTLY_COLOR, OTHER_CATEGORY, PINK_COLOR, REGULAR, SETUP, SETUP_COLOR, SPECIAL_COLOR, SPECIAL_NIGHTLY, SPECIAL_SETUP, WEREWOLVES } from "../lib/Database";

    const categoryToRibbon = {
        [REGULAR]: null,
        [SETUP]: { text: 'SETUP', color: 'rgb(90, 138, 0)' },
        [SPECIAL_SETUP]: { text: '🔇SETUP', color: 'rgb(90, 138, 0)' },
        [NIGHTLY]: { text: 'NIGHT', color: 'rgb(88, 50, 255)' },
        [SPECIAL_NIGHTLY]: { text: '🔇NIGHT', color: 'rgb(88, 50, 255)' },
        [OTHER_CATEGORY]: { text: 'OTHER', color: '#444444' }
    }

    const dispatch = createEventDispatcher();

    export let role

    let {
        name,
        team,
        isBig = false,
        src,
        category,
        ribbonColor,
        ribbonText
    } = role
    

    $: imagePath = src != null? src : `images/role-thumbnails/${name}.webp`
    $: ribbon =
        (ribbonText != null && ribbonColor != null)? { text: ribbonText, color: ribbonColor } :
        (category != null && categoryToRibbon[category] != null)? categoryToRibbon[category] :
        null
    $: badgeText =
        role.worth == null?
            null:
        role.worth <= -2?
            '--':
        role.worth <= -1?
            '-':
        role.worth == 0?
            '~':
        role.worth >= 2?
            '++':
        role.worth >= 1?
            '++':
        '?'
    const badgeToColorMapping = {
        '--': EVIL_COLOR,
        '-': EVIL_COLOR,
        '~': SPECIAL_COLOR,
        '+': SETUP_COLOR,
        '++': NIGHTLY_COLOR,
        '?': PINK_COLOR
    }
        
</script>

<div class="image-wrapper {isBig? 'big': ''}" on:click={(evt) => dispatch('click', evt)}>
    <div class="content">
        {#if isBig != true}
            {#if team == WEREWOLVES}
                <div class="ribbon evil" style={`background-color: ${EVIL_COLOR}`}>EVIL</div>
            {/if}
            {#if ribbon != null}
                <div class="ribbon" style="background-color: {ribbon.color}">
                    { ribbonText != null ? ribbonText : ribbon.text}
                </div>
            {/if}
        {/if}
        <img src={imagePath} class="{role.isValid == false? 'grayscale': ''}"/>
    </div>
    {#if badgeText != null && badgeToColorMapping[badgeText] != null}
        <div class="badge" style="background-color: {badgeToColorMapping[badgeText]}">{badgeText}</div>
    {/if}
</div>