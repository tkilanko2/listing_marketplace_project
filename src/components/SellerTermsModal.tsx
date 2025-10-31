import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogActions,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
  Link,
  Fade,
  Collapse
} from '@mui/material';
import { 
  X, 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Calendar,
  MessageCircle,
  ChevronDown,
  Settings,
  Edit3
} from 'lucide-react';
import { CancellationPolicy } from './policy/PolicyTypes';
import { PolicySummaryCard } from './policy/PolicySummaryCard';
import { PolicyConfigEditor } from './policy/PolicyConfigEditor';
import { useSellerPolicy } from '../contexts/SellerPolicyContext';

interface SellerTermsModalProps {
  open: boolean;
  onClose: () => void;
  serviceName?: string;
  providerName?: string;
  serviceType?: 'product' | 'service';
  onNavigate?: (page: string) => void;
  allowConfiguration?: boolean;
  onPolicyConfigured?: () => void;
}

// Memoized Service Overview Component
const ServiceOverview = memo<{
  serviceName: string;
  providerName: string;
  serviceType: 'product' | 'service';
}>(({ serviceName, providerName, serviceType }) => (
  <Box sx={{ p: 3, bgcolor: '#EDD9FF', borderBottom: '1px solid #CDCED8' }}>
    <Typography variant="h6" sx={{ color: '#3D1560', mb: 1, fontWeight: 'bold' }}>
      {serviceName}
    </Typography>
    <Typography variant="body2" sx={{ color: '#3D1560' }}>
      Provided by: {providerName}
    </Typography>
    <Chip 
      label={serviceType === 'service' ? 'Service Booking' : 'Product Purchase'}
      size="small"
      sx={{ 
        mt: 1,
        bgcolor: '#3D1560', 
        color: 'white',
        fontWeight: 'medium'
      }}
    />
  </Box>
));

ServiceOverview.displayName = 'ServiceOverview';

// Memoized Terms Sections Component
const TermsSections = memo(() => (
  <>
    {/* Service Terms */}
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Shield className="w-5 h-5 text-[#3D1560]" />
        <Typography variant="h6" sx={{ color: '#1B1C20', fontWeight: 'bold' }}>
          Service Terms & Conditions
        </Typography>
      </Box>
      
      <Typography variant="body2" sx={{ color: '#383A47', mb: 2 }}>
        By booking this service, you agree to the following terms and conditions:
      </Typography>

      <List dense sx={{ bgcolor: '#F8F8FA', borderRadius: 1, p: 1 }}>
        <ListItem>
          <ListItemText 
            primary="Service Delivery"
            secondary="Service will be delivered as described in the listing details and confirmed appointment time."
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#1B1C20' }}
            secondaryTypographyProps={{ fontSize: '0.8rem', color: '#70727F' }}
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Quality Standards"
            secondary="Provider commits to delivering service according to professional standards and listing specifications."
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#1B1C20' }}
            secondaryTypographyProps={{ fontSize: '0.8rem', color: '#70727F' }}
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Communication"
            secondary="Provider will maintain professional communication and respond to inquiries within 24 hours."
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#1B1C20' }}
            secondaryTypographyProps={{ fontSize: '0.8rem', color: '#70727F' }}
          />
        </ListItem>
      </List>
    </Box>

    <Divider />

    {/* Cancellation & Rescheduling Policy */}
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Calendar className="w-5 h-5 text-[#3D1560]" />
        <Typography variant="h6" sx={{ color: '#1B1C20', fontWeight: 'bold' }}>
          Cancellation & Rescheduling Policy
        </Typography>
      </Box>

      <Box sx={{ bgcolor: '#F8F8FA', borderRadius: 1, p: 2, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ color: '#1B1C20', fontWeight: 'bold', mb: 1 }}>
          Customer Cancellation Rights:
        </Typography>
        <List dense>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <CheckCircle className="w-4 h-4 text-[#1B1C20] mr-2" />
            <ListItemText 
              primary="Free cancellation up to 24 hours before appointment"
              primaryTypographyProps={{ fontSize: '0.85rem', color: '#383A47' }}
            />
          </ListItem>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <CheckCircle className="w-4 h-4 text-[#1B1C20] mr-2" />
            <ListItemText 
              primary="50% refund for cancellations 2-24 hours before"
              primaryTypographyProps={{ fontSize: '0.85rem', color: '#383A47' }}
            />
          </ListItem>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <AlertTriangle className="w-4 h-4 text-[#DF678C] mr-2" />
            <ListItemText 
              primary="No refund for cancellations less than 2 hours before"
              primaryTypographyProps={{ fontSize: '0.85rem', color: '#383A47' }}
            />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ bgcolor: '#FFE5ED', borderRadius: 1, p: 2, border: '1px solid #DF678C' }}>
        <Typography variant="subtitle2" sx={{ color: '#DF678C', fontWeight: 'bold', mb: 1 }}>
          Provider Cancellation Policy:
        </Typography>
        <Typography variant="body2" sx={{ color: '#DF678C', fontSize: '0.85rem' }}>
          If the provider cancels, you will receive a full refund plus a 10% credit for future bookings. 
          Provider cancellations within 24 hours may result in penalty fees applied to the provider.
        </Typography>
      </Box>
    </Box>

    <Divider />

    {/* Payment Terms */}
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <DollarSign className="w-5 h-5 text-[#3D1560]" />
        <Typography variant="h6" sx={{ color: '#1B1C20', fontWeight: 'bold' }}>
          Payment Terms
        </Typography>
      </Box>

      <List dense sx={{ bgcolor: '#F8F8FA', borderRadius: 1, p: 1 }}>
        <ListItem>
          <ListItemText 
            primary="Payment Processing"
            secondary="Payments are processed securely through our platform. Funds are released to provider after successful service completion."
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#1B1C20' }}
            secondaryTypographyProps={{ fontSize: '0.8rem', color: '#70727F' }}
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Pricing"
            secondary="All prices include applicable taxes and platform fees. Final amount is shown at checkout."
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#1B1C20' }}
            secondaryTypographyProps={{ fontSize: '0.8rem', color: '#70727F' }}
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Disputes"
            secondary="Payment disputes can be filed within 7 days of service completion through our resolution center."
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#1B1C20' }}
            secondaryTypographyProps={{ fontSize: '0.8rem', color: '#70727F' }}
          />
        </ListItem>
      </List>
    </Box>

    <Divider />

    {/* Seller Responsibilities */}
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <MessageCircle className="w-5 h-5 text-[#3D1560]" />
        <Typography variant="h6" sx={{ color: '#1B1C20', fontWeight: 'bold' }}>
          Provider Responsibilities
        </Typography>
      </Box>

      <Box sx={{ bgcolor: '#EDD9FF', borderRadius: 1, p: 2, border: '1px solid #3D1560' }}>
        <Typography variant="body2" sx={{ color: '#3D1560', fontSize: '0.85rem', lineHeight: 1.6 }}>
          <strong>The service provider agrees to:</strong>
          <br />• Provide services as described in the listing
          <br />• Maintain professional standards and conduct
          <br />• Arrive punctually for scheduled appointments
          <br />• Communicate clearly about service details and requirements
          <br />• Respect customer privacy and property
          <br />• Complete work according to agreed specifications
          <br />• Provide appropriate insurance and licensing where required
        </Typography>
      </Box>
    </Box>

    <Divider />
  </>
));

TermsSections.displayName = 'TermsSections';

// Memoized Platform Policies Component
const PlatformPolicies = memo<{ onNavigate?: (page: string) => void }>(({ onNavigate }) => (
  <Box sx={{ p: 3, bgcolor: '#F8F8FA' }}>
    <Typography variant="h6" sx={{ color: '#1B1C20', mb: 2, fontWeight: 'bold' }}>
      Platform Policies
    </Typography>
    
    <Typography variant="body2" sx={{ color: '#383A47', mb: 2, fontSize: '0.85rem', lineHeight: 1.6 }}>
      This service agreement is governed by ExpatTray's Terms of Service and Privacy Policy. 
      By proceeding with this booking, both parties acknowledge they have read and agree to these terms.
    </Typography>

    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Chip 
        label="Terms of Service" 
        size="small" 
        onClick={() => onNavigate?.('termsOfService')}
        sx={{ 
          bgcolor: '#3D1560', 
          color: 'white',
          '&:hover': { bgcolor: '#6D26AB' },
          cursor: 'pointer'
        }} 
      />
      <Chip 
        label="Privacy Policy" 
        size="small" 
        onClick={() => onNavigate?.('privacyPolicy')}
        sx={{ 
          bgcolor: '#3D1560', 
          color: 'white',
          '&:hover': { bgcolor: '#6D26AB' },
          cursor: 'pointer'
        }} 
      />
      <Chip 
        label="Dispute Resolution" 
        size="small" 
        sx={{ 
          bgcolor: '#3D1560', 
          color: 'white',
          '&:hover': { bgcolor: '#6D26AB' },
          cursor: 'pointer'
        }} 
      />
    </Box>
  </Box>
));

PlatformPolicies.displayName = 'PlatformPolicies';

const SellerTermsModal: React.FC<SellerTermsModalProps> = ({
  open,
  onClose,
  serviceName = 'Service',
  providerName = 'Service Provider',
  serviceType = 'service',
  onNavigate,
  allowConfiguration = true,
  onPolicyConfigured
}) => {
  const {
    platformPolicy,
    customPolicy,
    activePolicy,
    hasCustomPolicy,
    createCustomPolicy,
    updateCustomPolicy,
    isLoading,
    error
  } = useSellerPolicy();

  const [viewMode, setViewMode] = useState<'view' | 'configure'>('view');
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [editablePolicy, setEditablePolicy] = useState<CancellationPolicy>(
    customPolicy || platformPolicy
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Memoize current policy to prevent recalculation
  const currentPolicy = useMemo(
    () => (activePolicy === 'custom' && customPolicy ? customPolicy : platformPolicy),
    [activePolicy, customPolicy, platformPolicy]
  );

  // Reset modal state when opened
  useEffect(() => {
    if (open) {
      setViewMode('view');
      setIsEditingPolicy(false);
      setSaveSuccess(false);
      setSaveError(null);
      setEditablePolicy(customPolicy || platformPolicy);
    }
  }, [open, customPolicy, platformPolicy]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      // ESC to close (only if not loading)
      if (e.key === 'Escape' && !isLoading) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, isLoading]);

  // Memoized callbacks to prevent recreation on every render
  const handleConfigurePolicy = useCallback(() => {
    setViewMode('configure');
    setIsEditingPolicy(true);
    setEditablePolicy(customPolicy || platformPolicy);
    setSaveError(null);
  }, [customPolicy, platformPolicy]);

  const handleBackToView = useCallback(() => {
    if (isLoading) return; // Prevent navigation during save
    setViewMode('view');
    setIsEditingPolicy(false);
    setEditablePolicy(customPolicy || platformPolicy);
    setSaveError(null);
  }, [customPolicy, platformPolicy, isLoading]);

  const handleSavePolicy = useCallback(async () => {
    setSaveError(null);
    
    try {
      if (hasCustomPolicy) {
        await updateCustomPolicy(editablePolicy);
      } else {
        await createCustomPolicy(editablePolicy);
      }
      
      setSaveSuccess(true);
      setIsEditingPolicy(false);
      
      // Call callback if provided
      onPolicyConfigured?.();

      // Show success for 2 seconds then return to view mode
      setTimeout(() => {
        setViewMode('view');
        setSaveSuccess(false);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save policy. Please try again.';
      setSaveError(errorMessage);
      console.error('Failed to save policy:', err);
    }
  }, [
    hasCustomPolicy,
    editablePolicy,
    updateCustomPolicy,
    createCustomPolicy,
    onPolicyConfigured
  ]);

  const handleCancelEdit = useCallback(() => {
    if (isLoading) return; // Prevent cancel during save
    setIsEditingPolicy(false);
    setEditablePolicy(customPolicy || platformPolicy);
    setSaveError(null);
  }, [customPolicy, platformPolicy, isLoading]);

  const handleClose = useCallback(() => {
    if (isLoading) return; // Prevent close during save
    setViewMode('view');
    setIsEditingPolicy(false);
    setSaveSuccess(false);
    setSaveError(null);
    onClose();
  }, [isLoading, onClose]);

  const handleNavigateToSettings = useCallback(() => {
    handleClose();
    onNavigate?.('sellerPolicy');
  }, [handleClose, onNavigate]);

  // Memoize button text to prevent recalculation
  const configureButtonText = useMemo(
    () => (hasCustomPolicy ? 'Edit Policy' : 'Configure Custom Policy'),
    [hasCustomPolicy]
  );

  const saveButtonText = useMemo(
    () => (isLoading ? 'Saving...' : 'Save & Apply'),
    [isLoading]
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
      aria-labelledby="seller-terms-modal-title"
      aria-describedby="seller-terms-modal-description"
    >
      <DialogTitle 
        id="seller-terms-modal-title"
        sx={{ 
          bgcolor: viewMode === 'configure' ? '#EDD9FF' : '#F8F8FA', 
          borderBottom: '1px solid #CDCED8',
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          color: '#1B1C20',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          position: 'relative',
          transition: 'background-color 0.3s ease'
        }}
      >
        {viewMode === 'configure' ? (
          <>
            <Settings className="w-6 h-6 text-[#3D1560]" />
            Configure Seller Policy
          </>
        ) : (
          <>
            <FileText className="w-6 h-6 text-[#3D1560]" />
            Service Terms & Agreement
          </>
        )}
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          aria-label="Close modal"
          sx={{ 
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#70727F',
            '&:hover': { backgroundColor: '#E8E9ED' },
            '&:disabled': { opacity: 0.5 }
          }}
        >
          <X className="w-5 h-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* VIEW MODE */}
          {viewMode === 'view' && (
            <Fade in={viewMode === 'view'} timeout={300}>
              <Box>
                <ServiceOverview 
                  serviceName={serviceName}
                  providerName={providerName}
                  serviceType={serviceType}
                />

                {/* Current Policy Summary */}
                <Box sx={{ p: 3, bgcolor: '#F8F8FA' }}>
                  <PolicySummaryCard 
                    policy={currentPolicy}
                    policyType={activePolicy}
                    isActive={true}
                    compact={true}
                  />
                </Box>

                <TermsSections />
                <PlatformPolicies onNavigate={onNavigate} />
              </Box>
            </Fade>
          )}

          {/* CONFIGURE MODE */}
          {viewMode === 'configure' && (
            <Fade in={viewMode === 'configure'} timeout={300}>
              <Box>
                {/* Success Message */}
                <Collapse in={saveSuccess}>
                  <Alert 
                    severity="success" 
                    icon={<CheckCircle className="w-5 h-5" />}
                    sx={{ m: 3, mb: 0 }}
                  >
                    Policy saved successfully! Your custom policy is now active.
                  </Alert>
                </Collapse>

                {/* Error Message */}
                <Collapse in={!!saveError}>
                  <Alert 
                    severity="error" 
                    icon={<AlertTriangle className="w-5 h-5" />}
                    sx={{ m: 3, mb: saveSuccess ? 2 : 0 }}
                    onClose={() => setSaveError(null)}
                  >
                    {saveError || 'An error occurred while saving your policy.'}
                  </Alert>
                </Collapse>

                {/* Context Error from SellerPolicyContext */}
                <Collapse in={!!error}>
                  <Alert 
                    severity="error" 
                    icon={<AlertTriangle className="w-5 h-5" />}
                    sx={{ m: 3, mb: 0 }}
                  >
                    {error}
                  </Alert>
                </Collapse>

                {/* Collapsible Full Terms */}
                <Accordion sx={{ borderRadius: 0, boxShadow: 'none' }}>
                  <AccordionSummary 
                    expandIcon={<ChevronDown className="w-5 h-5 text-[#3D1560]" />}
                    sx={{ 
                      bgcolor: '#F8F8FA',
                      borderBottom: '1px solid #E8E9ED',
                      '&:hover': { bgcolor: '#E8E9ED' },
                      transition: 'background-color 0.2s ease'
                    }}
                    aria-label="View full service terms"
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileText className="w-5 h-5 text-[#3D1560]" />
                      <Typography sx={{ fontWeight: 'medium', color: '#1B1C20' }}>
                        View Full Service Terms
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ bgcolor: '#FFFFFF', p: 3 }}>
                    <Typography variant="body2" sx={{ color: '#383A47', fontSize: '0.85rem', lineHeight: 1.6 }}>
                      <strong>Service Delivery:</strong> Services delivered as described, with professional standards.
                      <br /><br />
                      <strong>Communication:</strong> Provider responds within 24 hours and maintains professionalism.
                      <br /><br />
                      <strong>Payment:</strong> Secure processing through platform, funds released after completion.
                      <br /><br />
                      <strong>Disputes:</strong> Filed within 7 days through resolution center.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                {/* Policy Configuration Section */}
                <Box sx={{ p: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#1B1C20', fontWeight: 'bold', mb: 1 }}>
                      Customize Your Cancellation Policy
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#70727F', mb: 2 }}>
                      {hasCustomPolicy 
                        ? 'Update your custom cancellation policy to suit your business needs.'
                        : 'Create a custom policy that works better for your services.'}
                    </Typography>

                    {/* Info Alert */}
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                        💡 <strong>Quick Setup:</strong> Configure essential cancellation terms here. 
                        Need more control?{' '}
                        <Link
                          component="button"
                          onClick={handleNavigateToSettings}
                          disabled={isLoading}
                          sx={{ 
                            color: '#3D1560', 
                            fontWeight: 'medium',
                            textDecoration: 'underline',
                            '&:hover': { color: '#6D26AB' },
                            '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }
                          }}
                        >
                          Visit Seller Policy Settings
                        </Link>
                        {' '}for full configuration options.
                      </Typography>
                    </Alert>
                  </Box>

                  {/* Policy Editor */}
                  <PolicyConfigEditor
                    mode="compact"
                    policy={editablePolicy}
                    onPolicyChange={setEditablePolicy}
                    onSave={handleSavePolicy}
                    onCancel={handleCancelEdit}
                    isEditing={isEditingPolicy}
                    policyType={hasCustomPolicy ? 'custom' : 'platform'}
                    showActions={false}
                    disabled={isLoading}
                  />
                </Box>
              </Box>
            </Fade>
          )}
        </Box>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 3, 
          borderTop: '1px solid #CDCED8',
          bgcolor: '#F8F8FA',
          justifyContent: viewMode === 'configure' ? 'space-between' : 'flex-end',
          gap: 2,
          flexWrap: 'wrap'
        }}
      >
        {/* VIEW MODE Actions */}
        {viewMode === 'view' && (
          <>
            {allowConfiguration && (
              <button
                onClick={handleConfigurePolicy}
                className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-[#3D1560] text-[#3D1560] font-medium rounded-lg hover:bg-[#EDD9FF] hover:border-[#6D26AB] hover:text-[#6D26AB] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:ring-offset-2"
                aria-label={configureButtonText}
              >
                <Edit3 className="w-4 h-4" />
                {configureButtonText}
              </button>
            )}
            <button
              onClick={handleClose}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-[#3D1560] text-white font-medium rounded-lg hover:bg-[#6D26AB] active:bg-[#9B53D9] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:ring-offset-2 shadow-sm"
              aria-label="I understand and agree to terms"
            >
              I Understand
            </button>
          </>
        )}

        {/* CONFIGURE MODE Actions */}
        {viewMode === 'configure' && (
          <>
            <button
              onClick={handleBackToView}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#CDCED8] text-[#70727F] font-medium rounded-lg hover:border-[#70727F] hover:bg-[#E8E9ED] hover:text-[#383A47] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#70727F] focus:ring-offset-2"
              aria-label="Back to terms view"
            >
              Back to Terms
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#CDCED8] text-[#70727F] font-medium rounded-lg hover:border-[#70727F] hover:bg-[#E8E9ED] hover:text-[#383A47] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#70727F] focus:ring-offset-2"
                aria-label="Cancel policy changes"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePolicy}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#3D1560] text-white font-medium rounded-lg hover:bg-[#6D26AB] active:bg-[#9B53D9] disabled:bg-[#EDD9FF] disabled:text-[#CDCED8] disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:ring-offset-2 shadow-sm min-w-[140px]"
                aria-label={saveButtonText}
              >
                {isLoading && (
                  <CircularProgress size={16} sx={{ color: 'inherit' }} />
                )}
                {saveButtonText}
              </button>
            </div>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default memo(SellerTermsModal);
