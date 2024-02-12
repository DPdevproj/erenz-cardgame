CREATE TABLE `card` (
	`id` varchar(191) NOT NULL,
	`name` varchar(256) NOT NULL,
	`expansion` varchar(256) NOT NULL,
	`rarity` varchar(256) NOT NULL,
	`language` varchar(256) NOT NULL,
	`info` varchar(256),
	`quantity` int NOT NULL,
	`price` real NOT NULL,
	`condition` int NOT NULL,
	`available` boolean NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now(),
	CONSTRAINT `card_id` PRIMARY KEY(`id`)
);
