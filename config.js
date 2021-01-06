exports.DATABASE_URL = process.env.MONGO_SEEDDB_URL; /*||
                      'mongodb://localhost/dreamJournalSeedDB';*/
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.TEST_DATABASE_URL = process.env.MONGO_TESTDB_URL; /* ||
                      'mongodb://localhost/dreamJournalTestDB';*/
exports.PORT = process.env.PORT || 8080;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '2d';