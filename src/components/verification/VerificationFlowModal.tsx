import React from 'react';
import { Dialog, DialogContent, useTheme } from '@mui/material';
import IndividualVerificationFlow from './IndividualVerificationFlow';
import BusinessVerificationFlow from './BusinessVerificationFlow';

interface VerificationFlowModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  verificationType: 'individual' | 'business' | undefined;
}

const VerificationFlowModal: React.FC<VerificationFlowModalProps> = ({
  open,
  onClose,
  onComplete,
  verificationType
}) => {
  const theme = useTheme();
  
  if (!verificationType) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          maxHeight: '90vh',
          height: 'auto',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#F8F8FA',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#CDCED8',
            borderRadius: '4px',
          },
        }
      }}
    >
      <DialogContent sx={{ 
        p: 0, 
        bgcolor: '#F8F8FA', 
        '&:first-of-type': { 
          pt: 0 
        }
      }}>
        {verificationType === 'individual' ? (
          <IndividualVerificationFlow 
            onCancel={onClose} 
            onComplete={onComplete} 
          />
        ) : (
          <BusinessVerificationFlow 
            onCancel={onClose} 
            onComplete={onComplete} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerificationFlowModal; 