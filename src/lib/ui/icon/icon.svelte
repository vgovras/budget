<script lang="ts">
	import * as icons from '@lucide/svelte';

	let {
		name,
		size = 24,
		class: className = '',
		strokeWidth = 1.8
	}: {
		name: string;
		size?: number;
		class?: string;
		strokeWidth?: number;
	} = $props();

	const iconMap: Record<string, typeof icons.Home> = {
		home: icons.Home,
		list: icons.List,
		plus: icons.Plus,
		'bar-chart': icons.BarChart3,
		settings: icons.Settings,
		'chevron-left': icons.ChevronLeft,
		'chevron-right': icons.ChevronRight,
		'arrow-right': icons.ArrowRight,
		calendar: icons.Calendar,
		trash: icons.Trash2,
		edit: icons.Pencil,
		x: icons.X,
		utensils: icons.Utensils,
		car: icons.Car,
		tv: icons.Tv,
		gamepad: icons.Gamepad,
		'heart-pulse': icons.HeartPulse,
		house: icons.House,
		wallet: icons.Wallet,
		target: icons.Target,
		'piggy-bank': icons.PiggyBank,
		bell: icons.Bell,
		'triangle-alert': icons.TriangleAlert,
		'credit-card': icons.CreditCard,
		landmark: icons.Landmark,
		banknote: icons.Banknote,
		sparkles: icons.Sparkles,
		check: icons.Check
	};

	const IconComponent = $derived(iconMap[name]);
</script>

{#if IconComponent}
	<IconComponent {size} {strokeWidth} class={className} />
{/if}
