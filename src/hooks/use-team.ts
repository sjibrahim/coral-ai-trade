
import { useState, useEffect, useCallback } from 'react';
import { getTeamDetails } from '@/services/api';
import { useToast } from './use-toast';

export interface TeamMember {
  id: string;
  name: string;
  phone: string;
  invited_by: string;
  level: string;
  active_member: string;
  total_deposit: string;
  total_withdraw: string;
}

export const useTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  
  // Filter members by level
  const level1Members = teamMembers.filter(member => member.level === "1");
  const level2Members = teamMembers.filter(member => member.level === "2");
  const level3Members = teamMembers.filter(member => member.level === "3");
  
  // Get active members count by level
  const activeLevel1 = level1Members.filter(member => member.active_member === "1").length;
  const activeLevel2 = level2Members.filter(member => member.active_member === "1").length;
  const activeLevel3 = level3Members.filter(member => member.active_member === "1").length;
  
  const totalTeamSize = teamMembers.length;
  const totalActiveMembers = teamMembers.filter(member => member.active_member === "1").length;
  
  const fetchTeamDetails = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await getTeamDetails(token);
      
      if (response.status) {
        setTeamMembers(response.data || []);
      } else {
        setError(response.msg || 'Failed to load team details');
        toast({
          title: 'Error',
          description: response.msg || 'Failed to load team details',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch team details:', error);
      setError('An error occurred while fetching team details');
      toast({
        title: 'Error',
        description: 'An error occurred while fetching team details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  return {
    teamMembers,
    level1Members,
    level2Members,
    level3Members,
    activeLevel1,
    activeLevel2,
    activeLevel3,
    totalTeamSize,
    totalActiveMembers,
    isLoading,
    error,
    fetchTeamDetails,
  };
};
