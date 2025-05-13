
import React from 'react';
import MobileLayout from "@/components/layout/MobileLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Users, Check, Award, Star } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
        <div className="p-4 pb-safe space-y-6">
          {/* Header Section with improved design */}
          <AspectRatio ratio={16/9} className="mb-6 overflow-hidden rounded-lg">
            <div className="h-full w-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
              <div className="text-center p-4 relative z-10">
                <div className="mb-3 flex justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-md">NEXBIT</h1>
                <h2 className="text-xl font-semibold text-white/90 drop-shadow-md">Broker Salary Program</h2>
                
                {/* Animated particles for visual interest */}
                <div className="absolute top-0 left-0 w-full h-full -z-10">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-white/30 animate-pulse"></div>
                  <div className="absolute top-3/4 left-2/3 w-3 h-3 rounded-full bg-white/20 animate-pulse" style={{animationDelay: "0.5s"}}></div>
                  <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{animationDelay: "1s"}}></div>
                </div>
              </div>
            </div>
          </AspectRatio>

          {/* VIP Levels Card with improved styling */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2 px-1 text-blue-500">
              <Star className="w-5 h-5" /> VIP Levels
            </h3>
            <Card className="overflow-hidden border-0 shadow-lg bg-card/95 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-blue-500/95">
                      <TableRow>
                        <TableHead className="text-center text-white font-medium text-xs">VIP</TableHead>
                        <TableHead className="text-center text-white font-medium text-xs">L1</TableHead>
                        <TableHead className="text-center text-white font-medium text-xs whitespace-nowrap">L1+L2+L3</TableHead>
                        <TableHead className="text-center text-white font-medium text-xs">Salary</TableHead>
                        <TableHead className="text-center text-white font-medium text-xs whitespace-nowrap">New Qty</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vipLevels.map((level, index) => (
                        <TableRow key={level.level} className={index % 2 === 0 ? "bg-blue-50/60" : "bg-white/80"}>
                          <TableCell className="text-center font-medium text-xs py-2.5 text-blue-600">{level.level}</TableCell>
                          <TableCell className="text-center text-xs py-2.5">{level.l1}</TableCell>
                          <TableCell className="text-center text-xs py-2.5">{level.totalRefs}</TableCell>
                          <TableCell className="text-center text-xs py-2.5">{level.salary}</TableCell>
                          <TableCell className="text-center text-xs py-2.5">{level.newQuantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Accordion instead of tabs for better mobile UX */}
          <Accordion type="single" collapsible className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2 px-1 text-blue-500 mb-1">
              <Info className="w-5 h-5" /> VIP Program Details
            </h3>
            
            <AccordionItem value="explanation" className="border bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="flex items-center gap-2">
                  <Info size={16} className="text-blue-500" /> What are L1, L2, and L3?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-800">L1 is a user who registered directly using your referral code.</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-800">L2 is a user who registered using the L1 member referral code.</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-800">L3 is a user who registered using the L2 member referral code.</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rules" className="border bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-blue-500" /> Agent Rules & Requirements
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-800">Agents should guide new users to use the APP correctly and clarify transaction rules, recharge methods and withdrawal requirements.</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-800">Actively promote the company to carry out various forms of online and offline promotion activities, and encourage users to publish your invitation link through Youtube, WhatsApp, and other channels.</span>
                  </li>
                </ul>

                <div className="mt-4 p-3 bg-red-50/80 border border-red-200 rounded-lg">
                  <p className="font-medium text-sm mb-1 text-red-600">Disclaimer:</p>
                  <p className="text-xs text-gray-800">Each person, each mobile phone, each IP address, and each bank account can only have one NEXBIT account. If the system audit finds malicious use of multiple accounts to defraud rewards, all accounts will be frozen and the principal will be confiscated once discovered.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </MobileLayout>
  );
};

export default VipPage;
