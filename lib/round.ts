const round = (value: number, places: number) =>
	Math.round(value * 10 ** places) / 10 ** places

export default round
