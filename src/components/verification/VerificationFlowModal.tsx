import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
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
          height: 'auto'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
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