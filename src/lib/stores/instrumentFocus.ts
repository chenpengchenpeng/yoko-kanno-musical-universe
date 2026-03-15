import { writable } from 'svelte/store';

export type InstrumentKey =
	| 'room'
	| 'piano'
	| 'violin'
	| 'drums'
	| 'saxophone'
	| 'guitar'
	| 'cello';

export const instrumentFocus = writable<InstrumentKey>('room');

export const setInstrumentFocus = (instrument: InstrumentKey) => {
	instrumentFocus.set(instrument);
};

