import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  CancellationPolicy, 
  PolicyType, 
  SellerPolicyData,
  defaultPlatformPolicy 
} from '../components/policy/PolicyTypes';

interface SellerPolicyContextType extends SellerPolicyData {
  updateCustomPolicy: (policy: CancellationPolicy) => Promise<void>;
  activatePolicy: (type: PolicyType) => Promise<void>;
  createCustomPolicy: (policy: CancellationPolicy) => Promise<void>;
  deleteCustomPolicy: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const SellerPolicyContext = createContext<SellerPolicyContextType | undefined>(undefined);

interface SellerPolicyProviderProps {
  children: ReactNode;
}

export const SellerPolicyProvider: React.FC<SellerPolicyProviderProps> = ({ children }) => {
  // Initialize with platform policy as default
  const [policyData, setPolicyData] = useState<SellerPolicyData>({
    platformPolicy: defaultPlatformPolicy,
    customPolicy: null,
    activePolicy: 'platform',
    hasCustomPolicy: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new custom policy
   */
  const createCustomPolicy = useCallback(async (policy: CancellationPolicy) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // await api.createSellerPolicy(policy);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Save to localStorage for persistence (temporary solution)
      localStorage.setItem('sellerCustomPolicy', JSON.stringify(policy));
      localStorage.setItem('sellerActivePolicy', 'custom');

      setPolicyData(prev => ({
        ...prev,
        customPolicy: policy,
        activePolicy: 'custom',
        hasCustomPolicy: true
      }));

      console.log('Custom policy created successfully:', policy);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create custom policy';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update existing custom policy
   */
  const updateCustomPolicy = useCallback(async (policy: CancellationPolicy) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // await api.updateSellerPolicy(policy);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Save to localStorage
      localStorage.setItem('sellerCustomPolicy', JSON.stringify(policy));

      setPolicyData(prev => ({
        ...prev,
        customPolicy: policy
      }));

      console.log('Custom policy updated successfully:', policy);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update custom policy';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Activate a policy (platform or custom)
   */
  const activatePolicy = useCallback(async (type: PolicyType) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // await api.activateSellerPolicy(type);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Save to localStorage
      localStorage.setItem('sellerActivePolicy', type);

      setPolicyData(prev => ({
        ...prev,
        activePolicy: type
      }));

      console.log('Policy activated:', type);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to activate policy';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete custom policy
   */
  const deleteCustomPolicy = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // await api.deleteSellerPolicy();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Remove from localStorage
      localStorage.removeItem('sellerCustomPolicy');
      localStorage.setItem('sellerActivePolicy', 'platform');

      setPolicyData(prev => ({
        ...prev,
        customPolicy: null,
        activePolicy: 'platform',
        hasCustomPolicy: false
      }));

      console.log('Custom policy deleted');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete custom policy';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize from localStorage on mount
  React.useEffect(() => {
    const loadSavedPolicy = () => {
      try {
        const savedCustomPolicy = localStorage.getItem('sellerCustomPolicy');
        const savedActivePolicy = localStorage.getItem('sellerActivePolicy');

        if (savedCustomPolicy) {
          const customPolicy = JSON.parse(savedCustomPolicy) as CancellationPolicy;
          setPolicyData(prev => ({
            ...prev,
            customPolicy,
            activePolicy: (savedActivePolicy as PolicyType) || 'custom',
            hasCustomPolicy: true
          }));
        }
      } catch (err) {
        console.error('Failed to load saved policy:', err);
      }
    };

    loadSavedPolicy();
  }, []);

  const value: SellerPolicyContextType = {
    ...policyData,
    updateCustomPolicy,
    activatePolicy,
    createCustomPolicy,
    deleteCustomPolicy,
    isLoading,
    error
  };

  return (
    <SellerPolicyContext.Provider value={value}>
      {children}
    </SellerPolicyContext.Provider>
  );
};

/**
 * Hook to use seller policy context
 */
export const useSellerPolicy = (): SellerPolicyContextType => {
  const context = useContext(SellerPolicyContext);
  if (!context) {
    throw new Error('useSellerPolicy must be used within a SellerPolicyProvider');
  }
  return context;
};

export default SellerPolicyContext;

