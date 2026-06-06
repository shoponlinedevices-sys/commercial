import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Modal,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { login, register, forgotPassword, UserInfo } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { setLoggingOut } from '../api/apiClient';

type RootStackParamList = {
  Login: undefined;
  Products: { user: UserInfo };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [forgotPasswordUsername, setForgotPasswordUsername] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const { setUser, setIsLoggingOut } = useAuth();

  // Reset logout flag when login screen mounts
  useEffect(() => {
    setIsLoggingOut(false);
    setLoggingOut(false);
  }, [setIsLoggingOut]);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập tài khoản và mật khẩu');
      return;
    }

    setLoading(true);
    console.log(`[LoginScreen] handleLogin called - username: ${username}, password length: ${password.length}`);
    try {
      console.log(`[LoginScreen] Calling login API with username: ${username.trim()}`);
      const user = await login(username.trim(), password);
      console.log(`[LoginScreen] Login success:`, user);
      setLoading(false);
      setUser(user);
      navigation.replace('Products', { user });
    } catch (error: any) {
      console.error(`[LoginScreen] Login error:`, error);
      setLoading(false);
      Alert.alert('Đăng nhập thất bại', error.message || 'Tài khoản hoặc mật khẩu không đúng');
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập tài khoản và mật khẩu');
      return;
    }

    setLoading(true);
    console.log(`[LoginScreen] handleRegister called - username: ${username}, password length: ${password.length}`);
    try {
      console.log(`[LoginScreen] Calling register API with username: ${username.trim()}`);
      const user = await register(username.trim(), password);
      console.log(`[LoginScreen] Register success:`, user);
      setLoading(false);
      Alert.alert('Đăng ký thành công', 'Tài khoản đã được tạo. Vui lòng đăng nhập.');
    } catch (error: any) {
      console.error(`[LoginScreen] Register error:`, error);
      setLoading(false);
      Alert.alert('Đăng ký thất bại', error.message || 'Không thể tạo tài khoản');
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordUsername) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập');
      return;
    }

    setForgotPasswordLoading(true);
    console.log(`[LoginScreen] handleForgotPassword called - username: ${forgotPasswordUsername}`);
    try {
      console.log(`[LoginScreen] Calling forgotPassword API with username: ${forgotPasswordUsername.trim()}`);
      const response = await forgotPassword(forgotPasswordUsername.trim());
      console.log(`[LoginScreen] Forgot password success:`, response);
      setForgotPasswordLoading(false);
      setForgotPasswordModalVisible(false);
      setForgotPasswordUsername('');
      Alert.alert('Thành công', response.message || 'Mật khẩu tạm thời đã được gửi đến email của bạn');
    } catch (error: any) {
      console.error(`[LoginScreen] Forgot password error:`, error);
      setForgotPasswordLoading(false);
      Alert.alert('Lỗi', error.message || 'Không thể gửi mật khẩu. Vui lòng kiểm tra tên đăng nhập và thử lại.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header with time and status icons */}
      <View style={styles.header}>
        <Text style={styles.timeText}>15:05</Text>
        <View style={styles.statusIcons}>
          <Ionicons name="wifi" size={16} color="#000" />
          <Ionicons name="battery-full" size={16} color="#000" />
        </View>
      </View>

      {/* Logo and company info */}
      <View style={styles.brandContainer}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>C</Text>
        </View>
        <Text style={styles.logoText}>Công ty TNHH Thiết Bị Công Nghiệp</Text>
        <Text style={styles.subtitle}>Đăng nhập để quản lý đơn hàng và trải nghiệm tốt hơn</Text>
      </View>

      {/* Form card */}
      <View style={styles.formContainer}>
        {/* Account input */}
        <Text style={styles.inputLabel}>Tài khoản</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập tài khoản"
            placeholderTextColor="#9ca3af"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoComplete="username"
          />
        </View>

        {/* Password input */}
        <Text style={styles.inputLabel}>Mật khẩu</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color="#9ca3af" 
            />
          </TouchableOpacity>
        </View>

        {/* Remember login and forgot password */}
        <View style={styles.rowContainer}>
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setRememberLogin(!rememberLogin)}
          >
            <View style={[styles.checkbox, rememberLogin && styles.checkboxChecked]}>
              {rememberLogin && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.checkboxText}>Ghi nhớ đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setForgotPasswordModalVisible(true)}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        {/* Login button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>hoặc</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Register button */}
        <TouchableOpacity
          style={[styles.registerButton, loading && styles.loginButtonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#3b82f6" />
          ) : (
            <View style={styles.buttonContent}>
              <Ionicons name="person-add-outline" size={20} color="#3b82f6" />
              <Text style={styles.registerButtonText}>Đăng ký tài khoản mới</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer with security message */}
      <View style={styles.footer}>
        <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
        <Text style={styles.footerText}>
          Bảo mật thông tin tuyệt đối và không chia sẻ với bên thứ ba.
        </Text>
      </View>

      {/* Forgot Password Modal */}
      <Modal
        visible={forgotPasswordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setForgotPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quên mật khẩu</Text>
              <TouchableOpacity onPress={() => setForgotPasswordModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalDescription}>
                Nhập tên đăng nhập của bạn để nhận mật khẩu tạm thời qua email.
              </Text>

              <Text style={styles.inputLabel}>Tên đăng nhập</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên đăng nhập"
                  placeholderTextColor="#9ca3af"
                  value={forgotPasswordUsername}
                  onChangeText={setForgotPasswordUsername}
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[styles.modalButton, forgotPasswordLoading && styles.modalButtonDisabled]}
                onPress={handleForgotPassword}
                disabled={forgotPasswordLoading}
              >
                {forgotPasswordLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Gửi mật khẩu</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  logoBadgeText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  inputLabel: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1e293b',
  },
  eyeIcon: {
    padding: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkboxText: {
    fontSize: 13,
    color: '#64748b',
  },
  forgotPasswordText: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  separatorText: {
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#94a3b8',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  registerButtonText: {
    color: '#3b82f6',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalContent: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  modalButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;