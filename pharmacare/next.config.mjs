import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false, // Disable for better performance
	// Disable Turbopack completely for stability
	turbo: false,
	// Set the correct root directory
	experimental: {
		// Minimal optimizations only
		optimizePackageImports: ['@heroicons/react'],
		// Disable heavy features
		turbo: false,
		serverComponentsExternalPackages: [],
	},
	// Performance optimizations
	productionBrowserSourceMaps: false,
	poweredByHeader: false,
	// Reduce bundle size
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	// Webpack optimizations for minimal resource usage
	webpack: (config, { dev, isServer }) => {
		if (dev) {
			// Reduce memory usage in development
			config.optimization = {
				...config.optimization,
				minimize: false,
				splitChunks: false, // Disable code splitting in dev
			};
			
			// Reduce file watching
			config.watchOptions = {
				poll: 1000,
				aggregateTimeout: 300,
				ignored: ['**/node_modules', '**/.next'],
			};
			
			// Limit parallel processing
			config.parallelism = 1;
		}
		
		// Reduce bundle size
		config.resolve.alias = {
			...config.resolve.alias,
			'@': path.resolve(__dirname, 'src'),
		};
		
		return config;
	},
	// Output configuration
	output: 'standalone',
	// Disable features that consume resources
	images: {
		unoptimized: true,
	},
};

export default nextConfig;

