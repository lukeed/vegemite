exports.babel = function(config) {
	config.compact = true;
	config.presets.push([
		'@babel/preset-typescript',
		{
			allExtensions: true,
			isTSX: true,
		},
	]);
};

exports.webpack = function (config, env) {
	// fix outdated preact@8.x optimization
	config.resolve.alias.preact = 'preact';

	// disable sourcemaps for production
	if (env.production) config.devtool = false;

	// Allow TypeScript extensions
	config.resolve.extensions.unshift('.ts', '.tsx');
	config.module.rules[0].test = /\.(t|j)sx?$/i;

	// TEMP: Will be fixed in upcoming PWA ver
	config.entry.bundle[0] = './index.tsx';
}
