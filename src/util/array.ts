export function sort<T>(arr: T[], propertySupplier: (t: T) => number, direction: 'asc' | 'desc' = 'asc'): T[] {
	return direction === 'asc'
		? arr.sort((a: T, b: T) => propertySupplier(a) - propertySupplier(b))
		: arr.sort((a: T, b: T) => propertySupplier(a) - propertySupplier(b))
}