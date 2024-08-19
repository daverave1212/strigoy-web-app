<style>

    canvas {
        width: 100%;
    }

</style>


<script>
    import { onMount } from "svelte";
    import { clearCanvas, drawImageOnCanvasAsync, drawText, drawTextLines } from "../../lib/utils";
    import RoleChooserDrawer from "../../components/RoleChooserDrawer.svelte";
    import { getRoles, WEREWOLVES } from "../../lib/Database";
    import { getMods } from "../../lib/ModsDatabase";

    const allRoles = getRoles()
    const allMods = getMods()

    let canvas
    let roleChooserObjects = allRoles
    let isRoleChooserOpen = false
    let objectBeingDrawn

    $: if (canvas != null && objectBeingDrawn != null) {
        draw()
    }

    async function draw() {
        console.log({objectBeingDrawn})
        clearCanvas(canvas)
        await drawImageOnCanvasAsync(canvas, `/images/roles/${objectBeingDrawn.name}.png`, 0, 0, canvas.width, canvas.width)
        await drawImageOnCanvasAsync(canvas, '/images/card-templating/CardTemplate.png', 0, 0)
        drawText({
            canvas,
            font: '64px Aladin',
            x: canvas.width / 2,
            y: canvas.height * 0.695,
            text: objectBeingDrawn.name,
            textAlign: 'center'
        })

        const hasNotes = objectBeingDrawn.notes != null
        const effectY = hasNotes? canvas.height * 0.8225 : canvas.height * 0.85
        drawTextLines({
            canvas,
            font: '40px SingleDay',
            x: canvas.width / 2,
            y: effectY,
            width: canvas.width * 0.8,
            lineHeight: objectBeingDrawn.lineHeight == null ? 40 : objectBeingDrawn.lineHeight,
            text: objectBeingDrawn.effect,
            textAlign: 'center'
        })
        
        const brownTextColor = 'rgb(113, 108, 95)'
        if (hasNotes) {
            const notesY = canvas.height * 0.92
            drawTextLines({
                canvas,
                font: '33px SingleDay',
                x: canvas.width / 2,
                y: notesY,
                width: canvas.width * 0.85,
                lineHeight: 22,
                text: objectBeingDrawn.notes,
                textAlign: 'center',
                color: brownTextColor
            })  
        }
        if (objectBeingDrawn.team == WEREWOLVES) {
            await drawImageOnCanvasAsync(canvas, '/images/card-templating/Evil Badge.png', canvas.width - 196 - 20, 0 + 20)
        }
        if (objectBeingDrawn.isMod) {
            await drawImageOnCanvasAsync(canvas, '/images/card-templating/Mod Badge.png', canvas.width - 196 - 20, 0 + 20)
        }
        if (objectBeingDrawn.type != null) {
            const tribeBadgeHeight = 66
            const tribeY = canvas.height - tribeBadgeHeight - 12
            await drawImageOnCanvasAsync(canvas, '/images/card-templating/Tribe Badge.png', canvas.width / 2 - 258/2, tribeY)        
            drawText({
                canvas,
                font: '40px SingleDay',
                x: canvas.width / 2,
                y: tribeY + tribeBadgeHeight / 2 + 40 / 4,
                text: objectBeingDrawn.type,
                color: brownTextColor,
                textAlign: 'center'
            })
        }
    }

</script>

<div class="flex-content padded align-right">
    <button class="btn colorful" on:click={() => { roleChooserObjects = allMods; isRoleChooserOpen = true}}>Open Mods</button>
    <button class="btn blue" on:click={() => { roleChooserObjects = allRoles; isRoleChooserOpen = true }}>Open Roles</button>
</div>

<RoleChooserDrawer
    roleStates={roleChooserObjects}
    isOpen={isRoleChooserOpen}
    onClickOnRole={i => {
        objectBeingDrawn = roleChooserObjects[i]
        isRoleChooserOpen = false
    }}
    onClickOutside={() => {
        isRoleChooserOpen = false
    }}
/>

<canvas width="756" height="1093" bind:this={canvas}>

</canvas>