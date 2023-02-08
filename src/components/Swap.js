import {Input, Popover, Radio, Modal, message} from 'antd'
import {ArrowDownOutlined, SettingOutlined} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import tokenList from '../tokenList.json'
import axios from 'axios'
import {useSendTransaction, useWaitForTransaction} from "wagmi"


function Swap(props) {
  const {address, isConnected} = props
const [slippage, setSlippage] = useState(2.5)
const [messageApi, contextHolder] = message.useMessage()
const [tokenOneAmount, setTokenOneAmount] = useState(0)
const [tokenTwoAmount, setTokenTwoAmount] = useState(0)
const [tokenOne, setTokenOne] = useState(tokenList[0])
const [tokenTwo, setTokenTwo] = useState(tokenList[1])
const [isOpen, setIsOpen] = useState(false)
const [changeToken, setChangeToken] = useState(1)
const [prices, setPrices] = useState({})
const [txDetails, setTxDetails] = useState({
  to: null, 
  data: null,
  value: null
})

const {data, sendTransaction} = useSendTransaction({
  request: {
    from : address,
    to: String(txDetails.to),
    data: String(txDetails.data),
    value: String(txDetails.value)
  }
})

const {isLoading, isSuccess} = useWaitForTransaction({
  hash: data?.hash
}) 

const handleSlippage = (e) => {
  setSlippage(e.target.value)
}

const changeAmount = (e) => {
  setTokenOneAmount(e.target.value)
  if(e.target.value && prices) {
    setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2))
  } else 
    setTokenTwoAmount(0)
}

const switchTokens = () => {
  setPrices(null)
  setTokenOneAmount(0)
  setTokenTwoAmount(0)
  setTokenOne(tokenTwo)
  setTokenTwo(tokenOne)
  fetchDexSwap(tokenTwo.address, tokenOne.address)
}

const openModal = (token) => {
  setChangeToken(token)
  setIsOpen(true)
}

const modifyToken = (i) => {
  setPrices(null)
  setTokenOneAmount(0)
  setTokenTwoAmount(0)
  if (changeToken === 1) {
    setTokenOne(tokenList[i])
    fetchDexSwap(tokenList[i].address, tokenTwo.address)
  } else {
    setTokenTwo(tokenList[i])
    fetchDexSwap(tokenOne.address, tokenList[i].address)
  }
  setIsOpen(false)
}

const fetchDexSwap = async (one, two) => {
  const res = await axios.get("https://dex-swap-clone.onrender.com/tokenPrice", {
    params: {
      addressOne: one,
      addressTwo: two 
    }
  })
  console.log(res.data)
  setPrices(res.data)
}

const fetchDex = async () => {
  const allowance = await axios.get(`https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`)

  if(allowance.data.allowance == 0) {
    const approve = await axios.get(`https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=${tokenOne.address}&amount=100000000000
    `)
    setTxDetails(approve.data)
    console.log("Not approved") 
    return
  }
  

console.log("make swap", allowance.data.allowance)

const swap = await axios.get(`https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${tokenOne.address}&toTokenAddress=${tokenTwo.address}&amount=${tokenOneAmount.padEnd(tokenOne.decimals+tokenOneAmount.length, '0')}&fromAddress=${address}&slippage=${slippage}`)

console.log("swap", swap.data)

let decimals = Number(`1E${tokenTwo.decimals}`)

setTokenTwoAmount((Number(swap?.data?.toTokenAmount)/decimals).toFixed(2))

setTxDetails(swap?.data?.tx)

}

useEffect(() => {
  fetchDexSwap(tokenList[0].address, tokenList[1].address)
}, [])

useEffect(() => {
  messageApi.destroy()
  if (isLoading) {
    messageApi.open({
      content: 'Waiting for transaction to be mined',
      type: 'loading',
      duration: 0
    })
  }},[isLoading])

  useEffect(() => {
    messageApi.destroy()
    if (isSuccess) {
      messageApi.open({
        type: 'success',
        content: 'Transaction Success',
        duration: 2
      })
    } else if (txDetails.to){
      messageApi.open({
        type: 'error',
        content: 'Transaction Failed',
        duration: 2
      })
    }
  }, [isSuccess]) 

useEffect(() => {
  if (txDetails.to && isConnected) {
   sendTransaction()
    message.success('Transaction sent')
  }
}, [txDetails])

  const settingsContent = (
    <>
    <div>Slippage Tolerance</div>
    <div>
      <Radio.Group onChange={handleSlippage} value={slippage}>
        <Radio.Button value={0.5}>0.5%</Radio.Button>
        <Radio.Button value={2.5}>2.5%</Radio.Button>
        <Radio.Button value={5}>5%</Radio.Button>
      </Radio.Group>
    </div>
    </>
  )

  return (
    <>
    {contextHolder}
    <Modal open={isOpen} footer={null} onCancel={()=> {setIsOpen(false)}} title="Select a token">
    <div className='modalContent'>
      {tokenList?.map((token, index) => {
        return (
          <div className='tokenChoice' key={index} 
          onClick={() => modifyToken(index)}
          >
            <img src={token.img} alt={token.ticker} className="tokenLogo"/>
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
    </Modal>
    <div className='tradeBox'>
      <div className='tradeBoxHeader'>
        <h4>Swap</h4>
        <Popover
        title='Settings'
        trigger='click'
        placement='bottomRight'
        content={settingsContent}
        >
        <SettingOutlined className='cog'/>
        </Popover>
      </div>
      <div className='inputs'>
      <Input placeholder='0' value={tokenOneAmount} onChange={changeAmount} disabled={!prices}/>
      <Input placeholder='0' value={tokenTwoAmount} disabled={true} />
      <div className="switchButton" onClick={switchTokens}>
        <ArrowDownOutlined className='switchArrow'/>
          </div> 
      <div className='assetOne' onClick={()=> openModal(1)}>
        <img src={tokenOne.img} alt="assetOnelogo" className='logo'/>
        {tokenOne.ticker}
      </div>
      <div className='assetTwo' onClick={()=> openModal(2)}>
      <img src={tokenTwo.img} alt="assetTwologo" className='logo' />
        {tokenTwo.ticker}
      </div>
    </div>
    <div className='swapButton' onClick={fetchDex} disabled={!tokenOneAmount || !isConnected}>
      Swap
      </div>
    </div>
    </>
  )
}

export default Swap