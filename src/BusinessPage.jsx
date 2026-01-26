import React, { useState } from 'react';
import { Shield, ArrowRight, ArrowLeft, CheckCircle2, Users, Building2, Calendar, Phone, Mail, MessageCircle } from 'lucide-react';

const BusinessPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employeeCount: '',
    desiredTiming: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Google Apps Scriptに送信（必要に応じてURLを変更）
    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbyrsQhMMwmwrtiSH1pnXaAwHmpisIA7vX3PPecYHrg2A9l9PyBl5uD0lFRVhBeOoIBn/exec'; // 法人用のスクリプトURLに変更
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSubmit.append(key, formData[key]);
      });
      formDataToSubmit.append('type', 'business_inquiry');
      
      // 実際の送信処理（コメントアウト中）
      // await fetch(scriptURL, { method: 'POST', body: formDataToSubmit });
      
      // デモ用の遅延
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      alert('送信に失敗しました。お手数ですが、お電話またはメールでお問い合わせください。');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-orange-50">
      
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">護己 -Shuki-</h1>
                <p className="text-xs text-orange-600 font-medium">法人向けサービス</p>
              </div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-600 hover:text-orange-600 transition">特徴</a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-orange-600 transition">料金</a>
            <a href="#flow" className="text-sm text-slate-600 hover:text-orange-600 transition">導入の流れ</a>
            <a href="#contact" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition shadow-lg shadow-orange-500/25">
              お問い合わせ
            </a>
          </nav>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 px-4 py-2 rounded-full mb-6">
              <Building2 className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-200">法人・団体様向け</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
              従業員の安全を守る<br />
              <span className="text-orange-400">防災備蓄サブスク</span>
            </h2>
            
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              備蓄品の選定から賞味期限管理、定期入替まで。<br />
              企業のBCP対策・福利厚生をワンストップでサポートします。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#contact" 
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold transition shadow-xl shadow-orange-500/30"
              >
                無料で見積もり相談
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 数字で見る実績 */}
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500">5年</div>
              <p className="text-sm text-slate-600">長期保存食品</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">3日分</div>
              <p className="text-sm text-slate-600">推奨備蓄量</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">0</div>
              <p className="text-sm text-slate-600">管理の手間</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">最大20%</div>
              <p className="text-sm text-slate-600">ボリュームディスカウント</p>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴・メリット */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              FEATURES
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
              法人導入の<span className="text-orange-500">メリット</span>
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🛡️',
                title: '従業員の安全確保',
                description: '災害時に必要な3日分の備蓄を従業員一人ひとりに。大切な従業員と、そのご家族の安心を守ります。'
              },
              {
                icon: '📋',
                title: 'BCP対策の強化',
                description: '事業継続計画（BCP）の重要項目である従業員の安全確保。防災備蓄の整備で、BCPの実効性を高めます。'
              },
              {
                icon: '❤️',
                title: '福利厚生として',
                description: '従業員への防災備蓄の提供は、会社からの安心のメッセージ。採用や定着にも効果的です。'
              },
              {
                icon: '📅',
                title: '期限管理の自動化',
                description: '賞味期限・使用期限の管理はすべてお任せ。期限が近づいたら自動で入替え。管理業務ゼロを実現。'
              },
              {
                icon: '💰',
                title: 'ボリュームディスカウント',
                description: '導入人数に応じた割引をご用意。まとめて導入するほど、お得にご利用いただけます。'
              },
              {
                icon: '📊',
                title: '管理者ダッシュボード',
                description: '従業員の備蓄状況を一括管理。部署ごとの導入状況や期限管理も、ひと目で確認できます。'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:border-orange-200 transition-all"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ベースセット内容 */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              CONTENTS
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
              ベースセット<span className="text-orange-500">内容</span>
            </h3>
            <p className="text-slate-600">防災士監修のもと、災害時に本当に必要なものを厳選</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: '💧', name: '保存水 500ml', qty: '2本' },
                { icon: '🚽', name: '簡易トイレ', qty: '10個' },
                { icon: '🔦', name: 'LEDライト', qty: '1個' },
                { icon: '🧣', name: 'アルミブランケット', qty: '1枚' },
                { icon: '😷', name: 'マスク', qty: '5枚' },
                { icon: '🧤', name: '軍手', qty: '1組' },
                { icon: '📯', name: 'ホイッスル', qty: '1個' },
                { icon: '🧴', name: '除菌シート', qty: '1パック' },
                { icon: '🧦', name: '圧縮靴下', qty: '1足' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🍙</span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">オプション：非常食セット</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    アルファ米、パン、羊羹など3日分の非常食を追加可能。アレルギー対応もご相談ください。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 料金プラン */}
      <section id="pricing" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              PRICING
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
              法人向け<span className="text-orange-500">料金プラン</span>
            </h3>
            <p className="text-slate-600">導入人数に応じたボリュームディスカウントをご用意</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: 'スモール',
                range: '〜10名',
                description: '小規模チーム向け',
                features: ['基本ベースセット', '期限管理・自動入替', '管理者画面', 'メールサポート'],
                popular: false
              },
              {
                name: 'ミディアム',
                range: '11〜50名',
                description: '中小企業向け',
                features: ['基本ベースセット', '期限管理・自動入替', '管理者画面', '電話サポート', 'ボリュームディスカウント'],
                popular: true
              },
              {
                name: 'ラージ',
                range: '51名〜',
                description: '大企業・複数拠点向け',
                features: ['基本ベースセット', '期限管理・自動入替', '管理者画面', '専任担当者', '最大ディスカウント', 'カスタマイズ対応'],
                popular: false
              }
            ].map((plan, index) => (
              <div 
                key={index}
                className={`relative rounded-2xl p-6 ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/25' 
                    : 'bg-slate-50 border-2 border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-orange-600 text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      人気プラン
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className={`text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-slate-800'}`}>
                    {plan.name}
                  </h4>
                  <p className={`text-3xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-800'}`}>
                    {plan.range}
                  </p>
                  <p className={`text-sm ${plan.popular ? 'text-orange-100' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-orange-200' : 'text-orange-500'}`} />
                      <span className={`text-sm ${plan.popular ? 'text-white' : 'text-slate-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <a 
                  href="#contact"
                  className={`block text-center py-3 px-6 rounded-full font-medium transition ${
                    plan.popular 
                      ? 'bg-white text-orange-600 hover:bg-orange-50' 
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  見積もりを依頼
                </a>
              </div>
            ))}
          </div>
          
          <div className="bg-slate-800 rounded-2xl p-6 text-center">
            <h4 className="text-xl font-bold text-white mb-2">
              料金は個別にお見積もり
            </h4>
            <p className="text-slate-300 text-sm">
              導入人数・オプション内容・ご予算に応じて、最適なプランをご提案いたします。
            </p>
          </div>
        </div>
      </section>

      {/* 導入の流れ */}
      <section id="flow" className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              FLOW
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
              ご導入の<span className="text-orange-500">流れ</span>
            </h3>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'お問い合わせ', description: 'フォームまたはお電話でご連絡' },
              { step: '02', title: 'ヒアリング', description: '導入人数・ご要望をお伺い' },
              { step: '03', title: 'ご契約', description: 'お見積もり確認後、ご契約' },
              { step: '04', title: 'お届け', description: '備蓄セットをお届け' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-orange-500/30">
                  {item.step}
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              FAQ
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800">
              よくある<span className="text-orange-500">ご質問</span>
            </h3>
          </div>
          
          <div className="space-y-4">
            {[
              { q: '最低導入人数はありますか？', a: '1名様からご導入いただけます。10名様以上でボリュームディスカウントが適用されます。' },
              { q: '契約期間はどのくらいですか？', a: '年間契約となります。賞味期限管理・自動入替サービスは継続利用で効果を発揮します。' },
              { q: '既存の備蓄品がある場合は？', a: '既存備蓄の期限管理のみのプランもご用意しています。お気軽にご相談ください。' },
              { q: '支払い方法は？', a: '請求書払い（銀行振込）に対応。お支払いサイトについてもご相談ください。' },
              { q: '備蓄品の届け先は？', a: 'オフィスへの一括配送、または従業員様のご自宅への個別配送をお選びいただけます。' },
            ].map((faq, index) => (
              <details key={index} className="group bg-slate-50 rounded-xl border border-slate-100">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-medium text-slate-800 pr-4 text-sm sm:text-base">{faq.q}</span>
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-slate-600 text-sm">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* お問い合わせフォーム */}
      <section id="contact" className="py-16 px-4 bg-gradient-to-b from-slate-50 to-orange-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-orange-100 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              CONTACT
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
              お問い合わせ・<span className="text-orange-500">お見積もり</span>
            </h3>
            <p className="text-slate-600 text-sm">
              担当者より2営業日以内にご連絡いたします
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="text-2xl font-bold text-slate-800 mb-2">お問い合わせありがとうございます</h4>
                <p className="text-slate-600">
                  担当者より2営業日以内にご連絡いたします。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      会社名 <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="株式会社〇〇"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ご担当者名 <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="山田 太郎"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      メールアドレス <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="example@company.co.jp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="03-1234-5678"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      従業員数 <span className="text-orange-500">*</span>
                    </label>
                    <select
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">選択してください</option>
                      <option value="1-10">1〜10名</option>
                      <option value="11-30">11〜30名</option>
                      <option value="31-50">31〜50名</option>
                      <option value="51-100">51〜100名</option>
                      <option value="101-300">101〜300名</option>
                      <option value="301+">301名以上</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      導入希望時期
                    </label>
                    <select
                      name="desiredTiming"
                      value={formData.desiredTiming}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">選択してください</option>
                      <option value="asap">できるだけ早く</option>
                      <option value="1month">1ヶ月以内</option>
                      <option value="3months">3ヶ月以内</option>
                      <option value="6months">6ヶ月以内</option>
                      <option value="undecided">未定・情報収集</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ご要望・ご質問
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="ご要望やご質問があればお書きください"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-4 px-8 rounded-full font-bold transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      送信中...
                    </>
                  ) : (
                    <>
                      無料で見積もりを依頼する
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          
          {/* 連絡先カード */}
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <a href="tel:080-4249-1240" className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 hover:border-orange-300 transition">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">お電話</p>
                <p className="font-medium text-slate-800 text-sm">080-4249-1240</p>
              </div>
            </a>
            
            <a href="mailto:shukipanibo@gmail.com" className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 hover:border-orange-300 transition">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">メール</p>
                <p className="font-medium text-slate-800 text-xs">shukipanibo@gmail.com</p>
              </div>
            </a>
            
            <a href="https://lin.ee/v0KcwPS" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 hover:border-green-300 transition">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">LINE</p>
                <p className="font-medium text-slate-800 text-sm">公式LINE</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-slate-800 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="font-bold">護己 -Shuki-</h4>
                  <p className="text-xs text-slate-400">法人向けサービス</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                日常に溶け込む、あなただけの防災。
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">サービス</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={onBack} className="hover:text-orange-400 transition">個人向けサービス</button></li>
                <li><a href="#features" className="hover:text-orange-400 transition">法人向け特徴</a></li>
                <li><a href="#pricing" className="hover:text-orange-400 transition">料金プラン</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">会社情報</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>合同会社護己</li>
                <li>代表：竹内 啓介</li>
                <li>TEL：080-4249-1240</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
            <p>© 2024 合同会社護己 All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BusinessPage;
