<script lang="ts">
	import { fade } from 'svelte/transition';
	import { settingsVM } from '../settings.svelte.js';
	import type { ConfirmDialogViewModel } from '$lib/ui/confirm-dialog/confirm-dialog.svelte.js';
	import { expensesVM } from '$features/expenses/expenses.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { categoriesVM } from '$features/categories/categories.svelte.js';
	import CategoryEditorSheet from '$features/categories/category-editor/category-editor-sheet.svelte';
	import { CategoryEditorSheetViewModel } from '$features/categories/category-editor/category-editor-sheet.svelte.js';
	import { recurringVM } from '$features/recurring/recurring.svelte.js';
	import { subscriptionsVM } from '$features/subscriptions/subscriptions.svelte.js';
	import { navigationVM } from '$features/navigation/navigation.svelte.js';
	import RecurringEditorSheet from '$features/recurring/recurring-editor-sheet.svelte';
	import { RecurringEditorSheetViewModel } from '$features/recurring/recurring-editor-sheet.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { scrollNav } from '$lib/utils/scroll-nav.js';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';
	import { LANG_OPTIONS } from '$lib/utils/locale.js';
	import { CURRENCIES, CURRENCY_LABELS } from '$lib/constants.js';

	let { confirmVM }: { confirmVM: ConfirmDialogViewModel } = $props();

	let locale = $state(getLocale());
	let fiatDropdown = $state(settingsVM.fiatViewEnabled ? settingsVM.fiatCurrency : 'off');

	$effect(() => {
		if (locale !== getLocale()) {
			setLocale(locale as (typeof locales)[number]);
		}
	});

	$effect(() => {
		if (fiatDropdown === 'off') {
			if (settingsVM.fiatViewEnabled) {
				settingsVM.fiatViewEnabled = false;
				settingsVM.setFiatCurrency(settingsVM.currency);
			}
		} else {
			if (!settingsVM.fiatViewEnabled || settingsVM.fiatCurrency !== fiatDropdown) {
				settingsVM.fiatViewEnabled = true;
				settingsVM.setFiatCurrency(fiatDropdown);
			}
		}
	});

	const catEditorVM = new CategoryEditorSheetViewModel();
	const recEditorVM = new RecurringEditorSheetViewModel();

	function deleteCategory(id: string) {
		categoriesVM.remove(id);
	}

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
				categoriesVM.resetAll();
				recurringVM.resetAll();
				subscriptionsVM.resetAll();
				navigationVM.goTo('home');
			}
		});
	}
</script>

<div class="top-bar">
	<span class="top-bar-title">{m.screen_title_settings()}</span>
</div>

<div class="content" use:scrollNav>
	<!-- Регулярні платежі -->
	<div>
		<div class="settings-section-title">{m.recurring_section_title()}</div>
		<div class="settings-group">
			{#each recurringVM.items as item (item.id)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="settings-row" onclick={() => recEditorVM.openEdit(item.id)}>
					<div class="settings-row-icon">
						<Icon name={item.icon} size={18} />
					</div>
					<div class="settings-row-info">
						<div class="settings-row-label">{item.label}</div>
						<div class="settings-row-value">
							{item.type === 'income' ? '+' : '−'}{settingsVM.currency}{fmt(item.amount)} · {item.frequency === 'daily' ? m.recurring_daily() : item.frequency === 'weekly' ? m.recurring_weekly() : m.recurring_monthly()}
						</div>
					</div>
					<div class="settings-row-right">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span class="cat-edit-btn" onclick={(e) => { e.stopPropagation(); recurringVM.toggle(item.id); }}>
							<div class="toggle" class:on={item.enabled}>
								<div class="toggle-handle"></div>
							</div>
						</span>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span class="cat-delete-btn" onclick={(e) => { e.stopPropagation(); recurringVM.remove(item.id); }}>
							<Icon name="trash" size={16} />
						</span>
					</div>
				</div>
			{/each}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="settings-row add-cat-row" onclick={() => recEditorVM.open()}>
				<div class="settings-row-icon"><Icon name="plus" size={18} /></div>
				<div class="settings-row-info">
					<div class="settings-row-label" style="color:var(--accent)">{m.recurring_add_button()}</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Категорії витрат -->
	<div>
		<div class="settings-section-title">{m.categories_expense_title()}</div>
		<div class="settings-group">
			{#each categoriesVM.expenseCategories as cat (cat.id)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="settings-row" out:fade={{ duration: 200 }} onclick={() => catEditorVM.openEdit(cat.id)}>
					<div class="settings-row-icon" style:background={cat.bg} style:border-color={cat.border}>
						<Icon name={cat.icon} size={18} />
					</div>
					<div class="settings-row-info">
						<div class="settings-row-label">{cat.label}</div>
					</div>
					<div class="settings-row-right">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span class="cat-delete-btn" onclick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }}>
							<Icon name="trash" size={16} />
						</span>
					</div>
				</div>
			{/each}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="settings-row add-cat-row" onclick={() => catEditorVM.open('expense')}>
				<div class="settings-row-icon"><Icon name="plus" size={18} /></div>
				<div class="settings-row-info">
					<div class="settings-row-label" style="color:var(--accent)">{m.category_add_button()}</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Категорії надходжень -->
	<div>
		<div class="settings-section-title">{m.categories_income_title()}</div>
		<div class="settings-group">
			{#each categoriesVM.incomeCategories as cat (cat.id)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="settings-row" out:fade={{ duration: 200 }} onclick={() => catEditorVM.openEdit(cat.id)}>
					<div class="settings-row-icon" style:background={cat.bg} style:border-color={cat.border}>
						<Icon name={cat.icon} size={18} />
					</div>
					<div class="settings-row-info">
						<div class="settings-row-label">{cat.label}</div>
						{#if cat.commission}
							<div class="settings-row-value">{m.category_commission_label()}: {cat.commission}%</div>
						{/if}
					</div>
					<div class="settings-row-right">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span class="cat-delete-btn" onclick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }}>
							<Icon name="trash" size={16} />
						</span>
					</div>
				</div>
			{/each}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="settings-row add-cat-row" onclick={() => catEditorVM.open('income')}>
				<div class="settings-row-icon"><Icon name="plus" size={18} /></div>
				<div class="settings-row-info">
					<div class="settings-row-label" style="color:var(--accent)">{m.category_add_button()}</div>
				</div>
			</div>
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
			<div class="settings-row fiat-row">
				<div class="settings-row-icon"><Icon name="banknote" size={18} /></div>
				<div class="settings-row-info">
					<div class="settings-row-label">{m.settings_fiat_view_label()}</div>
					<div class="settings-row-value">{m.settings_fiat_view_desc()}</div>
				</div>
				<div class="settings-row-right">
					<Dropdown
						bind:value={fiatDropdown}
						options={[
							{ value: 'off', label: m.settings_fiat_view_off() },
							...CURRENCIES.map((c) => ({ value: c, label: CURRENCY_LABELS[c] ?? c }))
						]}
						position="top"
					/>
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

<CategoryEditorSheet vm={catEditorVM} />
<RecurringEditorSheet vm={recEditorVM} />

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
		font-weight: 500;
		color: rgba(255, 255, 255, 0.85);
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
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 1.4px;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.25);
		padding: 0 4px 8px;
	}

	.settings-group {
		background: #09090e;
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.07);
		position: relative;
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
		width: 34px;
		height: 34px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.4);
	}

	.settings-row-info {
		flex: 1;
		min-width: 0;
	}
	.settings-row-label {
		font-size: 14px;
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
		background: var(--accent-bg);
		border-color: var(--accent-border);
		box-shadow: 0 0 8px var(--accent-glow);
	}

	.toggle-handle {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.8);
		transition: all 0.25s ease;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
	}
	.toggle.on .toggle-handle {
		left: 22px;
		background: var(--accent);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
	}

	.danger-text {
		color: var(--danger);
	}

	.cat-edit-btn,
	.cat-delete-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 8px;
		cursor: pointer;
		transition: background 0.15s ease;
	}
	.cat-edit-btn:hover {
		background: rgba(255, 255, 255, 0.06);
	}
	.cat-delete-btn {
		color: var(--danger);
	}
	.cat-delete-btn:hover {
		background: var(--danger-bg);
	}
	.add-cat-row {
		cursor: pointer;
	}

	.fiat-row {
		cursor: default;
	}
</style>
