export function buildQuery(params = {}) {
	return Object
		.keys(params)
		.filter(x => params[x] != null)
		.map(x => `${x}=${encodeURIComponent(params[x])}`)
		.join('&')
}
