<style>
    
    .page {
        text-align: center;
    }

    .image-wrapper {
        width: var(--role-chooser-image-size);
        height: var(--role-chooser-image-size);
        overflow: hidden;
        border-radius: 50%;
    }
    .image-wrapper img {
        --width: calc(0.55 * var(--role-chooser-image-size));
        width: calc(2.5 * var(--width));
        aspect-ratio: var(--card-aspect-ratio);
        margin-left: calc(-0.34 * var(--width));
        margin-top: calc(-0.34 * var(--width));
    }
</style>

<script>
    import RoleChooserDrawer from "../../components/RoleChooserDrawer.svelte";
    import RoundCardPortrait from "../../components/RoundCardPortrait.svelte";
    import { getRolesByDifficulty } from "../../lib/Database";
    import { difficulties, selectedDifficulty } from '../../stores/difficulty-store'
    import { mods, selectedModOption } from "../../stores/mods-store";


    let isRolesDrawerOpen = false
    let availableDrawerRoles = []

    function openDrawerWithDifficultyRoles(difficulty) {
        availableDrawerRoles = getRolesByDifficulty(difficulty)
        isRolesDrawerOpen = true
    }
    
    function onClickOnDifficulty(difficulty) {
        if ($selectedDifficulty.name == difficulty.name) {
            openDrawerWithDifficultyRoles(difficulty.difficulty)
            return
        }
        $selectedDifficulty = difficulty
    }


</script>


<RoleChooserDrawer
    isOpen={isRolesDrawerOpen}
    roleStates={availableDrawerRoles}
    onClickOnRole={() => isRolesDrawerOpen = false}
    onClickOutside={() => isRolesDrawerOpen = false}
/>
<div class="page space-top">
    <h2>Choose Game Difficulty</h2>
    <br>
    <p>Each game difficulty contains about 10 extra roles. The more advanced the difficulty, the more complex player choices will be!</p>
    <br>

    <div class="cards">
        {#each difficulties as difficulty}
            <div class="card shadowed rounded {$selectedDifficulty.name == difficulty.name? 'colorful' : ''}" on:click={() => onClickOnDifficulty(difficulty)}>
                <RoundCardPortrait name={difficulty.imageName} isValid={true}/>
                <h3>{difficulty.name}</h3>
                <p>{difficulty.description}</p>
            </div>
        {/each}
    </div>

    <br>
    <br>
    <br>
    <h2>Play With Mods?</h2>
    <br>
    <p>Mods are extra ways to spice up the game. Each mod will change some rules of the game. Maybe some players will have 2 roles, or maybe one player is hallucinating!</p>
    <br>

    <div class="cards">
        {#each mods as mod}
            <div class="card shadowed rounded {$selectedModOption == mod.name? 'colorful' : ''}" on:click={() => $selectedModOption = mod.name}>
                <RoundCardPortrait name={mod.imageName} isValid={true}/>
                <h3>{mod.name}</h3>
                <p>{mod.description}</p>
            </div>
        {/each}
    </div>
    
    
    <br>
    <br>
    <div class="flex-content center">
        <a  class="btn big colorful" href="add-players">Back</a>
        <a  style="width: 45vw"
            class="btn big {$selectedDifficulty == null || $selectedModOption == null? 'gray': 'colorful'}"
            href="/roles"
        >
            Next
        </a>
    </div>
</div>