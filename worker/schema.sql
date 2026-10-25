-- Accepted lessons only. No IP, no timestamp: `day` is the UTC date (YYYY-MM-DD).
CREATE TABLE IF NOT EXISTS lessons (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  install  TEXT    NOT NULL,          -- random install id from the plugin, not tied to any account
  day      TEXT    NOT NULL,
  lesson   TEXT    NOT NULL,          -- JSON of the cleaned lesson from validateLesson()
  exported INTEGER NOT NULL DEFAULT 0 -- set to 1 by scripts/export-inbox.mjs
);
CREATE INDEX IF NOT EXISTS lessons_install_day ON lessons (install, day);
CREATE INDEX IF NOT EXISTS lessons_exported ON lessons (exported);

-- "Delete my shared tips" requests, so the maintainer's next export also purges copies already downloaded.
-- Holds only the random install id and the date; removed after the retention period.
CREATE TABLE IF NOT EXISTS deletion_requests (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  install TEXT NOT NULL,
  day     TEXT NOT NULL
);
