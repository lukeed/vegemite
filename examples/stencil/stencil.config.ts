import { Config } from "@stencil/core";

// https://stenciljs.com/docs/config

export const config: Config = {
	globalStyle: "src/assets/todomvc.css",
	taskQueue: "async",
	outputTargets: [
		{
			type: "www",
		},
	],
};
