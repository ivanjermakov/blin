export interface Show {
	show(): any
}

export function format(output: Show[] | any[]) {
	return output.map(i => {
		return i.show ? i.show() : i
	})
}