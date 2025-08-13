import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PostJobScreen: React.FC = () => {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salaryRange: '',
    jobType: 'Full-time',
    isFeatured: false,
    isSponsored: false,
  });

  const [selectedPackage, setSelectedPackage] = useState('basic');

  const jobPackages = [
    {
      id: 'basic',
      name: 'Basic Job Post',
      price: 299,
      duration: '30 days',
      features: [
        'Standard job listing',
        '30-day visibility',
        'Basic applicant tracking',
        'Email notifications',
      ],
    },
    {
      id: 'featured',
      name: 'Featured Job Post',
      price: 499,
      duration: '30 days',
      popular: true,
      features: [
        'Everything in Basic',
        'Featured placement',
        'Highlighted in search',
        'Priority in job feed',
        'Enhanced visibility',
        'Social media promotion',
      ],
    },
    {
      id: 'sponsored',
      name: 'Sponsored Job Post',
      price: 799,
      duration: '30 days',
      features: [
        'Everything in Featured',
        'Top search placement',
        'Homepage banner',
        'Email newsletter inclusion',
        'LinkedIn promotion',
        'Dedicated account support',
      ],
    },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setJobData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePackageSelection = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const calculateTotal = () => {
    const selectedPkg = jobPackages.find(pkg => pkg.id === selectedPackage);
    let total = selectedPkg?.price || 0;
    
    if (jobData.isFeatured && selectedPackage === 'basic') {
      total += 200; // Featured upgrade
    }
    if (jobData.isSponsored && selectedPackage !== 'sponsored') {
      total += 300; // Sponsored upgrade
    }
    
    return total;
  };

  const handlePostJob = async () => {
    if (!jobData.title || !jobData.company || !jobData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const total = calculateTotal();
    
    Alert.alert(
      'Confirm Job Posting',
      `Post this job for $${total}?\n\nYour job will be live within 24 hours after payment confirmation.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay & Post',
          onPress: () => initiatePayment(total),
        },
      ]
    );
  };

  const initiatePayment = async (amount: number) => {
    try {
      // Here you would integrate with Stripe or other payment processor
      console.log('Processing payment for:', amount);
      
      // For now, show success message
      Alert.alert(
        'Payment Successful!',
        `Your job posting has been submitted and will be reviewed within 24 hours.\n\nReceipt: $${amount}`,
        [{ text: 'OK' }]
      );
      
      // Reset form
      setJobData({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        salaryRange: '',
        jobType: 'Full-time',
        isFeatured: false,
        isSponsored: false,
      });
    } catch (error) {
      Alert.alert('Payment Error', 'Payment failed. Please try again.');
    }
  };

  const renderPackageCard = (pkg: any) => (
    <TouchableOpacity
      key={pkg.id}
      style={[
        styles.packageCard,
        selectedPackage === pkg.id && styles.selectedPackage,
        pkg.popular && styles.popularPackage,
      ]}
      onPress={() => handlePackageSelection(pkg.id)}
    >
      {pkg.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}
      
      <Text style={styles.packageName}>{pkg.name}</Text>
      <Text style={styles.packagePrice}>${pkg.price}</Text>
      <Text style={styles.packageDuration}>{pkg.duration}</Text>
      
      <View style={styles.featuresContainer}>
        {pkg.features.map((feature: string, index: number) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark" size={16} color="#0077B5" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Post a Job</Text>
        <Text style={styles.subtitle}>
          Find the best IT professionals for your team
        </Text>
      </View>

      {/* Job Details Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Details</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Job Title *</Text>
          <TextInput
            style={styles.input}
            value={jobData.title}
            onChangeText={(text) => handleInputChange('title', text)}
            placeholder="e.g. Senior React Developer"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Company Name *</Text>
          <TextInput
            style={styles.input}
            value={jobData.company}
            onChangeText={(text) => handleInputChange('company', text)}
            placeholder="Your company name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={jobData.location}
            onChangeText={(text) => handleInputChange('location', text)}
            placeholder="Remote, New York, etc."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Salary Range</Text>
          <TextInput
            style={styles.input}
            value={jobData.salaryRange}
            onChangeText={(text) => handleInputChange('salaryRange', text)}
            placeholder="$80,000 - $120,000"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Job Description *</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={jobData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            placeholder="Describe the role, responsibilities, and requirements..."
            multiline
            numberOfLines={5}
          />
        </View>
      </View>

      {/* Package Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Package</Text>
        <View style={styles.packagesContainer}>
          {jobPackages.map(renderPackageCard)}
        </View>
      </View>

      {/* Add-ons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add-ons</Text>
        
        {selectedPackage === 'basic' && (
          <>
            <View style={styles.addonRow}>
              <View style={styles.addonInfo}>
                <Text style={styles.addonTitle}>Featured Listing (+$200)</Text>
                <Text style={styles.addonDescription}>
                  Highlight your job in search results
                </Text>
              </View>
              <Switch
                value={jobData.isFeatured}
                onValueChange={(value) => handleInputChange('isFeatured', value)}
                trackColor={{ false: '#767577', true: '#0077B5' }}
              />
            </View>
          </>
        )}

        {selectedPackage !== 'sponsored' && (
          <View style={styles.addonRow}>
            <View style={styles.addonInfo}>
              <Text style={styles.addonTitle}>Sponsored Placement (+$300)</Text>
              <Text style={styles.addonDescription}>
                Premium placement across the platform
              </Text>
            </View>
            <Switch
              value={jobData.isSponsored}
              onValueChange={(value) => handleInputChange('isSponsored', value)}
              trackColor={{ false: '#767577', true: '#0077B5' }}
            />
          </View>
        )}
      </View>

      {/* Total and Post Button */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${calculateTotal()}</Text>
        </View>
        
        <TouchableOpacity style={styles.postButton} onPress={handlePostJob}>
          <Text style={styles.postButtonText}>
            Pay ${calculateTotal()} & Post Job
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.footerNote}>
          Secure payment • 24-hour review • 30-day guarantee
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0077B5',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  packagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  packageCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedPackage: {
    borderColor: '#0077B5',
    backgroundColor: '#e3f2fd',
  },
  popularPackage: {
    borderColor: '#ff6b35',
  },
  popularBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  packageName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077B5',
  },
  packageDuration: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  featuresContainer: {
    alignItems: 'flex-start',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 11,
    color: '#333',
    marginLeft: 4,
    flex: 1,
  },
  addonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addonInfo: {
    flex: 1,
  },
  addonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addonDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    padding: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: '#0077B5',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077B5',
  },
  postButton: {
    backgroundColor: '#0077B5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default PostJobScreen;
