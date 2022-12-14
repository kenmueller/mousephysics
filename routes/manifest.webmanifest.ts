import type { RequestHandler } from '@sveltejs/kit'
import type { WebAppManifest } from 'web-app-manifest'

import errorFromValue from '$lib/error/from/value'

import touch from '../images/touch.png'
import mask from '../images/mask.png'

const manifest: WebAppManifest = {
	dir: 'ltr',
	lang: 'en-US',
	scope: '/',
	start_url: '/',
	name: 'Mouse Physics',
	short_name: 'Mouse Physics',
	description: "Track your mouse's position, velocity, acceleration",
	display: 'standalone',
	theme_color: 'white',
	background_color: 'white',
	categories: ['utilities', 'education', 'entertainment'],
	icons: [
		{ src: touch, sizes: '180x180' },
		{ src: mask, sizes: '512x512', purpose: 'monochrome maskable' }
	]
}

let data: string | null = null

export const GET: RequestHandler = () => {
	try {
		return {
			headers: {
				'cache-control': 'no-cache',
				'content-type': 'application/manifest+json'
			},
			body: (data ??= JSON.stringify(manifest))
		}
	} catch (value) {
		const { code, message } = errorFromValue(value)
		return { status: code, body: message }
	}
}
