<script lang="ts">
	import ScreenTrack from '$features/navigation/screen-track/screen-track.svelte';
	import BottomNav from '$features/navigation/bottom-nav/bottom-nav.svelte';
	import HomeScreen from '$features/home/home-screen/home-screen.svelte';
	import HistoryScreen from '$features/history/history-screen/history-screen.svelte';
	import AnalyticsScreen from '$features/analytics/analytics-screen/analytics-screen.svelte';
	import SettingsScreen from '$features/settings/settings-screen/settings-screen.svelte';
	import AddExpenseSheet from '$features/add-expense/add-expense-sheet.svelte';
	import { AddExpenseSheetViewModel } from '$features/add-expense/add-expense-sheet.svelte.js';
	import EditExpense from '$features/expenses/edit-expense/edit-expense.svelte';
	import { EditExpenseViewModel } from '$features/expenses/edit-expense/edit-expense.svelte.js';
	import ConfirmDialog from '$lib/ui/confirm-dialog/confirm-dialog.svelte';
	import { ConfirmDialogViewModel } from '$lib/ui/confirm-dialog/confirm-dialog.svelte.js';
	import AddAccountSheet from '$features/accounts/add-account/add-account-sheet.svelte';
	import { AddAccountSheetViewModel } from '$features/accounts/add-account/add-account-sheet.svelte.js';
	import EditAccountSheet from '$features/accounts/edit-account/edit-account-sheet.svelte';
	import { EditAccountSheetViewModel } from '$features/accounts/edit-account/edit-account-sheet.svelte.js';
	import SubscriptionEditorSheet from '$features/subscriptions/subscription-editor/subscription-editor-sheet.svelte';
	import { SubscriptionEditorSheetViewModel } from '$features/subscriptions/subscription-editor/subscription-editor-sheet.svelte.js';
	import Onboarding from '$features/onboarding/onboarding.svelte';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { recurringVM } from '$features/recurring/recurring.svelte.js';
	import { subscriptionsVM } from '$features/subscriptions/subscriptions.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	const addExpenseVM = new AddExpenseSheetViewModel();
	const addAccountVM = new AddAccountSheetViewModel();
	const editAccountVM = new EditAccountSheetViewModel();
	const editExpenseVM = new EditExpenseViewModel();
	const subEditorVM = new SubscriptionEditorSheetViewModel();
	const confirmVM = new ConfirmDialogViewModel();

	// Sync subscriptions total → settings
	$effect(() => {
		settingsVM.setSubscriptionsTotal(subscriptionsVM.monthlyTotal);
	});

	// Sync account budgets when settings budget changes
	$effect(() => {
		const budget = settingsVM.budget;
		if (!settingsVM.loaded || budget <= 0) return;
		for (const acc of accountsVM.accounts) {
			if (acc.budget !== budget) {
				accountsVM.update(acc.id, { budget });
			}
		}
	});
</script>

<div class="phone">
	<ScreenTrack>
		<div class="screen">
			<AnalyticsScreen
				onAddAccount={() => addAccountVM.open()}
				onEditAccount={(id) => editAccountVM.open(id)}
				onAddSubscription={() => subEditorVM.openNew()}
				onEditSubscription={(id) => subEditorVM.openEdit(id)}
			/>
		</div>
		<div class="screen">
			<HomeScreen
				onEdit={(id: number) => editExpenseVM.open(id)}
				onAdd={() => addExpenseVM.open()}
			/>
		</div>
		<div class="screen">
			<HistoryScreen onEdit={(id: number) => editExpenseVM.open(id)} />
		</div>
		<div class="screen">
			<SettingsScreen {confirmVM} />
		</div>
	</ScreenTrack>

	<BottomNav onAdd={() => addExpenseVM.open()} />

	<AddExpenseSheet vm={addExpenseVM} />
	<AddAccountSheet vm={addAccountVM} />
	<EditAccountSheet vm={editAccountVM} onDelete={(id, name) => {
		confirmVM.show({
			title: m.button_delete(),
			message: name,
			okLabel: m.button_delete(),
			okStyle: 'danger',
			onConfirm() { editAccountVM.delete(); }
		});
	}} />
	<EditExpense vm={editExpenseVM} />
	<SubscriptionEditorSheet vm={subEditorVM} />
	<ConfirmDialog vm={confirmVM} />

	{#if settingsVM.loaded && !settingsVM.onboardingDone}
		<Onboarding />
	{/if}
</div>

<style>
	.phone {
		width: 100%;
		height: 100vh;
		padding-top: calc(12px + env(safe-area-inset-top));
		background: var(--bg);
		overflow: hidden;
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	/* Ambient mesh gradient — sits behind everything */
	.phone::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 600px 400px at 30% 20%,
				rgba(60, 100, 220, 0.03) 0%,
				transparent 100%
			),
			radial-gradient(
				ellipse 500px 500px at 70% 80%,
				rgba(120, 50, 180, 0.02) 0%,
				transparent 100%
			);
	}

	.screen {
		flex-shrink: 0;
		width: 100%;
		height: 100%;
		min-height: 0;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 1;
		overflow: hidden;
	}
</style>
