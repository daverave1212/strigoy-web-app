export function percentChance(chance){	/* Ex: percentChance(20) = 20% chance to return true; */
    var c = randomInt(1, 100);
    if(c <= chance) return true;
    return false;
}
export function randomInt(low, high){
    return Math.floor(Math.random() * (high - low + 1) + low);
}
export function randomOf(...args){
    return args[randomInt(0, args.length - 1)];
}





export function sum(arr) {
    return arr.reduce((partialSum, a) => partialSum + a, 0)
}
export function randomizeArray(array_a){
    var iRandomize;
    for(iRandomize = 0; iRandomize < array_a.length; iRandomize++){
        var randomizeArrayIndex = randomInt(0, array_a.length - 1);
        var auxRandomize = array_a[iRandomize];
        array_a[iRandomize] = array_a[randomizeArrayIndex];
        array_a[randomizeArrayIndex] = auxRandomize;
    }
    return array_a
}
export function popArrayElementAt(arr, index) {
    const elem = arr[index]
    arr.splice(index, 1)
    return elem
}
export function popArrayElementFind(arr, findFunc) {
    const index = arr.findIndex(findFunc)
    const elem = arr[index]
    arr.splice(index, 1)
    return elem
}
export function times(n, func) {
    for (let i = 0; i < n; i++) {
        func(i)
    }
}
export function arrayFindIndexLowest(arr, getValue) {
    if (arr.length == 0) return null
    let lowestSoFar = getValue(arr[0])
    let lowestIndex = 0
    for (let i = 0; i < arr.length; i++) {
        if (getValue(arr[i]) < lowestSoFar) {
            lowestSoFar = getValue(arr[i])
            lowestIndex = i
        }
    }
    return lowestIndex
}
export function arrayFindIndexHighest(arr, getValue) {
    if (arr.length == 0) return null
    let highestSoFar = getValue(arr[0])
    let highestIndex = 0
    for (let i = 0; i < arr.length; i++) {
        if (getValue(arr[i]) > highestSoFar) {
            highestSoFar = getValue(arr[i])
            highestIndex = i
        }
    }
    return highestIndex
}
export function arrayFindLowest(arr, getValue) {
    const index = arrayFindIndexLowest(arr, getValue)
    return arr[index]
}
export function arrayFindHighest(arr, getValue) {
    const index = arrayFindIndexHighest(arr, getValue)
    return arr[index]
}

export function notNullOr(obj, or) {
    if (obj == null)
        return or
    return obj
}

let ctxSettings = {}
function saveCtxSettings(ctx) {
    ctxSettings.textAlign = ctx.textAlign
    ctxSettings.font = ctx.font
    ctxSettings.fillStyle = ctx.fillStyle
}
function loadCtxSettings(ctx) {
    for (const key of Object.keys(ctxSettings)) {
        ctx[key] = ctxSettings[key]
    }
}

export function drawImageOnCanvasAsync(canvas, path, x, y, width, height) {
    const ctx = canvas.getContext('2d')
    const image = new Image()
    image.src = path
    return new Promise((res, rej) => {
        image.onload = function() {
            if (width != null && height == null) {
                ctx.drawImage(image, x, y, width)
            } else if (width != null && height != null) {
                ctx.drawImage(image, x, y, width, height)
            } else {
                ctx.drawImage(image, x, y)
            }
            res()
        }
    })
}
export function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.reset()
}
export function drawText({canvas, font, x, y, text, textAlign='center', color}) {
    const ctx = canvas.getContext('2d')
    saveCtxSettings(ctx)
    if (color != null) {
        ctx.fillStyle = color
    }
    ctx.textAlign = textAlign
    ctx.font = font
    ctx.fillText(text, x, y)
    loadCtxSettings(ctx)
}

export function drawTextLines({canvas, font, x, y, width, text, lineHeight, textAlign='center', color}) {
    const ctx = canvas.getContext('2d')
    ctx.font = font
    const lines = getLines(ctx, text, width)
    console.log(`Got lines as`)
    console.log({lines})
    const totalHeight = lines.length * lineHeight
    const startY = y - totalHeight / 2
    for (let i = 0; i < lines.length; i++) {
        const textLine = lines[i]
        const thisY = startY + i * lineHeight
        drawText({canvas, font, x, y: thisY, text: textLine, textAlign, color})
    }
}

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}