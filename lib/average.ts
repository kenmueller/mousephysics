const average = (...values: number[]) =>
	values.reduce((sum, value) => sum + value, 0) / values.length

export default average
