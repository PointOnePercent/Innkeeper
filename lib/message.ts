import Discord from 'discord.js';
import { TextCommand, EmbedCommand } from './commands/logic';
import { getKeyword, getCommandSymbol } from './helpers';
import { Command } from './commands/list';

import { findCommandByKeyword } from './storage/db';

// LOGIC

const isUserAdmin = (msg: Discord.Message): boolean =>
	msg.member?.hasPermission('ADMINISTRATOR') ?? false;
const isChannelDM = (msg: Discord.Message) => msg.author.id === msg.channel.id;
const isUserBot = (msg: Discord.Message) => msg.author.bot;
const messageStartsWithCommandSymbol = async (msg: Discord.Message) => {
	const sym = await getCommandSymbol();
	return sym !== undefined && msg.content.startsWith(sym);
};

const answer = (msg: Discord.Message, answer: string) =>
	msg.channel.send(answer);
const answerCommand = async (msg: Discord.Message) => {
	const command = await findCommandByKeyword(getKeyword(msg));
	if (command === undefined) {
		await msg.react(':questionmark:244535324737273857');
		return;
	}

	if (command.text !== undefined) {
		new TextCommand(command, msg).execute(command.text);
		return;
	}

	if (command.embed !== undefined) {
		new EmbedCommand(command, msg).execute(command.embed, msg.author.username);
		return;
	}
	if (Command[getKeyword(msg)]) {
		Command[getKeyword(msg)](command, msg);
		return;
	}

	await msg.react(':questionmark:244535324737273857');
};

// MAIN FUNCTION

const classifyMessage = async (msg: Discord.Message): Promise<void> => {
	if (isUserBot(msg)) {
		return;
	}
	if (isChannelDM(msg)) {
		answer(msg, 'You cannot speak to me in private.');
		return;
	}
	if (await messageStartsWithCommandSymbol(msg)) {
		answerCommand(msg);
		return;
	}
};

export { classifyMessage, isUserAdmin };
