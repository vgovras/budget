# Architecture

## Patterns

- **MVVM** — View (`.svelte`) + ViewModel (`.svelte.ts`) + Model (`.ts`)
- **Feature-based** — весь код фічі в одній директорії
- **Dependency injection** — VM створюється зверху, передається вниз через props
- **Repository pattern** — ізолює доступ до даних від логіки
- **Naming** — kebab-case для всіх файлів і папок

---

## MVVM шари

```
View           component-name.svelte      — рендер, events → методи VM
ViewModel      component-name.svelte.ts   — class з $state, $derived, методи
Model          component-name.ts          — типи, чиста логіка, без UI
```

Прості компоненти без логіки — тільки `.svelte`.

### ViewModel — клас з рунами

```ts
// add-expense-sheet.svelte.ts
import type { ExpensesViewModel } from '$features/expenses/expenses.svelte';

export class AddExpenseSheetViewModel {
	// $state — мутабельний реактивний стейт
	amount = $state(0);
	note = $state('');
	sheetType = $state<'expense' | 'income'>('expense');
	selectedCategory = $state<string | null>(null);
	isOpen = $state(false);

	// $derived — обчислюється автоматично, readonly
	readonly canSave = $derived(this.amount > 0);
	readonly dailyBudget = $derived(/* ... */);

	// Залежності через constructor (DI)
	constructor(private expensesVM: ExpensesViewModel) {}

	open() {
		this.isOpen = true;
		this.reset();
	}
	close() {
		this.isOpen = false;
	}

	save() {
		if (!this.canSave) return;
		this.expensesVM.add({
			amount: this.amount,
			note: this.note,
			type: this.sheetType,
			emoji: this.selectedCategory ?? '🍕'
			// ...
		});
		this.close();
	}

	private reset() {
		this.amount = 0;
		this.note = '';
		this.selectedCategory = null;
		this.sheetType = 'expense';
	}
}
```

### View — отримує VM через props

```svelte
<!-- add-expense-sheet.svelte -->
<script lang="ts">
	import type { AddExpenseSheetViewModel } from './add-expense-sheet.svelte';

	let { vm }: { vm: AddExpenseSheetViewModel } = $props();
</script>

<input bind:value={vm.amount} />
<button disabled={!vm.canSave} onclick={() => vm.save()}> Зберегти </button>
```

### Repository — ізоляція даних

```ts
// expenses.ts (Model)
export class ExpensesRepository {
	#expenses: Expense[] = [...SEED_EXPENSES]; // in-memory
	#nextId = 9;

	getAll(): Expense[] {
		return this.#expenses;
	}

	add(data: Omit<Expense, 'id'>): Expense {
		const expense = { ...data, id: this.#nextId++ };
		this.#expenses = [expense, ...this.#expenses];
		return expense;
	}

	update(id: number, patch: Partial<Expense>): void {
		this.#expenses = this.#expenses.map((e) => (e.id === id ? { ...e, ...patch } : e));
	}

	remove(id: number): void {
		this.#expenses = this.#expenses.filter((e) => e.id !== id);
	}
}
```

---

## Структура директорій

```
src/
├── lib/
│   ├── ui/                          # базові presentational компоненти
│   │   ├── card/
│   │   │   └── card.svelte
│   │   ├── button/
│   │   │   └── button.svelte
│   │   ├── confirm-dialog/
│   │   │   ├── confirm-dialog.svelte
│   │   │   └── confirm-dialog.svelte.ts
│   │   ├── bottom-sheet/            # vaul-svelte wrapper
│   │   │   └── bottom-sheet.svelte
│   │   └── icon/
│   │       └── icon.svelte          # @lucide/svelte wrapper
│   │
│   ├── types.ts                     # всі TypeScript інтерфейси
│   ├── constants.ts                 # CATEGORIES, CAT_COLORS, SCREEN_ORDER
│   └── utils/
│       ├── format.ts                # fmt(), getDateKey()
│       └── budget.ts                # getDailyBudget(), getAccStats()
│
├── features/
│   ├── app/                         # кореневий оркестратор
│   │   ├── app.svelte               # View — збирає всі features
│   │   └── app.svelte.ts            # AppViewModel — створює всі VM, DI
│   │
│   ├── navigation/                  # керування активним екраном і свайпом
│   │   ├── navigation.svelte.ts     # NavigationViewModel
│   │   ├── screen-track/
│   │   │   └── screen-track.svelte  # горизонтальний контейнер
│   │   └── bottom-nav/
│   │       ├── bottom-nav.svelte
│   │       └── bottom-nav.svelte.ts
│   │
│   ├── accounts/                    # рахунки
│   │   ├── accounts.ts              # AccountsRepository
│   │   ├── accounts.svelte.ts       # AccountsViewModel
│   │   ├── account-carousel/
│   │   │   ├── account-carousel.svelte
│   │   │   └── account-carousel.svelte.ts
│   │   └── account-card/
│   │       └── account-card.svelte  # простий — тільки .svelte
│   │
│   ├── expenses/                    # витрати
│   │   ├── expenses.ts              # ExpensesRepository
│   │   ├── expenses.svelte.ts       # ExpensesViewModel
│   │   ├── expense-list/
│   │   │   ├── expense-list.svelte
│   │   │   └── expense-list.svelte.ts
│   │   ├── expense-row/
│   │   │   └── expense-row.svelte
│   │   └── edit-expense/
│   │       ├── edit-expense.svelte
│   │       └── edit-expense.svelte.ts
│   │
│   ├── add-expense/                 # шторка додавання витрати
│   │   ├── add-expense-sheet.svelte
│   │   ├── add-expense-sheet.svelte.ts  # AddExpenseSheetViewModel
│   │   ├── quick-chips/
│   │   │   ├── quick-chips.svelte
│   │   │   └── quick-chips.ts       # getRecentUnique()
│   │   ├── category-picker/
│   │   │   └── category-picker.svelte
│   │   └── note-input/
│   │       ├── note-input.svelte
│   │       └── note-input.ts        # getNoteSuggestions()
│   │
│   ├── analytics/                   # графіки і статистика
│   │   ├── analytics.svelte.ts      # AnalyticsViewModel
│   │   ├── analytics-screen/
│   │   │   └── analytics-screen.svelte
│   │   ├── donut-chart/
│   │   │   ├── donut-chart.svelte
│   │   │   └── donut-chart.ts       # buildSlices(), анімація
│   │   ├── weekly-bars/
│   │   │   └── weekly-bars.svelte
│   │   └── category-limits/
│   │       ├── category-limits.svelte
│   │       └── category-limits.svelte.ts
│   │
│   ├── settings/                    # налаштування
│   │   ├── settings.ts              # SettingsRepository
│   │   ├── settings.svelte.ts       # SettingsViewModel
│   │   ├── settings-screen/
│   │   │   └── settings-screen.svelte
│   │   ├── goal-card/
│   │   │   ├── goal-card.svelte
│   │   │   └── goal-card.svelte.ts  # GoalCardViewModel
│   │   └── settings-input-modal/
│   │       ├── settings-input-modal.svelte
│   │       └── settings-input-modal.svelte.ts
│   │
│   └── onboarding/                  # онбординг
│       ├── onboarding.svelte
│       ├── onboarding.svelte.ts     # OnboardingViewModel
│       └── steps/
│           ├── step-welcome.svelte
│           ├── step-budget.svelte
│           ├── step-salary.svelte
│           ├── step-payday.svelte
│           ├── step-goal.svelte
│           └── step-finish.svelte
│
└── routes/
    └── +page.svelte                 # єдина сторінка — монтує app.svelte
```

---

## Shared State — ViewModel як singleton

Коли стейт потрібен у кількох непов'язаних компонентах — **exported ViewModel instance** у `.svelte.ts` файлі. ViewModel містить і `$state` і Repository — один клас, один файл.

```ts
// features/expenses/expenses.svelte.ts
import type { ExpensesRepository } from './expenses.ts';

export class ExpensesViewModel {
	#repo: ExpensesRepository;

	expenses = $state<Expense[]>([]);
	nextId = $state(9);

	readonly total = $derived(
		this.expenses.filter((e) => e.type !== 'income').reduce((s, e) => s + e.amount, 0)
	);

	constructor(repo: ExpensesRepository) {
		this.#repo = repo;
		// Завантажити початкові дані з репозиторію
		const saved = this.#repo.load();
		this.expenses = saved.expenses ?? [...SEED_EXPENSES];
		this.nextId = saved.nextId ?? 9;
	}

	add(data: Omit<Expense, 'id'>): Expense {
		const exp = { ...data, id: this.nextId++ };
		this.expenses = [exp, ...this.expenses];
		this.#repo.save(this.#snapshot());
		return exp;
	}

	update(id: number, patch: Partial<Expense>) {
		this.expenses = this.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e));
		this.#repo.save(this.#snapshot());
	}

	remove(id: number) {
		this.expenses = this.expenses.filter((e) => e.id !== id);
		this.#repo.save(this.#snapshot());
	}

	reset() {
		this.expenses = [...SEED_EXPENSES];
		this.nextId = 9;
		this.#repo.clear();
	}

	#snapshot() {
		return { expenses: this.expenses, nextId: this.nextId };
	}
}

// Singleton — один інстанс на весь app
// Repository передається при створенні
import { ExpensesRepository } from './expenses.ts';
export const expensesVM = new ExpensesViewModel(new ExpensesRepository());
```

```ts
// features/accounts/accounts.svelte.ts
export class AccountsViewModel {
	#repo: AccountsRepository;

	accounts = $state<Account[]>([]);
	activeIdx = $state(0);

	readonly active = $derived(this.accounts[this.activeIdx]);

	constructor(repo: AccountsRepository) {
		this.#repo = repo;
		this.accounts = this.#repo.load() ?? [...SEED_ACCOUNTS];
	}

	setActive(idx: number) {
		this.activeIdx = idx;
	}

	add(data: Omit<Account, 'id'>) {
		const acc = { ...data, id: 'acc-' + Date.now() };
		this.accounts = [...this.accounts, acc];
		this.#repo.save(this.accounts);
	}

	update(id: string, patch: Partial<Account>) {
		this.accounts = this.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a));
		this.#repo.save(this.accounts);
	}
}

import { AccountsRepository } from './accounts.ts';
export const accountsVM = new AccountsViewModel(new AccountsRepository());
```

### Repository — тільки I/O, без логіки

```ts
// features/expenses/expenses.ts
export class ExpensesRepository {
	readonly #key = 'budget:expenses';

	load(): { expenses: Expense[]; nextId: number } | null {
		try {
			const raw = localStorage.getItem(this.#key);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	}

	save(data: { expenses: Expense[]; nextId: number }): void {
		try {
			localStorage.setItem(this.#key, JSON.stringify(data));
		} catch {
			/* quota exceeded */
		}
	}

	clear(): void {
		localStorage.removeItem(this.#key);
	}
}
```

### Як інший VM використовує shared ViewModel

```ts
// features/analytics/analytics.svelte.ts
import { expensesVM } from '$features/expenses/expenses.svelte';
import { accountsVM } from '$features/accounts/accounts.svelte';

export class AnalyticsViewModel {
	// $derived реагує на зміни в expensesVM і accountsVM автоматично
	readonly accountExpenses = $derived(
		expensesVM.expenses.filter((e) => e.accountId === accountsVM.active?.id && e.type !== 'income')
	);

	readonly byCategory = $derived(
		Object.entries(
			this.accountExpenses.reduce<Record<string, number>>((acc, e) => {
				acc[e.emoji] = (acc[e.emoji] ?? 0) + e.amount;
				return acc;
			}, {})
		)
			.map(([emoji, sum]) => ({ emoji, sum }))
			.sort((a, b) => b.sum - a.sum)
	);
}
```

### Як .svelte створює свій VM

```svelte
<!-- features/analytics/analytics-screen/analytics-screen.svelte -->
<script lang="ts">
	import { AnalyticsViewModel } from '../analytics.svelte';

	// Кожен .svelte сам створює свій VM
	const vm = new AnalyticsViewModel();
</script>

{#each vm.byCategory as cat}
	<div>{cat.emoji} {cat.sum}</div>
{/each}
```

### Структура файлів

```
features/
├── expenses/
│   ├── expenses.ts              ← ExpensesRepository + типи + seed
│   ├── expenses.svelte.ts       ← ExpensesViewModel singleton (expensesVM)
│   └── ...
├── accounts/
│   ├── accounts.ts              ← AccountsRepository + типи + seed
│   ├── accounts.svelte.ts       ← AccountsViewModel singleton (accountsVM)
│   └── ...
└── settings/
    ├── settings.ts              ← SettingsRepository + типи
    └── settings.svelte.ts       ← SettingsViewModel singleton (settingsVM)
```

### Правило

```
✅ ViewModel — singleton, містить $state + Repository
✅ Repository — тільки localStorage I/O, чистий .ts
✅ VM зберігає після кожної мутації через #repo.save()
✅ Інші VM імпортують singleton напряму (expensesVM)
❌ Не передавати VM через props якщо це shared singleton
❌ Repository не знає про $state і реактивність
❌ Не дублювати — один singleton на домен
```

---

---

## Правила залежностей між features

```
✅ Feature VM імпортує store іншої feature напряму
✅ Feature може залежати від lib/ui і lib/utils
✅ .svelte створює свій VM сам (new ViewModel())
❌ Feature не імпортує .svelte файл іншої feature
❌ Не передавати store через props — імпортуй напряму
❌ Не дублювати store — один singleton на домен
```

**Напрямок залежностей:**

```
routes/+page.svelte
  └── features/*/screen.svelte     (монтує екрани)
        └── new FeatureViewModel() (кожен сам)
              └── featureStore     (singleton import)
                    └── lib/       (utils, types, constants)
```

---

## ViewModel — детальні приклади

### NavigationViewModel

```ts
// features/navigation/navigation.svelte.ts
import { SCREEN_ORDER, type ScreenId } from '$lib/constants';

export class NavigationViewModel {
	currentScreen = $state<ScreenId>('home');
	navVisible = $state(true);

	readonly currentIndex = $derived(SCREEN_ORDER.indexOf(this.currentScreen));

	goTo(id: ScreenId) {
		this.currentScreen = id;
		this.navVisible = true;
	}

	goNext() {
		const next = SCREEN_ORDER[this.currentIndex + 1];
		if (next) this.goTo(next);
	}

	goPrev() {
		const prev = SCREEN_ORDER[this.currentIndex - 1];
		if (prev) this.goTo(prev);
	}

	setNavVisible(visible: boolean) {
		this.navVisible = visible;
	}
}
```

### ExpensesViewModel

```ts
// features/expenses/expenses.svelte.ts
export class ExpensesViewModel {
	#repo: ExpensesRepository;

	expenses = $state<Expense[]>([]);

	readonly total = $derived(
		this.expenses.filter((e) => e.type !== 'income').reduce((s, e) => s + e.amount, 0)
	);

	constructor(repo: ExpensesRepository) {
		this.#repo = repo;
		this.expenses = repo.getAll();
	}

	forAccount(accountId: string) {
		return $derived(this.expenses.filter((e) => e.accountId === accountId));
	}

	add(data: Omit<Expense, 'id'>) {
		const exp = this.#repo.add({ ...data, date: new Date().toISOString() });
		this.expenses = [exp, ...this.expenses];
	}

	update(id: number, patch: Partial<Expense>) {
		this.#repo.update(id, patch);
		this.expenses = this.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e));
	}

	remove(id: number) {
		this.#repo.remove(id);
		this.expenses = this.expenses.filter((e) => e.id !== id);
	}
}
```

### AnalyticsViewModel

```ts
// features/analytics/analytics.svelte.ts
export class AnalyticsViewModel {
	constructor(
		private expensesVM: ExpensesViewModel,
		private accountsVM: AccountsViewModel
	) {}

	readonly activeAccount = $derived(this.accountsVM.accounts[this.accountsVM.activeIdx]);

	readonly accountExpenses = $derived(
		this.expensesVM.expenses.filter(
			(e) => e.accountId === this.activeAccount?.id && e.type !== 'income'
		)
	);

	readonly total = $derived(this.accountExpenses.reduce((s, e) => s + e.amount, 0));

	readonly byCategory = $derived(
		Object.entries(
			this.accountExpenses.reduce<Record<string, number>>((acc, e) => {
				acc[e.emoji] = (acc[e.emoji] ?? 0) + e.amount;
				return acc;
			}, {})
		)
			.map(([emoji, sum]) => ({ emoji, sum }))
			.sort((a, b) => b.sum - a.sum)
	);

	readonly weeklyAmounts = $derived(
		Array.from({ length: 7 }, (_, i) => {
			const d = new Date();
			d.setDate(d.getDate() - (6 - i));
			const key = d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
			return this.accountExpenses
				.filter(
					(e) =>
						e.date &&
						new Date(e.date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' }) ===
							key
				)
				.reduce((s, e) => s + e.amount, 0);
		})
	);

	readonly dailyBudget = $derived(
		(() => {
			const acc = this.activeAccount;
			if (!acc) return 0;
			const now = new Date();
			const daysLeft =
				new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() + 1;
			const remaining = Math.max(0, acc.budget - this.total);
			return Math.floor(remaining / Math.max(daysLeft, 1));
		})()
	);
}
```

---

## Конвенції іменування

```
features/add-expense/               ← kebab-case директорія
  add-expense-sheet.svelte          ← kebab-case файл
  add-expense-sheet.svelte.ts       ← ViewModel
  add-expense-sheet.ts              ← Model (якщо є)

class AddExpenseSheetViewModel {}   ← PascalCase клас
let vm = new AddExpenseSheetViewModel(...)

<!-- в .svelte -->
let { vm }: { vm: AddExpenseSheetViewModel } = $props();
```

---

## Стилізація — Tailwind CSS first

```
✅ Tailwind класи в class="" — за замовчуванням для всіх стилів
✅ Theme токени — text-text-hi, bg-card-alt, border-accent-border (не hardcoded rgba)
✅ Типографія — text-2xs(10) text-xs(12) text-sm(14) text-base(16) text-lg(18) text-xl(20)
✅ cn() — для умовних класів і variant maps (button, chip)
✅ <style> — ТІЛЬКИ для pseudo-elements (::before/::after), нескінченних CSS анімацій,
   scroll-snap, SVG filter, :global() селекторів, CSS vars в gradient
❌ <style> для layout, кольорів, spacing, typography — використовуй Tailwind
❌ Hardcoded кольори (rgba, #hex) — додай токен в :root + @theme в app.css
❌ Hardcoded font-size (text-[13px]) — використовуй шкалу або додай в @theme
```

### Theme архітектура (app.css)

```
:root { --accent: rgba(80,130,255,0.7); }     ← значення, override для тем
@theme inline { --color-accent: var(--accent); }  ← маплення на Tailwind утиліти
```

Для додавання нового кольору:
1. Додай змінну в `:root` в `app.css`
2. Додай маплення в `@theme inline`
3. Використовуй як `bg-accent`, `text-accent`, `border-accent`

---

## Що НЕ робити

```
❌ export let prop  — Svelte 4, використовуй $props()
❌ $: derived       — Svelte 4, використовуй $derived
❌ writable()       — Svelte 4 stores, використовуй $state в class
❌ get total() { return $derived(...) }  — не працює, використовуй readonly total = $derived(...)
❌ Глобальний стор для всього  — тільки Repository як singleton
❌ Feature імпортує .svelte іншої feature  — тільки через VM props
❌ Логіка в .svelte файлах  — тільки в ViewModel або Model
❌ <style> для layout/кольорів — використовуй Tailwind класи
❌ Hardcoded rgba/hex кольори — додай токен в :root + @theme
```
