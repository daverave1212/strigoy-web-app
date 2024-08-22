

<script>
    import { onMount } from "svelte";
    import RoleChooserDrawer from "../../components/RoleChooserDrawer.svelte";
    import { ADVANCED, COMPLETE, getRolesByDifficulty, getTestRoles } from "../../lib/Database";
    import { addedPlayers, test_addPlayers } from "../../stores/added-players-store";

    import { goto } from '$app/navigation'

    import { rolesDistribution, autochooseRoles } from '../../stores/roles-store'
    import { selectedDifficulty } from '../../stores/difficulty-store'
    import { selectedModOption, autochooseMod, currentlySelectedMod, getUnusedMods, NO_MODS, WITH_MODS } from '../../stores/mods-store'
    import { hasRegenerateRolesTooltip } from '../../stores/tutorial-store'
    import Tooltip from "../../components-standalone/Tooltip.svelte";
    import DrawerPage from "../../components-standalone/DrawerPage.svelte";
    import InspectRoleDrawer from "../../components/InspectRoleDrawer.svelte";

    import RoundCardPortrait from "../../components/RoundCardPortrait.svelte";
    import RoleList from "../../components/RoleList.svelte";
    import { getMods } from "../../lib/ModsDatabase";
    import RoleCard from "../../components/RoleCard.svelte";
    import { autochooseBOTCTRoles, isSecretBOTCT } from "../../stores/secret-botct-store";
    
    let currentlyOpenObject

    function generateRoles() {
        // autochooseRoles($addedPlayers.length, $selectedDifficulty.difficulty)
        autochooseBOTCTRoles($addedPlayers.length)
    }
    function generateMod() {
        autochooseMod()
    }

    onMount(() => {
        if ($addedPlayers == null || $addedPlayers.length == 0) {
            console.error("ERROR: No players added!!")
            throw `No players added.`
        }
        if ($rolesDistribution.length == 0 || $rolesDistribution.length != $addedPlayers.length) {
            generateRoles()
        }
        console.log(`Selected mod option??? ${$selectedModOption}`)
        if ($selectedModOption == WITH_MODS) {
            generateMod()
        }
    })

    function onRegenerateClick() {
        $hasRegenerateRolesTooltip = false
        generateRoles()
    }

    function onClickOnRole(i) {
        currentlyOpenObject = $rolesDistribution[i]
    }
    function onClickOnUnusedMod(mod) {
        currentlyOpenObject = mod
    }
    function onClickOnSelectedMod() {
        currentlyOpenObject = $currentlySelectedMod
    }



</script>

<InspectRoleDrawer isOpen={currentlyOpenObject != null} role={currentlyOpenObject} setIsOpen={bool => currentlyOpenObject = null}/>

<RoleChooserDrawer
    isOpen={true}
    roleStates={$rolesDistribution}
    onClickOnRole={onClickOnRole}
    onClickOutside={() => {}}
>
    <div slot="top" class="center-content center-text padded">
        <h2>Roles in this game</h2>
        <br>
        <p class="text-align-left">These are all the {$addedPlayers.length} roles automatically selected from the {$selectedDifficulty.name} difficulty to be in this game.</p>
        <p class="text-align-left margin-top-1">
            Take these cards, shuffle them in a deck, and give each player one card. Players can look at their card.
        </p>
        <p class="text-align-left margin-top-1">
            When every player took a role, scroll down to continue.
        </p>
        {#if $rolesDistribution.find(role => role.isDrunk) != null}
            <h3 class="margin-top-1">Drunk: {$rolesDistribution.find(role => role.isDrunk).name}</h3>
            <p>There is a Drunk in the game: {$rolesDistribution.find(role => role.isDrunk).name}</p>
        {/if}
        <div class="flex-content center-content margin-top-2">
            <button class="btn big blue" style="position: relative" on:click={onRegenerateClick}>
                <Tooltip isShown={$hasRegenerateRolesTooltip} left="50%" top="80%" width="200px">
                    If you don't like the role distribution, you can regenerate them.
                </Tooltip>
                Regenerate Roles
            </button>
        </div>
    </div>

    <div slot="middle" class="center-content center-text padded">


        {#if $currentlySelectedMod != null && $selectedModOption != NO_MODS}
            <h2 class="margin-top-2">Selected Mod</h2>
            <br>
            <p>This mod was selected for the game.</p>

            <div class="flex-content center-content margin-top-2">
                <button class="btn big blue" on:click={generateMod}>Regenerate Mod</button>
            </div>

            <div class="margin-top-2">
                <RoleCard role={$currentlySelectedMod} isValid={true} on:role-click={() => onClickOnSelectedMod()}/>
            </div>
        {/if}



        <div class="flex-content center-content margin-top-4">
            <a class="btn big colorful" href="/difficulty-select" on:click|preventDefault={() => goto('/difficulty-select')}>Back</a>
            <a class="btn big colorful" style="width: 40vw;" href="/players" on:click|preventDefault={() => goto('/players')}>Next</a>
        </div>

        <h2 class="margin-top-4">Roles NOT in game</h2>
        <br>
        <p>These roles (from the {$selectedDifficulty.name} difficulty) are NOT in the game (Strigoy can bluff as them, Philosopher gets one of them, etc).</p>


    </div>

    <div slot="bottom" class="center-content center-text padded">
        {#if $currentlySelectedMod != null}
            <h2 class="margin-top-4">Mods NOT in game</h2>
            <br>
            <p>These mods are NOT in the game.</p>

            <RoleList>
                {#each getUnusedMods() as mod}
                    <RoleCard role={mod} on:role-click={() => onClickOnUnusedMod(mod)}/>
                {/each}
            </RoleList>
        {/if}
    </div>
</RoleChooserDrawer>