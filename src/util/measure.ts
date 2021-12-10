export function measure<T>(f: () => T): [T, number] {
	const start = new Date().valueOf()
	const result = f()
	const stop = new Date().valueOf()
	return [result, (stop - start) / 1000]
}