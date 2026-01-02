import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      onSuccess(userCredential.user);
      onClose();
    } catch (err) {
      setError('会員登録に失敗しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onSuccess(userCredential.user);
      onClose();
    } catch (err) {
      setError('ログインに失敗しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      setError('パスワードリセットに失敗しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">
          {mode === 'login' && 'ログイン'}
          {mode === 'signup' && '会員登録'}
          {mode === 'reset' && 'パスワードリセット'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            パスワードリセットのメールを送信しました。メールをご確認ください。
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                placeholder="example@email.com"
                required
              />
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
                placeholder="6文字以上"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all disabled:bg-slate-300"
            >
              {loading ? '登録中...' : '会員登録'}
            </button>

            <p className="text-center text-sm text-slate-600">
              すでにアカウントをお持ちですか？{' '}
              <button type="button" onClick={() => setMode('login')} className="text-orange-500 font-semibold">
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                placeholder="example@email.com"
                required
              />
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
              disabled={loading}
              className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all disabled:bg-slate-300"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>

            <div className="flex justify-between text-sm">
              <button type="button" onClick={() => setMode('signup')} className="text-orange-500 font-semibold">
                新規登録
              </button>
              <button type="button" onClick={() => setMode('reset')} className="text-slate-600 hover:text-slate-800">
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                placeholder="example@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all disabled:bg-slate-300"
            >
              {loading ? '送信中...' : 'リセットメールを送信'}
            </button>

            <p className="text-center text-sm text-slate-600">
              <button type="button" onClick={() => setMode('login')} className="text-orange-500 font-semibold">
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
