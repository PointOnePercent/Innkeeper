import Discord from 'discord.js';

import { ICommand } from '../types/command';
import {
	// TextCommand,
	// EmbedCommand,
	CustomCommand,
} from './logic';

import { help, hmod } from './commands/basic';
export const Command: {
	[key: string]: (command: ICommand, msg: Discord.Message) => string | void;
} = {
	help: (command: ICommand, msg: Discord.Message) =>
		new CustomCommand(command, msg).execute(help, msg),
	h: (command: ICommand, msg: Discord.Message) =>
		new CustomCommand(command, msg).execute(help, msg),
	hmod: (command: ICommand, msg: Discord.Message) =>
		new CustomCommand(command, msg).execute(hmod, msg),
};
