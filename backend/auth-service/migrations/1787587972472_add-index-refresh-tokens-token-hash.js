export const up = (pgm) => {
    pgm.createIndex('refresh_tokens', 'token_hash');
};

export const down = (pgm) => {
    pgm.dropIndex('refresh_tokens', 'token_hash');
};