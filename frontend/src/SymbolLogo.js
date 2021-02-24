

function Logo(props) {
  const url = `https://s2.coinmarketcap.com/static/img/coins/32x32/${props.id}.png`;
  
  return (
    <div>  
        <img 
            // src={`https://cryptoicons.org/api/color/${props.symbol}/30/000000`}
            // src={`https://cryptoicons.org/api/icon/${props.symbol}/30`}
            src={url}
            style={{height: "30px", position: "relative", top: "50%", transform: "translateY(-50%)"}}
            className="Symbol-logo"
            alt={props.symbol}
        />
    </div>
  );
}

export default Logo;
