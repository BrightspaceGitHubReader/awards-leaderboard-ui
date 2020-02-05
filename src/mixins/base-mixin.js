import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';

const langTerms = {};
const baseUrl = import.meta.url;

export const BaseMixin = superclass => class extends LocalizeMixin(superclass) {

	static async getLocalizeResources(langs) {
		const uniqueLangs = new Set(langs);

		for await (let lang of uniqueLangs) {
			if (!lang) {
				continue;
			}

			lang = lang.toLowerCase();

			// Strip out the last part of a lang unless it's zh-tw
			if (lang !== 'zh-tw') {
				lang = lang.split('-')[0];
			}
			const langTermRelativeUrl = `../../lang/${lang}.json`;
			const langTermUrl = `${new URL(langTermRelativeUrl, baseUrl)}`;

			if (langTerms[langTermUrl]) {
				return await langTerms[langTermUrl];
			}

			langTerms[langTermUrl] = (async () => {
				const response = await fetch(langTermUrl);
				const translations = await response.json();

				if (!translations) {
					return;
				}

				return {
					language: lang,
					resources: translations
				};
			})();

			return await langTerms[langTermUrl];
		}

		return null;
	}

	localize(key, values) {
		return super.localize(key, values) || `{language term '${key}' not found}`;
	}

};
