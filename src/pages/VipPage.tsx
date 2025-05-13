
import React from 'react';
import MobileLayout from "@/components/layout/MobileLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Users, Check } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// VIP level data from the reference image
const vipLevels = [
  { level: "VIP1", l1: 2, totalRefs: 15, salary: 200, newQuantity: 2 },
  { level: "VIP2", l1: 5, totalRefs: 25, salary: 800, newQuantity: 5 },
  { level: "VIP3", l1: 10, totalRefs: 50, salary: 2000, newQuantity: 8 },
  { level: "VIP4", l1: 30, totalRefs: 150, salary: 5000, newQuantity: 15 },
  { level: "VIP5", l1: 80, totalRefs: 500, salary: 10000, newQuantity: 30 },
  { level: "VIP6", l1: 200, totalRefs: 2000, salary: 30000, newQuantity: 100 },
  { level: "VIP7", l1: 500, totalRefs: 5000, salary: 100000, newQuantity: 300 },
  { level: "VIP8", l1: 1000, totalRefs: 10000, salary: 200000, newQuantity: "caly" },
];

const VipPage = () => {
  return (
    <MobileLayout showBackButton title="VIP Program">
      <ScrollArea className="h-full">
        <div className="p-4 pb-safe">
          {/* Header Section */}
          <AspectRatio ratio={16/9} className="mb-6 overflow-hidden rounded-lg">
            <div className="h-full w-full bg-gradient-to-r from-green-300 to-green-100 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="mb-3 flex justify-center">
                  <div className="w-20 h-20">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-blue-800">
                      <path d="M50,10 L90,30 L90,70 L50,90 L10,70 L10,30 Z" fill="currentColor" stroke="none" />
                      <path d="M25,40 L40,60 L50,40 L60,60 L75,40" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M30,60 L70,60" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-blue-800 mb-1">NEXBIT</h1>
                <h2 className="text-2xl font-bold text-blue-800">Broker Salary Schedule</h2>
              </div>
            </div>
          </AspectRatio>

          <Card className="mb-6">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-teal-500">
                  <TableRow>
                    <TableHead className="text-center text-white font-bold">VIP</TableHead>
                    <TableHead className="text-center text-white font-bold">L1</TableHead>
                    <TableHead className="text-center text-white font-bold">L1+L2+L3</TableHead>
                    <TableHead className="text-center text-white font-bold">Salary</TableHead>
                    <TableHead className="text-center text-white font-bold">New quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vipLevels.map((level, index) => (
                    <TableRow key={level.level} className={index % 2 === 0 ? "bg-green-200" : "bg-green-300"}>
                      <TableCell className="text-center font-medium">{level.level}</TableCell>
                      <TableCell className="text-center">{level.l1}</TableCell>
                      <TableCell className="text-center">{level.totalRefs}</TableCell>
                      <TableCell className="text-center">{level.salary}</TableCell>
                      <TableCell className="text-center">{level.newQuantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Tabs defaultValue="explanation" className="w-full mb-6">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="explanation">Explanation</TabsTrigger>
              <TabsTrigger value="rules">Agent Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="explanation" className="mt-0 space-y-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Info size={18} className="mr-2 text-blue-800" /> What are L1, L2, and L3?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span>L1 is a user who registered directly using your referral code.</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span>L2 is a user who registered using the L1 member referral code.</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span>L3 is a user who registered using the L2 member referral code.</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="rules" className="mt-0 space-y-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Users size={18} className="mr-2 text-blue-800" /> Agent Rules & Requirements
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span>Agents should guide new users to use the APP correctly and clarify transaction rules, recharge methods and withdrawal requirements.</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span>Actively promote the company to carry out various forms of online and offline promotion activities, and encourage users to publish your invitation link through Youtube, WhatsApp, and other channels.</span>
                  </li>
                </ul>

                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="font-medium mb-1">Disclaimer:</p>
                  <p className="text-sm">Each person, each mobile phone, each IP address, and each bank account can only have one NEXBIT account. If the system audit finds malicious use of multiple accounts to defraud rewards, all accounts will be frozen and the principal will be confiscated once discovered.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </MobileLayout>
  );
};

export default VipPage;
