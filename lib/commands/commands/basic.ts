import Discord from 'discord.js';
import {
	createEmbed,
	getCommandSymbol,
	splitArrayByObjectKey,
} from '../../helpers';
import { findModCommands, Command, findUserCommands } from '../../storage/db';

type TField = {
	title: string;
	content: string;
};

export const help = async (msg: Discord.Message): Promise<void> => {
	const fields = new Array<TField>();
	const commandsAll = await findUserCommands();
	const commands = splitArrayByObjectKey(commandsAll, 'category');

	const sym = await getCommandSymbol()!;
	for (const category in commands) {
		const title = `Category ${category.toUpperCase()}`;
		let content = '';
		commands[category].map((command: Command) => {
			if (command.description)
				content += `- **${sym}${command.keyword}** - ${command.description}\n`;
		});
		fields.push({ title, content });
	}

	const embed = createEmbed('📜 List of commands', fields);
	msg.author
		.send({ embed })
		.then(() => msg.react('📩'))
		.catch(() =>
			msg.channel.send(
				createEmbed(':warning: I am unable to reply to you', [
					{
						title: '___',
						content: `This command sends the reply to your DM, and it seems you have DMs from members of this server disabled.
            \nTo be able to receive messages from me, go to \`\`User Settings => Privacy & Safety => Allow direct messages from server members\`\` and then resend the command.`,
					},
				]),
			),
		);
};

export const hmod = async (msg: Discord.Message): Promise<void> => {
	const fields = new Array<TField>();
	const commandsAll = await findModCommands();
	const commands = splitArrayByObjectKey(commandsAll, 'category');

	const sym = await getCommandSymbol()!;
	for (const category in commands) {
		const title = `Category ${category.toUpperCase()}`;
		let content = '';
		commands[category].map(
			(command: Command) =>
				(content += `\`\`-\`\`**${sym}${command.keyword}** - ${command.description}\n`),
		);
		fields.push({ title, content });
	}

	const embed = createEmbed('📜 List of moderator commands', fields);
	msg.author
		.send({ embed })
		.then(() => msg.react('📩'))
		.catch(() =>
			msg.channel.send(
				createEmbed(':warning: I am unable to reply to you', [
					{
						title: '___',
						content: `This command sends the reply to your DM, and it seems you have DMs from members of this server disabled.
            \nTo be able to receive messages from me, go to \`\`User Settings => Privacy & Safety => Allow direct messages from server members\`\` and then resend the command.`,
					},
				]),
			),
		);
};
