<div>
    All game data reset.
</div>

<script>
    import { page } from '$app/stores'
    import { addedPlayers } from "../../stores/added-players-store";
    import { rolesDistribution } from '../../stores/roles-store';

    page.subscribe(data => {
        if (data.data.url == '/reset') {
            $addedPlayers = []
            $rolesDistribution = []
        }
    })

    

</script>