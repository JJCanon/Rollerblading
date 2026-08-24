export const up = (pgm) => {
    // role enum - as the data model, just 'roller' and 'admin' have row;
    //'invited' is an implicit rol for users who are not authenticated
    pgm.createType('user_role', ['roller', 'admin']);

    pgm.createTable('users', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        email: {
            type: 'varchar(255)',
            notNull: true,
            unique: true,
        },
        password_hash: {
            type: 'varchar(255)',
            notNull: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        lastname: {
            type: 'varchar(255)',
            notNull: true
        },
        cellphone: {
            type: 'varchar(255)',
        },
        avatar_url: {
            type: 'varchar(255)',
        },
        role: {
            type: 'user_role',
            notNull: true,
            default: 'roller',
        },
        active: {
            type: 'boolean',
            notNull: true,
            default: true,
        },
        registered_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('now()')
        },
    });

    pgm.createTable('refresh_tokens', {
        id: {
            type: 'uuid',
            primaryKey: true,
            notNull: true,
            default: pgm.func('gen_random_uuid()'),
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        token_hash: {
            type: 'varchar(255)',
            notNull: true,
        },
        expires_at: {
            type: 'timestamp',
            notNull: true,
        },
        revoked: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
    });

    // index to search faster valid user tokens
    pgm.createIndex('refresh_tokens', 'user_id');
};

export const down = (pgm) => {
    pgm.dropTable('refresh_tokens');
    pgm.dropTable('users');
    pgm.dropType('user_role');
};