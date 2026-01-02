import React, { useState, useEffect } from 'react';
import { User, LogOut, Package, Calendar, Mail, Phone, Home } from 'lucide-react';

const MyPage = ({ user, userDiagnoses, onLogout, onViewDiagnosis, onBackToHome }) => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

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
      paid: { text: '支払い済み', color: 'bg-green-100 text-green-800' },
      shipped: { text: '発送済み', color: 'bg-blue-100 text-blue-800' },
      cancelled: { text: 'キャンセル', color: 'bg-gray-100 text-gray-800' }
    };
    return badges[status] || badges.pending;
  };

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

          {/* 診断結果 */}
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
                      {box.personalizedFoods?.map((item, i) => (
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
    </div>
  );
};

export default MyPage;
