CREATE TABLE `bestcms`.`project` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC));


CREATE TABLE `bestcms`.`languages` (
  `id` INT NOT NULL,
  `name` VARCHAR(49) NULL,
  `code` VARCHAR(2) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `bestcms`.`string` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_web` VARCHAR(45) NOT NULL,
  `lang` INT NOT NULL,
  `value` TEXT NULL,
  PRIMARY KEY (`id`, `id_web`, `lang`));


  CREATE TABLE `bestcms`.`project_lang` (
    `id_project` INT NOT NULL,
    `id_lang` INT NOT NULL,
    PRIMARY KEY (`id_project`, `id_lang`),
    INDEX `fk_project_lang_idx` (`id_lang` ASC),
    CONSTRAINT `fk_project_lang_project`
      FOREIGN KEY (`id_project`)
      REFERENCES `bestcms`.`project` (`id`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT `fk_project_lang_languages`
      FOREIGN KEY (`id_lang`)
      REFERENCES `bestcms`.`languages` (`id`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);


CREATE TABLE `bestcms`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `family` VARCHAR(100) NULL,
  `email` VARCHAR(255) NOT NULL,
  `picture` VARCHAR(255) NULL,
  `pass` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

  CREATE TABLE `bestcms`.`user_project` (
    `id_user` INT NOT NULL,
    `id_project` INT NOT NULL,
    `role` INT NULL DEFAULT 0,
    PRIMARY KEY (`id_user`, `id_project`),
    INDEX `fk_user_project_project_idx` (`id_project` ASC),
    CONSTRAINT `fk_user_project_user`
      FOREIGN KEY (`id_user`)
      REFERENCES `bestcms`.`user` (`id`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT `fk_user_project_project`
      FOREIGN KEY (`id_project`)
      REFERENCES `bestcms`.`project` (`id`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);
