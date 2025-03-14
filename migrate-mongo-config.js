const config = {
    mongodb: {
        url: 'mongodb://admin:secret@172.17.0.1:27017/testdb?authSource=admin',
        databaseName: 'testdb',

        options: {
            //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
            //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
        },
    },
    migrationsDir: './src/database/migrations',

    // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
    changelogCollectionName: 'changelog',
    // The mongodb collection where the lock will be created.
    lockCollectionName: 'changelog_lock',
    // The value in seconds for the TTL index that will be used for the lock. Value of 0 will disable the feature.
    lockTtl: 0,

    // The file extension to create migrations and search for in migration dir
    migrationFileExtension: '.ts',
    // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
    // if the file should be run.  Requires that scripts are coded to be run multiple times.
    useFileHash: false,

    // Don't change this, unless you know what you're doing
    moduleSystem: 'esm',
};

export default config;
