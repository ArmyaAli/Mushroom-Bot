module.exports = {
	name: 'play',
	description: 'play music',
	execute(message, args) {
		message.channel.send('Playing music from youtube: ');
	},
};