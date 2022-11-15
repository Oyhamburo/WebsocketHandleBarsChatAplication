const sqliteConfig = {
    client: 'sqlite3',
    connection: {
        filename: './DB/msgs.sqlite',
    },
    useNullAsDefault: true
};

export default sqliteConfig;