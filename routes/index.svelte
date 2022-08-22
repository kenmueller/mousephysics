<script lang="ts">
	import type Position from '$lib/position'
	import round from '$lib/round'
	import distance from '$lib/distance'
	import average from '$lib/average'
	import view from '$lib/view/store'
	import MetaImage from '../components/Meta/Image.svelte'
	import MetaTitle from '../components/Meta/Title.svelte'
	import MetaDescription from '../components/Meta/Description.svelte'

	interface State {
		position: Position
		time: number
	}

	let states: State[] = []

	$: position = states.length ? states[0].position : null

	$: velocity = (() => {
		const points = [
			velocityAt(states, 0),
			velocityAt(states, 1),
			velocityAt(states, 2)
		].filter(value => value !== null) as number[]

		return points.length ? average(...points) : null
	})()

	$: acceleration = (() => {
		const points = [
			accelerationAt(states, 0),
			accelerationAt(states, 1),
			accelerationAt(states, 2)
		].filter(value => value !== null) as number[]

		return points.length ? average(...points) : null
	})()

	const timeBetween = (states: State[], index: number) =>
		average(states[index].time, states[index + 1].time)

	const _velocityAt = (states: State[], index: number) =>
		distance(states[index].position, states[index + 1].position) /
		(states[index].time - states[index + 1].time)

	const velocityAt = (states: State[], index: number) =>
		states.length < index + 2 ? null : _velocityAt(states, index)

	const _accelerationAt = (states: State[], index: number) =>
		(_velocityAt(states, index) - _velocityAt(states, index + 1)) /
		(timeBetween(states, index) - timeBetween(states, index + 1))

	const accelerationAt = (states: State[], index: number) =>
		states.length < index + 3 ? null : _accelerationAt(states, index)

	const onMove = ({ offsetX: x, offsetY: y }: MouseEvent) => {
		if (!$view) return

		states = [
			{
				position: {
					x: -$view.bounds.width / 2 + x,
					y: $view.bounds.height / 2 - y
				},
				time: performance.now() / 1000
			},
			...states
		]
	}
</script>

<MetaImage />
<MetaTitle />
<MetaDescription />

<main on:mousemove={onMove}>
	<aside>
		<h1>Mouse Physics</h1>
		{#if position !== null}
			<p>Position: ({round(position.x, 1)} m, {round(position.y, 1)} m)</p>
		{/if}
		{#if velocity !== null}
			<p>Velocity: {round(velocity, 1)} m/s</p>
		{/if}
		{#if acceleration !== null}
			<p class="acceleration">
				Acceleration: {round(acceleration, 1)} m/s<sup>2</sup>
			</p>
		{/if}
	</aside>
</main>

<style lang="scss">
	main {
		position: relative;
		height: 100%;
		background: linear-gradient(
				-90deg,
				rgba(0, 0, 0, 0.05) 1px,
				transparent 1px
			),
			linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
			linear-gradient(-90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
			linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
			linear-gradient(
				transparent 9px,
				#f2f2f2 9px,
				#f2f2f2 78px,
				transparent 78px
			),
			linear-gradient(-90deg, #aaa 1px, transparent 1px),
			linear-gradient(
				-90deg,
				transparent 9px,
				#f2f2f2 9px,
				#f2f2f2 78px,
				transparent 78px
			),
			linear-gradient(#aaa 1px, transparent 1px), #f2f2f2;
		background-size: 10px 10px, 10px 10px, 80px 80px, 80px 80px, 80px 80px,
			80px 80px, 80px 80px, 80px 80px;
	}

	aside {
		pointer-events: none;
		position: absolute;
		top: 0.7rem;
		left: 1.5rem;
	}

	p {
		margin-top: 1rem;
	}

	.acceleration {
		margin-top: 0.9rem;
	}
</style>
