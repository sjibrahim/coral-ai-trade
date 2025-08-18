
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Gift, Check } from "lucide-react";

const CheckinPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentDay, setCurrentDay] = useState(1);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [checkedDays, setCheckedDays] = useState<number[]>([]);

  // Load checkin data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('checkinData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setCurrentDay(data.currentDay || 1);
      setCheckedDays(data.checkedDays || []);
      
      // Check if user has already checked in today
      const today = new Date().toDateString();
      const lastCheckin = data.lastCheckin;
      if (lastCheckin === today) {
        setCheckedInToday(true);
      }
    }
  }, []);

  const handleCheckin = () => {
    if (checkedInToday) return;

    const today = new Date().toDateString();
    const newCheckedDays = [...checkedDays, currentDay];
    const nextDay = currentDay < 7 ? currentDay + 1 : 1;

    // Save to localStorage
    const checkinData = {
      currentDay: nextDay,
      checkedDays: nextDay === 1 ? [] : newCheckedDays,
      lastCheckin: today
    };
    localStorage.setItem('checkinData', JSON.stringify(checkinData));

    setCheckedDays(newCheckedDays);
    setCurrentDay(nextDay);
    setCheckedInToday(true);

    toast({
      title: "Check-in Successful!",
      description: `You earned ₹${currentDay} today!`,
    });
  };

  const checkinDays = [
    { day: 1, reward: 1 },
    { day: 2, reward: 2 },
    { day: 3, reward: 3 },
    { day: 4, reward: 4 },
    { day: 5, reward: 5 },
    { day: 6, reward: 6 },
    { day: 7, reward: 7 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-xl font-bold text-white">Daily Check-in</h1>
        <div className="w-16"></div>
      </div>

      <div className="px-4 pb-8">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 mb-6 text-center">
          <Calendar className="w-12 h-12 text-white mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">Daily Check-in</h2>
          <p className="text-white/80 text-sm">Check in daily to earn rewards!</p>
        </div>

        {/* Current Day Info */}
        <div className="bg-gray-800/80 rounded-xl p-4 mb-6 text-center border border-gray-700/30">
          <div className="text-gray-400 text-sm mb-1">Today's Reward</div>
          <div className="text-3xl font-bold text-white mb-2">₹{currentDay}</div>
          <div className="text-gray-400 text-xs">Day {currentDay} of 7</div>
        </div>

        {/* Check-in Calendar */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {checkinDays.map((item) => {
            const isChecked = checkedDays.includes(item.day);
            const isCurrent = item.day === currentDay && !checkedInToday;
            const isPast = item.day < currentDay || checkedDays.includes(item.day);
            
            return (
              <div
                key={item.day}
                className={`
                  aspect-square rounded-xl p-2 text-center flex flex-col justify-center items-center relative
                  ${isCurrent ? 'bg-gradient-to-r from-teal-500 to-cyan-500 ring-2 ring-white/50' : ''}
                  ${isChecked ? 'bg-green-600' : ''}
                  ${!isCurrent && !isChecked ? 'bg-gray-800/60 border border-gray-700/30' : ''}
                `}
              >
                {isChecked && (
                  <Check className="w-4 h-4 text-white absolute top-1 right-1" />
                )}
                <div className="text-xs text-white/80 mb-1">Day {item.day}</div>
                <div className="text-sm font-bold text-white">₹{item.reward}</div>
              </div>
            );
          })}
        </div>

        {/* Check-in Button */}
        <Button
          onClick={handleCheckin}
          disabled={checkedInToday}
          className={`
            w-full h-14 text-lg font-bold rounded-xl
            ${checkedInToday 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white'
            }
          `}
        >
          <Gift className="w-5 h-5 mr-2" />
          {checkedInToday ? 'Already Checked In Today' : `Check In - Earn ₹${currentDay}`}
        </Button>

        {checkedInToday && (
          <div className="text-center mt-4 text-gray-400 text-sm">
            Come back tomorrow for your next reward!
          </div>
        )}

        {/* Progress Info */}
        <div className="mt-6 bg-gray-800/60 rounded-xl p-4 border border-gray-700/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">Progress</span>
            <span className="text-white text-sm">{checkedDays.length}/7 days</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(checkedDays.length / 7) * 100}%` }}
            ></div>
          </div>
          <div className="text-gray-400 text-xs mt-2 text-center">
            {checkedDays.length === 7 ? 'Cycle completed! Starting new cycle...' : `${7 - checkedDays.length} days left in current cycle`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckinPage;
