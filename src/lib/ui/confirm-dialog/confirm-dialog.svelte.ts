export class ConfirmDialogViewModel {
	isOpen = $state(false);
	title = $state('');
	message = $state('');
	okLabel = $state('OK');
	okStyle = $state<'default' | 'danger'>('default');
	#onConfirm: (() => void) | null = null;

	show(opts: {
		title: string;
		message: string;
		okLabel?: string;
		okStyle?: 'default' | 'danger';
		onConfirm: () => void;
	}) {
		this.title = opts.title;
		this.message = opts.message;
		this.okLabel = opts.okLabel ?? 'OK';
		this.okStyle = opts.okStyle ?? 'default';
		this.#onConfirm = opts.onConfirm;
		this.isOpen = true;
	}

	confirm() {
		this.isOpen = false;
		this.#onConfirm?.();
		this.#onConfirm = null;
	}

	cancel() {
		this.isOpen = false;
		this.#onConfirm = null;
	}
}
