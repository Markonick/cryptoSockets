from dataclasses import dataclass

@dataclass()
class Tick:
    event_time: int
    symbol: str
    price_change: str
    price_change_percent: str
    weighted_average_price: str
    first_trade_f_1_price: str
    last_price: str
    last_quantity: str
    best_bid_price: str
    best_bid_quantity: str
    best_ask_price: str
    best_ask_quantity: str
    open_price: str
    high_price: str
    low_price: str
    total_traded_base_asset_volume: str
    total_traded_quote_asset_volume: str
    total_number_of_trades: int