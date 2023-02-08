import React from 'react'
import tokenList from '../tokenList'

function Tokens() {
  return (
    <div style={{width: "100vw", height: "100%"}}>
      <div className=''>
      <h1 style={{textAlign: "center", mb: "5px"}} >This tokens are available to swap:</h1>
      </div>
      <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 20, margin: "0 auto", alignItems: "center", justifyContent: "center"}}>
      {tokenList?.map((token, index) => {
        return (
          <div className='tokenChoice' key={index} 
          >
             <div className="pulsating-img-container">
            <img src={token.img} alt={token.ticker} className="tokenLogo"/>
            </div>
            <div className='tokenChoiceNames'>
              <div className='tokenName'> 
                {token.name}
              </div>
              <div className='tokenTicker'>
                {token.ticker}
                </div>
            </div>
            </div>
        )
      })}
    </div>
    </div>
  )
}

export default Tokens