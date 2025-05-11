
export const mockCryptoCurrencies = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    binance_symbol: 'BTCUSDT',
    price: 94278.61,
    change: -1.645,
    logo: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'eth',
    binance_symbol: 'ETHUSDT',
    price: 1809.13,
    change: -1.29,
    logo: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/eth.png'
  },
  {
    id: 'binance-coin',
    name: 'Binance',
    symbol: 'bnb',
    binance_symbol: 'BNBUSDT',
    price: 586.26,
    change: -2.217,
    logo: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/bnb.png'
  },
  {
    id: 'toncoin',
    name: 'Toncoin',
    symbol: 'ton',
    binance_symbol: 'TONUSDT',
    price: 3.02,
    change: -2.11,
    logo: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/ton.png'
  },
  {
    id: 'band-protocol',
    name: 'Band',
    symbol: 'band',
    binance_symbol: 'BANDUSDT',
    price: 0.76,
    change: -4.056,
    logo: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/band.png'
  },
  {
    id: 'dogecoin',
    name: 'DogeCoin',
    symbol: 'doge',
    binance_symbol: 'DOGEUSDT',
    price: 0.17,
    change: -3.065,
    logo: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/doge.png'
  },
  {
    id: 'dai',
    name: 'Dai',
    symbol: 'dai',
    binance_symbol: 'DAIUSDT',
    price: 0.99,
    change: 0,
    logo: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/dai.png'
  }
];

export const mockUser = {
  name: 'Karan Deep Singh',
  phone: '+91 6306789537',
  email: 'sraju@gmail.com',
  vipLevel: 'VIP2',
  avatar: '/lovable-uploads/ef5444f1-eaec-497e-8ebd-b06a7c268dfb.png'
};

export const mockBalances = {
  totalBalance: 20023,
  totalDeposit: -317,
  totalWithdrawal: 7800,
  availableBalance: 20340
};

export const mockTeamStats = {
  levels: [
    { id: 'L1', current: 2, total: 28 },
    { id: 'L2', current: 8, total: 10 },
    { id: 'L3', current: 3, total: 4 },
  ],
  members: [
    {
      id: '8159038374',
      amount: 0,
      date: '09-04-25 22:02:49'
    },
    {
      id: '9781162680',
      amount: 0,
      date: '15-04-25 16:54:54'
    },
    {
      id: '9972008075',
      amount: 0,
      date: '13-04-25 14:35:07'
    },
    {
      id: '9812383815',
      amount: 0,
      date: '08-04-25 15:45:25'
    },
    {
      id: '8429155465',
      amount: 0,
      date: '04-04-25 18:30:42'
    }
  ]
};

export const mockTransactions = [
  {
    id: 1,
    coin: 'Bitcoin',
    symbol: 'btc',
    logo: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png',
    amount: 17286,
    buyTime: '22-04-25 17:12:53',
    obtainedPrice: 7392316.79,
    sellTime: '22-04-25 17:13:53',
    closurePrice: 7460722.36,
    profit: 1037,
    currentBalance: 18323
  },
  {
    id: 2,
    coin: 'Tst',
    symbol: 'usdt',
    logo: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png',
    amount: 11119,
    buyTime: '15-04-25 17:01:38',
    obtainedPrice: 5.9280,
    sellTime: '15-04-25 17:02:38',
    closurePrice: 5.9780,
    profit: 667,
    currentBalance: 11786
  },
  {
    id: 3,
    coin: 'DogeCoin',
    symbol: 'doge',
    logo: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/doge.png',
    amount: 4773,
    buyTime: '07-04-25 17:17:48',
    obtainedPrice: 11.5230,
    sellTime: '07-04-25 17:18:48',
    closurePrice: 11.4130,
    profit: 286,
    currentBalance: 5059
  }
];

export const mockPriceChartData = [
  { time: '04:56', price: 94560 },
  { time: '05:00', price: 94520 },
  { time: '05:04', price: 94450 },
  { time: '05:08', price: 94200 },
  { time: '05:12', price: 94160 },
  { time: '05:16', price: 94240 },
  { time: '05:20', price: 94280 },
  { time: '05:24', price: 94220 },
  { time: '05:28', price: 94300 },
  { time: '05:32', price: 94240 },
  { time: '05:36', price: 94212 }
];

export const mockReferralData = {
  totalInvitations: 28,
  validInvitations: 2,
  referralCode: '558544',
  referralLink: 'https://indx.kiev.ua/?referral_code=558544',
  qrCode: '/lovable-uploads/73ac2c19-12f2-4d46-a3b4-8d5dfc48434a.png'
};
