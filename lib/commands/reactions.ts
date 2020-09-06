import Discord from 'discord.js';
// import { TextReaction, CustomReaction } from './logic';

export const Reaction: {
	[key: string]: (msg: Discord.Message) => string | void;
} = {
	// example: (msg:Discord.Message) => new CustomReaction(msg).execute(example, msg),
};
