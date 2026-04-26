/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
			},
			colors: {
				primary: {
					50: '#f0fdf4',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#16a34a',
					600: '#15803d',
					700: '#166534',
					800: '#14532d',
					900: '#052e16',
				},
			},
		},
	},
	plugins: [],
};

