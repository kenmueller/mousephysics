import type Position from './position'

const distance = (a: Position, b: Position) =>
	Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)

export default distance
