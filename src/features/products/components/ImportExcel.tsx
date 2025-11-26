import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XIcon } from '../../../components/icons';
import { ProductsService } from '../../../services/products';

interface ImportResult {
  success_count: number;
  error_count: number;
  errors: { row: number | string; error: string }[];
  message: string;
}

interface ImportExcelProps {
  onClose: () => void;
  storeId: string;
  onSuccess: () => void;
}

const ImportExcel: React.FC<ImportExcelProps> = ({
  onClose,
  storeId,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [selectedZipFile, setSelectedZipFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        
        // Check file size (5MB limit)
        if (file.size && file.size > 5 * 1024 * 1024) {
          Alert.alert('Lỗi', 'File Excel không được vượt quá 5MB');
          return;
        }

        setSelectedFile(file);
        setImportResult(null);
      }
    } catch (error) {
      console.error('[ImportExcel] Failed to pick file:', error);
      Alert.alert('Lỗi', 'Không thể chọn file');
    }
  };

  const handlePickZipFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/zip', 'application/x-zip-compressed'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        
        // Check file size (50MB limit for ZIP)
        if (file.size && file.size > 50 * 1024 * 1024) {
          Alert.alert('Lỗi', 'File ZIP không được vượt quá 50MB');
          return;
        }

        setSelectedZipFile(file);
      }
    } catch (error) {
      console.error('[ImportExcel] Failed to pick ZIP file:', error);
      Alert.alert('Lỗi', 'Không thể chọn file ZIP');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('Lỗi', 'Vui lòng chọn file Excel');
      return;
    }

    try {
      setUploading(true);

      // Create FormData
      const formData = new FormData();
      
      // Add Excel file
      const fileToUpload: any = {
        uri: selectedFile.uri,
        type: selectedFile.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        name: selectedFile.name,
      };
      formData.append('file', fileToUpload);

      // Add ZIP file if selected
      if (selectedZipFile) {
        const zipToUpload: any = {
          uri: selectedZipFile.uri,
          type: 'application/zip',
          name: selectedZipFile.name,
        };
        formData.append('images_zip', zipToUpload);
        console.log('[ImportExcel] Uploading with ZIP:', selectedZipFile.name);
      }

      console.log('[ImportExcel] Uploading file:', selectedFile.name);

      // Upload to API
      const result = await ProductsService.importProductsFromExcel(storeId, formData);

      console.log('[ImportExcel] Import result:', result);

      setImportResult(result);

      if (result.success_count > 0) {
        Alert.alert(
          'Thành công',
          `Đã import ${result.success_count} sản phẩm${
            result.error_count > 0 ? `. ${result.error_count} sản phẩm lỗi.` : ''
          }`,
          [
            {
              text: 'OK',
              onPress: () => {
                if (result.error_count === 0) {
                  onSuccess();
                  handleClose();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Lỗi', 'Không có sản phẩm nào được import thành công');
      }
    } catch (error: any) {
      console.error('[ImportExcel] Upload failed:', error);
      Alert.alert('Lỗi', error.message || 'Không thể upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setUploading(true);
      const url = await ProductsService.getExcelTemplateUrl();
      
      console.log('[ImportExcel] Downloading template from:', url);
      
      // Download file using fetch
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      
      // Create file in document directory
      const file = new File(Paths.document, 'product_template.xlsx');
      
      // Write array buffer to file (convert to Uint8Array)
      await file.write(new Uint8Array(arrayBuffer));
      
      console.log('[ImportExcel] Downloaded to:', file.uri);
      
      // Share/Save file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Lưu template Excel',
          UTI: 'com.microsoft.excel.xlsx',
        });
        Alert.alert('Thành công', 'Template đã được tải về');
      } else {
        Alert.alert('Lỗi', 'Không thể chia sẻ file trên thiết bị này');
      }
    } catch (error) {
      console.error('[ImportExcel] Failed to download template:', error);
      Alert.alert('Lỗi', 'Không thể tải template');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setSelectedZipFile(null);
    setImportResult(null);
    onClose();
  };

  // Get safe area insets to handle bottom padding properly
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View style={styles.container}>
            {/* Header - Fixed */}
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>📊 Import Excel</Text>
                <Text style={styles.headerSubtitle}>Thêm hàng loạt từ file Excel</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <XIcon color="white" width={24} height={24} />
              </TouchableOpacity>
            </View>

            {/* ScrollView */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
          {/* Instructions */}
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>
              ℹ️ Hướng dẫn
            </Text>
            <Text style={styles.instructionText}>
              1. Tải file mẫu Excel{'\n'}
              2. Điền thông tin sản phẩm theo cột{'\n'}
              3. Đặt tên ảnh trùng với Mã ảnh trong Excel{'\n'}
              4. Nén tất cả ảnh vào file ZIP (không bắt buộc){'\n'}
              5. Chọn file Excel và file ZIP để upload
            </Text>
            <TouchableOpacity
              onPress={handleDownloadTemplate}
              style={styles.downloadButton}
            >
              <Text style={styles.downloadButtonText}>
                📥 Tải file mẫu
              </Text>
            </TouchableOpacity>
          </View>

          {/* File Picker */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>
              Chọn file Excel
            </Text>

            {selectedFile ? (
              <View style={styles.selectedFileContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: '#059669',
                        marginBottom: 4,
                      }}
                      numberOfLines={1}
                    >
                      📄 {selectedFile.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: '#10b981',
                      }}
                    >
                      {selectedFile.size
                        ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                        : 'Unknown size'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedFile(null)}
                    style={{
                      padding: 8,
                      backgroundColor: '#fee2e2',
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: '#ef4444', fontSize: 18 }}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handlePickFile}
                style={styles.filePickerButton}
              >
                <Text style={{ fontSize: 40, marginBottom: 12 }}>📁</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#3b82f6', marginBottom: 4 }}>
                  Chọn file Excel
                </Text>
                <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
                  Chỉ hỗ trợ file .xlsx, .xls{'\n'}
                  Kích thước tối đa: 5MB
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ZIP File Picker */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>
              Chọn file ảnh (ZIP) - Không bắt buộc
            </Text>

            {selectedZipFile ? (
              <View style={styles.selectedFileContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: '#059669',
                        marginBottom: 4,
                      }}
                      numberOfLines={1}
                    >
                      🗜️ {selectedZipFile.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: '#10b981',
                      }}
                    >
                      {selectedZipFile.size
                        ? `${(selectedZipFile.size / 1024 / 1024).toFixed(2)} MB`
                        : 'Unknown size'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedZipFile(null)}
                    style={{
                      padding: 8,
                      backgroundColor: '#fee2e2',
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: '#ef4444', fontSize: 18 }}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handlePickZipFile}
                style={styles.filePickerButton}
              >
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🗜️</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#3b82f6', marginBottom: 4 }}>
                  Chọn file ZIP chứa ảnh
                </Text>
                <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
                  Đặt tên file ảnh trùng với Mã ảnh{'\n'}
                  Kích thước tối đa: 50MB
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Upload Button */}
          <TouchableOpacity
            onPress={handleUpload}
            disabled={!selectedFile || uploading}
            style={[
              styles.uploadButton,
              !selectedFile || uploading ? styles.uploadButtonDisabled : styles.uploadButtonEnabled,
            ]}
          >
            {uploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={[styles.uploadButtonText, { color: !selectedFile ? '#9ca3af' : 'white' }]}>
                🚀 Upload & Import
              </Text>
            )}
          </TouchableOpacity>

          {/* Import Result */}
          {importResult && (
            <View
              style={{
                backgroundColor:
                  importResult.error_count === 0 ? '#f0fdf4' : '#fef3c7',
                borderRadius: 12,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor:
                  importResult.error_count === 0 ? '#10b981' : '#f59e0b',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color:
                    importResult.error_count === 0 ? '#059669' : '#d97706',
                  marginBottom: 12,
                }}
              >
                {importResult.error_count === 0 ? '✅' : '⚠️'} Kết quả Import
              </Text>

              <View style={{ gap: 8, marginBottom: 12 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: 13, color: '#374151' }}>
                    Thành công:
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '700',
                      color: '#059669',
                    }}
                  >
                    {importResult.success_count} sản phẩm
                  </Text>
                </View>

                {importResult.error_count > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ fontSize: 13, color: '#374151' }}>
                      Lỗi:
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: '#dc2626',
                      }}
                    >
                      {importResult.error_count} sản phẩm
                    </Text>
                  </View>
                )}
              </View>

              {/* Error Details */}
              {importResult.errors.length > 0 && (
                <View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: '#b45309',
                      marginBottom: 8,
                    }}
                  >
                    Chi tiết lỗi:
                  </Text>
                  <ScrollView
                    style={{
                      maxHeight: 200,
                      backgroundColor: 'white',
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    {importResult.errors.map((error, index) => (
                      <View
                        key={index}
                        style={{
                          marginBottom: 8,
                          paddingBottom: 8,
                          borderBottomWidth:
                            index < importResult.errors.length - 1 ? 1 : 0,
                          borderBottomColor: '#f3f4f6',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: '#dc2626',
                            fontWeight: '600',
                          }}
                        >
                          Dòng {error.row}:
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: '#6b7280',
                            marginTop: 2,
                          }}
                        >
                          {error.error}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </ScrollView>
        {/* Bottom spacer for safe area */}
        <View style={{ height: insets.bottom, backgroundColor: '#f9fafb' }} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    minHeight: 110,
    maxHeight: 120,
    backgroundColor: '#10b981', 
    borderBottomLeftRadius: 24, 
    borderBottomRightRadius: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 5, 
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#d1fae5',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 13,
    color: '#1e3a8a',
    lineHeight: 20,
    marginBottom: 8,
  },
  downloadButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  selectedFileContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  filePickerButton: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  uploadButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonEnabled: {
    backgroundColor: '#10b981',
  },
  uploadButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  uploadButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultSuccessCard: {
    borderColor: '#10b981',
  },
  resultErrorCard: {
    borderColor: '#ef4444',
  },
});

export default ImportExcel;
