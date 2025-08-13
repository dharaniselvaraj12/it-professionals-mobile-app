import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

const SubscriptionScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      duration: 'Forever',
      features: [
        'Basic profile creation',
        'Up to 50 connections',
        'Basic job search',
        '10 messages per month',
        'Join public events',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 9.99,
      duration: 'per month',
      popular: true,
      features: [
        'Everything in Free',
        'Unlimited connections',
        'Advanced job search filters',
        'Unlimited messaging',
        'Profile analytics',
        'Priority job applications',
        '5 InMail credits per month',
        'Create private events',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      price: 29.99,
      duration: 'per month',
      features: [
        'Everything in Professional',
        'Post jobs (5 per month)',
        'Company page creation',
        'Applicant tracking',
        'Host unlimited events',
        'Advanced analytics',
        'Recruitment tools',
        'Team collaboration',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
      duration: 'per month',
      features: [
        'Everything in Business',
        'Unlimited job postings',
        'Custom branding',
        'API access',
        'Priority support',
        'Advanced recruitment suite',
        'White-label options',
        'Dedicated account manager',
      ],
    },
  ];

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (plan.id === 'free') {
      Alert.alert('Free Plan', 'You are already on the free plan!');
      return;
    }

    Alert.alert(
      'Subscription',
      `Subscribe to ${plan.name} plan for $${plan.price}/${plan.duration}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: () => initiatePayment(plan),
        },
      ]
    );
  };

  const initiatePayment = async (plan: SubscriptionPlan) => {
    try {
      // Here you would integrate with Stripe or other payment processor
      console.log('Initiating payment for:', plan.name);
      
      // For now, show success message
      Alert.alert(
        'Success!',
        `Welcome to ${plan.name}! Your subscription is now active.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  const renderPlanCard = (plan: SubscriptionPlan) => (
    <View
      key={plan.id}
      style={[
        styles.planCard,
        selectedPlan === plan.id && styles.selectedPlan,
        plan.popular && styles.popularPlan,
      ]}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}
      
      <TouchableOpacity
        onPress={() => handlePlanSelection(plan.id)}
        style={styles.planContent}
      >
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {plan.price === 0 ? 'Free' : `$${plan.price}`}
          </Text>
          {plan.price > 0 && (
            <Text style={styles.duration}>/{plan.duration}</Text>
          )}
        </View>
        
        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons name="checkmark" size={16} color="#0077B5" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            plan.id === 'free' && styles.freeButton,
            plan.popular && styles.popularButton,
          ]}
          onPress={() => handleSubscribe(plan)}
        >
          <Text
            style={[
              styles.subscribeButtonText,
              plan.id === 'free' && styles.freeButtonText,
            ]}
          >
            {plan.id === 'free' ? 'Current Plan' : 'Subscribe Now'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Unlock premium features and grow your IT career
        </Text>
      </View>
      
      <View style={styles.plansContainer}>
        {subscriptionPlans.map(renderPlanCard)}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All plans include 7-day free trial. Cancel anytime.
        </Text>
        <Text style={styles.footerSubtext}>
          Secure payment processing by Stripe
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
    alignItems: 'center',
    backgroundColor: '#fff',
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
  plansContainer: {
    padding: 20,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlan: {
    borderColor: '#0077B5',
  },
  popularPlan: {
    borderColor: '#ff6b35',
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: -10,
    marginBottom: 10,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planContent: {
    padding: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0077B5',
  },
  duration: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#0077B5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  freeButton: {
    backgroundColor: '#e9ecef',
  },
  popularButton: {
    backgroundColor: '#ff6b35',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  freeButtonText: {
    color: '#666',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default SubscriptionScreen;
