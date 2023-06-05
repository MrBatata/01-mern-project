/** Modules */
import { useState, useEffect } from 'react';

/** Hook for LocalStorage management */
const useLocalStorage = (key, defaultValue = null) => {
	const [value, setValue] = useState(() => {
		try {
			const item = localStorage.getItem(key);
			if (item !== null) {
				return JSON.parse(item);
			}
			return defaultValue;
		} catch (error) {
			console.log(error, 'Cannot find key in localStorage');
			return defaultValue;
		}
	});

	useEffect(() => {
		console.log(`Setting localStorage key: "${key}" with new value`);
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
};

export default useLocalStorage;
