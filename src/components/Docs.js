import React from 'react'

const Docs = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: "center" }}>
      <div style={{ width: '50%', backgroundColor: 'white', opacity: 0.7, padding: '20px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', color: "black", margin: "auto", borderRadius: "1%" }}>
        <h3>Instructions</h3>
        <p>1. For swapping you have to be on mainnet. On other chains this does not work.</p>
        <p>2. You have to have some eth for gas fees to make swap.</p>
        <p>3. First you have to approve 1Inch aggregator to make this swap and use your tokens. When transaction is completed wait cca 5-10 minutes to approve. Its little bit delayed. Then you can click again on swap button and make swap ! You can look to console. When there is make a swap, it means you are approved and you can make swap. Beware of sending multiple transactions, you have to wait like i said.</p>
      </div>
    </div>
  )
}

export default Docs