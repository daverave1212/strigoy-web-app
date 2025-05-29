<style>
    .loader {
        width: 128px;
        height: 128px;
        border: 15px solid #FFF;
        border-bottom-color: var(--blue-color);
        border-radius: 50%;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 
</style>

<script>

    export let className
    export let style

</script>

<div class="loader {className}" {style}></div>