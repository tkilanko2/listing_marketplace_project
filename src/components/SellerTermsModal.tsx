import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton
} from '@mui/material';
import { 
  X, 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Calendar,
  MessageCircle
} from 'lucide-react';

interface SellerTermsModalProps {
  open: boolean;
  onClose: () => void;
  serviceName?: string;
  providerName?: string;
  serviceType?: 'product' | 'service';
}

const SellerTermsModal: React.FC<SellerTermsModalProps> = ({
  open,
  onClose,
  serviceName = 'Service',
  providerName = 'Service Provider',
  serviceType = 'service'
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#F8F8FA', 
        borderBottom: '1px solid #CDCED8',
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5, 
        color: '#1B1C20',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        position: 'relative'
      }}>
        <FileText className="w-6 h-6 text-[#3D1560]" />
        Service Terms & Agreement
        <IconButton
          onClick={onClose}
          sx={{ 
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#70727F',
            '&:hover': { backgroundColor: '#E8E9ED' }
          }}
        >
          <X className="w-5 h-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Service Overview */}
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

          {/* Platform Policies */}
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
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: '1px solid #CDCED8',
        bgcolor: '#F8F8FA',
        justifyContent: 'flex-end'
      }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ 
            bgcolor: '#3D1560', 
            color: 'white',
            px: 4,
            py: 1.5,
            fontWeight: 'medium',
            '&:hover': { bgcolor: '#6D26AB' }
          }}
        >
          I Understand
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SellerTermsModal; 