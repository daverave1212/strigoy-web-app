

import { browser } from '$app/environment'
import { writable, get } from 'svelte/store'

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