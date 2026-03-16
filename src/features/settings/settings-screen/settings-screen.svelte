<script lang="ts">
	import { settingsVM } from '../settings.svelte.js';
	import SettingsInputModal from '../settings-input-modal/settings-input-modal.svelte';
	import { SettingsInputModalViewModel } from '../settings-input-modal/settings-input-modal.svelte.js';
	import type { ConfirmDialogViewModel } from '$lib/ui/confirm-dialog/confirm-dialog.svelte.js';
	import { expensesVM } from '$features/expenses/expenses.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import { CATEGORIES } from '$lib/constants.js';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { scrollNav } from '$lib/utils/scroll-nav.js';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';
	import { LANG_OPTIONS } from '$lib/utils/locale.js';

	let { confirmVM }: { confirmVM: ConfirmDialogViewModel } = $props();

	let locale = $state(getLocale());

	$effect(() => {
		if (locale !== getLocale()) {
			setLocale(locale as typeof locales[number]);
		}
	});

	const inputVM = new SettingsInputModalViewModel();

	function resetAll() {
		confirmVM.show({
			title: m.confirm_clear_all_title(),
			message: m.confirm_clear_all_message(),
			okLabel: m.button_clear(),
			okStyle: 'danger',
			onConfirm() {
				settingsVM.resetAll();
				expensesVM.resetAll();
				accountsVM.resetAll();
			}
		});
	}
</script>

<div class="top-bar">
	<span class="top-bar-title">{m.screen_title_settings()}</span>
</div>

<div class="content" use:scrollNav>
	<!-- Фінанси -->
	<div>
		<div class="settings-section-title">{m.settings_section_finances()}</div>
		<div class="settings-group">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="settings-row" onclick={() => inputVM.open('budget')}>
				<div class="settings-row-icon"><Icon name="wallet" size={18} /></div>
				<div class="settings-row-info">
					<div class="settings-row-label">{m.settings_monthly_budget_label()}</div>
					<div class="settings-row-value">{m.settings_monthly_budget_desc()}</div>
				</div>
				<div class="settings-row-right">
					<span class="settings-val-badge">₴ {fmt(settingsVM.budget)}</span>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
						><polyline points="9 18 15 12 9 6" /></svg
					>
				</div>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="settings-row" onclick={() => inputVM.open('salary')}>
				<div class="settings-row-icon"><Icon name="credit-card" size={18} /></div>
				<div class="settings-row-info">
					<div class="settings-row-label">{m.settings_salary_label()}</div>
					<div class="settings-row-value">{m.settings_salary_desc()}</div>
				</div>
				<div class="settings-row-right">
					<span class="settings-val-badge">₴ {fmt(settingsVM.salary)}</span>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
						><polyline points="9 18 15 12 9 6" /></svg
					>
				</div>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="settings-row" onclick={() => inputVM.open('payday')}>
				<div class="settings-row-icon"><Icon name="calendar" size={18} /></div>
				<div class="settings-row-info">
					<div class="settings-row-label">{m.settings_payday_label()}</div>
					<div class="settings-row-value">{m.settings_payday_desc()}</div>
				</div>
				<div class="settings-row-right">
					<span class="settings-val-badge">{settingsVM.payday}</span>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
						><polyline points="9 18 15 12 9 6" /></svg
					>
				</div>
			</div>
		</div>
	</div>

	<!-- Категорії -->
	<div>
		<div class="settings-section-title">{m.settings_section_categories()}</div>
		<div class="settings-group">
			{#each CATEGORIES as cat}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="settings-row" onclick={() => inputVM.openCatLimit(cat.icon, cat.label)}>
					<div class="settings-row-icon"><Icon name={cat.icon} size={18} /></div>
					<div class="settings-row-info">
						<div class="settings-row-label">{cat.label}</div>
					</div>
					<div class="settings-row-right">
						<span class="settings-val-badge">
							{settingsVM.catLimits[cat.icon]
								? `₴ ${fmt(settingsVM.catLimits[cat.icon])}`
								: m.analytics_no_limit()}
						</span>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
							><polyline points="9 18 15 12 9 6" /></svg
						>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Загальне -->
	<div>
		<div class="settings-section-title">{m.settings_section_general()}</div>
		<div class="settings-group">
			<div class="settings-row lang-row">
				<div class="settings-row-icon"><Icon name="globe" size={18} /></div>
				<div class="settings-row-info">
					<div class="settings-row-label">{m.settings_language_label()}</div>
					<div class="settings-row-value">{m.settings_language_desc()}</div>
				</div>
				<div class="settings-row-right">
					<Dropdown bind:value={locale} options={LANG_OPTIONS} position="top" />
				</div>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="settings-row" onclick={() => settingsVM.toggleNotifications()}>
				<div class="settings-row-icon"><Icon name="bell" size={18} /></div>
				<div class="settings-row-info">
					<div class="settings-row-label">{m.settings_reminders_label()}</div>
					<div class="settings-row-value">{m.settings_reminders_desc()}</div>
				</div>
				<div class="settings-row-right">
					<div class="toggle" class:on={settingsVM.notifications}>
						<div class="toggle-handle"></div>
					</div>
				</div>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="settings-row" onclick={() => settingsVM.toggleWarning()}>
				<div class="settings-row-icon"><Icon name="triangle-alert" size={18} /></div>
				<div class="settings-row-info">
					<div class="settings-row-label">{m.settings_warning_label()}</div>
					<div class="settings-row-value">{m.settings_warning_desc()}</div>
				</div>
				<div class="settings-row-right">
					<div class="toggle" class:on={settingsVM.warning}>
						<div class="toggle-handle"></div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Дані -->
	<div>
		<div class="settings-section-title">{m.settings_section_data()}</div>
		<div class="settings-group">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="settings-row danger" onclick={resetAll}>
				<div class="settings-row-icon"><Icon name="trash" size={18} /></div>
				<div class="settings-row-info">
					<div class="settings-row-label danger-text">{m.settings_clear_all_label()}</div>
					<div class="settings-row-value">{m.settings_clear_all_desc()}</div>
				</div>
			</div>
		</div>
	</div>
</div>

<SettingsInputModal vm={inputVM} />

<style>
	.top-bar {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 16px 10px;
		flex-shrink: 0;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}
	.top-bar-title {
		font-size: 20px;
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--text-hi);
	}

	.content {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 8px 16px calc(100px + env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		gap: 24px;
		scrollbar-width: none;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}
	.content::-webkit-scrollbar {
		display: none;
	}

	.settings-section-title {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-lo);
		padding: 0 4px 8px;
	}

	.settings-group {
		background: rgba(255, 255, 255, 0.03);
		border-radius: var(--r-lg);
		border: 1px solid rgba(255, 255, 255, 0.06);
		position: relative;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}

	.settings-row {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 16px;
		cursor: pointer;
		transition: background 0.15s ease;
		position: relative;
	}
	.settings-row:not(:last-child)::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 16px;
		right: 16px;
		height: 1px;
		background: var(--border);
	}
	.settings-row:hover {
		background: rgba(255, 255, 255, 0.03);
	}
	.lang-row {
		cursor: default;
	}

	.settings-row-icon {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		background: rgba(255, 255, 255, 0.05);
	}

	.settings-row-info {
		flex: 1;
		min-width: 0;
	}
	.settings-row-label {
		font-size: 17px;
		font-weight: 400;
		color: var(--text-hi);
	}
	.settings-row-value {
		font-size: 13px;
		color: var(--text-lo);
		font-family: var(--font-mono);
		margin-top: 1px;
	}

	.settings-row-right {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--text-lo);
		flex-shrink: 0;
	}
	.settings-row-right svg {
		width: 16px;
		height: 16px;
		stroke-width: 1.8;
		flex-shrink: 0;
	}

	.settings-val-badge {
		font-family: var(--font-mono);
		font-size: 15px;
		font-weight: 500;
		color: var(--text-mid);
	}

	.toggle {
		width: 48px;
		height: 28px;
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.08);
		position: relative;
		cursor: pointer;
		transition: all 0.25s ease;
		flex-shrink: 0;
		box-shadow: none;
	}
	.toggle.on {
		background: rgba(255, 255, 255, 0.16);
		border-color: rgba(255, 255, 255, 0.14);
		box-shadow: none;
	}

	.toggle-handle {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.80);
		transition: all 0.25s ease;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
	}
	.toggle.on .toggle-handle {
		left: 22px;
		background: #ffffff;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
	}

	.danger-text {
		color: rgba(255, 80, 80, 0.85);
	}
</style>
