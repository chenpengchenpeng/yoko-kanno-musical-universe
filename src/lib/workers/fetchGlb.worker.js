/**
 * Fetches GLB file in a Web Worker so network I/O doesn't block the main thread.
 * Returns the ArrayBuffer to the main thread; parsing still runs on main (GLTFLoader/Three.js).
 */
self.onmessage = async (e) => {
	const { id, url } = e.data;
	try {
		const res = await fetch(url);
		if (!res.ok) throw new Error(res.statusText);
		const ab = await res.arrayBuffer();
		// Worker.postMessage(message, transfer) — 2nd arg is Transferable[], not targetOrigin
		// @ts-expect-error DOM types treat postMessage as Window; in Worker the 2nd param is transfer list
		self.postMessage({ id, buffer: ab }, [ab]);
	} catch (err) {
		self.postMessage({ id, error: err instanceof Error ? err.message : String(err) });
	}
};
