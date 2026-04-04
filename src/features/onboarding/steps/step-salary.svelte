<script lang="ts">
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import { fmt } from '$lib/utils/format.js';
	import { convert } from '$lib/utils/currency.js';
	import { CURRENCIES, CURRENCY_CODES, CURRENCY_LABELS } from '$lib/constants.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		value = $bindable<number | null>(null),
		currency = $bindable<string>('₴'),
		fiatViewEnabled = $bindable<boolean>(false),
		fiatCurrency = $bindable<string>('₴'),
		onNext
	}: { value: number | null; currency: string; fiatViewEnabled: boolean; fiatCurrency: string; onNext: () => void } = $props();

	let fiatDropdown = $state('off');

	$effect(() => {
		fiatViewEnabled = fiatDropdown !== 'off';
		if (fiatDropdown !== 'off') fiatCurrency = fiatDropdown;
	});

	const canNext = $derived(value !== null && value > 0);
	function fmtShort(n: number): string {
		if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
		if (n >= 10_000) return `${(n / 1_000).toFixed(1)}k`;
		return fmt(n);
	}

	const displayAmount = $derived.by(() => {
		if (!value || value <= 0) return `${currency}0`;
		if (fiatDropdown !== 'off' && fiatDropdown !== currency) {
			const converted = convert(value, currency, fiatDropdown);
			return `${fiatDropdown}${fmtShort(converted)}`;
		}
		return `${currency}${fmtShort(value)}`;
	});
</script>

<div class="slide-layout">
	<div class="slide-visual h-60">
		<div class="glow-orb glow-1"></div>
		<div class="glow-orb glow-2"></div>
		<div class="ill">
			<svg width="240" height="240" viewBox="0 0 200 200" fill="none">
				<rect x="30" y="60" width="140" height="88" rx="16" fill="var(--surface-4)" stroke="var(--surface-8)" stroke-width="1"/>
				<rect x="18" y="48" width="140" height="88" rx="16" fill="var(--card)" stroke="var(--accent-border)" stroke-width="1"/>
				<ellipse cx="50" cy="62" rx="40" ry="25" fill="var(--accent-bg)"/>
				<rect x="34" y="68" width="28" height="20" rx="4" fill="var(--surface-10)" stroke="var(--surface-16)" stroke-width="0.8"/>
				<line x1="34" y1="76" x2="62" y2="76" stroke="var(--surface-12)" stroke-width="0.8"/>
				<text x="34" y="108" font-family="DM Sans,sans-serif" font-size="11" fill="var(--text-mid)" font-weight="400">{m.income_label()}</text>
				<text x="34" y="124" font-family="DM Sans,sans-serif" font-size="18" fill="var(--text-hi)" font-weight="500" letter-spacing="-0.5">{displayAmount}</text>
				<circle cx="118" cy="120" r="7" fill="rgba(80,200,120,0.5)"/>
				<circle cx="130" cy="120" r="7" fill="rgba(80,200,120,0.3)"/>
			</svg>
		</div>
	</div>

	<div class="slide-text-block">
		<div class="slide-num">02 / 05</div>
		<h2 class="slide-title">{@html m.onboarding_salary_title()}</h2>
		<p class="slide-desc">{m.onboarding_salary_desc_new()}</p>
	</div>

	<div class="input-area">
		<div class="currency-chips">
			{#each CURRENCIES as cur (cur)}
				<button
					class="cur-chip"
					class:active={currency === cur}
					onclick={() => (currency = cur)}
				>
					{cur} {CURRENCY_CODES[cur]}
				</button>
			{/each}
		</div>
		<MoneyInput bind:value {currency} size="lg" placeholder="30 000" autofocus />

		<div class="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-hi)] bg-[var(--surface-4)] px-4 py-3.5">
			<div class="flex flex-col gap-0.5">
				<span class="text-sm font-medium text-[var(--text-hi)]">{m.settings_fiat_view_label()}</span>
				<span class="text-2xs text-[var(--text-muted)]">{m.settings_fiat_view_desc()}</span>
			</div>
			<Dropdown
				bind:value={fiatDropdown}
				class="min-w-[100px]"
				options={[
					{ value: 'off', label: m.settings_fiat_view_off() },
					...CURRENCIES.map((c) => ({ value: c, label: CURRENCY_LABELS[c] ?? c }))
				]}
			/>
		</div>
	</div>

	<div class="slide-bottom">
		<Button variant="primary" size="lg" class="text-md rounded-[18px]" disabled={!canNext} onclick={onNext}>{m.onboarding_next()} →</Button>
	</div>
</div>

<style>
	.glow-1 {
		width: 240px; height: 180px; left: -30px; top: -30px;
		background: radial-gradient(ellipse, rgba(80,200,120,0.3) 0%, transparent 70%);
	}
	.glow-2 {
		width: 160px; height: 160px; right: -20px; bottom: -20px;
		background: radial-gradient(ellipse, rgba(60,100,255,0.25) 0%, transparent 70%);
		animation-delay: 2s;
	}
	.ill { position: relative; z-index: 2; }

	.input-area {
		padding: 1.25rem 1.5rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.currency-chips {
		display: flex;
		gap: 0.375rem;
		flex-wrap: wrap;
	}
	.cur-chip {
		padding: 0.4375rem 0.75rem;
		border-radius: 0.625rem;
		border: 1px solid var(--surface-8);
		background: var(--surface-4);
		color: var(--text-lo);
		font-size: 0.8125rem;
		font-weight: 500;
		font-family: var(--font);
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.cur-chip.active {
		border-color: var(--text-muted);
		background: var(--surface-8);
		color: var(--text-hi);
	}
</style>
