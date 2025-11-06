import React, { useState } from 'react';
import { View, Text, ScrollView, Image, ImageBackground, TouchableOpacity, Switch, Modal, TextInput, Alert, Share } from 'react-native';
import { mockStoreInfo, mockStoreStats, mockStoreReviews, mockStoreFollowers, mockStoreAnalytics, mockShareStoreData } from '../../shared/data/mockData';
import { StoreInfo } from '../../shared/types';
import { PencilIcon } from '@/src/components/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconButton from '@/components/ui/icon-button';
import Button from '@/components/ui/button';

const InfoRow: React.FC<{ label: string; value: string; icon?: string }> = ({ label, value, icon }) => (
  <View className="py-3 border-b border-gray-200">
    <Text className="text-sm text-gray-500">{icon ? `${icon} ${label}` : label}</Text>
    <Text className="text-base text-gray-800">{value}</Text>
  </View>
);

const CompactStat: React.FC<{ 
  icon: string; 
  value: string; 
  onPress?: () => void 
}> = ({ icon, value, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="flex-1 flex-row items-center justify-center py-2"
    disabled={!onPress}
  >
    <Text style={{ fontSize: 16 }}>{icon}</Text>
    <Text className="text-sm font-bold text-gray-800 ml-1.5">{value}</Text>
  </TouchableOpacity>
);

const StoreScreen: React.FC = () => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    ...mockStoreInfo,
    email: 'support@greenfarm.vn',
    website: 'www.greenfarm.vn',
    paymentMethods: 'COD, Chuyển khoản, Ví điện tử',
    shippingPolicy: 'Miễn phí với đơn từ 200K',
    returnPolicy: 'Đổi trả trong 7 ngày',
    facebook: 'facebook.com/greenfarm',
    instagram: 'instagram.com/greenfarm',
    youtube: 'youtube.com/@greenfarm',
  });
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [detailType, setDetailType] = useState<'reviews' | 'followers' | 'products' | null>(null);
  const [editField, setEditField] = useState<'description' | 'address' | 'phone' | 'hours' | 'email' | 'website' | 'paymentMethods' | 'shippingPolicy' | 'returnPolicy' | 'facebook' | 'instagram' | 'youtube' | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditField = (field: 'description' | 'address' | 'phone' | 'hours' | 'email' | 'website' | 'paymentMethods' | 'shippingPolicy' | 'returnPolicy' | 'facebook' | 'instagram' | 'youtube') => {
    setEditField(field);
    let value = '';
    switch (field) {
      case 'description':
        value = storeInfo.description;
        break;
      case 'address':
        value = storeInfo.address;
        break;
      case 'phone':
        value = storeInfo.phone;
        break;
      case 'hours':
        value = storeInfo.openingHours;
        break;
      case 'email':
      case 'website':
      case 'paymentMethods':
      case 'shippingPolicy':
      case 'returnPolicy':
      case 'facebook':
      case 'instagram':
      case 'youtube':
        value = storeInfo[field] || '';
        break;
    }
    setEditValue(value);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editField) return;
    
    setStoreInfo(prev => ({
      ...prev,
      [editField === 'hours' ? 'openingHours' : editField]: editValue
    }));
    setShowEditModal(false);
    setEditField(null);
    setEditValue('');
  };

  const handleToggleStore = (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Tạm đóng cửa hàng',
        'Khách hàng sẽ không thể đặt hàng khi cửa hàng đóng cửa. Bạn có chắc chắn?',
        [
          { text: 'Hủy', style: 'cancel' },
          { 
            text: 'Đồng ý', 
            style: 'destructive',
            onPress: () => setIsStoreOpen(false)
          }
        ]
      );
    } else {
      setIsStoreOpen(true);
    }
  };

  const getFieldLabel = () => {
    switch (editField) {
      case 'description': return 'Giới thiệu';
      case 'address': return 'Địa chỉ';
      case 'phone': return 'Số điện thoại';
      case 'hours': return 'Giờ mở cửa';
      case 'email': return 'Email';
      case 'website': return 'Website';
      case 'paymentMethods': return 'Phương thức thanh toán';
      case 'shippingPolicy': return 'Chính sách giao hàng';
      case 'returnPolicy': return 'Chính sách đổi trả';
      case 'facebook': return 'Facebook';
      case 'instagram': return 'Instagram';
      case 'youtube': return 'YouTube';
      default: return '';
    }
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50/50">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Store Status Toggle */}
        <View className="bg-white px-4 py-3 flex-row justify-between items-center border-b border-gray-200">
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-800">Trạng thái cửa hàng</Text>
            <Text className="text-sm text-gray-600 mt-0.5">
              {isStoreOpen ? '🟢 Đang mở cửa' : '🔴 Đã đóng cửa'}
            </Text>
          </View>
          <Switch
            value={isStoreOpen}
            onValueChange={handleToggleStore}
            trackColor={{ false: '#d1d5db', true: '#10b981' }}
            thumbColor={isStoreOpen ? '#ffffff' : '#f3f4f6'}
          />
        </View>

        {/* Cover Image with Edit Button */}
        <ImageBackground source={{ uri: storeInfo.coverImageUrl }} className="w-full h-48" resizeMode="cover">
            <View className="flex-1 bg-black/30 justify-end p-4">
              <View className="self-end">
                <IconButton onPress={() => console.log('Edit cover')}>
                  <View style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                    padding: 8, 
                    borderRadius: 8 
                  }}>
                    <PencilIcon className="h-5 w-5" color="white" />
                  </View>
                </IconButton>
              </View>
            </View>
        </ImageBackground>
        
        {/* Store Profile Section */}
        <View className="px-4 -mt-16">
          <View className="flex-row items-center" style={{ gap: 16 }}>
            <Image source={{ uri: storeInfo.avatarUrl }} className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg" />
            <View className="flex-1">
              <View style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.4)', 
                paddingHorizontal: 12, 
                paddingVertical: 8, 
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
                marginBottom: 8,
              }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}>
                  {storeInfo.name}
                </Text>
              </View>
              
              {/* Compact Stats Row */}
              <View className="flex-row bg-white rounded-xl shadow-sm">
                <CompactStat 
                  icon="⭐" 
                  value={`${mockStoreStats.averageRating}`} 
                  onPress={() => {
                    setDetailType('reviews');
                    setShowDetailModal(true);
                  }}
                />
                <View className="w-px bg-gray-200 my-1.5" />
                <CompactStat 
                  icon="❤️" 
                  value={mockStoreStats.totalFollowers > 999 ? `${(mockStoreStats.totalFollowers / 1000).toFixed(1)}K` : `${mockStoreStats.totalFollowers}`}
                  onPress={() => {
                    setDetailType('followers');
                    setShowDetailModal(true);
                  }}
                />
                <View className="w-px bg-gray-200 my-1.5" />
                <CompactStat 
                  icon="📦" 
                  value={`${mockStoreStats.totalProducts}`}
                  onPress={() => {
                    setDetailType('products');
                    setShowDetailModal(true);
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Store Description Card */}
        <View className="bg-white p-4 rounded-xl shadow-sm mx-4 mt-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-base font-semibold text-gray-800">Giới thiệu</Text>
            <IconButton onPress={() => handleEditField('description')}>
              <PencilIcon className="h-4 w-4" color="#6b7280" />
            </IconButton>
          </View>
          <Text className="text-sm text-gray-600 leading-5">{storeInfo.description}</Text>
        </View>

        {/* Store Information Card */}
        <View className="bg-white p-4 rounded-xl shadow-sm mx-4 mt-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold text-gray-800">Thông tin liên hệ</Text>
          </View>
          <TouchableOpacity onPress={() => handleEditField('address')}>
            <InfoRow label="Địa chỉ" value={storeInfo.address} icon="📍" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEditField('phone')}>
            <InfoRow label="Số điện thoại" value={storeInfo.phone} icon="📞" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEditField('hours')}>
            <InfoRow label="Giờ mở cửa" value={storeInfo.openingHours} icon="🕐" />
          </TouchableOpacity>
        </View>

        {/* Additional Info Cards */}
        <View className="bg-white p-4 rounded-xl shadow-sm mx-4 mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-3">Thông tin bổ sung</Text>
          <TouchableOpacity onPress={() => handleEditField('email')}>
            <InfoRow label="Email liên hệ" value={storeInfo.email || 'Chưa cập nhật'} icon="📧" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEditField('website')}>
            <InfoRow label="Website" value={storeInfo.website || 'Chưa cập nhật'} icon="🌐" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEditField('paymentMethods')}>
            <InfoRow label="Phương thức thanh toán" value={storeInfo.paymentMethods || 'Chưa cập nhật'} icon="💳" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEditField('shippingPolicy')}>
            <InfoRow label="Chính sách giao hàng" value={storeInfo.shippingPolicy || 'Chưa cập nhật'} icon="🚚" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEditField('returnPolicy')}>
            <InfoRow label="Chính sách đổi trả" value={storeInfo.returnPolicy || 'Chưa cập nhật'} icon="↩️" />
          </TouchableOpacity>
        </View>

        {/* Social Media Links */}
        <View className="bg-white p-4 rounded-xl shadow-sm mx-4 mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-3">Mạng xã hội</Text>
          <View className="flex-row justify-around items-center">
            <TouchableOpacity 
              className="w-14 h-14 rounded-full items-center justify-center" 
              style={{ backgroundColor: '#1877F2' }}
              onPress={() => handleEditField('facebook')}
            >
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' }}
                style={{ width: 28, height: 28, tintColor: 'white' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity 
              className="w-14 h-14 rounded-full items-center justify-center" 
              style={{ backgroundColor: '#E4405F' }}
              onPress={() => handleEditField('instagram')}
            >
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png' }}
                style={{ width: 28, height: 28, tintColor: 'white' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity 
              className="w-14 h-14 rounded-full items-center justify-center" 
              style={{ backgroundColor: '#FF0000' }}
              onPress={() => handleEditField('youtube')}
            >
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' }}
                style={{ width: 28, height: 28, tintColor: 'white' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 16, marginTop: 24, gap: 12 }}>
          <Button
            onPress={() => setShowAnalyticsModal(true)}
            variant="primary"
            size="md"
            fullWidth
          >
            📊 Xem thống kê cửa hàng
          </Button>
          
          <Button
            onPress={() => setShowShareModal(true)}
            variant="secondary"
            size="md"
            fullWidth
          >
            🔗 Chia sẻ cửa hàng
          </Button>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6" style={{ minHeight: 300 }}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">Chỉnh sửa {getFieldLabel()}</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text className="text-2xl text-gray-400">✕</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              value={editValue}
              onChangeText={setEditValue}
              multiline={editField === 'description'}
              numberOfLines={editField === 'description' ? 4 : 1}
              className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-base text-gray-800"
              placeholder={`Nhập ${getFieldLabel().toLowerCase()}`}
              style={{ textAlignVertical: editField === 'description' ? 'top' : 'center' }}
            />

            <View className="flex-row mt-6" style={{ gap: 12 }}>
              <View className="flex-1">
                <Button
                  onPress={() => setShowEditModal(false)}
                  variant="secondary"
                  size="md"
                  fullWidth
                >
                  Hủy
                </Button>
              </View>
              <View className="flex-1">
                <Button
                  onPress={handleSaveEdit}
                  variant="primary"
                  size="md"
                  fullWidth
                >
                  Lưu
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detail Modal - Reviews/Followers/Products */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-16 bg-white rounded-t-3xl">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-800">
                {detailType === 'reviews' && `Đánh giá (${mockStoreStats.totalReviews})`}
                {detailType === 'followers' && `Người theo dõi (${mockStoreStats.totalFollowers})`}
                {detailType === 'products' && `Sản phẩm (${mockStoreStats.totalProducts})`}
              </Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Text className="text-2xl text-gray-400">✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView className="flex-1 p-4">
              {detailType === 'reviews' && mockStoreReviews.map((review) => (
                <View key={review.id} className="bg-gray-50 p-4 rounded-xl mb-3">
                  <View className="flex-row items-center mb-2">
                    <Image 
                      source={{ uri: review.customerAvatar }} 
                      className="w-10 h-10 rounded-full"
                    />
                    <View className="flex-1 ml-3">
                      <Text className="font-semibold text-gray-800">{review.customerName}</Text>
                      <View className="flex-row items-center">
                        <Text className="text-yellow-500">{'⭐'.repeat(review.rating)}</Text>
                        <Text className="text-xs text-gray-500 ml-2">{review.timestamp}</Text>
                      </View>
                    </View>
                  </View>
                  <Text className="text-sm text-gray-700 mb-1">{review.comment}</Text>
                  <Text className="text-xs text-gray-500">Sản phẩm: {review.productName}</Text>
                  {review.images && (
                    <View className="flex-row mt-2" style={{ gap: 8 }}>
                      {review.images.map((img, idx) => (
                        <Image 
                          key={idx}
                          source={{ uri: img }} 
                          className="w-20 h-20 rounded-lg"
                        />
                      ))}
                    </View>
                  )}
                </View>
              ))}
              
              {detailType === 'followers' && mockStoreFollowers.map((follower) => (
                <View key={follower.id} className="bg-gray-50 p-4 rounded-xl mb-3 flex-row items-center">
                  <Image 
                    source={{ uri: follower.customerAvatar }} 
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="font-semibold text-gray-800">{follower.customerName}</Text>
                    <Text className="text-xs text-gray-500">Theo dõi từ {follower.followedAt}</Text>
                    <Text className="text-xs text-emerald-600 mt-1">
                      {follower.totalOrders} đơn • {(follower.totalSpent / 1000).toFixed(0)}K đã mua
                    </Text>
                  </View>
                </View>
              ))}

              {detailType === 'products' && (
                <View className="bg-gray-50 p-4 rounded-xl">
                  <Text className="text-sm text-gray-600 mb-3">
                    Hiển thị danh sách sản phẩm tại màn hình Sản phẩm
                  </Text>
                  <Button
                    onPress={() => {
                      setShowDetailModal(false);
                      // Navigate to Products screen
                    }}
                    variant="primary"
                    size="md"
                    fullWidth
                  >
                    Xem tất cả sản phẩm
                  </Button>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Analytics Modal */}
      <Modal
        visible={showAnalyticsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAnalyticsModal(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-16 bg-white rounded-t-3xl">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-800">📊 Thống kê cửa hàng</Text>
              <TouchableOpacity onPress={() => setShowAnalyticsModal(false)}>
                <Text className="text-2xl text-gray-400">✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView className="flex-1 p-4">
              {/* Overview Stats */}
              <View className="bg-emerald-50 p-4 rounded-xl mb-4">
                <Text className="text-base font-bold text-emerald-800 mb-3">Tổng quan</Text>
                <View className="flex-row flex-wrap" style={{ gap: 12 }}>
                  <View className="flex-1 bg-white p-3 rounded-lg" style={{ minWidth: '45%' }}>
                    <Text className="text-xs text-gray-500">Doanh thu tháng</Text>
                    <Text className="text-lg font-bold text-emerald-600">
                      {(mockStoreAnalytics.overview.totalRevenue / 1000000).toFixed(1)}M
                    </Text>
                  </View>
                  <View className="flex-1 bg-white p-3 rounded-lg" style={{ minWidth: '45%' }}>
                    <Text className="text-xs text-gray-500">Tổng đơn hàng</Text>
                    <Text className="text-lg font-bold text-blue-600">{mockStoreAnalytics.overview.totalOrders}</Text>
                  </View>
                  <View className="flex-1 bg-white p-3 rounded-lg" style={{ minWidth: '45%' }}>
                    <Text className="text-xs text-gray-500">Giá trị TB/đơn</Text>
                    <Text className="text-lg font-bold text-orange-600">
                      {(mockStoreAnalytics.overview.averageOrderValue / 1000).toFixed(0)}K
                    </Text>
                  </View>
                  <View className="flex-1 bg-white p-3 rounded-lg" style={{ minWidth: '45%' }}>
                    <Text className="text-xs text-gray-500">Lượt xem tháng</Text>
                    <Text className="text-lg font-bold text-purple-600">
                      {(mockStoreAnalytics.overview.viewsThisMonth / 1000).toFixed(1)}K
                    </Text>
                  </View>
                </View>
              </View>

              {/* Top Products */}
              <View className="bg-gray-50 p-4 rounded-xl mb-4">
                <Text className="text-base font-bold text-gray-800 mb-3">Sản phẩm bán chạy</Text>
                {mockStoreAnalytics.topSellingProducts.map((product, index) => (
                  <View key={product.id} className="flex-row items-center justify-between py-2 border-b border-gray-200">
                    <View className="flex-row items-center flex-1">
                      <Text className="text-lg font-bold text-gray-400 w-6">{index + 1}</Text>
                      <View className="flex-1 ml-2">
                        <Text className="text-sm font-semibold text-gray-800">{product.name}</Text>
                        <Text className="text-xs text-gray-500">{product.sold} đã bán</Text>
                      </View>
                    </View>
                    <Text className="text-sm font-bold text-emerald-600">
                      {(product.revenue / 1000000).toFixed(1)}M
                    </Text>
                  </View>
                ))}
              </View>

              {/* Customer Stats */}
              <View className="bg-blue-50 p-4 rounded-xl mb-4">
                <Text className="text-base font-bold text-blue-800 mb-3">Khách hàng</Text>
                <View className="flex-row" style={{ gap: 12 }}>
                  <View className="flex-1 bg-white p-3 rounded-lg">
                    <Text className="text-xs text-gray-500">Khách mới</Text>
                    <Text className="text-xl font-bold text-blue-600">
                      {mockStoreAnalytics.customerDemographics.newCustomers}
                    </Text>
                  </View>
                  <View className="flex-1 bg-white p-3 rounded-lg">
                    <Text className="text-xs text-gray-500">Khách quay lại</Text>
                    <Text className="text-xl font-bold text-green-600">
                      {mockStoreAnalytics.customerDemographics.returningCustomers}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Peak Hours */}
              <View className="bg-orange-50 p-4 rounded-xl">
                <Text className="text-base font-bold text-orange-800 mb-3">Giờ cao điểm</Text>
                {mockStoreAnalytics.peakHours.slice(0, 5).map((hour) => (
                  <View key={hour.hour} className="flex-row items-center justify-between py-2">
                    <Text className="text-sm text-gray-700">{hour.hour}</Text>
                    <View className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                      <View 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${(hour.orders / 42) * 100}%` }}
                      />
                    </View>
                    <Text className="text-sm font-bold text-gray-800">{hour.orders}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowShareModal(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-32 bg-white rounded-t-3xl">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-800">🔗 Chia sẻ cửa hàng</Text>
              <TouchableOpacity onPress={() => setShowShareModal(false)}>
                <Text className="text-2xl text-gray-400">✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView className="flex-1 p-4">
              {/* QR Code */}
              <View className="items-center bg-gray-50 p-6 rounded-xl mb-4">
                <Image 
                  source={{ uri: mockShareStoreData.qrCodeUrl }}
                  style={{ width: 200, height: 200 }}
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-600 mt-3 text-center">
                  Quét mã QR để truy cập cửa hàng
                </Text>
              </View>

              {/* Store URL */}
              <View className="bg-gray-50 p-4 rounded-xl mb-4">
                <Text className="text-xs text-gray-500 mb-2">Link cửa hàng</Text>
                <View className="flex-row items-center justify-between bg-white p-3 rounded-lg">
                  <Text className="text-sm text-gray-800 flex-1" numberOfLines={1}>
                    {mockShareStoreData.storeUrl}
                  </Text>
                  <TouchableOpacity 
                    className="ml-2 bg-emerald-100 px-3 py-1.5 rounded-lg"
                    onPress={async () => {
                      try {
                        await Share.share({
                          message: `${mockShareStoreData.socialShareText}\n\n${mockShareStoreData.storeUrl}`,
                          url: mockShareStoreData.storeUrl,
                        });
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    <Text className="text-xs font-semibold text-emerald-700">Sao chép</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Short URL */}
              <View className="bg-gray-50 p-4 rounded-xl mb-4">
                <Text className="text-xs text-gray-500 mb-2">Link rút gọn</Text>
                <View className="flex-row items-center justify-between bg-white p-3 rounded-lg">
                  <Text className="text-base font-semibold text-emerald-600">
                    {mockShareStoreData.shortUrl}
                  </Text>
                  <TouchableOpacity 
                    className="ml-2 bg-emerald-100 px-3 py-1.5 rounded-lg"
                    onPress={async () => {
                      try {
                        await Share.share({
                          message: `${mockShareStoreData.socialShareText}\n\n${mockShareStoreData.shortUrl}`,
                        });
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    <Text className="text-xs font-semibold text-emerald-700">Sao chép</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Share Stats */}
              <View className="bg-blue-50 p-4 rounded-xl mb-4">
                <Text className="text-sm font-bold text-blue-800 mb-3">Thống kê chia sẻ</Text>
                <View className="flex-row flex-wrap" style={{ gap: 12 }}>
                  <View className="flex-1 bg-white p-3 rounded-lg items-center" style={{ minWidth: '45%' }}>
                    <Text className="text-2xl font-bold text-blue-600">{mockShareStoreData.shareStats.totalShares}</Text>
                    <Text className="text-xs text-gray-500 mt-1">Tổng lượt chia sẻ</Text>
                  </View>
                  <View className="flex-1 bg-white p-3 rounded-lg items-center" style={{ minWidth: '45%' }}>
                    <Text className="text-2xl font-bold text-blue-500">{mockShareStoreData.shareStats.facebookShares}</Text>
                    <Text className="text-xs text-gray-500 mt-1">Facebook</Text>
                  </View>
                  <View className="flex-1 bg-white p-3 rounded-lg items-center" style={{ minWidth: '45%' }}>
                    <Text className="text-2xl font-bold text-blue-400">{mockShareStoreData.shareStats.zaloShares}</Text>
                    <Text className="text-xs text-gray-500 mt-1">Zalo</Text>
                  </View>
                  <View className="flex-1 bg-white p-3 rounded-lg items-center" style={{ minWidth: '45%' }}>
                    <Text className="text-2xl font-bold text-gray-600">{mockShareStoreData.shareStats.otherShares}</Text>
                    <Text className="text-xs text-gray-500 mt-1">Khác</Text>
                  </View>
                </View>
              </View>

              {/* Share Buttons */}
              <View style={{ gap: 12 }}>
                <Button
                  onPress={async () => {
                    try {
                      await Share.share({
                        message: `${mockShareStoreData.socialShareText}\n\n${mockShareStoreData.storeUrl}`,
                        url: mockShareStoreData.storeUrl,
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  variant="primary"
                  size="md"
                  fullWidth
                >
                  📱 Chia sẻ ngay
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default StoreScreen;