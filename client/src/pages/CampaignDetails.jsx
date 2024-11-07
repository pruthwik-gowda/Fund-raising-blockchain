import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import axios from 'axios';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { final_logo } from '../assets';

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [amountUPI, setAmountUPI] = useState('');
  const [donators, setDonators] = useState([]);
  const [qrCodeURL, setQrCodeURL] = useState(''); // State to store the QR code URL
  const [isAmount, setIsAmount] = useState(false);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);
  };

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  const handleDonate = async () => {
    setIsLoading(true);
    try{
      if(address) await donate(state.pId, amount)
      else alert("Connect your wallet")
    }
    catch(err){
      console.log(err)
    }
    navigate('/');
    setIsLoading(false);
  };

  const fetchQrCode = async () => {
    try {
      // Send a request to your backend to generate the QR code
      const response = await axios.post('https://fund-raising-blockchain-chag.vercel.app/generate-qr', {
        upiId: state.upiId,
        amount: amountUPI || '0', // Default amount to 0 if none is provided
      });

      // Set the returned QR code URL
      setQrCodeURL(response.data.qrCodeURL);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  const updateAmount = (value) => {
    setAmount(value);
    setIsAmount(true);
  }

  const handleAmountNotEntered = () => {
    alert("amount not entered")
  }

  useEffect(() => {
    if (state.upiId) {
      fetchQrCode(); // Fetch QR code when the component mounts or UPI ID changes
    }
  }, [state.upiId, amountUPI]);

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-fill rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%' }}></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          {/* Campaign Creator */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={final_logo} alt="user" className="w-full h-full rounded bg-white" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 Campaigns</p>
              </div>
            </div>
          </div>

          {/* Campaign Story */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
            </div>
          </div>

          {/* Donators */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Donators</h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? donators.map((item, index) => (
                <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                  <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator} - {item.donation} ETH</p>
                  {/* <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donation}</p> */}
                </div>
              )) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>   

          <div className="mt-[20px] flex flex-col justify-around space-y-5 p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign through crypto
            </p>
            {/* <div className="mt-[30px] flex flex-col justify-around space-y-5"> */}
              <input 
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => updateAmount(e.target.value)}
                required
              />

              {isAmount ? <CustomButton 
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleDonate}
              /> : <CustomButton 
              btnType="button"
              title="Fund Campaign"
              styles="w-full bg-[#8c6dfd]"
              handleClick={handleAmountNotEntered}
            /> }

            {/* </div> */}

            
            </div>


          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">


            <div className="flex flex-col justify-around space-y-5">
              <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                Fund the campaign through UPI
              </p>

              <input 
                type="number"
                placeholder="Enter the amount"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amountUPI}
                onChange={(e) => setAmountUPI(e.target.value)}
                required
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px] flex justify-center">
                {qrCodeURL ? (
                  <img src={qrCodeURL} alt="UPI QR Code" className="w-[150px] h-[150px]" />
                ) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px]">Loading QR code...</p>
                )}
              </div>

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-center text-[14px] leading-[22px] text-white">{state.upiId}</h4>
              </div>
            </div>
          </div>
          </div>    
        </div>
      </div>
  );
};

export default CampaignDetails;
