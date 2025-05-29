


<script>
    import { onMount } from "svelte";
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { getDifficultiesFromUrl, setDifficultyCheckboxesToLSForce } from "../../stores/settings-checkboxes-store";
    import LoadingSpinner from "../../components-standalone/LoadingSpinner.svelte";

    onMount(async () => {
        console.log('Ok...')
        const difficultyCheckboxesObj = getDifficultiesFromUrl($page.url)
        console.log(difficultyCheckboxesObj)
        setDifficultyCheckboxesToLSForce(difficultyCheckboxesObj)
        setTimeout(() => {
            goto('/all-roles')
        }, 500)
    })
    
</script>

<div class="center-content">
    <div class="center-content" style="width: 25vw; margin-top: 25vh;">
        <LoadingSpinner/>
    </div>
</div>