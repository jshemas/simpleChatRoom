module.exports = {
	mongoPath: process.env.MONGODB || 'mongodb://localhost/simpleChatroom',
	jwtSecret: process.env.JWTSECRET || 'youllneverguessthishahaha',
	encryptionKey: process.env.ENCRYPTIONKEY || 'thisisthebestkeyever'
};