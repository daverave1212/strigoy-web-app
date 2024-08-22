


<div class="contact shadowed rounded">
    <div class="header">
        <div class="picture-wrapper" on:click={toggleContent}>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
                src={state.src == null? 'images/user.png' : state.src}
                class="{state.isPortraitCentered == true? 'center': ''}"
            />
        </div>
        <div class="right-wrapper">
            {#if state.isEditMode}
                <div class="edit-div flex-content">
                    <button class="btn blue" on:click={onInputDone}>Done</button>
                    <input class="subtitle-input" on:change={onInputDone} bind:value={_subtitleInputValue} bind:this={domInput}>
                </div>
            {:else}
                <span class="subtitle" on:click={toggleContent}>{state.subtitle}</span>
            {/if}
        </div>
    </div>
    <div class="{SUBCONTENT_CLASS}">
        <div class="subcontent-content">
            <slot></slot>
        </div>
    </div>
</div>


<script>

    import { createEventDispatcher, onMount } from 'svelte'
    import { page, navigating } from '$app/stores'
    import './Contact.css'

    const dispatch = createEventDispatcher()

    export let state
    export let setState

    let _subtitleInputValue
    let domInput

    $: SUBCONTENT_CLASS = state.isExpanded ? 'subcontent subcontent--expanded' : 'subcontent'


    onMount(() => {
        setTimeout(() => {
            if (domInput != null) {
                domInput.focus()
            }
        }, 100)
    })
    $: {
        if (state.isEditMode) {
            setTimeout(() => {
            if (domInput != null) {
                domInput.focus()
            }
        }, 100)
        }
    }



    function toggleContent() {
        setState({ ...state, isExpanded: !state.isExpanded })
    }
    function onInputDone() {
        setState({ ...state, subtitle: _subtitleInputValue, isEditMode: false })
    }


    page.subscribe(data => {
        if (data.data.url != '/add-players' && state.isEditMode) {
            onInputDone()
        }
    })


</script>