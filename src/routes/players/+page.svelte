
<style>
    body {
        overflow: hidden;
    }
</style>

<script>
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
    import { BEGINNER, getRole, getRoles, getRolesByDifficulty } from "../../lib/Database";
    import Modal from "../../components-standalone/Modal.svelte";
    import { randomInt } from "../../lib/utils";
    import Tooltip from "../../components-standalone/Tooltip.svelte";
    import { addedPlayers, setPlayerStateI } from "../../stores/added-players-store";
    import { sortCurrentRolesNightly, sortCurrentRolesSetup } from "../../stores/added-players-store";
    import { hasExpandTooltip, hasInspectTooltip, hasSetRoleTooltip, hasSortTooltip } from '../../stores/tutorial-store';
    import ModContact from '../../components/Contact/ModContact.svelte';
    import { currentlySelectedMod } from '../../stores/mods-store.js';
    import { isSecretBOTCT } from '../../stores/secret-botct-store.js';
    

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

    // Role chooser
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
        const newRole = $rolesDistribution[newRoleI]
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
        invalidateAvailableRole(newRoleI)
        if (previousRole != null) {
            validateUnavailbleRole(previousRole)
        }
    }

    function invalidateAvailableRole(i) {
        $rolesDistribution[i].isValid = false
        $rolesDistribution = $rolesDistribution
    }
    function validateUnavailbleRole(roleName) {
        const thisRole = $rolesDistribution.find(role => role.name == roleName)
        if (thisRole == null) {
            console.log("ERROR: Role to validate " + roleName + " not found!")
            return
        }
        thisRole.isValid = true
        $rolesDistribution = $rolesDistribution
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

    function onClickOnSortNight() {
        sortCurrentRolesNightly()
    }
    function onClickOnSortSetup() {
        $hasSortTooltip = false
        sortCurrentRolesSetup()
    }
    

    
    console.log(`HMMMMMM`)
    console.log($currentlySelectedMod)
    

</script>

<InspectRoleDrawer
    role={currentModalObject}
    isOpen={currentModalObject != null}
    setIsOpen={bool => {
        didOpenAndCloseModalOnce = true
        closeModal()
    }}
/>

<RoleChooserDrawer
    isOpen={isRoleChooserOpen}
    roleStates={[...$rolesDistribution]}
    onClickOnRole={clickedRoleI => changeRole(currentlySelectedRoleI, clickedRoleI)}
    onClickOutside={() => closeRoleChooserDrawerWithoutSideEffects()}
>
    <div slot="top" class="center-content center-text padded">
        <h2>Roles in this game</h2>
        <br>
        <p>These are all the roles automatically selected to be in this game.</p>
    </div>

    <div slot="middle" class="center-content center-text padded">
        <h2>Roles not in game</h2>
        <br>
        <p>These roles are NOT in the game (Strigoy can bluff as them, Philosopher gets one of them, etc).</p>
    </div>
</RoleChooserDrawer>

<ContactListHeader>
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
    

    <ContactList>

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
                </div>
            </Contact>


        {/each}


        <ModContact state={$currentlySelectedMod} on:show-portrait={onModPortraitClick}>
            Some content
        </ModContact>

        <h3 class="center-text margin-top-1">To restart the game, open the menu and hit Play. All players are saved.</h3>
    
    </ContactList>   
    
    
</div>