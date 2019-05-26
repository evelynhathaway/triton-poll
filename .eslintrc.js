module.exports = {
	"plugins": [
		"evelyn",
	],
	"extends": [
		"plugin:evelyn/default",
	],
	"rules": {
		"indent": [
			"error",
			4,
		],
	},
	"overrides": [
		// All src files use node and source configs
		{
			"files": [
				"src/server/**/*.js",
			],
			"extends": [
				"plugin:evelyn/node",
				"plugin:evelyn/source",
			],
			"parser": "babel-eslint",
		},
		{
			"files": [
				"src/client/**/*.js",
			],
			"extends": [
				"plugin:evelyn/browser",
				"plugin:evelyn/jsx",
			],
			"parser": "babel-eslint",
		},
		{
			"files": [
				"*.config.js",
				".*rc.js",
				".*rc",
			],
			"parser": "babel-eslint",
			"extends": [
				"plugin:evelyn/node",
			],
		},
	],
};
