import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { marketplaceAddress } from '../config'
import NFTMarketplace from '../abi/marketplace.json'
import {Web3} from 'web3'

export default function Home() {
  const [accountAddress, setAccountAddress] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [address , setAddress] = useState('')
  const [balance , setBalance] = useState(' ')
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [error, setError] = useState(null)
  const [buyingNft, setBuyingNft] = useState(null)

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      
      const network = await provider.getNetwork()
      if (network.chainId !== 5003) {
        throw new Error('Please switch to the Mantle testnet')
      }
      
      const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
      const data = await contract.fetchMarketItems()

      const items = await Promise.all(data.map(async i => {
        const tokenUri = await contract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        return {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          cid1: meta.data.cid1,
        }
      }))

      setNfts(items)
      setLoadingState('loaded')
      setError(null)
    } catch (error) {
      console.error("Failed to load NFTs:", error)
      setError(error.message)
      setLoadingState('loaded')
    }
  }

  async function buyNft(nft) {
    setBuyingNft(nft.tokenId)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      
      const network = await provider.getNetwork()

      // alert(network);
      if (network.chainId !== 5003) { // mnt testnet chain ID
        throw new Error('Please switch to the Mantle testnet')
      }
      
      const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price
      })
      await transaction.wait()
      await loadNFTs()
      alert("NFT purchased successfully!")
    } catch (error) {
      console.error("Failed to buy NFT:", error)
      setError(error.message)
    } finally {
      setBuyingNft(null)
    }
  }

  const networks = {
    MantleTestnet: {
      chainId: `0x${Number(5003).toString(16)}`,
      chainName: "MantleTestnet",
      nativeCurrency: {
        name: "MantleTestnet",
        symbol: "MNT",
        decimals: 18,
      },
      rpcUrls: ["https://endpoints.omniatech.io/v1/mantle/sepolia/public"],
      blockExplorerUrls: ['https://explorer.sepolia.mantle.xyz/'],
    },
  }

  async function switchToMantleTestnet() {
    setLoading(true)
    
    if(typeof window.ethereum =="undefined"){
      console.log("PLease install the metamask")
    }
    let web3 =  new Web3(window.ethereum)

    const chainId = await web3.eth.getChainId()
    const MantleTestnetChainId = parseInt(networks.MantleTestnet.chainId, 16)

    console.log(parseInt(chainId))
    console.log("The neo testnet chain id is",parseInt(chainId))

    const chainId1 = parseInt(chainId)
   
    if(chainId1 !== MantleTestnetChainId){
      await window.ethereum.request({
        method:"wallet_addEthereumChain",
        params:[{
          ...networks["MantleTestnet"]
        }]
      })
    }
    const accounts = await web3.eth.requestAccounts()

    console.log(accounts)
    const Address =  accounts[0]
    if (typeof window !== 'undefined') {
      localStorage.setItem("filWalletAddress",Address)
    }

    console.log(Address)
    setAddress(Address)

    setLoading(false)
    window.location.reload()
  }

  if (loadingState === 'not-loaded') {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
          NFT STORE Marketplace
        </h1>
        
        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            {error === 'Please switch to the Mantle testnet' && (
              <button
                onClick={switchToMantleTestnet}
                className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Switch to Mantle Testnet
              </button>
            )}
          </div>
        )}
        
        {nfts.length === 0 ? (
          <div className="text-center text-white text-2xl">
            No items in the marketplace
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src={nft.image} 
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">{nft.name}</h2>
                  <p className="text-gray-600 h-20 overflow-y-auto mb-4">{nft.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-indigo-600">{nft.price} MNT</span>
                    <button 
                      onClick={() => buyNft(nft)}
                      disabled={buyingNft === nft.tokenId}
                      className={`bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl ${buyingNft === nft.tokenId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {buyingNft === nft.tokenId ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          Buying...
                        </div>
                      ) : (
                        'Buy Item'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}