// Tests hit a real SQLite file kept separate from the dev database so
// running the test suite never disturbs data used for local manual demos.
// Prisma resolves relative sqlite paths relative to schema.prisma's
// directory (prisma/), not the process cwd — so this resolves to
// prisma/test.db, matching dev.db's sibling location.
process.env.DATABASE_URL = "file:./test.db";

import "@testing-library/jest-dom/vitest";
