import { MongoClient, Db } from 'mongodb';
import assert from 'assert';
import type { GuildMember, Guild } from 'discord.js';
import { IEmbed } from '../types/command';

const DB_NAME = 'innkeeper';
let db: Db;

export const connectToDb = async (url: string): Promise<void> => {
	const client = await MongoClient.connect(url);
	db = client.db(DB_NAME);
};

export async function upsertOne<T>(
	name: string,
	filter: any,
	object: T,
): Promise<void> {
	assert.ok(
		db !== undefined,
		'Have not connected to the database - make sure connectToDb() is called at least once',
	);
	await db
		.collection<T>(name)
		.updateOne(filter, { $set: object }, { upsert: true });
}

export interface User {
	id: string;
	discordId: string;
	punished: boolean;
}
[];

export async function upsertUser(id: string, user: User): Promise<void> {
	// TODO this throws cyclic dependency error - FIX IT!
	await upsertOne('users', { discordId: id }, user);
}

export async function isKnownMember(member: GuildMember): Promise<boolean> {
	return findUserByDiscordId(member.id) !== undefined;
}

export async function findUserByDiscordId(
	id?: string,
): Promise<User | undefined> {
	if (!id) return;
	const user = await db.collection('users').findOne({ discordId: id });
	return user;
}

export async function findAllGuildMembers(
	guild?: Guild | null,
): Promise<User[] | void> {
	if (!guild) return;
	const results = db.collection('users').find({
		membership: {
			$elemMatch: {
				serverId: guild.id,
			},
		},
	});

	return await results.toArray();
}

interface Option<T> {
	value: T;
}

interface Options {
	assignableRoles: string[];
	roomRoles: {
		id: string;
		guild: string;
	}[];
	modRoles: string[];
	membershipRoles: {
		name: string;
	}[];
	jokeRoles: string[];

	topMembers: number;

	roomLogMsgs: {
		guild: string;
		id: string;
	}[];
	roomLogUsers: {
		guild: string;
		id: string;
	}[];
	roomGlobal: string;

	commandSymbol: string;
}

export async function findOption<K extends keyof Options>(
	name: K,
): Promise<Options[K] | undefined> {
	type T = Option<Options[K]>;
	const opt = await db.collection('options').findOne<T>({ option: name });
	return opt?.value;
}

export interface Command {
	keyword: string;
	isModOnly: boolean;
	description?: string;
	text?: string;
	embed?: IEmbed;
}

export async function findModCommands(): Promise<Command[]> {
	const r = db.collection('commands').find({
		isModOnly: true,
	});

	return await r.toArray();
}

export async function findUserCommands(): Promise<Command[]> {
	const r = db.collection('commands').find({
		isModOnly: false,
	});

	return await r.toArray();
}

export async function findCommandByKeyword(
	keyword: string,
): Promise<Command | undefined> {
	const c = db.collection('commands');
	return (await c.findOne({ keyword })) ?? undefined;
}
