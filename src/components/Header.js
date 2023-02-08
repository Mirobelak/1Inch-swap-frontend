import React from 'react'
import Eth from '../eth.svg'
import Logo from '../logo.png'
import {Link} from 'react-router-dom'

function Header(props) {
  const {connect, isConnected, address} = props
  return (
    <header>
      <div className='leftH'>
        <img src={Logo} alt='eth' className='logo' />
        <Link to='/' className='link'>
        <div className='headerItem'>Swap</div>  
        </Link>
        <Link to='/tokens' className='link'>
        <div className='headerItem'>Tokens</div>
        </Link>
        <Link to='/docs' className='link'>
        <div className='headerItem'>Docs</div>
        </Link>
        </div>
      <div className='rightH'>
        <div className='headerItem'>
          <img src={Eth} alt='eth' className='logo' />
          Ethereum
        </div>
        <div className='connectButton' 
        onClick={connect}
         >{isConnected ? (address.slice(0,4) + "..." + address.slice(38)) : "Connect" }</div>
        </div>
    </header>
  )
}

export default Header