import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { subscribeEmail, checkSubscription } from '../api/supabase';

const DEMO_SUBS_KEY = 'demo_subscriptions';

export function useSubscribe() {
  const { user, isSupabaseConfigured } = useAuth();
  const queryClient = useQueryClient();

  // Check if currently subscribed
  const { data: isSubscribed = false, isLoading } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (isSupabaseConfigured && user) {
        return await checkSubscription(user.id);
      }
      // Demo mode or Guest: check localStorage if they subscribed on this device
      const localSubs = JSON.parse(localStorage.getItem(DEMO_SUBS_KEY) || '[]');
      if (user?.email && localSubs.includes(user.email)) return true;
      // We can't strictly identify guests across sessions without an email input, 
      // but if there's any local sub, we might consider the device "subscribed" for demo purposes.
      return localSubs.length > 0;
    },
    // Only re-fetch if user changes
    staleTime: Infinity,
  });

  const subscribeMutation = useMutation({
    mutationFn: async (email) => {
      if (isSupabaseConfigured) {
        return await subscribeEmail(email, user?.id || null);
      } else {
        // Demo mode fallback
        const localSubs = JSON.parse(localStorage.getItem(DEMO_SUBS_KEY) || '[]');
        if (localSubs.includes(email)) {
          throw new Error('Email is already subscribed');
        }
        localSubs.push(email);
        localStorage.setItem(DEMO_SUBS_KEY, JSON.stringify(localSubs));
        return true;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subscription', user?.id]);
    },
  });

  return {
    isSubscribed,
    isLoading,
    subscribe: subscribeMutation.mutateAsync,
    isSubscribing: subscribeMutation.isPending,
    error: subscribeMutation.error,
  };
}
