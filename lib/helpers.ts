import Discord from 'discord.js';
import moment from 'moment';
import { IEmbedField } from './types/command';
import { findOption } from './storage/db';
import { COLORS } from './modules/colors';

export const getCommandSymbol = async (): Promise<string | undefined> =>
	await findOption('commandSymbol');

export const getKeyword = (msg: Discord.Message): string => {
	const argumentsPresent = msg.content.includes(' ');
	const keyword = argumentsPresent
		? msg.content.substring(1, msg.content.indexOf(' '))
		: msg.content.substring(1);
	return keyword.toLowerCase();
};

export const removeKeyword = (msg: Discord.Message): string => {
	if (msg.content.indexOf(' ') !== -1)
		return msg.content.substring(msg.content.indexOf(' ')).trim();
	return '';
};

export const hasSeparator = (msg: Discord.Message): boolean =>
	removeKeyword(msg).includes('|');

export const extractArguments = (msg: Discord.Message): string[] => {
	const args = removeKeyword(msg).trim().split('|');
	if (args.length === 1 && args[0] === '') return [];
	return args;
};

export const splitByFirstSymbol = (
	msg: Discord.Message,
	symbol: string,
): unknown[] => {
	const msgContent = removeKeyword(msg);
	if (msgContent.indexOf(symbol) === -1) return [msgContent];
	const args = [
		msgContent.substring(0, msgContent.indexOf(symbol)).trim(),
		msgContent.substring(msgContent.indexOf(symbol)).trim(),
	];
	return args;
};

export const createEmbed = (
	title: string,
	fields: Array<IEmbedField>,
	color?: string,
	thumbnail?: string,
	footer?: string,
): Discord.MessageEmbed => {
	const embed = thumbnail
		? new Discord.MessageEmbed()
				.setTitle(title)
				.setColor(color ? `0x${color}` : `0x${COLORS.embed.main}`)
				.setThumbnail(thumbnail)
				.setFooter(footer ? footer : '')
		: new Discord.MessageEmbed()
				.setTitle(title)
				.setColor(color ? `0x${color}` : `0x${COLORS.embed.main}`)
				.setFooter(footer ? footer : '');
	fields.map(field =>
		embed.addField(
			field.title,
			field.content,
			field.inline ? field.inline : false,
		),
	);
	return embed;
};

export const isLink = (supposedLink: string): boolean => {
	if (supposedLink.startsWith('http')) return true;
	return false;
};

export const splitArrayByObjectKey = (
	array: Array<any>,
	sortBy: string,
): Array<any> =>
	array.reduce((reducer: Array<any>, obj: any) => {
		const key = obj[sortBy];
		if (reducer[key] || (reducer[key] = [])) reducer[key].push(obj);
		return reducer;
	}, {});

export const toDDHHMMSS = (joinedAt: Date | null): string => {
	if (!joinedAt) return 'unknown duration';
	const start = moment(joinedAt);
	const end = moment();
	const diff = moment.duration(end.diff(start));

	return `${
		moment.duration(diff).years() ? moment.duration(diff).years() + 'y ' : ''
	}${
		moment.duration(diff).months() ? moment.duration(diff).months() + 'm ' : ''
	}${moment.duration(diff).days() ? moment.duration(diff).days() + 'd ' : ''}${
		moment.duration(diff).hours() ? moment.duration(diff).hours() + 'h ' : ''
	}${
		moment.duration(diff).minutes()
			? moment.duration(diff).minutes() + 'm '
			: ''
	}${
		moment.duration(diff).seconds()
			? moment.duration(diff).seconds() + 's '
			: ''
	}`;
};

export const toMMSS = (miliseconds: number): string => {
	const mili = 1000;
	const duration = miliseconds / mili;
	const minutes = (duration / 60).toFixed(0);
	const seconds = (duration % 60).toFixed(0);
	return `${minutes} minutes ${seconds} seconds`;
};

export const justifyToRight = (
	input: string,
	desiredLength: number,
): string => {
	let output = input;
	while (output.length < desiredLength) output = ` ${output}`;
	return output;
};

export const justifyToLeft = (input: string, desiredLength: number): string => {
	let output = input;
	while (output.length < desiredLength) output += ` `;
	return output;
};

export const replaceAll = (stringToReplace: string): RegExp =>
	new RegExp(stringToReplace, 'gi');

export const modifyInput = (input: string): string =>
	encodeURIComponent(input.replace(replaceAll(' '), ''));
