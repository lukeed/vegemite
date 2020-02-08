exports.webpack = function (config, env) {
	// fix outdated preact@8.x optimization
	config.resolve.alias.preact = 'preact';

	// disable sourcemaps for production
	if (env.production) config.devtool = false;
}
