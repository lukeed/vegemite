exports.webpack = function (config, env) {
	// disable sourcemaps for production
	if (env.production) config.devtool = false;
}
