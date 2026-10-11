/**
 * Versioned migrations for persisted progress.
 *
 * Each entry upgrades a state object from `version` to `version + 1`. Adding a
 * migration is the only sanctioned way to change the stored shape, so a
 * learner's history survives every future release.
 */

export const CURRENT_SCHEMA_VERSION = 1;

type Migration = {
  /** The version this migration upgrades *from*. */
  version: number;
  migrate: (state: Record<string, unknown>) => Record<string, unknown>;
};

export const MIGRATIONS: Migration[] = [
  // v0 predates the schemaVersion field: anything without one is treated as v0
  // and given the baseline shape.
  {
    version: 0,
    migrate: (state) => ({
      attempts: [],
      lessons: {},
      theme: "system",
      createdAt: Date.now(),
      ...state,
      schemaVersion: 1,
    }),
  },
];

/** Runs every migration needed to bring `state` up to the current version. */
export function migrate(state: Record<string, unknown>): Record<string, unknown> {
  let current = state;
  let version = typeof current.schemaVersion === "number" ? current.schemaVersion : 0;

  while (version < CURRENT_SCHEMA_VERSION) {
    const step = MIGRATIONS.find((m) => m.version === version);
    if (!step) {
      throw new Error(`No migration registered from schema version ${version}`);
    }
    current = step.migrate(current);
    const next = typeof current.schemaVersion === "number" ? current.schemaVersion : version + 1;
    if (next <= version) {
      throw new Error(`Migration from version ${version} did not advance the schema version`);
    }
    version = next;
  }

  return current;
}
