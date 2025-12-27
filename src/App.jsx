import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, Loader2, Package, Mail, CheckCircle2, User, Home, Users, Utensils, AlertTriangle, Sparkles } from 'lucide-react';
import PolicyPage from './PolicyPage';

const ShukiApp = () => {
  const [step, setStep] = useState(1);
  const [fadeIn, setFadeIn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    residents: '',
    livingEnvironment: '',
    currentPreparation: '',
    notes: '',
    // 人数分の個別情報（最大3人まで対応）
    persons: [
      { age: '', gender: '', allergies: [], allergyOther: '', foodPreference: '', tastePreference: '', tastePreference2: '' },
      { age: '', gender: '', allergies: [], allergyOther: '', foodPreference: '', tastePreference: '', tastePreference2: '' },
      { age: '', gender: '', allergies: [], allergyOther: '', foodPreference: '', tastePreference: '', tastePreference2: '' }
    ]
  });

  const handleStepChange = (n) => {
    setFadeIn(false);
    setTimeout(() => { setStep(n); setFadeIn(true); }, 300);
  };

  const handleMultiSelect = (personIndex, field, value) => {
    setFormData(prev => {
      const newPersons = [...prev.persons];
      const current = newPersons[personIndex][field];
      if (value === '特になし') {
        newPersons[personIndex] = { ...newPersons[personIndex], [field]: ['特になし'] };
      } else {
        const filtered = current.filter(v => v !== '特になし');
        if (filtered.includes(value)) {
          const newValue = filtered.filter(v => v !== value);
          newPersons[personIndex] = { ...newPersons[personIndex], [field]: newValue.length === 0 ? ['特になし'] : newValue };
        } else {
          newPersons[personIndex] = { ...newPersons[personIndex], [field]: [...filtered, value] };
        }
      }
      return { ...prev, persons: newPersons };
    });
  };

  const updatePerson = (personIndex, field, value) => {
    setFormData(prev => {
      const newPersons = [...prev.persons];
      newPersons[personIndex] = { ...newPersons[personIndex], [field]: value };
      return { ...prev, persons: newPersons };
    });
  };

  const getPersonCount = () => {
    if (formData.residents === '一人暮らし') return 1;
    if (formData.residents === '二人暮らし') return 2;
    if (formData.residents === '三人以上') return 3;
    return 0;
  };

  const generateDisasterType = () => {
    const personCount = getPersonCount();
    const hasWoman = formData.persons.slice(0, personCount).some(p => p.gender === '女性');
    
    if (formData.livingEnvironment === 'mansion') {
      return { type: 'マンション籠城タイプ', icon: '🏢', advice: 'マンションのあなたは、エレベーター停止時の「トイレ」と「メンタル維持」が課題です。水は重いので浄水器で対応し、その分スペースを「美味しい食事」に使いましょう。' };
    } else if (formData.livingEnvironment === 'house') {
      return { type: '在宅避難・備蓄タイプ', icon: '🏠', advice: '戸建てなら、在宅避難が基本。長期保存できる美味しい食品と、ライフライン途絶に備えた装備を充実させましょう。' };
    } else if (formData.livingEnvironment === 'apartment') {
      return { type: 'コンパクト備蓄タイプ', icon: '🏘️', advice: 'アパートでの備蓄は省スペースが鍵。必要最小限で効率的な備えと、避難時の持ち出しやすさを重視しましょう。' };
    } else if (personCount >= 3 || hasWoman) {
      return { type: 'ファミリー安心タイプ', icon: '👨‍👩‍👧', advice: '家族みんなが安心できる備えが大切。お子様向けの食品や、女性に配慮した衛生用品を充実させましょう。' };
    } else {
      return { type: 'グルメな備蓄家タイプ', icon: '🍱', advice: 'あなたは「日常の延長」として防災を考えられる方。美味しさを妥協せず、ローリングストックで無理なく続けられる構成が最適です。' };
    }
  };

  const generateRecommendations = () => {
    const personCount = getPersonCount();
    const hasWoman = formData.persons.slice(0, personCount).some(p => p.gender === '女性');
    
    // 人数分のボックス生成
    const boxes = [];
    
    for (let i = 0; i < personCount; i++) {
      const person = formData.persons[i];
      
      // ベースアイテム（各人共通）
      const baseItems = [
        { name: '保存水 500ml (2本)', img: '💧' },
        { name: '防災用品 (アルミブランケット、マスク、軍手、ホイッスル、ウエットティッシュ)', img: '🎒' },
        { name: '簡易トイレ (10個)', img: '🚽' }
      ];
      
      // マンションの場合は防臭袋を追加
      if (formData.livingEnvironment === 'mansion') {
        baseItems.push({ name: 'BOS防臭袋（10枚）', img: '🛍️' });
      }
      
      // 女性の場合は衛生用品を追加
      if (person.gender === '女性') {
        baseItems.push({ name: '生理用品・衛生セット', img: '🧴' });
      }
      
      // パーソナライゼーション情報
      const personalizations = [
        { reason: `${formData.residents}・${person.age}向けに最適化`, detail: '15L収納ボックスに効率よく収まる、3日分の備蓄を想定' }
      ];
      
      // アレルギー情報の処理
      const allergyList = person.allergies.filter(a => a !== '特になし');
      const hasWheat = allergyList.includes('小麦');
      const hasEgg = allergyList.includes('卵');
      const hasMilk = allergyList.includes('乳製品');
      
      const foodDB = {
        '牛丼の具': ['小麦'], 'ポークカレー': ['小麦', '乳製品'], 'しょうゆラーメン味': ['小麦', '卵'],
        '塩ラーメン味': [], 'うどん味': ['小麦'], '白粥': [], '梅粥': [], '鮭粥': [], 'ホワイトシチュー': [],
        'ハンバーグ煮込み': ['小麦', '卵', '乳製品'], 'さば味噌煮': ['小麦'], '中華風ミートボール': ['小麦', '卵', '乳製品'],
        'いわしの煮付': ['小麦'], '筑前煮': ['小麦'], '赤魚の煮付': [], 'ハンバーグ煮込みトマトソース': ['小麦', '卵', '乳製品'],
        '鶏と野菜のトマト煮': ['小麦', '乳製品'], 'さつま芋のレモン煮': [], 'パン缶（プレーン）': ['小麦', '卵', '乳製品'],
        'パン缶（チョコ）': ['小麦', '卵', '乳製品'], 'かぼちゃ煮': [], 'けんちん汁': []
      };
      
      const checkAllergy = (foodName) => {
        const allergens = foodDB[foodName] || [];
        if (hasWheat && allergens.includes('小麦')) return false;
        if (hasEgg && allergens.includes('卵')) return false;
        if (hasMilk && allergens.includes('乳製品')) return false;
        return true;
      };
      
      const tasteOptions = {
        'しょっぱいもの好き': { main: ['牛丼の具', 'ポークカレー', 'しょうゆラーメン味'], side: ['ハンバーグ煮込み', 'さば味噌煮', '中華風ミートボール'] },
        'あっさり・和食系': { main: ['白粥', '梅粥', 'うどん味'], side: ['いわしの煮付', '筑前煮', '赤魚の煮付'] },
        '辛いもの好き': { main: ['ポークカレー', 'しょうゆラーメン味', '牛丼の具'], side: ['ハンバーグ煮込みトマトソース', '鶏と野菜のトマト煮', '中華風ミートボール'] },
        '甘いもの好き': { main: ['パン缶（プレーン）', 'パン缶（チョコ）', 'ホワイトシチュー'], side: ['ホワイトシチュー', 'さつま芋のレモン煮', 'かぼちゃ煮'] }
      };
      
      const backups = { main: ['塩ラーメン味', '白粥', '鮭粥', 'けんちん汁'], side: ['赤魚の煮付', 'かぼちゃ煮', 'けんちん汁'] };
      
      let mainFoods = [], sideDishes = [];
      const pref1 = tasteOptions[person.tastePreference];
      const pref2 = person.tastePreference2 ? tasteOptions[person.tastePreference2] : null;
      
      if (pref1 && pref2) {
        const main1 = pref1.main.filter(checkAllergy).slice(0, 2);
        const main2 = pref2.main.filter(checkAllergy).filter(m => !main1.includes(m)).slice(0, 1);
        mainFoods = [...main1, ...main2];
        
        const side1 = pref1.side.filter(checkAllergy).slice(0, 2);
        const side2 = pref2.side.filter(checkAllergy).filter(s => !side1.includes(s)).slice(0, 1);
        sideDishes = [...side1, ...side2];
        
        if (mainFoods.length < 3) {
          const extras = backups.main.filter(checkAllergy).filter(m => !mainFoods.includes(m)).slice(0, 3 - mainFoods.length);
          mainFoods = [...mainFoods, ...extras];
        }
        if (sideDishes.length < 3) {
          const extras = backups.side.filter(checkAllergy).filter(s => !sideDishes.includes(s)).slice(0, 3 - sideDishes.length);
          sideDishes = [...sideDishes, ...extras];
        }
        
        personalizations.push({ reason: `${person.tastePreference}と${person.tastePreference2}をバランスよく`, detail: '第一希望から2品、第二希望から1品を選定してバラエティ豊かに構成' });
      } else if (pref1) {
        mainFoods = pref1.main.filter(checkAllergy).slice(0, 3);
        if (mainFoods.length < 3) mainFoods = [...mainFoods, ...backups.main.filter(checkAllergy)].slice(0, 3);
        
        sideDishes = pref1.side.filter(checkAllergy).slice(0, 3);
        if (sideDishes.length < 3) sideDishes = [...sideDishes, ...backups.side.filter(checkAllergy)].slice(0, 3);
        
        personalizations.push({ reason: `${person.tastePreference}に対応`, detail: 'お好みに合わせた食品を選定' });
      }
      
      const icons = {
        '牛丼の具': '🍖', 'ポークカレー': '🍛', 'しょうゆラーメン味': '🍜', '塩ラーメン味': '🍜', 'うどん味': '🍜', '白粥': '🍚', '梅粥': '🍚',
        '鮭粥': '🍚', 'ホワイトシチュー': '🥘', 'ハンバーグ煮込み': '🍖', 'さば味噌煮': '🐟', '中華風ミートボール': '🥢', 'いわしの煮付': '🐟',
        '筑前煮': '🥕', '赤魚の煮付': '🐟', 'ハンバーグ煮込みトマトソース': '🍖', '鶏と野菜のトマト煮': '🍗', 'さつま芋のレモン煮': '🍠',
        'パン缶（プレーン）': '🍞', 'パン缶（チョコ）': '🍞', 'かぼちゃ煮': '🎃', 'けんちん汁': '🍲'
      };
      
      const withIcons = (fs) => fs.map(n => ({ name: n, img: icons[n] || '🍱' }));
      
      if (allergyList.length > 0 || person.allergyOther) {
        const at = [...allergyList, person.allergyOther].filter(Boolean).join('、');
        personalizations.push({ reason: `${at}アレルギー対応`, detail: 'アレルゲンを含まない食品に置き換え' });
      }
      
      const personalizedFoods = [...withIcons(mainFoods), ...withIcons(sideDishes), { name: '羊羹', img: '🍡' }];
      
      boxes.push({
        personIndex: i,
        personLabel: personCount === 1 ? '' : `${i + 1}人目`,
        baseItems,
        personalizedFoods,
        personalizations
      });
    }
    
    // 防災タイプに応じたパーソナライゼーション（全体）
    const disasterType = generateDisasterType();
    
    // 料金計算
    const initialCost = 9980 * personCount;
    const annualCost = 5000 * personCount;
    
    return { boxes, initialCost, annualCost, disasterType, personCount };
  };

  const submitToGoogleForm = async () => {
    const rec = generateRecommendations();
    const personCount = getPersonCount();
    
    // 各人の情報を整形
    const personsDetail = formData.persons.slice(0, personCount).map((p, i) => {
      return `【${personCount > 1 ? `${i + 1}人目` : '本人'}】年齢:${p.age} 性別:${p.gender} アレルギー:${p.allergies.join('・')}${p.allergyOther ? `・${p.allergyOther}` : ''} 食の好み:${p.foodPreference} 味:${p.tastePreference}/${p.tastePreference2}`;
    }).join(' | ');
    
    // 各BOXの食品リスト
    const baseItems = rec.boxes.map((box, i) => {
      const label = personCount > 1 ? `[${i + 1}人目]` : '';
      return `${label}${box.baseItems.map(item => item.name).join('、')}`;
    }).join(' | ');
    
    const personalizedFoods = rec.boxes.map((box, i) => {
      const label = personCount > 1 ? `[${i + 1}人目]` : '';
      return `${label}${box.personalizedFoods.map(item => item.name).join('、')}`;
    }).join(' | ');
    
    // URLパラメータとして送信
    const params = new URLSearchParams({
      name: formData.name || '未入力',
      email: formData.email || '',
      phone: formData.phone || '',
      residents: formData.residents,
      disasterType: rec.disasterType.type,
      livingEnvironment: formData.livingEnvironment,
      currentPreparation: formData.currentPreparation,
      notes: formData.notes || 'なし',
      initialCost: `¥${rec.initialCost.toLocaleString()} (${personCount}人分)`,
      annualCost: `¥${rec.annualCost.toLocaleString()}/年 (${personCount}人分)`,
      exchangeCycle: '3年ごとに交換',
      personsDetail: personsDetail,
      baseItems: baseItems,
      personalizedFoods: personalizedFoods
    });
    
    try {
      // GETリクエストで送信（imgタグを使った送信方法）
      const img = document.createElement('img');
      img.style.display = 'none';
      img.src = `https://script.google.com/macros/s/AKfycbyqItT0HJx62mAGgIo4RtPPhLgX8zHTM-FsrifVmwn1ZXTIG4J21PrKr5gZAUkehp_I/exec?${params.toString()}`;
      document.body.appendChild(img);
      
      // 1秒後に削除
      setTimeout(() => {
        document.body.removeChild(img);
      }, 1000);
      
      // 送信完了メッセージ表示
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
      
    } catch (error) {
      console.error('送信エラー:', error);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    }
  };

  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => handleStepChange(4), 3000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const rec = step === 4 ? generateRecommendations() : { boxes: [], initialCost: 9980, annualCost: 5000, disasterType: {}, personCount: 1 };

  if (showPolicy) {
    return <PolicyPage onBack={() => setShowPolicy(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        
        {step === 1 && (
          <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
            <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 rounded-full mb-4">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800">
                護己 <span className="text-xl sm:text-2xl md:text-3xl text-slate-600">-Shuki-</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-orange-500 font-medium px-4 leading-relaxed">
                日常に溶け込む、<br className="sm:hidden" />
                あなただけの防災。
              </p>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto px-4 leading-relaxed">
                たった1分の質問に答えるだけで、<br />
                AIがあなたの生活スタイルと<br className="sm:hidden" />防災ニーズに<br className="hidden sm:inline" />
                最適な備蓄を提案します。
              </p>
              <button onClick={() => handleStepChange(2)} className="mt-8 sm:mt-12 px-8 sm:px-12 py-4 sm:py-5 bg-orange-500 text-white text-lg sm:text-xl font-bold rounded-xl hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-3 min-h-[56px]">
                総合診断を始める<ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12">
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-4"><Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" /><h2 className="text-2xl sm:text-3xl font-bold text-slate-800">AI総合診断</h2></div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">あなたの生活スタイルと防災ニーズから、最適な備蓄をご提案します。</p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div><label className="block text-base sm:text-lg font-semibold text-slate-700 mb-3">お名前 <span className="text-orange-500">*</span></label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 sm:py-4 text-base border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none min-h-[48px]" placeholder="山田 太郎" /></div>

                <div><label className="block text-base sm:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2"><Mail className="w-5 h-5 text-orange-500" />メールアドレス <span className="text-orange-500">*</span></label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 sm:py-4 text-base border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none min-h-[48px]" placeholder="example@email.com" /></div>

                <div><label className="block text-base sm:text-lg font-semibold text-slate-700 mb-3">電話番号 <span className="text-orange-500">*</span></label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 sm:py-4 text-base border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none min-h-[48px]" placeholder="090-1234-5678" /></div>

                <div><label className="block text-base sm:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2"><Home className="w-5 h-5 text-orange-500" />居住環境 <span className="text-orange-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'mansion', label: 'マンション', emoji: '🏢' },
                      { value: 'house', label: '戸建て', emoji: '🏠' },
                      { value: 'apartment', label: 'アパート', emoji: '🏘️' }
                    ].map(opt => (
                      <button key={opt.value} onClick={() => setFormData({...formData, livingEnvironment: opt.value})} className={`px-4 py-3 rounded-xl font-medium transition-all ${formData.livingEnvironment === opt.value ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        <span className="mr-2">{opt.emoji}</span>{opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div><label className="block text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2"><Users className="w-5 h-5 text-orange-500" />居住人数 <span className="text-orange-500">*</span></label>
                  <div className="grid grid-cols-3 gap-3">
                    {['一人暮らし', '二人暮らし', '三人以上'].map(o => (
                      <button key={o} onClick={() => setFormData({...formData, residents: o})} className={`px-6 py-4 rounded-xl font-medium transition-all ${formData.residents === o ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{o}</button>
                    ))}
                  </div>
                </div>

                {formData.residents && (
                  <>
                    {[...Array(getPersonCount())].map((_, personIndex) => (
                      <div key={personIndex} className="bg-slate-50 rounded-2xl p-6 space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                          <User className="w-6 h-6 text-orange-500" />
                          {getPersonCount() === 1 ? 'あなたの情報' : `${personIndex + 1}人目の情報`}
                        </h3>

                        <div><label className="block text-base font-semibold text-slate-700 mb-3">年齢区分 <span className="text-orange-500">*</span></label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['18歳未満', '18-29歳', '30-49歳', '50歳以上'].map(o => (
                              <button key={o} onClick={() => updatePerson(personIndex, 'age', o)} className={`px-4 py-3 rounded-xl font-medium transition-all ${formData.persons[personIndex].age === o ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{o}</button>
                            ))}
                          </div>
                        </div>

                        <div><label className="block text-base font-semibold text-slate-700 mb-3">性別 <span className="text-orange-500">*</span></label>
                          <div className="grid grid-cols-3 gap-3">
                            {['男性', '女性', '回答しない'].map(o => (
                              <button key={o} onClick={() => updatePerson(personIndex, 'gender', o)} className={`px-4 py-3 rounded-xl font-medium transition-all ${formData.persons[personIndex].gender === o ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{o}</button>
                            ))}
                          </div>
                        </div>

                        <div><label className="block text-base font-semibold text-slate-700 mb-3">アレルギー（複数選択可）</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['特になし', '卵', '乳製品', '小麦', 'そば', '落花生', 'えび', 'かに'].map(o => (
                              <button key={o} onClick={() => handleMultiSelect(personIndex, 'allergies', o)} className={`px-3 py-2 rounded-xl font-medium transition-all text-sm ${formData.persons[personIndex].allergies.includes(o) ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{o}</button>
                            ))}
                          </div>
                          <input type="text" value={formData.persons[personIndex].allergyOther} onChange={(e) => updatePerson(personIndex, 'allergyOther', e.target.value)} className="w-full mt-3 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none" placeholder="その他のアレルギーがあれば記入してください" />
                        </div>

                        <div><label className="block text-base font-semibold text-slate-700 mb-3 flex items-center gap-2"><Utensils className="w-5 h-5 text-orange-500" />食の好み <span className="text-orange-500">*</span></label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['ご飯派', 'パン派', '麺派', 'こだわりなし'].map(o => (
                              <button key={o} onClick={() => updatePerson(personIndex, 'foodPreference', o)} className={`px-3 py-2 rounded-xl font-medium transition-all text-sm ${formData.persons[personIndex].foodPreference === o ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{o}</button>
                            ))}
                          </div>
                        </div>

                        <div><label className="block text-base font-semibold text-slate-700 mb-3">味の好み（第一希望） <span className="text-orange-500">*</span></label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['しょっぱいもの好き', 'あっさり・和食系', '甘いもの好き', '辛いもの好き'].map(o => (
                              <button key={o} onClick={() => updatePerson(personIndex, 'tastePreference', o)} className={`px-3 py-2 rounded-xl font-medium transition-all text-sm ${formData.persons[personIndex].tastePreference === o ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{o}</button>
                            ))}
                          </div>
                        </div>

                        <div><label className="block text-base font-semibold text-slate-700 mb-3">味の好み（第二希望） <span className="text-orange-500">*</span></label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['しょっぱいもの好き', 'あっさり・和食系', '甘いもの好き', '辛いもの好き'].map(o => (
                              <button key={o} onClick={() => updatePerson(personIndex, 'tastePreference2', o)} disabled={formData.persons[personIndex].tastePreference === o} className={`px-3 py-2 rounded-xl font-medium transition-all text-sm ${formData.persons[personIndex].tastePreference2 === o ? 'bg-orange-500 text-white shadow-md' : formData.persons[personIndex].tastePreference === o ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{o}</button>
                            ))}
                          </div>
                          <p className="text-sm text-slate-500 mt-2">※第一希望と異なる好みを選択してください</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                <div><label className="block text-base sm:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-500" />現在の備え <span className="text-orange-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: "none", label: "全くない", emoji: "❌" },
                      { value: "water", label: "水はある", emoji: "💧" },
                      { value: "expired", label: "期限切れが心配", emoji: "📅" }
                    ].map(opt => (
                      <button key={opt.value} onClick={() => setFormData({...formData, currentPreparation: opt.value})} className={`px-4 py-4 sm:py-3 rounded-xl font-medium transition-all min-h-[80px] sm:min-h-0 flex flex-col sm:flex-row items-center justify-center gap-2 ${formData.currentPreparation === opt.value ? "bg-orange-500 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                        <span className="text-2xl sm:text-xl">{opt.emoji}</span>
                        <span className="text-sm sm:text-base leading-tight text-center sm:text-left">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>