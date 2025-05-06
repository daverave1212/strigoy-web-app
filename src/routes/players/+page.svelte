
<style>
    body {
        overflow: hidden;
    }
</style>

<script>
	import { selectedRoles } from './../../stores/selected-roles-store.js';
	import { getBOTCTRole } from './../../lib/BOTCTDatabase.js';
	import { rolesDistribution } from './../../stores/roles-store.js';
	import InspectRoleDrawer from './../../components/InspectRoleDrawer.svelte';

    import AddContactButton from "../../components/AddContactButton.svelte";
    import Contact from "../../components/Contact/Contact.svelte";
    import ContactList from "../../components/ContactList.svelte";
    import ContactListHeader from "../../components/ContactListHeader.svelte";
    import { Scaffold, SidenavItem, SidenavButton } from "saraui"
    import SideMenu from "../../components-standalone/SideMenu.svelte";
    import DrawerPage from "../../components-standalone/DrawerPage.svelte";
    import RoleChooserDrawer from "../../components/RoleChooserDrawer.svelte";
    import { ADVANCED, BEGINNER, COMPLETE, difficultyNames, getAllRoleDifficulties, getRole, getRoles, getRolesByDifficulty, INTERMEDIATE, NIGHTLY, SETUP, SPECIAL_NIGHTLY, SPECIAL_SETUP } from "../../lib/Database";
    import Modal from "../../components-standalone/Modal.svelte";
    import { isNumber, randomInt } from "../../lib/utils";
    import Tooltip from "../../components-standalone/Tooltip.svelte";
    import { addedPlayers, addPlayer, addPlayerAdded, addPlayerTemporary, getAddedPlayerRoleDifficulties, removePlaceholderRoles, removePlayer, setPlayerStateI } from "../../stores/added-players-store";
    import { sortCurrentRolesNightly, sortCurrentRolesSetup } from "../../stores/added-players-store";
    import { hasExpandTooltip, hasInspectTooltip, hasSetRoleTooltip, hasSortTooltip } from '../../stores/tutorial-store';
    import ModContact from '../../components/Contact/ModContact.svelte';
    import { currentlySelectedMod } from '../../stores/mods-store.js';
    import { isSecretBOTCT } from '../../stores/secret-botct-store.js';
    import RoleChooserManyDrawer from '../../components/RoleChooserManyDrawer.svelte';

    import '../../components/add-contact-button.css'
    import SimpleContact from '../../components/Contact/SimpleContact.svelte';
    import ColorDisplay from '../../components/ColorDisplay.svelte';
    import LocationPicker from '../../components/LocationPicker.svelte';
    
    $:{
        console.log('added:')
        console.log($addedPlayers)
    }

    $: shouldShowRoleTooltip = 
        $hasSetRoleTooltip == false &&
        currentModalObject == null &&
        $hasInspectTooltip &&
        $addedPlayers.length > 0 && $addedPlayers[0].role != null
    $: shouldShowExpandTooltip =
        $hasInspectTooltip == false &&
        $hasExpandTooltip &&
        didOpenAndCloseModalOnce
    $: shouldShowSortTooltip =
        $hasExpandTooltip == false &&
        $addedPlayers.filter(player => player.role == null).length == 0 &&
        $hasSortTooltip
    
    $: areSortButtonsDisabled = $addedPlayers.filter(p => p.role == null).length > 0

    const statusEffects = [
        'Hazed',
        'Drunk',
        'Lover',
        'Used Ability',
        'Evil',
        'Out of Game',
    ]

    // Inspect drawer
    let didOpenAndCloseModalOnce = false
    let currentModalObject = null
    function openModalWithRoleName(roleName) {
        $hasInspectTooltip = false
        console.log(`Opening modal with ${roleName}`)
        if ($isSecretBOTCT) {
            currentModalObject = getBOTCTRole(roleName)
        } else {
            currentModalObject = getRole(roleName)
        }
    }
    function onModPortraitClick() {
        currentModalObject = $currentlySelectedMod
    }
    function closeModal() {
        currentModalObject = null
    }

    // Color drawer
    let currentColor = null
    $: isColorDrawerOpen = currentColor != null

    // Role chooser
    let allRoles = getRoles()
    let isRoleChooserOpen = false
    let currentlySelectedRoleI


    // Functions
    function openRoleChangeMenuForPlayerI(i) {
        console.log('Hiding tooltip')
        $hasSetRoleTooltip = false
        currentlySelectedRoleI = i
        isRoleChooserOpen = true
        console.log($hasSetRoleTooltip)
    }
    function changeRole(playerI, newRoleI) {
        console.log(`Player ${playerI} clicked on role ${newRoleI}`)
        const newRole = allRoles[newRoleI]
        isRoleChooserOpen = false
        const playerState = $addedPlayers[playerI]
        const previousRole = playerState.role
        const newPlayerState = {
            ...playerState,
            name: newRole.name,
            src: newRole.src == null? `images/roles/${newRole.name}.png`: newRole.src,
            role: newRole.name
        }
        $addedPlayers[playerI] = newPlayerState
        $addedPlayers = $addedPlayers
    }


    function killPlayer(i) {
        const player = $addedPlayers[i]
        player.isDead = !player.isDead
        setPlayerStateI(i, player)
    }

    function onClickOnStatusEffect(playerI, statusName) {
        console.log('Adding status ' + statusName)
        const player = $addedPlayers[playerI]
        if (player.statusEffects == null) {
            player.statusEffects = []
        }

        const hasThisStatus = player.statusEffects.find(status => status == statusName) != null
        if (hasThisStatus) {
            player.statusEffects = player.statusEffects.filter(status => status != statusName)
        } else {
            player.statusEffects.push(statusName)
        }

        setPlayerStateI(playerI, player)
    }

    function closeRoleChooserDrawerWithoutSideEffects() {
        currentlySelectedRoleI = null
        isRoleChooserOpen = false
    }

    function addMissingRequiredRoles(filterExtraRequiredRolesFunc) {
        removePlaceholderRoles()
        const isAnyPlayerThisRoleName = roleName => $addedPlayers.find(player => player.role == roleName) != null

        const difficultiesInGame = getAddedPlayerRoleDifficulties()
        const allPossibleRoles = getRoles().filter(role => difficultiesInGame.includes(role.difficulty))

        const selectedRolesNotSet = allPossibleRoles.filter(role => isAnyPlayerThisRoleName(role.name) == false)
        const extraRequiredRoles = selectedRolesNotSet.filter(filterExtraRequiredRolesFunc)
        for (const role of extraRequiredRoles) {
            addPlayerTemporary(role.name)
        }
    }

    function onClickOnSortNight() {
        const filterExtraRequiredRolesFunc = role => role => role.category == NIGHTLY || role.category == SPECIAL_NIGHTLY
        addMissingRequiredRoles(filterExtraRequiredRolesFunc)
        sortCurrentRolesNightly()
    }
    function onClickOnSortSetup() {
        $hasSortTooltip = false
        const filterExtraRequiredRolesFunc = role => role => role.category == SETUP || role.category == SPECIAL_SETUP
        addMissingRequiredRoles(filterExtraRequiredRolesFunc)
        sortCurrentRolesSetup()
    }
    function onClickOnCleanup() {
        removePlaceholderRoles()
    }
    function onClickOnAdd() {
        const name = prompt('Player name')
        const player = addPlayerAdded({}, name)
    }
    function onRemovePlayer(i) {
        const player = $addedPlayers[i]
        removePlayer(i)
    }

    function getSectionFilters() {
        const difficulties = getAllRoleDifficulties()
        const filterFunctions = []
        for (const difficulty of difficulties) {
            const filter = i => allRoles[i].difficulty == difficulty
            filterFunctions.push(filter)
        }
        return filterFunctions
    }

</script>

<DrawerPage
    isOpen={currentColor != null}
    zIndex="486 !important"
    on:click={() => currentColor = null}
>
    <div style={`width: 100vw; height: 100vh; background-color: ${currentColor};`}>
    </div>
</DrawerPage>

<InspectRoleDrawer
    role={currentModalObject}
    isOpen={currentModalObject != null}
    setIsOpen={bool => {
        didOpenAndCloseModalOnce = true
        closeModal()
    }}
/>

<RoleChooserManyDrawer
    isOpen={isRoleChooserOpen}
    roles={getRoles()}
    
    sectionFilters={getSectionFilters()}
    sectionTitles={getAllRoleDifficulties().map(difficulty => difficultyNames[difficulty])}
    sectionTexts={getAllRoleDifficulties().map(difficulty => '')}

    onClickOnRole={clickedRoleI => changeRole(currentlySelectedRoleI, clickedRoleI)}
    onClickOutside={() => closeRoleChooserDrawerWithoutSideEffects()}
></RoleChooserManyDrawer>

<ContactListHeader>
    <button class="btn" style="background-color: #AA88BB; position: relative;" on:click={onClickOnCleanup}>
        Cleanup
    </button>
    <button class="btn" style="background-color: #BB8844; position: relative;" on:click={onClickOnSortSetup}>
        <Tooltip isShown={shouldShowSortTooltip} top="3rem" left="calc(50% - 0.5rem)" width="40vw">Sort players for Setup for Night.</Tooltip>
        Sort for Setup
    </button>
    <button class="btn" style="background-color: #44AACC" on:click={onClickOnSortNight}>Sort for Night</button>
</ContactListHeader>

<div class="page" style="position: relative;">
    <Tooltip isShown={$hasSetRoleTooltip} top="calc(var(--contact-header-height) * 1.5)" left="50%" width="70vw">Set each player's role to the card they drew.</Tooltip>
    <Tooltip isShown={shouldShowRoleTooltip} top="calc(var(--contact-header-height) * 1.5)" left="calc(7.5vw + 0.75rem + var(--contact-header-height) / 2)" width="70vw" isLefty={true}>Click on the image to see role details.</Tooltip>
    <Tooltip isShown={shouldShowExpandTooltip} top="calc(var(--contact-header-height) * 1.5)" left="50%" width="70vw">Click to show more options (click again to hide).</Tooltip>

    <LocationPicker></LocationPicker>

    <ContactList className="margin-top-1">

        {#each $addedPlayers.keys() as i (`${$addedPlayers[i].name}${i}`)}

            <Contact
                state={$addedPlayers[i]} setState={(newState) => setPlayerStateI(i, newState)}
                on:change-role={() => openRoleChangeMenuForPlayerI(i)}
                on:show-portrait={() => openModalWithRoleName($addedPlayers[i].role)}
                on:expand={() => $hasExpandTooltip = false}
            >
                <div class="">
                    <!-- <button class="btn red" on:click={() => removeContact(i)}>Remove</button> -->
                    <div class="flex-content wrap">
                        <button class="btn blue" on:click={() => openRoleChangeMenuForPlayerI(i)}>Change Role</button>
                        <button class="btn red" on:click={() => killPlayer(i)}> <img class="icon" src="/images/status/Dead.png"/> Dead</button>
                    </div>
                    <div class="flex-content wrap margin-top-1">
                        {#each statusEffects as statusEffect}
                            <button class="btn" style="color: black;" on:click={()=>onClickOnStatusEffect(i, statusEffect)}> <img class="icon" src="/images/status/{statusEffect}.png"/> {statusEffect} </button>
                        {/each}
                    </div>
                    <div class="flex-content wrap margin-top-1">
                        <button class="btn gray" on:click={() => onRemovePlayer(i)}>Remove</button>
                    </div>
                </div>
            </Contact>



        {/each}

        <button class="add-contact-button shadowed rounded" on:click={onClickOnAdd} style="position: relative;">
            +
        </button>


        <h3 class="center-text margin-top-1">To restart the game, open the menu and hit Play. All players are saved.</h3>
    
    </ContactList>   
    
    
    <ColorDisplay
        className="rounded shadowed margin-top-1"
        onClickOnColor={color => currentColor = color}
    />
</div>