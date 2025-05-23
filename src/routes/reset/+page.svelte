<div>
    All game data reset.
</div>

<script>
    import { page } from '$app/stores'
    import { addedPlayers } from "../../stores/added-players-store";
    import { rolesDistribution } from '../../stores/roles-store';
    import { difficultyCheckboxes, resetDifficultyCheckboxes, resetRoleSettingsCheckboxes } from '../../stores/settings-checkboxes-store';

    page.subscribe(data => {
        if (data.data.url == '/reset') {
            $addedPlayers = []
            $rolesDistribution = []
            resetDifficultyCheckboxes()
            resetRoleSettingsCheckboxes()
        }
    })

    

</script>