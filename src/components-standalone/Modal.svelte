<style>
    .modal {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 3044;
    }
    .modal.hidden {
        display: none;
    }
    .modal-background {
        position: absolute;
        width: 100vw;
        height: 100vh;
        left: 0;
        top: 0;

        background-color: #00000077;
    }
    .modal-content {
        position: absolute;
        width: 90vw;
        left: 5vw;
        height: 100vh;
    }
</style>

<script>

    export let isOpen = false
    export let setIsOpen

</script>

<div class="modal {!isOpen? 'hidden' : ''}" on:click={() => setIsOpen(false)}>
    <div class="modal-background"></div>
    <div class="modal-content center-content">
        <slot></slot>
    </div>
</div>