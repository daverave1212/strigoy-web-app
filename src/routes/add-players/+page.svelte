<style>

</style>

<script>
    import { get } from "svelte/store";
    import AddContactButton from "../../components/AddContactButton.svelte";
    import Contact from "../../components/Contact/Contact.svelte";
    import { page, navigating } from '$app/stores'
    import SimpleContact from "../../components/Contact/SimpleContact.svelte";
    import ContactList from "../../components/ContactList.svelte";
    import ContactListHeader from "../../components/ContactListHeader.svelte";
    import { addedPlayers, addPlayer, setPlayerStateI, removePlayer } from '../../stores/added-players-store'
    import { hasAddPlayerTooltip } from '../../stores/tutorial-store'
    import Tooltip from "../../components-standalone/Tooltip.svelte";

    import '../../components/add-contact-button.css'
    import { randomInt } from "../../lib/utils";
    import { onMount } from "svelte";

    function onAddClick() {
        $hasAddPlayerTooltip = false
        addPlayer()
    }

    onMount(() => {
        $addedPlayers = $addedPlayers.map(player => ({
            ...player,
            role: null,
            src: 'images/user.png',
            hasSpaceUnderneath: false
        }))
        console.log($addedPlayers)
    })

    page.subscribe(data => {
        const searchParams = data.url.searchParams
        if (searchParams.get('test-players') != null) {
            const testPlayers = parseInt(searchParams.get('test-players'))
            for (let i = 0; i < testPlayers; i++) {
                setTimeout(() => {
                    addPlayer({ isEditMode: false, subtitle: 'Player' + i})
                }, 100 * i)
            }
        }
    })


</script>

<ContactListHeader>
    <button class="btn red" on:click={() => $addedPlayers = []}>Reset</button>
</ContactListHeader>

<div class="page">
    <ContactList>
        {#each $addedPlayers.keys() as i ($addedPlayers[i].subtitle + i)}
            <SimpleContact state={$addedPlayers[i]} setState={newState => setPlayerStateI(i, newState)}>
                <button class="btn red" on:click={() => removePlayer(i)}>Remove</button>
                <button class="btn blue" on:click={() => setPlayerStateI(i, {...$addedPlayers[i], isEditMode: true})}>Rename</button>
            </SimpleContact>
        {/each}
        <button class="add-contact-button shadowed rounded" on:click={onAddClick} style="position: relative;">
            <Tooltip isShown={$hasAddPlayerTooltip} left="50%" top="80%" width="200px">
                Add all players one by one (except the Narrator).
            </Tooltip>
            +
        </button>
        
        <a class="btn big {$addedPlayers.length > 0? 'colorful' : 'gray'}" href="/difficulty-select" style="position: relative;">
            Next
        </a>
    </ContactList>
</div>