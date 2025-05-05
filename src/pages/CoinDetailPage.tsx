
import { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import PriceChart from '@/components/PriceChart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { mockMarketData } from '@/data/mockData';
import { ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';

const CoinDetailPage = () => {
  const [activeTab, setActiveTab] = useState('chart');
  const crypto = mockMarketData[0]; // Using the first crypto from the list for demo
  
  // Sample chart data - in a real app this would be fetched based on the crypto
  const chartData = [
    { timestamp: '2023-01-01T00:00', price: 42000 },
    { timestamp: '2023-01-01T01:00', price: 42200 },
    { timestamp: '2023-01-01T02:00', price: 42100 },
    { timestamp: '2023-01-01T03:00', price: 42300 },
    { timestamp: '2023-01-01T04:00', price: 42500 },
    { timestamp: '2023-01-01T05:00', price: 42400 },
    { timestamp: '2023-01-01T06:00', price: 42600 },
    { timestamp: '2023-01-01T07:00', price: 42800 },
    { timestamp: '2023-01-01T08:00', price: 42700 },
    { timestamp: '2023-01-01T09:00', price: 42900 },
    { timestamp: '2023-01-01T10:00', price: 43000 },
    { timestamp: '2023-01-01T11:00', price: 42950 },
    { timestamp: '2023-01-01T12:00', price: 43100 },
  ];

  return (
    <MobileLayout showBackButton title={crypto.name}>
      <div className="p-4 max-w-md mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="bg-card/70 backdrop-blur-sm rounded-full p-2 mr-3">
              <img 
                src={crypto.icon} 
                alt={crypto.symbol}
                className="w-10 h-10"
              />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold">{crypto.name}</h2>
              <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">${crypto.price.toLocaleString()}</div>
            <div className={`text-sm flex items-center justify-end ${crypto.change > 0 ? 'text-market-increase' : 'text-market-decrease'}`}>
              {crypto.change > 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(crypto.change)}%
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <PriceChart 
                  data={chartData} 
                  currentPrice={crypto.price}
                  previousPrice={crypto.price - (crypto.price * crypto.change / 100)}
                  height={220}
                  areaChart
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Market Stats</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Market Cap</p>
                    <p className="font-medium">${(crypto.price * 19000000).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24h Volume</p>
                    <p className="font-medium">${(crypto.price * 800000).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Circulating Supply</p>
                    <p className="font-medium">19,000,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Max Supply</p>
                    <p className="font-medium">21,000,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Price History</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">1h</p>
                    <p className={crypto.change > 0 ? 'text-market-increase' : 'text-market-decrease'}>
                      {crypto.change > 0 ? '+' : ''}{(crypto.change * 0.1).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24h</p>
                    <p className={crypto.change > 0 ? 'text-market-increase' : 'text-market-decrease'}>
                      {crypto.change > 0 ? '+' : ''}{crypto.change}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">7d</p>
                    <p className={crypto.change > 0 ? 'text-market-increase' : 'text-market-decrease'}>
                      {crypto.change > 0 ? '+' : ''}{(crypto.change * 2.5).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="about">
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  {crypto.name} ({crypto.symbol}) is a digital currency that enables instant payments to anyone, anywhere in the world.
                </p>
                <p>
                  {crypto.name} uses peer-to-peer technology to operate with no central authority: managing transactions and issuing money are carried out collectively by the network.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trade">
            <Card>
              <CardContent className="pt-6 flex flex-col gap-4">
                <Button className="bg-market-increase hover:bg-market-increase/90">
                  Buy {crypto.symbol}
                </Button>
                <Button variant="outline">
                  Sell {crypto.symbol}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default CoinDetailPage;
