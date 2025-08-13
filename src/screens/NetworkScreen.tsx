import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../services/api';

interface Connection {
  id: string;
  user_id: string;
  target_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  user_name: string;
  target_user_name: string;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  expertise?: string;
  location?: string;
}

const NetworkScreen = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'connections' | 'discover'>('connections');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (activeTab === 'connections') {
        await loadConnections();
      } else {
        await loadUsers();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const loadConnections = async () => {
    try {
      const response = await ApiService.getConnections();
      if (response.data.success) {
        setConnections(response.data.connections || []);
      }
    } catch (error) {
      console.error('Error loading connections:', error);
      Alert.alert('Error', 'Failed to load connections');
    }
  };

  const loadUsers = async () => {
    try {
      const response = await ApiService.getUsers();
      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    }
  };

  const handleTabChange = (tab: 'connections' | 'discover') => {
    setActiveTab(tab);
    setIsLoading(true);
    if (tab === 'connections') {
      loadConnections();
    } else {
      loadUsers();
    }
  };

  const sendConnectionRequest = async (userId: string) => {
    try {
      const response = await ApiService.sendConnectionRequest(userId);
      if (response.data.success) {
        Alert.alert('Success', 'Connection request sent!');
        loadUsers(); // Refresh the list
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      Alert.alert('Error', 'Failed to send connection request');
    }
  };

  const respondToConnection = async (connectionId: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await ApiService.respondToConnection(connectionId, status);
      if (response.data.success) {
        Alert.alert('Success', `Connection ${status}!`);
        loadConnections(); // Refresh the list
      } else {
        Alert.alert('Error', response.data.message || 'Failed to respond');
      }
    } catch (error) {
      console.error('Error responding to connection:', error);
      Alert.alert('Error', 'Failed to respond to connection');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderConnection = ({ item }: { item: Connection }) => (
    <View style={styles.connectionCard}>
      <View style={styles.connectionInfo}>
        <View style={styles.avatar}>
          <Icon name="person" size={32} color="#0077B5" />
        </View>
        <View style={styles.connectionDetails}>
          <Text style={styles.connectionName}>
            {item.status === 'pending' ? item.user_name : item.target_user_name}
          </Text>
          <Text style={styles.connectionStatus}>
            Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
          <Text style={styles.connectionDate}>
            Connected: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      {item.status === 'pending' && (
        <View style={styles.connectionActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => respondToConnection(item.id, 'accepted')}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => respondToConnection(item.id, 'rejected')}
          >
            <Text style={styles.rejectButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Icon name="person" size={32} color="#0077B5" />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          {item.expertise && (
            <Text style={styles.userExpertise}>{item.expertise}</Text>
          )}
          {item.location && (
            <Text style={styles.userLocation}>
              <Icon name="location-on" size={12} color="#666" /> {item.location}
            </Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.connectButton}
        onPress={() => sendConnectionRequest(item.id)}
      >
        <Icon name="person-add" size={16} color="white" />
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'connections' && styles.activeTab]}
          onPress={() => handleTabChange('connections')}
        >
          <Text style={[styles.tabText, activeTab === 'connections' && styles.activeTabText]}>
            My Connections
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
          onPress={() => handleTabChange('discover')}
        >
          <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>
            Discover People
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'connections' ? (
        <FlatList<Connection>
          data={connections}
          renderItem={renderConnection}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="people-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No connections yet</Text>
            </View>
          }
        />
      ) : (
        <FlatList<User>
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="person-search" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2ef',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0077B5',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#0077B5',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 12,
  },
  connectionCard: {
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
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  connectionDetails: {
    flex: 1,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  connectionStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  connectionDate: {
    fontSize: 12,
    color: '#999',
  },
  connectionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#0077B5',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  rejectButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userExpertise: {
    fontSize: 14,
    color: '#0077B5',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 12,
    color: '#666',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  connectButtonText: {
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
});

export default NetworkScreen;
