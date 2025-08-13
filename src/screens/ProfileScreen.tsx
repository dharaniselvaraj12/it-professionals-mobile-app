import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AuthUtils, { User } from '../utils/auth';
import ApiService from '../services/api';

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    expertise: '',
    location: '',
    linkedin: '',
    github: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AuthUtils.getUserData();
      if (userData) {
        setUser(userData);
        setEditForm({
          name: userData.name || '',
          email: userData.email || '',
          expertise: userData.expertise || '',
          location: userData.location || '',
          linkedin: userData.linkedin || '',
          github: userData.github || '',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    if (!editForm.name || !editForm.email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await ApiService.updateUser({
        id: user?.id,
        ...editForm,
      });

      if (response.data.success) {
        // Update local storage and state
        const updatedUser = { ...user, ...editForm } as User;
        await AuthUtils.updateUserData(updatedUser);
        setUser(updatedUser);
        setShowEditModal(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthUtils.clearAuthData();
              // The AppNavigator will handle the navigation change automatically
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const ProfileItem = ({ 
    icon, 
    label, 
    value, 
    onPress 
  }: { 
    icon: string; 
    label: string; 
    value?: string; 
    onPress?: () => void; 
  }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.profileItemLeft}>
        <Icon name={icon} size={20} color="#0077B5" style={styles.profileItemIcon} />
        <View>
          <Text style={styles.profileItemLabel}>{label}</Text>
          {value && <Text style={styles.profileItemValue}>{value}</Text>}
        </View>
      </View>
      {onPress && <Icon name="chevron-right" size={20} color="#666" />}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="person" size={64} color="#ccc" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Icon name="person" size={48} color="#0077B5" />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Icon name="camera-alt" size={16} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.expertise && (
            <Text style={styles.userExpertise}>{user.expertise}</Text>
          )}
          {user?.location && (
            <Text style={styles.userLocation}>
              <Icon name="location-on" size={14} color="#666" /> {user.location}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <Icon name="edit" size={16} color="white" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <ProfileItem
          icon="person"
          label="Full Name"
          value={user?.name}
        />
        
        <ProfileItem
          icon="email"
          label="Email Address"
          value={user?.email}
        />
        
        <ProfileItem
          icon="work"
          label="Area of Expertise"
          value={user?.expertise || 'Not specified'}
        />
        
        <ProfileItem
          icon="location-on"
          label="Location"
          value={user?.location || 'Not specified'}
        />
        
        <ProfileItem
          icon="date-range"
          label="Member Since"
          value={formatDate(user?.created_at)}
        />
      </View>

      {/* Social Links */}
      {(user?.linkedin || user?.github) && (
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Social Links</Text>
          
          {user?.linkedin && (
            <ProfileItem
              icon="link"
              label="LinkedIn"
              value={user.linkedin}
              onPress={() => {
                // You could open the URL here
                Alert.alert('LinkedIn', user.linkedin);
              }}
            />
          )}
          
          {user?.github && (
            <ProfileItem
              icon="code"
              label="GitHub"
              value={user.github}
              onPress={() => {
                // You could open the URL here
                Alert.alert('GitHub', user.github);
              }}
            />
          )}
        </View>
      )}

      {/* Account Actions */}
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <ProfileItem
          icon="settings"
          label="Settings"
          onPress={() => Alert.alert('Settings', 'Settings screen coming soon!')}
        />
        
        <ProfileItem
          icon="help"
          label="Help & Support"
          onPress={() => Alert.alert('Help', 'Help screen coming soon!')}
        />
        
        <ProfileItem
          icon="info"
          label="About"
          onPress={() => Alert.alert('About', 'IT Professionals Network v1.0')}
        />
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#f44336" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowEditModal(false)}
              style={styles.modalCloseButton}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity
              onPress={handleUpdateProfile}
              disabled={isUpdating}
              style={[
                styles.modalSaveButton,
                isUpdating && styles.disabledButton,
              ]}
            >
              <Text style={styles.modalSaveButtonText}>
                {isUpdating ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={editForm.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={editForm.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Area of Expertise</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Software Engineer, Data Scientist"
                value={editForm.expertise}
                onChangeText={(value) => handleInputChange('expertise', value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. San Francisco, CA"
                value={editForm.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>LinkedIn Profile</Text>
              <TextInput
                style={styles.input}
                placeholder="LinkedIn profile URL"
                value={editForm.linkedin}
                onChangeText={(value) => handleInputChange('linkedin', value)}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>GitHub Profile</Text>
              <TextInput
                style={styles.input}
                placeholder="GitHub profile URL"
                value={editForm.github}
                onChangeText={(value) => handleInputChange('github', value)}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2ef',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f2ef',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0077B5',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  userExpertise: {
    fontSize: 16,
    color: '#0077B5',
    fontWeight: '500',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  profileSection: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemIcon: {
    marginRight: 16,
  },
  profileItemLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  profileItemValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalSaveButton: {
    backgroundColor: '#0077B5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  modalSaveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
  },
});

export default ProfileScreen;
