#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

const { modifyPackageJson } = require('./helpers')

const miniAppDirectory = process.argv[2] ? process.argv[2] : 'mini-app';
const showHelp = ~process.argv.indexOf('--help');
const useZeit = ~process.argv.indexOf('--zeit');

if (showHelp) {
	console.error(`🖖 Usage:
1️⃣ Create VK Mini App with @vkontakte/vk-miniapps-deploy deploy: ${chalk.bold.green('create-vk-mini-app <app-directory-name>')}
2️⃣ Create VK Mini App with Zeit deploy: ${chalk.bold.green('create-vk-mini-app <app-directory-name> --zeit')}`);
	process.exit(1);
}

console.log('🎬 Creating project...');
fs.mkdirSync(miniAppDirectory);

console.log('⏱ Copying VK Mini App source and configuration files..');
fs.copySync(path.join(__dirname, '..', 'boilerplate'), miniAppDirectory);

if (useZeit) {
	fs.copySync(path.join(__dirname, '..', 'zeit', 'now.json'), miniAppDirectory);
}

console.log(`🖼 VK Mini App source and configuration files are copied`);

const packageJsonPath = path.join(__dirname, miniAppDirectory, 'package.json');
const scriptsToAdd = {};

if (useZeit) {
	scriptsToAdd['now-build'] = 'react-scripts build';
}

if (Object.keys(scriptsToAdd).length) {
	modifyPackageJson(packageJsonPath, function(packageJson) {
		packageJson['scripts'] = {
			...packageJson['scripts'],
			...scriptsToAdd,
		};

		return packageJson;
	});
}

console.log('⏱ Installing project dependencies — it might take a few minutes..');
try {
	execSync(`cd ${miniAppDirectory} && npm ci`);
} catch (npmErr) {
	console.error(`😳 npm error:\n${npmErr}`);
	process.exit(1);
}
console.log('✅ Dependencies are installed');

console.log(`✌️ VK Mini App is ready to start in ${miniAppDirectory} folder. \n🧐 Check README.MD for brief instructrions.\n💻 Happy Coding!`)
