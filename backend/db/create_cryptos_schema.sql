CREATE SCHEMA cryptos;

CREATE TABLE cryptos.exchange (
    id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE cryptos.symbol (
    id INT PRIMARY KEY,
    name TEXT
);

CREATE TABLE cryptos.exchange_symbol (
    exchange_id INT NOT NULL REFERENCES cryptos.exchange ON DELETE CASCADE,
    symbol_id INT NOT NULL REFERENCES cryptos.symbol ON DELETE CASCADE,
    name TEXT,
    CONSTRAINT exchange_symbol_pk PRIMARY KEY (exchange_id, symbol_id)
);

CREATE TABLE IF NOT EXISTS cryptos.tick(
    id serial PRIMARY KEY,
    exchange_symbol_id INT NOT NULL REFERENCES cryptos.exchange_symbol,
    event_time BIGINT,
    price_change FLOAT,
    price_change_percent FLOAT,
    last_price FLOAT,
    open_price FLOAT,
    high_price FLOAT,
    low_price FLOAT
);

CREATE TABLE IF NOT EXISTS cryptos.kline(
    id serial PRIMARY KEY,
    exchange_symbol_id INT NOT NULL REFERENCES cryptos.exchange_symbol,
    event_time BIGINT,
    open_price FLOAT,
    close_price FLOAT,
    high_price FLOAT,
    low_price FLOAT,
    interval TEXT,
    start_time BIGINT,
    close_time BIGINT,
    number_of_trades INT
);
