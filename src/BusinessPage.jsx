import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, ArrowLeft, CheckCircle2, Users, Building2, Calendar, Phone, Mail, MessageCircle, ChevronDown, Sparkles, Target, TrendingUp, Award, Clock, Heart, Zap } from 'lucide-react';

const BusinessPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employeeCount: '',
    desiredTiming: '',
    message: '',
    privacyAgreed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbyrsQhMMwmwrtiSH1pnXaAwHmpisIA7vX3PPecYHrg2A9l9PyBl5uD0lFRVhBeOoIBn/exec';
      
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('companyName', formData.companyName);
      formDataToSubmit.append('contactName', formData.contactName);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('phone', formData.phone);
      formDataToSubmit.append('employeeCount', formData.employeeCount);
      formDataToSubmit.append('desiredTiming', formData.desiredTiming);
      formDataToSubmit.append('message', formData.message);
      formDataToSubmit.append('type', 'business_inquiry');
      
      await fetch(scriptURL, { 
        method: 'POST', 
        body: formDataToSubmit,
        mode: 'no-cors'
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      alert('送信に失敗しました。お手数ですが、お電話またはメールでお問い合わせください。');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50">
      
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-orange-100 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 bg-gradient-to-br from-slate-800 to-slate-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">護己 -Shuki-</h1>
                <p className="text-sm text-orange-600 font-semibold">法人向けサービス</p>
              </div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-5">
            <a href="#features" className="text-base text-slate-600 hover:text-orange-600 transition font-medium">特徴</a>
            <a href="#pricing" className="text-base text-slate-600 hover:text-orange-600 transition font-medium">料金</a>
            <a href="#contact" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-full text-base font-bold transition shadow-lg shadow-orange-500/30">
              お問い合わせ
            </a>
          </nav>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-orange-300/10 rounded-full blur-3xl" />
        
        <div className={`max-w-6xl mx-auto relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/30 to-orange-600/30 border-2 border-orange-400/40 px-5 py-2 rounded-full mb-6 shadow-lg shadow-orange-500/20">
              <Building2 className="w-5 h-5 text-orange-300" />
              <span className="text-sm font-bold text-orange-100">法人・団体様向けプラン</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
              従業員の安全を守る<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">防災備蓄サブスク</span>
            </h2>
            
            <p className="text-xl text-slate-200 mb-8 leading-relaxed font-medium">
              備蓄品の選定から賞味期限管理、定期入替まで。<br />
              企業のBCP対策・福利厚生をワンストップでサポート。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a 
                href="#contact" 
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-bold transition shadow-2xl shadow-orange-500/40 text-lg"
              >
                無料で見積もり相談
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="tel:080-4249-1240"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold transition shadow-xl text-lg"
              >
                <Phone className="w-5 h-5" />
                080-4249-1240
              </a>
            </div>

            {/* 数字で見る実績 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t-2 border-white/20">
              {[
                { num: '5年', label: '長期保存食品', icon: '📦' },
                { num: '3日分', label: '推奨備蓄量', icon: '🛡️' },
                { num: '0', label: '管理の手間', icon: '✨' },
                { num: '最大20%', label: 'ボリューム割引', icon: '💰' }
              ].map((item, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition">
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <div className="text-3xl font-bold text-orange-300 mb-1">{item.num}</div>
                  <p className="text-sm text-slate-200 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* スクロール誘導 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* 選ばれる理由（大きく目立つ） */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <Award className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-bold text-orange-600">WHY CHOOSE US</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              護己が<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">選ばれる理由</span>
            </h3>
            <p className="text-lg text-slate-600">安心と信頼の3つのポイント</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: '防災士監修',
                description: '防災のプロが監修した、災害時に本当に必要なものだけを厳選してお届けします',
                gradient: 'from-blue-500 to-blue-600',
                bg: 'bg-blue-50'
              },
              {
                icon: Clock,
                title: '管理業務ゼロ',
                description: '期限管理・入替作業すべて自動。担当者の負担を大幅に軽減します',
                gradient: 'from-green-500 to-green-600',
                bg: 'bg-green-50'
              },
              {
                icon: Heart,
                title: '柔軟なカスタマイズ',
                description: '企業規模や業種、ご予算に応じた最適なプランをご提案します',
                gradient: 'from-orange-500 to-orange-600',
                bg: 'bg-orange-50'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={`${item.bg} rounded-2xl p-8 border-2 border-slate-200 hover:border-orange-300 hover:shadow-2xl transition-all transform hover:-translate-y-1`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="w-9 h-9 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h4>
                  <p className="text-base text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 特徴・メリット */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-bold text-orange-600">FEATURES</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              法人導入の<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">メリット</span>
            </h3>
            <p className="text-lg text-slate-600">企業価値を高める6つの特徴</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '🛡️',
                title: '従業員の安全確保',
                description: '災害時に必要な3日分の備蓄を従業員一人ひとりに。大切な従業員と、そのご家族の安心を守ります。',
                color: 'orange'
              },
              {
                icon: '📋',
                title: 'BCP対策の強化',
                description: '事業継続計画（BCP）の重要項目である従業員の安全確保。防災備蓄の整備で、BCPの実効性を高めます。',
                color: 'blue'
              },
              {
                icon: '❤️',
                title: '福利厚生として',
                description: '従業員への防災備蓄の提供は、会社からの安心のメッセージ。採用や定着にも効果的です。',
                color: 'red'
              },
              {
                icon: '📅',
                title: '期限管理の自動化',
                description: '賞味期限・使用期限の管理はすべてお任せ。期限が近づいたら自動で入替え。管理業務ゼロを実現。',
                color: 'green'
              },
              {
                icon: '💰',
                title: 'ボリュームディスカウント',
                description: '導入人数に応じた割引をご用意。まとめて導入するほど、お得にご利用いただけます。',
                color: 'purple'
              },
              {
                icon: '📊',
                title: '管理者ダッシュボード',
                description: '従業員の備蓄状況を一括管理。部署ごとの導入状況や期限管理も、ひと目で確認できます。',
                color: 'indigo'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-7 border-2 border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h4>
                    <p className="text-base text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 業種別メリット */}
      <section className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <Building2 className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-bold text-orange-600">USE CASE</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              業種別<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">活用例</span>
            </h3>
            <p className="text-lg text-slate-600">様々な業種で導入いただけます</p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { industry: 'IT・通信業', icon: '💻', benefit: 'リモートワーク中心でも在宅備蓄で安心', gradient: 'from-blue-500 to-blue-600' },
              { industry: '製造業', icon: '🏭', benefit: '複数拠点の備蓄を一元管理', gradient: 'from-gray-600 to-gray-700' },
              { industry: '小売・サービス業', icon: '🏪', benefit: '各店舗スタッフの安全確保', gradient: 'from-green-500 to-green-600' },
              { industry: '医療・福祉', icon: '🏥', benefit: '24時間体制の職員を守る', gradient: 'from-red-500 to-red-600' },
              { industry: '建設・不動産', icon: '🏗️', benefit: '現場ごとの備蓄管理を効率化', gradient: 'from-yellow-600 to-orange-600' },
              { industry: '教育機関', icon: '🎓', benefit: '職員・学生の安全対策', gradient: 'from-purple-500 to-purple-600' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{item.industry}</h4>
                <p className="text-base text-slate-600 leading-relaxed">{item.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ベースセット内容 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-bold text-orange-600">CONTENTS</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              ベースセット<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">内容</span>
            </h3>
            <p className="text-lg text-slate-600">防災士監修のもと厳選したアイテム</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* 左カラム：セット内容 */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-xl border-2 border-slate-200">
              <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                基本セット内容
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '💧', name: '保存水', qty: '500ml×2本' },
                  { icon: '🚽', name: '簡易トイレ', qty: '10回分' },
                  { icon: '🔦', name: 'LEDライト', qty: '1個' },
                  { icon: '🧣', name: 'ブランケット', qty: '1枚' },
                  { icon: '😷', name: 'マスク', qty: '5枚入り' },
                  { icon: '🧤', name: '軍手', qty: '1組' },
                  { icon: '📯', name: 'ホイッスル', qty: '1個' },
                  { icon: '🧴', name: '除菌シート', qty: '1パック' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="font-bold text-slate-800 text-base">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右カラム：オプション */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 rounded-2xl p-8 border-2 border-orange-300 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">🍙</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">非常食セット</h4>
                    <p className="text-base text-slate-700 mb-4 leading-relaxed">
                      アルファ米、パン、羊羹など<br />
                      <span className="font-bold text-orange-600">3日分の非常食</span>を追加可能
                    </p>
                    <div className="inline-block bg-white px-4 py-2 rounded-full shadow-md">
                      <span className="text-sm font-bold text-orange-600">オプション追加可能</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border-2 border-slate-200 shadow-xl">
                <h4 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  カスタマイズ対応
                </h4>
                <ul className="space-y-3">
                  {[
                    'アレルギー対応食品',
                    '女性向けアイテム追加',
                    '乳幼児向けセット',
                    '医療・介護用品'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-base text-slate-700">
                      <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 料金プラン */}
      <section id="pricing" className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-bold text-orange-600">PRICING</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              法人向け<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">料金プラン</span>
            </h3>
            <p className="text-lg text-slate-600">導入人数に応じたボリューム割引をご用意</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: 'スモール',
                range: '〜10名',
                description: '小規模チーム向け',
                features: ['基本ベースセット', '期限管理・自動入替', '管理者画面', 'メールサポート'],
                popular: false,
                gradient: 'from-slate-600 to-slate-700'
              },
              {
                name: 'ミディアム',
                range: '11〜50名',
                description: '中小企業向け',
                features: ['基本ベースセット', '期限管理・自動入替', '管理者画面', '電話サポート', 'ボリュームディスカウント'],
                popular: true,
                gradient: 'from-orange-500 to-orange-600'
              },
              {
                name: 'ラージ',
                range: '51名〜',
                description: '大企業・複数拠点向け',
                features: ['基本ベースセット', '期限管理・自動入替', '管理者画面', '専任担当者', '最大ディスカウント', 'カスタマイズ対応'],
                popular: false,
                gradient: 'from-blue-600 to-blue-700'
              }
            ].map((plan, index) => (
              <div 
                key={index}
                className={`relative rounded-2xl p-7 border-2 transition-all transform hover:-translate-y-2 ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/40 border-orange-400 scale-105' 
                    : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-800 text-sm font-bold px-5 py-2 rounded-full shadow-lg">
                      ⭐ 人気プラン
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-800'}`}>
                    {plan.name}
                  </h4>
                  <p className={`text-4xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-800'}`}>
                    {plan.range}
                  </p>
                  <p className={`text-base ${plan.popular ? 'text-orange-100' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${plan.popular ? 'text-orange-200' : 'text-orange-500'}`} />
                      <span className={`text-base ${plan.popular ? 'text-white font-medium' : 'text-slate-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <a 
                  href="#contact"
                  className={`block text-center py-4 px-6 rounded-full font-bold transition text-base shadow-lg ${
                    plan.popular 
                      ? 'bg-white text-orange-600 hover:bg-orange-50 shadow-orange-900/30' 
                      : 'bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:from-slate-700 hover:to-slate-600'
                  }`}
                >
                  見積もりを依頼する
                </a>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-8 text-center shadow-2xl border-2 border-slate-600">
            <h4 className="text-2xl font-bold text-white mb-3">
              💡 料金は個別にお見積もり
            </h4>
            <p className="text-lg text-slate-200">
              導入人数・オプション内容・ご予算に応じて、<br className="hidden sm:block" />
              最適なプランをご提案いたします
            </p>
          </div>
        </div>
      </section>

      {/* 導入の流れ＋FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* 導入の流れ */}
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
                <ArrowRight className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-bold text-orange-600">FLOW</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">
                ご導入の<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">流れ</span>
              </h3>
            </div>
            
            <div className="space-y-4">
              {[
                { step: '01', title: 'お問い合わせ', description: 'フォーム・お電話でご連絡ください', icon: '📞' },
                { step: '02', title: 'ヒアリング', description: '導入人数・ご要望を詳しくお伺いします', icon: '💬' },
                { step: '03', title: 'ご契約', description: 'お見積もり確認後、ご契約手続き', icon: '📝' },
                { step: '04', title: 'お届け', description: '備蓄セットをお届けします', icon: '📦' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-5 bg-gradient-to-r from-slate-50 to-white p-5 rounded-xl border-2 border-slate-200 hover:border-orange-300 hover:shadow-lg transition">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h4>
                    <p className="text-base text-slate-600">{item.description}</p>
                  </div>
                  <div className="text-3xl">{item.icon}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
                <MessageCircle className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-bold text-orange-600">FAQ</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">
                よくある<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">質問</span>
              </h3>
            </div>
            
            <div className="space-y-4">
              {[
                { q: '最低導入人数はありますか？', a: '1名様からご導入いただけます。10名様以上でボリュームディスカウントが適用されます。' },
                { q: '契約期間はどのくらいですか？', a: '年間契約となります。賞味期限管理・自動入替サービスは継続利用で効果を発揮します。' },
                { q: '既存の備蓄品がある場合は？', a: '既存備蓄の期限管理のみのプランもございます。お気軽にご相談ください。' },
                { q: '支払い方法は？', a: '請求書払い（銀行振込）に対応しております。お支払いサイトについてもご相談ください。' },
              ].map((faq, index) => (
                <details key={index} className="group bg-gradient-to-r from-slate-50 to-white rounded-xl border-2 border-slate-200 hover:border-orange-300 transition">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <span className="font-bold text-slate-800 text-base pr-4">{faq.q}</span>
                    <svg className="w-6 h-6 text-orange-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-slate-600 text-base leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/30 to-orange-600/30 border-2 border-orange-400/40 px-5 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-orange-300" />
            <span className="text-sm font-bold text-orange-100">まずは無料相談から</span>
          </div>
          
          <h3 className="text-3xl sm:text-4xl font-bold mb-4 drop-shadow-lg">
            御社に最適なプランを<br className="sm:hidden" />ご提案します
          </h3>
          <p className="text-xl text-slate-200 mb-8 font-medium">
            専任担当者が丁寧にヒアリング。<br />
            お気軽にお問い合わせください。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-bold transition shadow-2xl text-lg"
            >
              <Mail className="w-5 h-5" />
              お問い合わせフォーム
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="tel:080-4249-1240"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 px-8 py-4 rounded-full font-bold transition shadow-2xl text-lg"
            >
              <Phone className="w-5 h-5" />
              080-4249-1240
            </a>
          </div>
        </div>
      </section>

      {/* お問い合わせフォーム */}
      <section id="contact" className="py-16 px-4 bg-gradient-to-b from-orange-50 via-white to-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <Mail className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-bold text-orange-600">CONTACT</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
              お問い合わせ・<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">お見積もり</span>
            </h3>
            <p className="text-lg text-slate-600">
              担当者より<span className="font-bold text-orange-600">2営業日以内</span>にご連絡いたします
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl border-2 border-slate-200">
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-3xl font-bold text-slate-800 mb-3">お問い合わせありがとうございます</h4>
                <p className="text-lg text-slate-600">
                  担当者より2営業日以内にご連絡いたします。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base font-bold text-slate-700 mb-2">
                      会社名 <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                      placeholder="株式会社〇〇"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-slate-700 mb-2">
                      ご担当者名 <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                      placeholder="山田 太郎"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base font-bold text-slate-700 mb-2">
                      メールアドレス <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                      placeholder="example@company.co.jp"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-slate-700 mb-2">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                      placeholder="03-1234-5678"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base font-bold text-slate-700 mb-2">
                      従業員数 <span className="text-orange-500">*</span>
                    </label>
                    <select
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
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
                    <label className="block text-base font-bold text-slate-700 mb-2">
                      導入希望時期
                    </label>
                    <select
                      name="desiredTiming"
                      value={formData.desiredTiming}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
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
                  <label className="block text-base font-bold text-slate-700 mb-2">
                    ご要望・ご質問
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-base"
                    placeholder="ご要望やご質問があればお書きください"
                  />
                </div>
                
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="privacyAgreed"
                    name="privacyAgreed"
                    checked={formData.privacyAgreed}
                    onChange={handleChange}
                    required
                    className="mt-1 w-5 h-5 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="privacyAgreed" className="text-sm text-slate-700">
                    個人情報の取り扱いについて同意します
                    <span className="text-orange-500 font-bold"> *</span>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white py-5 px-8 rounded-full font-bold transition shadow-2xl shadow-orange-500/40 flex items-center justify-center gap-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
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
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <a href="tel:080-4249-1240" className="flex items-center gap-4 bg-gradient-to-br from-orange-50 to-white p-5 rounded-xl border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">お電話</p>
                <p className="font-bold text-slate-800 text-base">080-4249-1240</p>
              </div>
            </a>
            
            <a href="mailto:shukipanibo@gmail.com" className="flex items-center gap-4 bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">メール</p>
                <p className="font-bold text-slate-800 text-xs break-all">shukipanibo@gmail.com</p>
              </div>
            </a>
            
            <a href="https://lin.ee/v0KcwPS" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">LINE</p>
                <p className="font-bold text-slate-800 text-base">公式LINE</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12 px-4 border-t-4 border-orange-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">護己 -Shuki-</h4>
                  <p className="text-sm text-slate-400">法人向けサービス</p>
                </div>
              </div>
              <p className="text-slate-300 text-base">
                日常に溶け込む、あなただけの防災。
              </p>
            </div>
            
            <div>
              <h5 className="font-bold text-base mb-3">サービス</h5>
              <ul className="space-y-2 text-base text-slate-300">
                <li><button onClick={onBack} className="hover:text-orange-400 transition">個人向けサービス</button></li>
                <li><a href="#features" className="hover:text-orange-400 transition">法人向け特徴</a></li>
                <li><a href="#pricing" className="hover:text-orange-400 transition">料金プラン</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold text-base mb-3">会社情報</h5>
              <ul className="space-y-2 text-base text-slate-300">
                <li>合同会社護己</li>
                <li>代表：竹内 啓介</li>
                <li>TEL：080-4249-1240</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
            <p>© 2024 合同会社護己 All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BusinessPage;