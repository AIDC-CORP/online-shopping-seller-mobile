import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { mockChatConversations } from '../../shared/data/mockData';
import { ChatConversation } from '../../shared/types';

const ChatScreen: React.FC = () => {
  const router = useRouter();
  const [conversations] = useState<ChatConversation[]>(mockChatConversations);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const renderConversation = ({ item }: { item: ChatConversation }) => (
    <TouchableOpacity
      onPress={() => {
        router.push(`/(main)/chat/${item.id}` as any);
      }}
      style={{
        flexDirection: 'row',
        padding: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
      }}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={{ position: 'relative' }}>
        {item.customerAvatar ? (
          <Image
            source={{ uri: item.customerAvatar }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#e5e7eb',
            }}
          />
        ) : (
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#3b82f6',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
              {item.customerName.charAt(0)}
            </Text>
          </View>
        )}
        
        {/* Online indicator */}
        <View
          style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#10b981',
            borderWidth: 2,
            borderColor: 'white',
          }}
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
        {/* Name & Time */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '700',
              color: '#1f2937',
              flex: 1,
            }}
            numberOfLines={1}
          >
            {item.customerName}
          </Text>
          <Text style={{ fontSize: 12, color: '#9ca3af', marginLeft: 8 }}>
            {item.lastMessageTime}
          </Text>
        </View>

        {/* Last Message */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 14,
              color: item.unreadCount > 0 ? '#1f2937' : '#6b7280',
              fontWeight: item.unreadCount > 0 ? '600' : '400',
              flex: 1,
            }}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          
          {/* Unread Badge */}
          {item.unreadCount > 0 && (
            <View
              style={{
                backgroundColor: '#ef4444',
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                paddingHorizontal: 6,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 8,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: 'white' }}>
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        style={{
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        }}
      >
        <View style={{ padding: 16, paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
              💬 Tin nhắn
            </Text>
            {totalUnread > 0 && (
              <View
                style={{
                  backgroundColor: '#fee2e2',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#dc2626' }}>
                  {totalUnread} Chưa đọc
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f3f4f6',
              borderRadius: 8,
              paddingHorizontal: 12,
              height: 40,
            }}
          >
            <Text style={{ fontSize: 16, color: '#9ca3af', marginRight: 8 }}>🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tìm khách hàng..."
              placeholderTextColor="#9ca3af"
              style={{
                flex: 1,
                fontSize: 14,
                color: '#1f2937',
                padding: 0,
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 110 }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>💬</Text>
            <Text style={{ fontSize: 16, color: '#9ca3af', textAlign: 'center' }}>
              {searchQuery ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có tin nhắn nào'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default ChatScreen;
