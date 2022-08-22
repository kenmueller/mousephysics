import { readable } from 'svelte/store'

import { browser } from '$app/env'

import type View from '.'

const view = readable<View | null>(null, set => {
	if (!browser) return

	const onResize = () => {
		set({
			bounds: {
				width: window.innerWidth,
				height: window.innerHeight
			}
		})
	}

	onResize()
	window.addEventListener('resize', onResize)

	return () => {
		window.removeEventListener('resize', onResize)
	}
})

export default view
