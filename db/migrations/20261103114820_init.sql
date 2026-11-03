CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE TABLE `jwks` (
	`id` text PRIMARY KEY NOT NULL,
	`publicKey` text NOT NULL,
	`privateKey` text NOT NULL,
	`createdAt` integer NOT NULL,
	`expiresAt` integer,
	`alg` text,
	`crv` text
);
--> statement-breakpoint
CREATE TABLE `oauthAccessToken` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`clientId` text NOT NULL,
	`sessionId` text,
	`userId` text,
	`referenceId` text,
	`authorizationCodeId` text,
	`resources` text,
	`requestedUserInfoClaims` text,
	`refreshId` text,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`revoked` integer,
	`confirmation` text,
	`scopes` text NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `oauthClient`(`clientId`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sessionId`) REFERENCES `session`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`refreshId`) REFERENCES `oauthRefreshToken`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `oauthAccessToken_token_unique` ON `oauthAccessToken` (`token`);--> statement-breakpoint
CREATE INDEX `oauthAccessToken_clientId_idx` ON `oauthAccessToken` (`clientId`);--> statement-breakpoint
CREATE INDEX `oauthAccessToken_sessionId_idx` ON `oauthAccessToken` (`sessionId`);--> statement-breakpoint
CREATE INDEX `oauthAccessToken_userId_idx` ON `oauthAccessToken` (`userId`);--> statement-breakpoint
CREATE INDEX `oauthAccessToken_authorizationCodeId_idx` ON `oauthAccessToken` (`authorizationCodeId`);--> statement-breakpoint
CREATE INDEX `oauthAccessToken_refreshId_idx` ON `oauthAccessToken` (`refreshId`);--> statement-breakpoint
CREATE TABLE `oauthClientAssertion` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `oauthClientResource` (
	`id` text PRIMARY KEY NOT NULL,
	`clientId` text NOT NULL,
	`resourceId` text NOT NULL,
	`metadata` text,
	`createdAt` integer,
	FOREIGN KEY (`clientId`) REFERENCES `oauthClient`(`clientId`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resourceId`) REFERENCES `oauthResource`(`identifier`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `oauthClientResource_clientId_idx` ON `oauthClientResource` (`clientId`);--> statement-breakpoint
CREATE INDEX `oauthClientResource_resourceId_idx` ON `oauthClientResource` (`resourceId`);--> statement-breakpoint
CREATE TABLE `oauthClient` (
	`id` text PRIMARY KEY NOT NULL,
	`clientId` text NOT NULL,
	`clientSecret` text,
	`clientDiscoveryId` text,
	`disabled` integer,
	`skipConsent` integer,
	`enableEndSession` integer,
	`subjectType` text,
	`scopes` text,
	`clientCredentialsScopes` text,
	`userId` text,
	`createdAt` integer,
	`updatedAt` integer,
	`name` text,
	`uri` text,
	`icon` text,
	`contacts` text,
	`tos` text,
	`policy` text,
	`softwareId` text,
	`softwareVersion` text,
	`softwareStatement` text,
	`redirectUris` text NOT NULL,
	`postLogoutRedirectUris` text,
	`backchannelLogoutUri` text,
	`backchannelLogoutSessionRequired` integer,
	`tokenEndpointAuthMethod` text,
	`applicationType` text,
	`jwks` text,
	`jwksUri` text,
	`grantTypes` text,
	`responseTypes` text,
	`requirePKCE` integer,
	`dpopBoundAccessTokens` integer,
	`referenceId` text,
	`metadata` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `oauthClient_clientId_unique` ON `oauthClient` (`clientId`);--> statement-breakpoint
CREATE INDEX `oauthClient_userId_idx` ON `oauthClient` (`userId`);--> statement-breakpoint
CREATE TABLE `oauthConsent` (
	`id` text PRIMARY KEY NOT NULL,
	`clientId` text NOT NULL,
	`userId` text,
	`referenceId` text,
	`resources` text,
	`requestedUserInfoClaims` text,
	`scopes` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `oauthClient`(`clientId`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `oauthConsent_clientId_idx` ON `oauthConsent` (`clientId`);--> statement-breakpoint
CREATE INDEX `oauthConsent_userId_idx` ON `oauthConsent` (`userId`);--> statement-breakpoint
CREATE TABLE `oauthRefreshToken` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`clientId` text NOT NULL,
	`sessionId` text,
	`userId` text NOT NULL,
	`referenceId` text,
	`authorizationCodeId` text,
	`resources` text,
	`requestedUserInfoClaims` text,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`revoked` integer,
	`rotatedAt` integer,
	`rotationReplayResponse` text,
	`rotationReplayExpiresAt` integer,
	`authTime` integer,
	`confirmation` text,
	`scopes` text NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `oauthClient`(`clientId`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sessionId`) REFERENCES `session`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `oauthRefreshToken_token_unique` ON `oauthRefreshToken` (`token`);--> statement-breakpoint
CREATE INDEX `oauthRefreshToken_clientId_idx` ON `oauthRefreshToken` (`clientId`);--> statement-breakpoint
CREATE INDEX `oauthRefreshToken_sessionId_idx` ON `oauthRefreshToken` (`sessionId`);--> statement-breakpoint
CREATE INDEX `oauthRefreshToken_userId_idx` ON `oauthRefreshToken` (`userId`);--> statement-breakpoint
CREATE INDEX `oauthRefreshToken_authorizationCodeId_idx` ON `oauthRefreshToken` (`authorizationCodeId`);--> statement-breakpoint
CREATE TABLE `oauthResource` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`name` text NOT NULL,
	`accessTokenTtl` integer,
	`refreshTokenTtl` integer,
	`signingAlgorithm` text,
	`signingKeyId` text,
	`allowedScopes` text,
	`customClaims` text,
	`dpopBoundAccessTokensRequired` integer,
	`disabled` integer,
	`createdAt` integer,
	`updatedAt` integer,
	`policyVersion` integer,
	`metadata` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `oauthResource_identifier_unique` ON `oauthResource` (`identifier`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`userId`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer NOT NULL,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
INSERT INTO `oauthClient` (`id`, `clientId`, `clientSecret`, `disabled`, `skipConsent`, `enableEndSession`, `scopes`, `createdAt`, `updatedAt`, `name`, `redirectUris`, `tokenEndpointAuthMethod`, `applicationType`, `grantTypes`, `responseTypes`, `requirePKCE`)
VALUES
('vesper', 'vesper', NULL, 0, 0, 0, '["openid","profile","email","offline_access","memos:read","memos:write","moment:read","moment:write","knowledge:read","knowledge:write"]', 1793664001839, 1793664001839, 'Vesper', '["vesper://oauth/callback"]', 'none', 'native', '["authorization_code","refresh_token"]', '["code"]', 1),
('workspace', 'workspace', NULL, 0, 0, 0, '["openid","profile","email","offline_access","memos:read","memos:write","moment:read","moment:write","knowledge:read","knowledge:write"]', 1793664058675, 1793664058675, 'Vesper Desktop', '["http://127.0.0.1:8793/callback"]', 'none', 'native', '["authorization_code","refresh_token"]', '["code"]', 1),
('memos', 'memos', NULL, 0, 1, 0, '["openid","profile","email"]', 1793665692898, 1793665692898, 'Memos', '["https://memos.you-find.me/api/auth/callback/you-find-me", "http://localhost:5173/api/auth/callback/you-find-me"]', 'none', 'web', '["authorization_code"]', '["code"]', 1),
('moment', 'moment', NULL, 0, 1, 0, '["openid","profile","email"]', 1793665692898, 1793665692898, 'Moment', '["https://moment.you-find.me/api/auth/callback/you-find-me", "http://localhost:5173/api/auth/callback/you-find-me"]', 'none', 'web', '["authorization_code"]', '["code"]', 1),
('knowledge', 'knowledge', NULL, 0, 1, 0, '["openid","profile","email"]', 1793665692898, 1793665692898, 'Knowledge', '["https://knowledge.you-find.me/api/auth/callback/you-find-me", "http://localhost:8787/api/auth/callback/you-find-me", "http://localhost:3000/api/auth/callback/you-find-me"]', 'none', 'web', '["authorization_code"]', '["code"]', 1);
--> statement-breakpoint
INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt`)
VALUES ('owner', 'Yiming Wang', 'pleasure9876@qq.com', 1, 'https://avatars.githubusercontent.com/u/144885467', 1793706500430, 1793706500430);
--> statement-breakpoint
INSERT INTO `account` (`id`, `accountId`, `providerId`, `userId`, `createdAt`, `updatedAt`)
VALUES
('owner-github', '144885467', 'github', 'owner', 1793706500430, 1793706500430),
('owner-google', '106887666860847474211', 'google', 'owner', 1793706500430, 1793706500430);
