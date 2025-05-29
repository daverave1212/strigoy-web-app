

import { browser } from '$app/environment'
import { writable, get } from 'svelte/store'
import QRCode from 'qrcode'

export function getUrlWithParams(baseUrl, obj) {
    let paramTexts = []
    for (const key of Object.keys(obj)) {
        paramTexts.push(`${key}=${JSON.stringify(obj[key])}`)
    }
    const queryParams = paramTexts.join('&')
    if (baseUrl.startsWith('/') && browser) {
        baseUrl = window.location.origin + baseUrl
    }
    if (baseUrl.endsWith('?')) {
        return baseUrl + queryParams
    }
    if (baseUrl.endsWith('/')) {
        return baseUrl.substring(0, baseUrl.length - 1) + '?' + queryParams
    }
    return baseUrl + '?' + queryParams
}
export async function showQR(div, text) {
    if (!browser) {
        throw `Not in browser`
    }
    const qrBase64 = await stringToBase64QRCode(text)
    div.innerHTML = `
        <img class="qr-code" src="${qrBase64}"/>
    `
}
export function getURLParams() {
    if (!browser) {
        throw `Not in browser`
    }
    return new URLSearchParams(window.location.search)
}
export async function stringToBase64QRCode(str) {
    const url = await QRCode.toDataURL(str)
    return url
}


export function hasLocalStorageObject(name) {
    if (browser) {
        return window.localStorage.getItem(name) != null
    }
}
export function getLocalStorageObject(name) {
    if (browser) {
        if (!hasLocalStorageObject(name)) {
            return null
        }
        return JSON.parse(window.localStorage.getItem(name))
    }
}
export function setLocalStorageObject(name, obj) {
    if (browser) {
        window.localStorage.setItem(name, JSON.stringify(obj))
    }
}

export function localStorageWritable(name, defaultValue) {
    const lsValue = getLocalStorageObject(name)
    if (browser) {
        
    }
    const theWritable = writable(hasLocalStorageObject(name) ?  getLocalStorageObject(name) : defaultValue)
    theWritable.subscribe(newWritable => {
        if (name == 'addedPlayers') {
            console.log(`Setting localStorage item "${name}" to value:`)
            console.log(newWritable)
            console.log(new Error())
        }
        setLocalStorageObject(name, newWritable)
    })

    if (browser) {
        if (window.stores == null) {
            window.stores = {}
        }
        window.stores[name] = { get: () => get(theWritable) }
    }

    return theWritable
}


/* <button use:longpress={500} on:longpress={clickHandler}>... */
export function longpress(node, threshold = 500) {
	const handle_mousedown = () => {
		let start = Date.now();
		
		const timeout = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longpress'));
		}, threshold);
		
		const cancel = () => {
			clearTimeout(timeout);
			node.removeEventListener('mousemove', cancel);
			node.removeEventListener('mouseup', cancel);
		};
		
		node.addEventListener('mousemove', cancel);
		node.addEventListener('mouseup', cancel);
	}
	
	node.addEventListener('mousedown', handle_mousedown);
	
	return {
		destroy() {
			node.removeEventListener('mousedown', handle_mousedown);
		}
	};
}