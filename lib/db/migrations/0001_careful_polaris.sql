CREATE TABLE `user_role` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`role` varchar(256) NOT NULL,
	CONSTRAINT `user_role_id` PRIMARY KEY(`id`)
);
