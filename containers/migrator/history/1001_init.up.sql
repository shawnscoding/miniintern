CREATE TABLE user (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  isAdmin TINYINT(1) NOT NULL DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email_idx (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE mclass (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  mclassCode VARCHAR(32) NOT NULL,                
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  maxParticipants INT NOT NULL,
  appliedParticipants INT NOT NULL DEFAULT 0,
  startAt DATETIME NOT NULL,
  endAt DATETIME NOT NULL,
  hostId INT UNSIGNED NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY mclassCode_idx (mclassCode),
  KEY hostId_idx (hostId),
  KEY startAt_endAt_idx (startAt, endAt),
  KEY createdAt_desc_idx (createdAt DESC),
  CONSTRAINT fk_mclass_hostId
    FOREIGN KEY (hostId) REFERENCES user(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_mclass_time CHECK (startAt < endAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE application (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  userId INT UNSIGNED NOT NULL,
  mclassId INT UNSIGNED NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY userId_classId_idx (userId, mclassId),
  KEY userId_idx (userId),
  KEY classId_idx (mclassId),
  CONSTRAINT fk_application_userId
    FOREIGN KEY (userId) REFERENCES user(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_application_classId
    FOREIGN KEY (mclassId) REFERENCES mclass(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;