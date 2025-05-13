
import React from 'react';
import MobileLayout from "@/components/layout/MobileLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import { ArrowRight, Crown, TrendingUp, Gift, Clock, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// VIP Level data
const vipLevels = [
  { level: 'VIP 1', deposit: 10000, commission: 1.0, withdrawal: 50000, color: '#FF7F50' },
  { level: 'VIP 2', deposit: 30000, commission: 1.2, withdrawal: 100000, color: '#FFA500' },
  { level: 'VIP 3', deposit: 80000, commission: 1.5, withdrawal: 250000, color: '#FFD700' },
  { level: 'VIP 4', deposit: 150000, commission: 1.8, withdrawal: 500000, color: '#7FFFD4' },
  { level: 'VIP 5', deposit: 300000, commission: 2.0, withdrawal: 1000000, color: '#0FE0E0' },
  { level: 'VIP 6', deposit: 800000, commission: 2.3, withdrawal: 2000000, color: '#1E90FF' },
  { level: 'VIP 7', deposit: 1500000, commission: 2.5, withdrawal: 5000000, color: '#B768FF' },
  { level: 'VIP 8', deposit: 3000000, commission: 3.0, withdrawal: 10000000, color: '#9932CC' },
];

// Benefits for each tab
const benefits = {
  rewards: [
    { title: 'Deposit Bonus', description: 'Get up to 3% bonus on every deposit' },
    { title: 'Trading Rebates', description: 'Earn back a percentage of your trading fees' },
    { title: 'Weekly Rewards', description: 'Exclusive weekly bonuses for active traders' },
    { title: 'Special Events', description: 'Priority access to promotional events' },
  ],
  services: [
    { title: 'Dedicated Manager', description: 'Personal account manager for VIP 3+' },
    { title: 'Priority Support', description: '24/7 priority customer service' },
    { title: 'Exclusive Webinars', description: 'Educational content from trading experts' },
    { title: 'Market Insights', description: 'Premium market analysis and reports' },
  ],
  limits: [
    { title: 'Higher Withdrawal Limits', description: 'Increased daily and monthly withdrawal caps' },
    { title: 'Faster Processing', description: 'Expedited transaction processing' },
    { title: 'Reduced Fees', description: 'Lower withdrawal and transaction fees' },
    { title: 'API Access', description: 'Advanced API privileges for automated trading' },
  ]
};

const VipPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('levels');

  // Animated level cards
  const renderLevelCards = () => {
    return (
      <div className="grid grid-cols-2 gap-3 mb-6">
        {vipLevels.slice(0, 4).map((level, index) => (
          <motion.div 
            key={level.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-[#1a1e29] to-[#131722] border border-white/5 overflow-hidden">
              <CardHeader className="p-3 pb-0">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-white flex items-center">
                    {level.level}
                    {index > 1 && <Crown className="h-3 w-3 ml-1 text-amber-500" />}
                  </CardTitle>
                  <span className="text-xs px-2 py-0.5 bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-full">
                    +{level.commission}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                <div className="text-xs text-gray-400 mb-1">Min. Deposit</div>
                <div className="text-base font-semibold text-white">₹{level.deposit.toLocaleString()}</div>
              </CardContent>
              <div className="h-1" style={{ backgroundColor: level.color }} />
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  // Benefits section for each tab
  const renderBenefits = (type) => {
    return (
      <div className="space-y-4 mb-6">
        {benefits[type].map((benefit, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex p-3 bg-[#1a1e29] rounded-lg border border-white/5"
          >
            <div className="mr-3 h-8 w-8 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
              {type === 'rewards' ? <Gift className="h-4 w-4" /> : 
               type === 'services' ? <Clock className="h-4 w-4" /> : 
               <TrendingUp className="h-4 w-4" />}
            </div>
            <div>
              <div className="font-medium text-sm text-white">{benefit.title}</div>
              <div className="text-xs text-gray-400">{benefit.description}</div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <MobileLayout showBackButton title="VIP Program">
      <ScrollArea className="h-full">
        <div className="p-4 bg-[#0d0f17]">
          {/* Hero Section */}
          <motion.div 
            className="relative overflow-hidden rounded-xl mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] p-6 text-white">
              <div className="flex items-center mb-3">
                <Crown className="h-6 w-6 mr-2 text-amber-300" />
                <h1 className="text-xl font-bold">VIP Program</h1>
              </div>
              <p className="text-sm text-white/90 mb-4">
                Unlock exclusive benefits and higher rewards as you progress through our VIP levels.
              </p>
              <Button 
                onClick={() => navigate('/deposit')} 
                className="bg-white text-[#7C3AED] hover:bg-white/90 mt-2"
              >
                Upgrade Now <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="levels">Levels</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>
            
            {/* VIP Levels Tab */}
            <TabsContent value="levels" className="mt-0">
              <div className="space-y-4">
                {renderLevelCards()}
                
                <div className="rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#1a1e29]">
                      <TableRow>
                        <TableHead className="text-white">Level</TableHead>
                        <TableHead className="text-white text-right">Min Deposit</TableHead>
                        <TableHead className="text-white text-right">Commission</TableHead>
                        <TableHead className="text-white text-right">Withdrawal Limit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vipLevels.map((level) => (
                        <TableRow key={level.level} className="border-b border-white/5">
                          <TableCell className="font-medium text-white">{level.level}</TableCell>
                          <TableCell className="text-right text-gray-300">₹{level.deposit.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-emerald-400">+{level.commission}%</TableCell>
                          <TableCell className="text-right text-gray-300">₹{level.withdrawal.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            {/* VIP Chart Tab */}
            <TabsContent value="chart" className="mt-0">
              <Card className="bg-[#1a1e29] border-white/5 mb-4">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg text-white">VIP Schedule Chart</CardTitle>
                  <CardDescription>
                    Commission rates increase with your VIP level
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[300px] w-full">
                    <ChartContainer 
                      className="h-full w-full"
                      config={{
                        blue: { theme: { light: "#8B5CF6", dark: "#8B5CF6" } },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={vipLevels} margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
                          <XAxis dataKey="level" axisLine={false} tickLine={false} />
                          <YAxis hide={true} />
                          <ChartTooltip 
                            content={<ChartTooltipContent />} 
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                          />
                          <Bar dataKey="commission" radius={[4, 4, 0, 0]} maxBarSize={50}>
                            {vipLevels.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <LabelList dataKey="commission" position="top" formatter={(value) => `${value}%`} fill="#fff" />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#131722] text-xs text-gray-400 flex justify-center">
                  Higher levels provide better benefits and rewards
                </CardFooter>
              </Card>
              
              <Card className="bg-[#1a1e29] border-white/5">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg text-white">Withdrawal Limits</CardTitle>
                  <CardDescription>
                    Daily withdrawal limits by VIP level
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[300px] w-full">
                    <ChartContainer 
                      className="h-full w-full"
                      config={{
                        blue: { theme: { light: "#1E90FF", dark: "#1E90FF" } },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={vipLevels} margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
                          <XAxis dataKey="level" axisLine={false} tickLine={false} />
                          <YAxis hide={true} />
                          <ChartTooltip 
                            content={<ChartTooltipContent />} 
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                          />
                          <Bar dataKey="withdrawal" radius={[4, 4, 0, 0]} maxBarSize={50}>
                            {vipLevels.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <LabelList 
                              dataKey="withdrawal" 
                              position="top" 
                              formatter={(value) => `₹${(value/1000)}K`}
                              fill="#fff" 
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Benefits Tab - using nested tabs */}
            <TabsContent value="benefits" className="mt-0">
              <Tabs defaultValue="rewards" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="rewards">Rewards</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="limits">Limits</TabsTrigger>
                </TabsList>
                
                <TabsContent value="rewards" className="mt-0">
                  {renderBenefits('rewards')}
                </TabsContent>
                
                <TabsContent value="services" className="mt-0">
                  {renderBenefits('services')}
                </TabsContent>
                
                <TabsContent value="limits" className="mt-0">
                  {renderBenefits('limits')}
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <Button 
                  onClick={() => navigate('/deposit')} 
                  className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
                >
                  Upgrade Your VIP Level <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </MobileLayout>
  );
};

export default VipPage;
