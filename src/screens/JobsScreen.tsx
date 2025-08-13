import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../services/api';

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location?: string;
  salary_range?: string;
  job_type?: string;
  posted_by: string;
  created_at: string;
}

const JobsScreen = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [creatingJob, setCreatingJob] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary_range: '',
    job_type: 'Full-time',
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await ApiService.getJobs();
      if (response.data.success) {
        setJobs(response.data.jobs || []);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      Alert.alert('Error', 'Failed to load jobs');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadJobs();
  };

  const handleInputChange = (field: string, value: string) => {
    setJobForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateJobForm = () => {
    if (!jobForm.title || !jobForm.description || !jobForm.company) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleCreateJob = async () => {
    if (!validateJobForm()) return;

    setCreatingJob(true);
    try {
      const response = await ApiService.createJob(jobForm);
      
      if (response.data.success) {
        setJobForm({
          title: '',
          description: '',
          company: '',
          location: '',
          salary_range: '',
          job_type: 'Full-time',
        });
        setShowCreateJob(false);
        onRefresh(); // Reload jobs
        Alert.alert('Success', 'Job posted successfully!');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      Alert.alert('Error', 'Failed to create job');
    } finally {
      setCreatingJob(false);
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    try {
      const response = await ApiService.applyToJob(jobId);
      
      if (response.data.success) {
        Alert.alert('Success', 'Application submitted successfully!');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to apply');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      Alert.alert('Error', 'Failed to apply to job');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const renderJob = ({ item }: { item: Job }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.companyLogo}>
          <Icon name="business" size={24} color="#0077B5" />
        </View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.company}>{item.company}</Text>
          {item.location && (
            <Text style={styles.location}>
              <Icon name="location-on" size={12} color="#666" /> {item.location}
            </Text>
          )}
          <View style={styles.jobMeta}>
            {item.job_type && (
              <View style={styles.jobType}>
                <Text style={styles.jobTypeText}>{item.job_type}</Text>
              </View>
            )}
            {item.salary_range && (
              <Text style={styles.salary}>{item.salary_range}</Text>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.jobDescription} numberOfLines={3}>
        {item.description}
      </Text>

      <View style={styles.jobFooter}>
        <Text style={styles.postedDate}>Posted {formatDate(item.created_at)}</Text>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleApplyToJob(item.id)}
        >
          <Text style={styles.applyButtonText}>Easy Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Post Job Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.postJobButton}
          onPress={() => setShowCreateJob(true)}
        >
          <Icon name="add" size={20} color="white" />
          <Text style={styles.postJobButtonText}>Post a Job</Text>
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="work-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No jobs available</Text>
          </View>
        }
      />

      {/* Create Job Modal */}
      <Modal
        visible={showCreateJob}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowCreateJob(false)}
              style={styles.modalCloseButton}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Post a Job</Text>
            <TouchableOpacity
              onPress={handleCreateJob}
              disabled={creatingJob}
              style={[
                styles.modalPostButton,
                creatingJob && styles.disabledButton,
              ]}
            >
              <Text style={styles.modalPostButtonText}>
                {creatingJob ? 'Posting...' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Job Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Senior Software Engineer"
                value={jobForm.title}
                onChangeText={(value) => handleInputChange('title', value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Company *</Text>
              <TextInput
                style={styles.input}
                placeholder="Company name"
                value={jobForm.company}
                onChangeText={(value) => handleInputChange('company', value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. San Francisco, CA"
                value={jobForm.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Job Type</Text>
              <View style={styles.jobTypeSelector}>
                {['Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      jobForm.job_type === type && styles.selectedType,
                    ]}
                    onPress={() => handleInputChange('job_type', type)}
                  >
                    <Text
                      style={[
                        styles.typeOptionText,
                        jobForm.job_type === type && styles.selectedTypeText,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Salary Range</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. $80,000 - $120,000"
                value={jobForm.salary_range}
                onChangeText={(value) => handleInputChange('salary_range', value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Job Description *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe the role, requirements, and benefits..."
                value={jobForm.description}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor="#999"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2ef',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 8,
  },
  postJobButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    padding: 12,
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: '#0077B5',
    fontWeight: '500',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  jobType: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  jobTypeText: {
    fontSize: 12,
    color: '#2e7d2e',
    fontWeight: '500',
  },
  salary: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  jobDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  postedDate: {
    fontSize: 12,
    color: '#666',
  },
  applyButton: {
    backgroundColor: '#0077B5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
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
  modalPostButton: {
    backgroundColor: '#0077B5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  modalPostButtonText: {
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
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
    minHeight: 120,
  },
  jobTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  selectedType: {
    borderColor: '#0077B5',
    backgroundColor: '#e1f5fe',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTypeText: {
    color: '#0077B5',
    fontWeight: '600',
  },
});

export default JobsScreen;
