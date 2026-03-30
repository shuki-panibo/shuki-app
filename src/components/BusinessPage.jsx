
import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, ArrowLeft, CheckCircle2, Users, Building2, Calendar, Phone, Mail, MessageCircle, ChevronDown, Sparkles, Target, TrendingUp, Award, Clock, Heart, Zap, AlertTriangle, UserCheck, FileCheck, BarChart3, RefreshCw, Package, Bell } from 'lucide-react';

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
      
      {/* ヘッダー - ロゴを画像に変更 */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-orange-100 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            {/* ロゴ画像を使用（publicフォルダに配置想定） */}
            <a href="#" className="flex items-center">
              <img 
                src="/public/rogo2.png" 
                alt="護己 -shuki-" 
                className="h-12 w-auto"
              />
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-5">
            <a href="#solution" className="text-base text-slate-600 hover:text-orange-600 transition font-medium">サービス</a>
            <a href="#benefits" className="text-base text-slate-600 hover:text-orange-600 transition font-medium">導入効果</a>
            <a href="#pricing" className="text-base text-slate-600 hover:text-orange-600 transition font-medium">料金</a>
            <a href="#contact" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-full text-base font-bold transition shadow-lg shadow-orange-500/30">
              お問い合わせ
            </a>
          </nav>
        </div>
      </header>

      {/* ===== セクション1: ヒーロー（FV）- 中央揃えに変更 ===== */}
      <section className="pt-28 pb-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-orange-400/10 rounded-full blur-3xl" />
        
        <div className={`max-w-5xl mx-auto relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* 中央揃えに変更 */}
          <div className="text-center">
            {/* バッジ */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/30 to-orange-600/30 border border-orange-400/40 px-4 py-2 rounded-full shadow-lg">
                <Zap className="w-4 h-4 text-orange-300" />
                <span className="text-sm font-bold text-orange-100">管理工数ゼロ</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/40 px-4 py-2 rounded-full shadow-lg">
                <Bell className="w-4 h-4 text-blue-300" />
                <span className="text-sm font-bold text-blue-100">入替時期通知</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/30 to-green-600/30 border border-green-400/40 px-4 py-2 rounded-full shadow-lg">
                <UserCheck className="w-4 h-4 text-green-300" />
                <span className="text-sm font-bold text-green-100">AIパーソナライズ</span>
              </div>
            </div>
            
            {/* メインコピー */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
              届いた瞬間、<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-300">防災管理は終了。</span>
            </h2>
            
            <p className="text-xl sm:text-2xl text-slate-200 mb-10 leading-relaxed font-medium max-w-3xl mx-auto">
              AIパーソナライズ × 期限管理で、<br />
              総務の"見えない業務"をゼロにするBCP管理クラウド
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
              <a 
                href="#contact" 
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-full font-bold transition shadow-2xl shadow-orange-500/40 text-lg"
              >
                無料で導入相談する
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="tel:080-4249-1240"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-full font-bold transition shadow-xl text-lg"
              >
                <Phone className="w-5 h-5" />
                080-4249-1240
              </a>
            </div>

            {/* 数字で見る価値 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/20 max-w-4xl mx-auto">
              {[
                { num: '0時間', label: '期限管理の工数', icon: Clock },
                { num: '100%', label: '個別最適化', icon: UserCheck },
                { num: '3年周期', label: '入替お知らせ', icon: Bell },
                { num: '即日〜', label: '導入可能', icon: Zap }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition">
                    <Icon className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{item.num}</div>
                    <p className="text-sm text-slate-300">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* スクロール誘導 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* ===== セクション2: 課題喚起 - 文字サイズアップ、余白調整 ===== */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-100 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-red-100 px-5 py-2.5 rounded-full mb-5">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <span className="text-base font-bold text-red-600">見過ごされている課題</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              その備蓄、本当に<br className="sm:hidden" />
              <span className="text-red-600">"全員"</span>を守れますか？
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏠',
                problem: 'リモート勤務で届かない',
                description: '会社に備蓄があっても、在宅勤務中の災害では届かない。従業員の"居場所"に届いていますか？',
                risk: '帰宅困難時に従業員を守れない'
              },
              {
                icon: '⚠️',
                problem: '安全配慮義務リスク',
                description: '女性社員への配慮不足、アレルギー対応の漏れ…「全員同じ備蓄」では法的リスクに。',
                risk: '訴訟・レピュテーションリスク'
              },
              {
                icon: '📅',
                problem: '期限切れ・廃棄地獄',
                description: '棚卸し、期限チェック、入替手配…終わりのない管理業務が総務を圧迫。そして結局、期限切れ廃棄。',
                risk: 'コスト増・ESG評価低下'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-200 hover:border-red-300 transition-all">
                <div className="text-6xl mb-5">{item.icon}</div>
                <h4 className="text-2xl font-bold text-slate-800 mb-4">{item.problem}</h4>
                <p className="text-lg text-slate-600 mb-5 leading-relaxed">{item.description}</p>
                <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3">
                  <p className="text-base text-red-700 font-bold">→ {item.risk}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== セクション3: ソリューション概要 - 「入替通知」に変更 ===== */}
      <section id="solution" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-5 py-2.5 rounded-full mb-5">
              <Sparkles className="w-6 h-6 text-orange-600" />
              <span className="text-base font-bold text-orange-600">SOLUTION</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              護己は<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">"備蓄品"</span>ではなく<br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">"管理そのもの"</span>を届けます
            </h3>
            <p className="text-xl text-slate-600">届いた瞬間から、管理業務はゼロになります</p>
          </div>
          
          {/* 4ステップフロー */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'ヒアリング',
                description: '従業員情報（性別・アレルギー等）をヒアリング',
                icon: MessageCircle,
                color: 'blue'
              },
              {
                step: '02',
                title: 'AIが個別最適化',
                description: '一人ひとりに最適な防災セットをAIが自動選定',
                icon: Sparkles,
                color: 'purple'
              },
              {
                step: '03',
                title: '自宅/拠点に直送',
                description: '個別梱包で従業員の自宅または指定拠点へ直接配送',
                icon: Package,
                color: 'green'
              },
              {
                step: '04',
                title: '入替時期を通知',
                description: '3年周期で入替時期をお知らせ。期限管理はお任せ',
                icon: Bell,
                color: 'orange'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              const colorClasses = {
                blue: 'from-blue-500 to-blue-600',
                purple: 'from-purple-500 to-purple-600',
                green: 'from-green-500 to-green-600',
                orange: 'from-orange-500 to-orange-600'
              };
              return (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all h-full">
                    <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[item.color]} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-base font-bold text-orange-500 mb-2">STEP {item.step}</div>
                    <h4 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h4>
                    <p className="text-base text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-orange-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 補足メッセージ */}
          <div className="mt-12 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-orange-200 text-center">
            <p className="text-xl font-bold text-slate-800">
              つまり、御社がやることは<span className="text-orange-600">「従業員情報を渡すだけ」</span>
            </p>
            <p className="text-lg text-slate-600 mt-2">選定・配送・期限管理…すべて護己が代行します</p>
            <p className="text-base text-slate-500 mt-2">※入替時期（3年周期）のお知らせ後、入替作業は御社にてお願いいたします</p>
          </div>
        </div>
      </section>

      {/* ===== セクション4: AIパーソナライズ比較 - 現実的な内容に修正 ===== */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-purple-100 px-5 py-2.5 rounded-full mb-5">
              <UserCheck className="w-6 h-6 text-purple-600" />
              <span className="text-base font-bold text-purple-600">AI PERSONALIZATION</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              一人ひとりに、<br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500">"自分専用"</span>の防災セットを
            </h3>
            <p className="text-xl text-slate-600">従業員の属性に基づき、AIが最適な内容を選定</p>
          </div>
          
          {/* 比較カード */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Aさん */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-pink-200">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                    👩
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">Aさん（28歳・女性）</h4>
                    <p className="text-lg text-pink-100">営業部 / コンタクトレンズ使用</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h5 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-lg">
                  <Sparkles className="w-6 h-6 text-pink-500" />
                  AIが選定したセット内容
                </h5>
                <ul className="space-y-4">
                  {[
                    { item: '生理用品（3日分）', reason: '女性向け必需品' },
                    { item: 'コンタクト保存液・ケース', reason: 'コンタクト使用者向け' },
                    { item: 'メイク落としシート', reason: '衛生・スキンケア' },
                    { item: 'ヘアゴム・ヘアピン', reason: '長髪対応' },
                    { item: '保存水・非常食（3日分）', reason: '基本セット' },
                    { item: '携帯トイレ・衛生用品', reason: '基本セット' }
                  ].map((content, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-pink-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800 text-lg">{content.item}</span>
                        <span className="text-base text-slate-500 ml-2">← {content.reason}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bさん */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-blue-200">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                    👨
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">Bさん（45歳・男性）</h4>
                    <p className="text-lg text-blue-100">管理部 / 小麦アレルギー</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h5 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-lg">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                  AIが選定したセット内容
                </h5>
                <ul className="space-y-4">
                  {[
                    { item: 'グルテンフリー非常食', reason: '小麦アレルギー対応' },
                    { item: 'アレルギー表示カード', reason: '緊急時の意思表示' },
                    { item: '保存水（3日分）', reason: '基本セット' },
                    { item: '携帯トイレ', reason: '基本セット' },
                    { item: 'LEDライト・ホイッスル', reason: '基本セット' },
                    { item: '衛生用品・マスク', reason: '基本セット' }
                  ].map((content, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800 text-lg">{content.item}</span>
                        <span className="text-base text-slate-500 ml-2">← {content.reason}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 安全配慮義務への言及 */}
          <div className="mt-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 text-center text-white">
            <h4 className="text-2xl font-bold mb-3">
              「全員同じ備蓄」では、<span className="text-orange-400">安全配慮義務</span>を満たせない時代に
            </h4>
            <p className="text-lg text-slate-300">
              従業員一人ひとりの属性に応じたパーソナライズが、企業のリスク管理として求められています
            </p>
          </div>
        </div>
      </section>

      {/* ===== セクション5: 導入メリット（6つ）- タグサイズ大きく ===== */}
      <section id="benefits" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-5 py-2.5 rounded-full mb-5">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <span className="text-base font-bold text-orange-600">BENEFITS</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              経営・法務・経理・総務、<br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">すべてに効く</span>
            </h3>
            <p className="text-xl text-slate-600">B2B導入で得られる6つのメリット</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: '安全配慮義務の履行証明',
                description: '従業員ごとにカスタマイズされた備蓄の提供記録が、安全配慮義務の履行証明に。訴訟リスクを低減。',
                tag: '法務',
                tagColor: 'blue'
              },
              {
                icon: FileCheck,
                title: '資産計上の適正化',
                description: 'サブスク型のため経費処理が明確に。備蓄品の資産計上・科目整理の手間を削減。',
                tag: '経理',
                tagColor: 'green'
              },
              {
                icon: RefreshCw,
                title: '廃棄ロス削減（ESG/SDGs）',
                description: '期限管理と入替通知で廃棄ロスを削減。サステナビリティ報告書にも記載可能な取り組みに。',
                tag: 'ESG',
                tagColor: 'emerald'
              },
              {
                icon: BarChart3,
                title: 'BCP監査対応',
                description: '備蓄状況の可視化で、BCP監査や内部監査への対応がスムーズに。証跡としても活用可能。',
                tag: '監査',
                tagColor: 'purple'
              },
              {
                icon: Heart,
                title: '従業員エンゲージメント向上',
                description: '「自分専用の防災セット」は会社からの安心のメッセージ。採用競争力・定着率向上にも寄与。',
                tag: '人事',
                tagColor: 'pink'
              },
              {
                icon: Clock,
                title: '総務の工数を劇的削減',
                description: '選定・発注・在庫管理・期限チェック…すべての業務から解放。本来業務に集中できる環境へ。',
                tag: '総務',
                tagColor: 'orange'
              }
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              const tagColors = {
                blue: 'bg-blue-500 text-white',
                green: 'bg-green-500 text-white',
                emerald: 'bg-emerald-500 text-white',
                purple: 'bg-purple-500 text-white',
                pink: 'bg-pink-500 text-white',
                orange: 'bg-orange-500 text-white'
              };
              return (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-7 border-2 border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shadow-md">
                      <Icon className="w-7 h-7 text-orange-600" />
                    </div>
                    {/* タグを大きく */}
                    <span className={`text-base font-bold px-4 py-2 rounded-full ${tagColors[benefit.tagColor]}`}>
                      {benefit.tag}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">{benefit.title}</h4>
                  <p className="text-base text-slate-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          {/* Before/After - 修正版 */}
          <div className="mt-12 bg-gradient-to-r from-slate-100 to-orange-50 rounded-2xl p-8">
            <h4 className="text-2xl font-bold text-center text-slate-800 mb-8">総務担当者の業務 Before / After</h4>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border-2 border-red-200">
                <div className="text-center mb-4">
                  <span className="inline-block bg-red-500 text-white font-bold px-6 py-2.5 rounded-full text-lg">Before</span>
                </div>
                <ul className="space-y-4">
                  {[
                    '備蓄品の選定・比較検討：3日',
                    '見積もり取得・稟議：1週間',
                    '在庫管理・棚卸し：毎月2時間',
                    '期限チェック：毎月1時間',
                    '入替発注・受取対応：年4回',
                    '廃棄処理・記録：都度'
                  ].map((task, i) => (
                    <li key={i} className="flex items-center gap-3 text-lg text-slate-700">
                      <span className="w-3 h-3 bg-red-400 rounded-full flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t-2 border-red-200 text-center">
                  <span className="text-3xl font-bold text-red-600">年間 50時間以上</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                <div className="text-center mb-4">
                  <span className="inline-block bg-green-500 text-white font-bold px-6 py-2.5 rounded-full text-lg">After（護己導入後）</span>
                </div>
                <ul className="space-y-4">
                  {[
                    '従業員情報を共有：1回のみ',
                    '以降の選定・配送：すべて自動',
                    '期限管理：護己にお任せ',
                    '入替時期：3年周期でお知らせ',
                    '在庫確認：不要',
                    '廃棄ロス：大幅削減'
                  ].map((task, i) => (
                    <li key={i} className="flex items-center gap-3 text-lg text-slate-700">
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t-2 border-green-200 text-center">
                  <span className="text-3xl font-bold text-green-600">年間 ほぼ0時間</span>
                </div>
              </div>
            </div>
            <p className="text-center text-base text-slate-500 mt-6">※入替時期（3年周期）のお知らせ後、入替作業は御社にてお願いいたします</p>
          </div>
        </div>
      </section>

      {/* ===== セクション6: 料金プラン - 全プラン共通機能に修正 ===== */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-5 py-2.5 rounded-full mb-5">
              <Target className="w-6 h-6 text-orange-600" />
              <span className="text-base font-bold text-orange-600">PRICING</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              すべてのプランに<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">フル機能</span>を搭載
            </h3>
            <p className="text-xl text-slate-600">規模に関わらず、同じ品質のサービスを提供</p>
          </div>

          {/* 全プラン共通機能 */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 mb-10 text-white">
            <h4 className="text-2xl font-bold text-center mb-6">全プラン共通の機能</h4>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Sparkles, label: 'AIパーソナライズ選定' },
                { icon: Package, label: '個別配送（自宅/オフィス）' },
                { icon: Bell, label: '期限管理・入替時期通知' },
                { icon: Mail, label: 'メールサポート' }
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                    <Icon className="w-6 h-6 text-orange-200" />
                    <span className="font-bold text-lg">{feature.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: 'Starter',
                range: '〜100名',
                description: 'スタートアップ・成長企業向け',
                gradient: 'from-slate-600 to-slate-700'
              },
              {
                name: 'Growth',
                range: '100〜500名',
                description: '中堅・成長企業向け',
                popular: true,
                gradient: 'from-orange-500 to-orange-600'
              },
              {
                name: 'Enterprise',
                range: '500名〜',
                description: '大企業・複数拠点向け',
                gradient: 'from-blue-600 to-indigo-700'
              }
            ].map((plan, index) => (
              <div 
                key={index}
                className={`relative rounded-2xl p-8 border-2 transition-all transform hover:-translate-y-2 ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/40 border-orange-400 scale-105' 
                    : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-800 text-base font-bold px-6 py-2 rounded-full shadow-lg">
                      ⭐ おすすめ
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-800'}`}>
                    {plan.name}
                  </h4>
                  <p className={`text-5xl font-bold mb-3 ${plan.popular ? 'text-white' : 'text-slate-800'}`}>
                    {plan.range}
                  </p>
                  <p className={`text-lg ${plan.popular ? 'text-orange-100' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className={`text-center py-4 mb-6 rounded-xl ${plan.popular ? 'bg-white/10' : 'bg-slate-100'}`}>
                  <p className={`text-lg font-bold ${plan.popular ? 'text-white' : 'text-slate-700'}`}>
                    全機能利用可能
                  </p>
                  <p className={`text-base ${plan.popular ? 'text-orange-100' : 'text-slate-500'}`}>
                    人数に応じたボリューム割引あり
                  </p>
                </div>
                
                <a 
                  href="#contact"
                  className={`block text-center py-4 px-6 rounded-full font-bold transition text-lg shadow-lg ${
                    plan.popular 
                      ? 'bg-white text-orange-600 hover:bg-orange-50' 
                      : 'bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:from-slate-700 hover:to-slate-600'
                  }`}
                >
                  お問い合わせ
                </a>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-8 text-center shadow-2xl">
            <h4 className="text-2xl font-bold text-white mb-3">
              💡 料金は個別にお見積もり
            </h4>
            <p className="text-lg text-slate-200">
              導入人数・配送先に応じて、最適なプランをご提案いたします
            </p>
          </div>
        </div>
      </section>

      {/* ===== セクション7: 導入フロー - 修正版 ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-5 py-2.5 rounded-full mb-5">
              <ArrowRight className="w-6 h-6 text-orange-600" />
              <span className="text-base font-bold text-orange-600">FLOW</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              最短<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">2週間</span>で、全従業員に届きます
            </h3>
          </div>
          
          <div className="space-y-6">
            {[
              { 
                step: '01', 
                title: 'お問い合わせ', 
                description: 'フォームまたはお電話でご連絡ください',
                icon: Phone,
                duration: '即日'
              },
              { 
                step: '02', 
                title: 'ヒアリング・お見積り', 
                description: '導入人数・ご要望を詳しくお伺いし、最適なプランをご提案',
                icon: MessageCircle,
                duration: '1〜3営業日'
              },
              { 
                step: '03', 
                title: 'ご契約・お支払い', 
                description: 'ご契約後、お支払いを確認次第、配送準備を開始',
                icon: FileCheck,
                duration: '〜1週間'
              },
              { 
                step: '04', 
                title: '従業員情報のご共有', 
                description: '従業員の属性・配送先情報をご共有いただきます',
                icon: Users,
                duration: '〜3営業日'
              },
              { 
                step: '05', 
                title: '配送開始', 
                description: 'AIがパーソナライズしたセットを個別に配送開始',
                icon: Package,
                duration: '順次発送'
              },
              { 
                step: '06', 
                title: '入替時期を通知', 
                description: '3年周期で入替時期をお知らせ。期限管理はお任せください',
                icon: Bell,
                duration: '3年後'
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-6 bg-gradient-to-r from-slate-50 to-white p-6 rounded-2xl border-2 border-slate-200 hover:border-orange-300 hover:shadow-lg transition">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-xl mb-1">{item.title}</h4>
                    <p className="text-lg text-slate-600">{item.description}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 bg-orange-100 px-5 py-2.5 rounded-full">
                    <Icon className="w-5 h-5 text-orange-600" />
                    <span className="text-base font-bold text-orange-600">{item.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-base text-slate-500 mt-8">※入替時期のお知らせ後、入替作業・発注は御社にてお願いいたします</p>
        </div>
      </section>

      {/* ===== セクション8: FAQ ===== */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-5 py-2.5 rounded-full mb-5">
              <MessageCircle className="w-6 h-6 text-orange-600" />
              <span className="text-base font-bold text-orange-600">FAQ</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800">
              よくある<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">ご質問</span>
            </h3>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                q: 'トライアル導入はできますか？', 
                a: 'はい、一部部署や拠点での先行導入（トライアル）も可能です。まずはお気軽にご相談ください。' 
              },
              { 
                q: '入替はどのように行われますか？', 
                a: '保存食・保存水は3年周期で入替時期をお知らせいたします。入替のご発注・作業は御社にてお願いしております。入替時の割引価格もご用意しています。' 
              },
              { 
                q: '請求書払い・購買システムへの対応は？', 
                a: '請求書払い（銀行振込）に対応しております。お支払いサイトについてもご相談ください。' 
              },
              { 
                q: '複数拠点への配送は可能ですか？', 
                a: 'はい、複数拠点への個別配送に対応しております。本社・支社・従業員自宅など、柔軟に対応可能です。' 
              },
              { 
                q: '情報セキュリティ体制について教えてください', 
                a: '従業員情報は暗号化して厳重に管理しております。NDA締結やセキュリティチェックシートへの回答も対応可能です。' 
              },
              { 
                q: '最低契約期間はありますか？', 
                a: '初回導入時のお支払い後、特に契約期間の縛りはございません。入替時（3年後）に継続・変更をご検討ください。' 
              },
            ].map((faq, index) => (
              <details key={index} className="group bg-white rounded-xl border-2 border-slate-200 hover:border-orange-300 transition shadow-sm">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-bold text-slate-800 text-xl pr-4">{faq.q}</span>
                  <svg className="w-6 h-6 text-orange-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-slate-600 text-lg leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== セクション9: 最終CTA ===== */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/30 to-orange-600/30 border border-orange-400/40 px-5 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-orange-300" />
            <span className="text-base font-bold text-orange-100">まずは無料相談から</span>
          </div>
          
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            防災管理の"見えない業務"から<br className="sm:hidden" />解放されませんか？
          </h3>
          <p className="text-xl text-slate-200 mb-8">
            御社の課題をヒアリングし、<br />
            最適なプランをご提案いたします
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-full font-bold transition shadow-2xl text-lg"
            >
              <Mail className="w-5 h-5" />
              無料で導入相談する
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="tel:080-4249-1240"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 px-10 py-4 rounded-full font-bold transition shadow-2xl text-lg"
            >
              <Phone className="w-5 h-5" />
              080-4249-1240
            </a>
          </div>
        </div>
      </section>

      {/* ===== セクション10: お問い合わせフォーム ===== */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-b from-orange-50 via-white to-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-5 py-2.5 rounded-full mb-5">
              <Mail className="w-6 h-6 text-orange-600" />
              <span className="text-base font-bold text-orange-600">CONTACT</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-3">
              お問い合わせ・<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">導入相談</span>
            </h3>
            <p className="text-xl text-slate-600">
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
                <p className="text-xl text-slate-600">
                  担当者より2営業日以内にご連絡いたします。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold text-slate-700 mb-2">
                      会社名 <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                      placeholder="株式会社〇〇"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-slate-700 mb-2">
                      ご担当者名 <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                      placeholder="山田 太郎"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold text-slate-700 mb-2">
                      メールアドレス <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                      placeholder="example@company.co.jp"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-slate-700 mb-2">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                      placeholder="03-1234-5678"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold text-slate-700 mb-2">
                      従業員数 <span className="text-orange-500">*</span>
                    </label>
                    <select
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                    >
                      <option value="">選択してください</option>
                      <option value="1-50">1〜50名</option>
                      <option value="51-100">51〜100名</option>
                      <option value="101-300">101〜300名</option>
                      <option value="301-500">301〜500名</option>
                      <option value="501-1000">501〜1,000名</option>
                      <option value="1001-5000">1,001〜5,000名</option>
                      <option value="5001+">5,001名以上</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-slate-700 mb-2">
                      導入希望時期
                    </label>
                    <select
                      name="desiredTiming"
                      value={formData.desiredTiming}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                    >
                      <option value="">選択してください</option>
                      <option value="asap">できるだけ早く</option>
                      <option value="1month">1ヶ月以内</option>
                      <option value="3months">3ヶ月以内</option>
                      <option value="6months">6ヶ月以内</option>
                      <option value="undecided">未定・情報収集中</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-lg font-bold text-slate-700 mb-2">
                    ご要望・ご質問
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-lg"
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
                    className="mt-1 w-6 h-6 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="privacyAgreed" className="text-base text-slate-700">
                    個人情報の取り扱いについて同意します
                    <span className="text-orange-500 font-bold"> *</span>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white py-5 px-8 rounded-full font-bold transition shadow-2xl shadow-orange-500/40 flex items-center justify-center gap-3 text-xl"
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
                      無料で導入相談する
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
                <p className="text-base text-slate-500 font-medium">お電話</p>
                <p className="font-bold text-slate-800 text-lg">080-4249-1240</p>
              </div>
            </a>
            
            <a href="mailto:shukipanibo@gmail.com" className="flex items-center gap-4 bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-base text-slate-500 font-medium">メール</p>
                <p className="font-bold text-slate-800 text-sm break-all">shukipanibo@gmail.com</p>
              </div>
            </a>
            
            <a href="https://lin.ee/v0KcwPS" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-base text-slate-500 font-medium">LINE</p>
                <p className="font-bold text-slate-800 text-lg">公式LINE</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ===== フッター ===== */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12 px-4 border-t-4 border-orange-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {/* フッターもロゴ画像に（暗い背景用に調整が必要な場合は別画像を用意） */}


// ファイルの先頭に追加
import logoImage from '/rogo2.png';

// そしてimgタグで使用
<img 
  src={logoImage} 
  alt="護己 -shuki-" 
  className="h-12 w-auto"
/>

現在の BusinessPage.jsx のヘッダー部分（ロゴ周辺）のコードを見せてもらえますか？
bashhead -100 src/components/BusinessPage.jsx Opus 4.5

              </div>
              <p className="text-slate-300 text-base">
                届いた瞬間、防災管理は終了。
              </p>
            </div>
            
            <div>
              <h5 className="font-bold text-lg mb-3">サービス</h5>
              <ul className="space-y-2 text-base text-slate-300">
                <li><button onClick={onBack} className="hover:text-orange-400 transition">個人向けサービス</button></li>
                <li><a href="#solution" className="hover:text-orange-400 transition">サービス概要</a></li>
                <li><a href="#benefits" className="hover:text-orange-400 transition">導入効果</a></li>
                <li><a href="#pricing" className="hover:text-orange-400 transition">料金プラン</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold text-lg mb-3">会社情報</h5>
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




