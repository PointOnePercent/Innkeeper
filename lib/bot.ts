import { Client, TextChannel, User } from 'discord.js';
import { classifyMessage } from './message';
import { log } from './log';

// Mutable module state sucks, but this is the easiest way to migrate what we already have
let bot: Client;

export async function initialize(token: string): Promise<void> {
	bot = new Client();
	bot.on('message', classifyMessage);
	await bot.login(token);
	log.INFO('Innkeeper bot starts working!');
}

export function findTextChannel(
	id: string | undefined,
): TextChannel | undefined {
	const ch = id
		? bot?.channels.cache.find(channel => channel.id === id)
		: undefined;
	if (ch === undefined || ch instanceof TextChannel === false) {
		return undefined;
	}
	return ch as TextChannel;
}

export function isBotUser(user?: User): boolean | void {
	if (!user || !bot.user) return;
	return bot?.user?.id === user.id;
}

export async function setBotPresence(status: string): Promise<void> {
	bot?.user?.setPresence({
		activity: {
			name: status,
			type: 'CUSTOM_STATUS',
		},
	});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* enumerateGuilds(): any {
	yield* bot?.guilds.cache.values();
}

export function findMemberJoinDate(
	guildId: string,
	memberId: string,
): Date | undefined {
	const guild = bot.guilds.cache.find(guild => guild.id == guildId);
	const member = guild?.members.cache.find(
		cachedMember => cachedMember.id == memberId,
	);
	if (!member || !member.joinedAt) return;
	return new Date(member?.joinedAt);
}
