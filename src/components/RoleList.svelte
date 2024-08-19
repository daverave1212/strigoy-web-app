
<style>
    :root {
        --role-chooser-image-size: 20vw;
    }
    .role-chooser-content {
        width: 100%;
        
        padding-left: 3vw;
        padding-left: 3vw;
        padding-top: 2vh;
        padding-bottom: 2vh;

        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
        grid-row-gap: 6vw;
    }
</style>

<div class="role-chooser-content">
    <slot></slot>
</div>