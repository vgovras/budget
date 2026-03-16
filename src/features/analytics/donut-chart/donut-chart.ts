import { CAT_COLORS, CAT_GLOWS } from '$lib/constants.js';

export interface DonutSlice {
	icon: string;
	label: string;
	sum: number;
	pct: number;
	color: string;
	glow: string;
	dash: number;
	offset: number;
}

export function buildSlices(
	byCategory: { icon: string; label: string; sum: number }[],
	total: number
): DonutSlice[] {
	const r = 58;
	const circ = 2 * Math.PI * r;
	const GAP = 3;
	let offset = 0;

	return byCategory.map((cat, i) => {
		const pct = total > 0 ? cat.sum / total : 0;
		const dash = Math.max(0, pct * circ - GAP);
		const slice: DonutSlice = {
			icon: cat.icon,
			label: cat.label ?? cat.icon,
			sum: cat.sum,
			pct: Math.round(pct * 100),
			color: CAT_COLORS[i % CAT_COLORS.length],
			glow: CAT_GLOWS[i % CAT_GLOWS.length],
			dash,
			offset: offset * circ
		};
		offset += pct;
		return slice;
	});
}

export const DONUT_R = 58;
export const DONUT_CX = 74;
export const DONUT_CY = 74;
export const DONUT_CIRC = 2 * Math.PI * DONUT_R;
