import type { Settings } from '$lib/types.js';
import { getLocalData, saveLocalData } from '$lib/utils/store.js';

export class SettingsRepository {
	load(): Settings {
		return getLocalData().settings;
	}

	save(settings: Settings): void {
		const data = getLocalData();
		data.settings = settings;
		saveLocalData(data);
	}
}
