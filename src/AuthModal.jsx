import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail
} from 'firebase/auth';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  // バリデーション状態
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // メールアドレスのバリデーション
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'メールアドレスを入力してください';
    }
    if (!emailRegex.test(email)) {
      return 'メールアドレスの形式が正しくありません';
    }
    return '';
  };

  // パスワードのバリデーション
  const validatePassword = (password) => {
    if (!password) {
      return 'パスワードを入力してください';
    }
    if (password.length < 8) {
      return 'パスワードは8文字以上で入力してください';
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return 'パスワードは英字と数字を含める必要があります';
    }
    return '';
  };

  // エラーメッセージの曖昧化
  const getGenericErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
      case 'auth/invalid-email':
        return 'メールアドレスまたはパスワードが正しくありません';
      case 'auth/email-already-in-use':
        return 'このメールアドレスは既に登録されています。ログインしてください。';
      case 'auth/too-many-requests':
        return 'しばらく時間をおいてから再度お試しください';
      case 'auth/network-request-failed':
        return 'ネットワークエラーが発生しました。接続を確認してください';
      default:
        return '処理に失敗しました。もう一度お試しください';
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // バリデーションチェック
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (emailErr || passwordErr) {
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 新規登録成功 → すぐに診断結果画面へ
      onSuccess(userCredential.user);
      onClose();
      
    } catch (err) {
      console.error('Signup error:', err.code);
      setError(getGenericErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // バリデーションチェック
    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onSuccess(userCredential.user);
      onClose();
    } catch (err) {
      console.error('Login error:', err.code);
      setError(getGenericErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // バリデーションチェック
    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      // パスワードリセットも曖昧なメッセージに（セキュリティ上）
      setResetSent(true);
    } finally {
      setLoading(false);
    }
  };

  // メール入力時のバリデーション
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      setEmailError(validateEmail(value));
    } else {
      setEmailError('');
    }
  };

  // パスワード入力時のバリデーション
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && mode === 'signup') {
      setPasswordError(validatePassword(value));
    } else {
      setPasswordError('');
    }
  };

  // モード切り替え時にエラーをリセット
  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setEmailError('');
    setPasswordError('');
    setResetSent(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">
          {mode === 'login' && 'ログイン'}
          {mode === 'signup' && '会員登録'}
          {mode === 'reset' && 'パスワードリセット'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {resetSent && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-start">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>パスワードリセットのメールを送信しました。メールをご確認ください。</span>
          </div>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />お名前
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                placeholder="山田 太郎"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" />メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                  emailError ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'
                }`}
                placeholder="example@email.com"
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Lock className="inline w-4 h-4 mr-1" />パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                  passwordError ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'
                }`}
                placeholder="8文字以上（英字と数字を含む）"
                required
                minLength={8}
              />
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                ※8文字以上で、英字と数字を含めてください
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || emailError || passwordError}
              className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? '登録中...' : '会員登録して診断結果を見る'}
            </button>

            <p className="text-center text-sm text-slate-600">
              すでにアカウントをお持ちですか？{' '}
              <button type="button" onClick={() => switchMode('login')} className="text-orange-500 font-semibold">
                ログイン
              </button>
            </p>
          </form>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" />メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                  emailError ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'
                }`}
                placeholder="example@email.com"
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Lock className="inline w-4 h-4 mr-1" />パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                placeholder="パスワード"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || emailError}
              className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>

            <div className="flex justify-between text-sm">
              <button type="button" onClick={() => switchMode('signup')} className="text-orange-500 font-semibold">
                新規登録
              </button>
              <button type="button" onClick={() => switchMode('reset')} className="text-slate-600 hover:text-slate-800">
                パスワードを忘れた方
              </button>
            </div>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" />メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                  emailError ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'
                }`}
                placeholder="example@email.com"
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || emailError}
              className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? '送信中...' : 'リセットメールを送信'}
            </button>

            <p className="text-center text-sm text-slate-600">
              <button type="button" onClick={() => switchMode('login')} className="text-orange-500 font-semibold">
                ログインに戻る
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;