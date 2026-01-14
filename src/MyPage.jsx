import React, { useState, useEffect } from 'react';
import { User, LogOut, Package, Calendar, Mail, Phone, Home, CreditCard, MapPin, AlertTriangle, X, Edit2, Check } from 'lucide-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const MyPage = ({ user, userDiagnoses, onLogout, onViewDiagnosis, onBackToHome }) => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState({
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
    phone: ''
  });

  // サブスクリプション情報を取得
  useEffect(() => {
    if (user && userDiagnoses.length > 0) {
      loadSubscriptionInfo();
    }
  }, [user, userDiagnoses]);

  const loadSubscriptionInfo = async () => {
    try {
      // 最新の診断からサブスク情報を取得
      const latestDiagnosis = userDiagnoses[0];
      const docRef = doc(db, 'diagnoses', latestDiagnosis.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSubscriptionInfo({
          status: data.subscriptionStatus || 'pending',
          customerId: data.stripeCustomerId || null,
          subscriptionId: data.stripeSubscriptionId || null,
          startDate: data.subscriptionStartDate || data.timestamp,
          nextBillingDate: data.nextBillingDate || null,
          shippingAddress: data.shippingAddress || null
        });
        
        // 住所が既にある場合は編集フォームにセット
        if (data.shippingAddress) {
          setEditingAddress(data.shippingAddress);
        }
      }
    } catch (error) {
      console.error('サブスク情報の取得に失敗:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: '審査中', color: 'bg-yellow-100 text-yellow-800' },
      active: { text: '契約中', color: 'bg-green-100 text-green-800' },
      paid: { text: '支払い済み', color: 'bg-green-100 text-green-800' },
      shipped: { text: '発送済み', color: 'bg-blue-100 text-blue-800' },
      cancelled: { text: 'キャンセル済み', color: 'bg-gray-100 text-gray-800' }
    };
    return badges[status] || badges.pending;
  };

  const getSubscriptionStatusBadge = (status) => {
    const badges = {
      pending: { text: '契約準備中', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      active: { text: '契約中', color: 'bg-green-100 text-green-800', icon: '✓' },
      cancelled: { text: '解約済み', color: 'bg-red-100 text-red-800', icon: '✕' }
    };
    return badges[status] || badges.pending;
  };

  // 解約処理
  const handleCancelSubscription = async () => {
    if (!user || !userDiagnoses.length) return;
    
    setLoading(true);
    try {
      const latestDiagnosis = userDiagnoses[0];
      const docRef = doc(db, 'diagnoses', latestDiagnosis.id);
      
      await updateDoc(docRef, {
        subscriptionStatus: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: user.email
      });
      
      alert('サブスクリプションの解約申請を受け付けました。\n担当者より確認のご連絡をさせていただきます。');
      setShowCancelModal(false);
      await loadSubscriptionInfo();
    } catch (error) {
      console.error('解約処理に失敗:', error);
      alert('解約処理に失敗しました。お手数ですが、サポートまでお問い合わせください。');
    } finally {
      setLoading(false);
    }
  };

  // 配送先住所の更新
  const handleUpdateAddress = async () => {
    if (!user || !userDiagnoses.length) return;
    
    // バリデーション
    if (!editingAddress.postalCode || !editingAddress.prefecture || !editingAddress.city || !editingAddress.address) {
      alert('必須項目をすべて入力してください。');
      return;
    }
    
    setLoading(true);
    try {
      const latestDiagnosis = userDiagnoses[0];
      const docRef = doc(db, 'diagnoses', latestDiagnosis.id);
      
      await updateDoc(docRef, {
        shippingAddress: editingAddress,
        addressUpdatedAt: new Date()
      });
      
      alert('配送先住所を更新しました。');
      setShowAddressModal(false);
      await loadSubscriptionInfo();
    } catch (error) {
      console.error('住所更新に失敗:', error);
      alert('住所の更新に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  // 診断詳細ビュー
  if (selectedDiagnosis) {
    const diagnosis = selectedDiagnosis;
    const statusBadge = getStatusBadge(diagnosis.status);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <button
              onClick={() => setSelectedDiagnosis(null)}
              className="text-slate-600 hover:text-slate-800 mb-4"
            >
              ← 診断履歴に戻る
            </button>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">診断詳細</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                {statusBadge.text}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">{formatDate(diagnosis.timestamp)}</p>
          </div>

          {/* 料金情報 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">料金情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-slate-600">初回費用</p>
                <p className="text-2xl font-bold text-orange-600">¥{diagnosis.initialCost?.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-slate-600">年会費</p>
                <p className="text-2xl font-bold text-blue-600">¥{diagnosis.annualCost?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* 診断内容 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">診断内容</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-600">お名前</p>
                  <p className="font-medium text-slate-800">{diagnosis.userName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-600">メールアドレス</p>
                  <p className="font-medium text-slate-800">{diagnosis.userEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-600">電話番号</p>
                  <p className="font-medium text-slate-800">{diagnosis.formData?.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="text-sm text-slate-600">住環境</p>
                  <p className="font-medium text-slate-800">{diagnosis.formData?.livingEnvironment}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 選定商品 */}
          {diagnosis.result?.boxes && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">選定商品</h2>
              {diagnosis.result.boxes.map((box, idx) => (
                <div key={idx} className="mb-6 pb-6 border-b border-slate-200 last:border-0">
                  <h3 className="font-bold text-slate-800 mb-3">{box.personLabel || '本人'}</h3>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-600 mb-2">基本セット</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {box.baseItems?.map((item, i) => (
                        <div key={i} className="text-sm text-slate-700 bg-slate-50 p-2 rounded">
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">パーソナライズ食品</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {box.recommendedItems?.map((item, i) => (
                        <div key={i} className="text-sm text-slate-700 bg-orange-50 p-2 rounded">
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // メインビュー
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">マイページ</h1>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onBackToHome}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
              >
                ホームに戻る
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                ログアウト
              </button>
            </div>
          </div>
        </div>

        {/* サブスクリプション情報 */}
        {subscriptionInfo && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              サブスクリプション状況
            </h2>
            
            <div className="space-y-4">
              {/* ステータス */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getSubscriptionStatusBadge(subscriptionInfo.status).icon}</span>
                  <div>
                    <p className="text-sm text-slate-600">契約状態</p>
                    <p className="font-bold text-slate-800">{getSubscriptionStatusBadge(subscriptionInfo.status).text}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionStatusBadge(subscriptionInfo.status).color}`}>
                  {getSubscriptionStatusBadge(subscriptionInfo.status).text}
                </span>
              </div>

              {/* 契約開始日 */}
              {subscriptionInfo.startDate && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-600">契約開始日</p>
                    <p className="font-medium text-slate-800">{formatDate(subscriptionInfo.startDate)}</p>
                  </div>
                </div>
              )}

              {/* 次回更新日 */}
              {subscriptionInfo.nextBillingDate && subscriptionInfo.status === 'active' && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-slate-600">次回更新日</p>
                    <p className="font-bold text-blue-600">{formatDate(subscriptionInfo.nextBillingDate)}</p>
                  </div>
                </div>
              )}

              {/* 配送先住所 */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    配送先住所
                  </h3>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-all flex items-center gap-1 text-sm"
                  >
                    <Edit2 className="w-3 h-3" />
                    {subscriptionInfo.shippingAddress ? '変更' : '登録'}
                  </button>
                </div>
                
                {subscriptionInfo.shippingAddress ? (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-700">
                      〒{subscriptionInfo.shippingAddress.postalCode}<br />
                      {subscriptionInfo.shippingAddress.prefecture}
                      {subscriptionInfo.shippingAddress.city}
                      {subscriptionInfo.shippingAddress.address}<br />
                      {subscriptionInfo.shippingAddress.building && `${subscriptionInfo.shippingAddress.building}`}
                    </p>
                    {subscriptionInfo.shippingAddress.phone && (
                      <p className="text-sm text-slate-600 mt-2">
                        TEL: {subscriptionInfo.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">配送先住所が登録されていません</p>
                  </div>
                )}
              </div>

              {/* 解約ボタン */}
              {(subscriptionInfo.status === 'active' || subscriptionInfo.status === 'pending') && (
                <div className="border-t border-slate-200 pt-4">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium"
                  >
                    サブスクリプションを解約する
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 診断履歴 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            診断履歴
          </h2>
          
          {userDiagnoses.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">診断履歴がありません</p>
              <button
                onClick={onBackToHome}
                className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
              >
                診断を始める
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userDiagnoses.map((diagnosis) => {
                const statusBadge = getStatusBadge(diagnosis.status);
                return (
                  <div
                    key={diagnosis.id}
                    onClick={() => setSelectedDiagnosis(diagnosis)}
                    className="p-4 border border-slate-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <p className="text-sm text-slate-600">{formatDate(diagnosis.timestamp)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800">{diagnosis.userName}</p>
                        <p className="text-sm text-slate-500">初回: ¥{diagnosis.initialCost?.toLocaleString()} / 年会費: ¥{diagnosis.annualCost?.toLocaleString()}</p>
                      </div>
                      <span className="text-orange-500 text-sm">詳細を見る →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 解約確認モーダル */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                解約確認
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-700 mb-4">
                サブスクリプションを解約すると、次回の商品配送は行われません。
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ 解約申請後、担当者より確認のご連絡をさせていただきます。
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
                disabled={loading}
              >
                キャンセル
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
                disabled={loading}
              >
                {loading ? '処理中...' : '解約する'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 配送先住所変更モーダル */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-orange-500" />
                配送先住所の{subscriptionInfo?.shippingAddress ? '変更' : '登録'}
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {/* 郵便番号 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  郵便番号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingAddress.postalCode}
                  onChange={(e) => setEditingAddress({...editingAddress, postalCode: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="123-4567"
                />
              </div>

              {/* 都道府県 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  都道府県 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingAddress.prefecture}
                  onChange={(e) => setEditingAddress({...editingAddress, prefecture: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="東京都"
                />
              </div>

              {/* 市区町村 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  市区町村 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingAddress.city}
                  onChange={(e) => setEditingAddress({...editingAddress, city: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="渋谷区"
                />
              </div>

              {/* 番地 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  番地 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingAddress.address}
                  onChange={(e) => setEditingAddress({...editingAddress, address: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="1-2-3"
                />
              </div>

              {/* 建物名・部屋番号 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  建物名・部屋番号
                </label>
                <input
                  type="text"
                  value={editingAddress.building}
                  onChange={(e) => setEditingAddress({...editingAddress, building: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="〇〇マンション101号室"
                />
              </div>

              {/* 電話番号 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  電話番号
                </label>
                <input
                  type="tel"
                  value={editingAddress.phone}
                  onChange={(e) => setEditingAddress({...editingAddress, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  placeholder="090-1234-5678"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
                disabled={loading}
              >
                キャンセル
              </button>
              <button
                onClick={handleUpdateAddress}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-medium flex items-center justify-center gap-2"
                disabled={loading}
              >
                <Check className="w-4 h-4" />
                {loading ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;