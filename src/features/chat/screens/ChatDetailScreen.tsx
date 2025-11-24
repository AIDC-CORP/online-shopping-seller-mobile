import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Animated } from 'react-native';
import { useChat } from '../hooks/useChat';
import * as ImagePicker from 'expo-image-picker';

interface ChatDetailScreenProps {
  chatId: string;
  onBack: () => void;
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ chatId, onBack }) => {
  const { messages, loading, error, sending, sendMessage } = useChat(chatId);
  const [inputText, setInputText] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const quickReplies = [
    '✅ Dạ vẫn còn hàng ạ!',
    '🚚 Shop sẽ giao trong 1-2 giờ',
    '🎉 Cảm ơn bạn đã mua hàng!',
    '💰 Giá này là tốt nhất rồi ạ',
    '📦 Đơn hàng đang được chuẩn bị',
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>Đang tải tin nhắn...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>⚠️</Text>
        <Text style={{ fontSize: 16, color: '#ef4444', textAlign: 'center' }}>
          {error}
        </Text>
      </View>
    );
  }

  const handleSend = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    await sendMessage(messageText);
    setInputText('');
    setShowQuickReplies(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Cần quyền truy cập thư viện ảnh!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      // TODO: Implement image upload to backend
      await sendMessage('📷 [Đã gửi hình ảnh]');
      scrollToBottom();
    }
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isFromSeller = item.senderType === 'seller';
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !isFromSeller && (!prevMessage || prevMessage.senderType === 'seller');
    
    // Format timestamp
    const formatTime = (timestamp: string) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };
    
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
          flexDirection: 'row',
          justifyContent: isFromSeller ? 'flex-end' : 'flex-start',
          marginBottom: 12,
          paddingHorizontal: 12,
        }}
      >
        {!isFromSeller && (
          <View style={{ width: 32, marginRight: 8 }}>
            {showAvatar && (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#3b82f6',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                  K
                </Text>
              </View>
            )}
          </View>
        )}
        
        <View
          style={{
            maxWidth: '70%',
            backgroundColor: isFromSeller ? '#10b981' : '#f3f4f6',
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopLeftRadius: isFromSeller ? 18 : (showAvatar ? 4 : 18),
            borderTopRightRadius: isFromSeller ? 4 : 18,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: isFromSeller ? 'white' : '#1f2937',
              lineHeight: 22,
            }}
          >
            {item.text}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 }}>
            <Text
              style={{
                fontSize: 11,
                color: isFromSeller ? '#d1fae5' : '#9ca3af',
              }}
            >
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={{ flex: 1, backgroundColor: 'white' }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 100}
    >
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 10,
            paddingTop: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
            backgroundColor: 'white',
          }}
        >
          <TouchableOpacity
            onPress={onBack}
            style={{
              padding: 8,
              marginRight: 8,
            }}
          >
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>

          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#3b82f6',
              marginRight: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
              K
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937' }}>
              Khách hàng
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#10b981',
                  marginRight: 6,
                }}
              />
              <Text style={{ fontSize: 13, color: '#10b981' }}>Đang hoạt động</Text>
            </View>
          </View>

          <TouchableOpacity style={{ padding: 8 }}>
            <Text style={{ fontSize: 20 }}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 8 }}>
            <Text style={{ fontSize: 20 }}>ℹ️</Text>
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={{ backgroundColor: '#fafafa' }}
            contentContainerStyle={{ paddingVertical: 16, paddingBottom: 16 }}
            inverted={false}
            onContentSizeChange={scrollToBottom}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Quick Replies */}
        {showQuickReplies && (
          <View
            style={{
              backgroundColor: 'white',
              borderTopWidth: 1,
              borderTopColor: '#e5e7eb',
              paddingVertical: 10,
            }}
          >
            <View style={{ flexDirection: 'row', paddingHorizontal: 12, flexWrap: 'wrap' }}>
              {quickReplies.map((reply, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSend(reply)}
                  style={{
                    backgroundColor: '#f0fdf4',
                    borderWidth: 1,
                    borderColor: '#10b981',
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 14, color: '#059669' }}>{reply}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Input Area */}
        <View
          style={{
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            paddingBottom: Platform.OS === 'ios' ? 4 : 2,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              paddingHorizontal: 12,
              paddingTop: 8,
              paddingBottom: 8,

            }}
          >
            {/* Quick Reply Button */}
            <TouchableOpacity
              onPress={() => setShowQuickReplies(!showQuickReplies)}
              style={{
                padding: 8,
                marginRight: 8,
                backgroundColor: showQuickReplies ? '#d1fae5' : 'transparent',
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 20 }}>⚡</Text>
            </TouchableOpacity>

            {/* Image Picker Button */}
            <TouchableOpacity
              onPress={pickImage}
              style={{ padding: 8, marginRight: 8 }}
            >
              <Text style={{ fontSize: 22 }}>📷</Text>
            </TouchableOpacity>

            {/* Input Field */}
            <View
              style={{
                flex: 1,
                backgroundColor: '#f9fafb',
                borderRadius: 24,
                borderWidth: 1,
                borderColor: '#e5e7eb',
                paddingHorizontal: 16,
                paddingVertical: 8,
                maxHeight: 40,
              }}
            >
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Nhập tin nhắn..."
                placeholderTextColor="#9ca3af"
                multiline
                style={{
                  fontSize: 15,
                  color: '#1f2937',
                  minHeight: 36,
                }}
                returnKeyType="send"
                onSubmitEditing={() => handleSend()}
                blurOnSubmit={false}
              />
            </View>

            {/* Send Button */}
            <TouchableOpacity
              onPress={() => handleSend()}
              style={{
                marginLeft: 8,
                backgroundColor: (inputText.trim() && !sending) ? '#10b981' : '#e5e7eb',
                width: 42,
                height: 42,
                borderRadius: 21,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: (inputText.trim() && !sending) ? '#10b981' : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}
              disabled={!inputText.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#9ca3af" />
              ) : (
                <Text style={{ fontSize: 20, color: inputText.trim() ? 'white' : '#9ca3af' }}>
                  ➤
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatDetailScreen;
