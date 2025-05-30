<script>
    import { difficultyDescriptions, difficultyNames, getAllRoleDifficulties, getSortedRolesInDifficulty } from "../lib/Database";
    import { allRolesSettingsCheckboxes, difficultyCheckboxes } from "../stores/settings-checkboxes-store";
    import RoleListWithRoles from "./RoleListWithRoles.svelte";

    export let filterValue = ''
    export let onClickOnRole

</script>

<div>
    {#each getAllRoleDifficulties() as difficulty, i (difficulty)}
        {#if $difficultyCheckboxes[difficulty] == true}
            <h3 class="center-text margin-top-2">{difficultyNames[difficulty]}</h3>
            <p class="center-text margin-top-1">{difficultyDescriptions[difficulty]}</p>
            <RoleListWithRoles
                roles={getSortedRolesInDifficulty(difficulty)}
                hasBadges={$allRolesSettingsCheckboxes['Show Value Badges']}
                hasRibbons={$allRolesSettingsCheckboxes['Show Helper Ribbons']}
                filter={filterValue}
                on:role-click={onClickOnRole}
            />
        {/if}
    {/each}
</div>