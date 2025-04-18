  // Handler for editing listings
  const handleEditListing = (id) => {
    console.log(`Editing listing with ID: ${id}`);
  };

  // Handler for canceling operations
  const handleCancel = () => {
    console.log('Cancel operation');
  };

  // Handler for saving changes
  const handleSave = () => {
    console.log('Save changes');
  };
  
  // Sample listing data for the form
  const listing = {
    id: '1',
    name: 'Sample Listing',
    category: 'Beauty & Wellness',
    type: 'product',
    status: 'active',
    image: '/placeholder-image.jpg',
    price: 99.99,
    quantity: '10',
    location: 'In-store only',
    description: 'Sample description',
    trend: 'up',
    performance: 'Good'
  };

