import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, Loader2, Package, Mail, CheckCircle2, User, Home, Users, Utensils, AlertTriangle, Sparkles } from 'lucide-react';
import PolicyPage from './PolicyPage';

const ShukiApp = () => {
  const [step, setStep] = useState(1);
  const [fadeIn, setFadeIn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [personCount, setPersonCount] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    residents: '',
    livingEnvironment: '',
    currentPreparation: '',
    notes: '',
    persons: Array(10).fill(null).map(() => ({ 
      age: '', 
      gender: '', 
      allergies: [], 
      allergyOther: '', 
      foodPreference: '', 
      tastePreference: '', 
      tastePreference2: '' 
    }))
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

  const updatePerson = (i, k, v) => {
    setFormData(prev => {
      const n = [...prev.persons];
      n[i] = { ...n[i], [k]: v };
      return { ...prev, persons: n };
    });
  };

  const addPerson = () => {
    if (personCount < 10) setPersonCount(personCount + 1);
  };

  const removePerson = () => {
    if (personCount > 0) {
      setPersonCount(personCount - 1);
      setFormData(prev => {
        const newPersons = [...prev.persons];
        newPersons[personCount - 1] = { age: '', gender: '', allergies: [], allergyOther: '', foodPreference: '', tastePreference: '', tastePreference2: '' };
        return { ...prev, persons: newPersons };
      });
    }
  };

  const getPersonCount = () => personCount;

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
    
    // 完全な商品データベース（Excelデータを反映）
    const foodDatabase = {
      'さばの味噌煮': { category: 'おかず', price: 440, allergens: ['小麦', 'さば', '大豆'], icon: '🐟' },
      'いわしの煮付': { category: 'おかず', price: 440, allergens: ['小麦', '大豆'], icon: '🐟' },
      '赤魚の煮付': { category: 'おかず', price: 480, allergens: [], icon: '🐟' },
      'ハンバーグ煮込み': { category: 'おかず', price: 480, allergens: ['小麦', '卵', '乳成分', '牛肉', '大豆', '豚肉', 'りんご', 'ゼラチン'], icon: '🍖' },
      'ハンバーグ煮込みトマトソース': { category: 'おかず', price: 480, allergens: ['小麦', '卵', '乳成分', '牛肉', '大豆', '豚肉'], icon: '🍖' },
      '中華風ミートボール': { category: 'おかず', price: 440, allergens: ['小麦', '卵', '乳成分', '鶏肉', 'ごま', '大豆', '豚肉'], icon: '🥢' },
      '肉じゃが': { category: 'おかず', price: 430, allergens: ['小麦', '牛肉', '大豆'], icon: '🥔' },
      '筑前煮': { category: 'おかず', price: 430, allergens: ['小麦', '大豆', '鶏肉'], icon: '🥕' },
      '豚汁': { category: 'おかず', price: 420, allergens: ['大豆', '豚肉'], icon: '🍲' },
      'きんぴらごぼう': { category: 'おかず', price: 400, allergens: ['小麦', 'ごま', '大豆'], icon: '🥕' },
      '鶏と野菜のトマト煮': { category: 'おかず', price: 480, allergens: ['小麦', '乳成分', '鶏肉', '大豆', '牛肉'], icon: '🍗' },
      '根菜のやわらか煮': { category: 'おかず', price: 430, allergens: ['小麦', '大豆', '鶏肉'], icon: '🥕' },
      '里芋の鶏そぼろ煮': { category: 'おかず', price: 430, allergens: ['小麦', '大豆', '鶏肉'], icon: '🍲' },
      'おでん': { category: 'おかず', price: 450, allergens: ['小麦', '大豆'], icon: '🍢' },
      'けんちん汁': { category: 'おかず', price: 420, allergens: [], icon: '🍲' },
      '牛丼の具': { category: '主食', price: 550, allergens: ['小麦', '牛肉', '大豆'], icon: '🍖' },
      'ポークカレー': { category: '主食', price: 480, allergens: ['小麦', '乳成分', '牛肉', 'ごま', '大豆', '鶏肉', '豚肉', 'りんご', 'ゼラチン'], icon: '🍛' },
      '鮭粥': { category: '主食', price: 350, allergens: ['さけ'], icon: '🍚' },
      '白粥': { category: '主食', price: 280, allergens: [], icon: '🍚' },
      '梅粥': { category: '主食', price: 280, allergens: [], icon: '🍚' },
      '塩ラーメン味': { category: '麺類', price: 580, allergens: [], icon: '🍜' },
      'しょうゆラーメン味': { category: '麺類', price: 580, allergens: ['小麦', '卵', '鶏肉', 'ごま', '大豆', '豚肉'], icon: '🍜' },
      'うどん味': { category: '麺類', price: 580, allergens: ['小麦', '大豆'], icon: '🍜' },
      'カルボナーラ': { category: '麺類', price: 450, allergens: ['小麦', '乳成分', '大豆', '鶏肉', '豚肉', 'りんご', 'ゼラチン'], icon: '🍝' },
      'ペペロンチーノ': { category: '麺類', price: 450, allergens: ['小麦'], icon: '🍝' },
      'きのこのパスタ': { category: '麺類', price: 450, allergens: ['小麦', '乳成分', '大豆', '鶏肉', '豚肉', 'ゼラチン'], icon: '🍝' },
      '米粉でつくった山菜うどん': { category: '麺類', price: 450, allergens: [], icon: '🍜', allergenFree: true },
      '米粉でつくったカレーうどん': { category: '麺類', price: 450, allergens: [], icon: '🍜', allergenFree: true },
      'あじのムース（にんじん付）': { category: 'ムース', price: 450, allergens: ['小麦', '卵', '大豆', '鶏肉'], icon: '🐟' },
      'いかのムース（ごぼう付）': { category: 'ムース', price: 450, allergens: ['小麦', '卵', 'いか', '大豆', '牛肉'], icon: '🦑' },
      '牛肉のムース（すき焼き風）': { category: 'ムース', price: 480, allergens: ['小麦', '卵', '乳成分', '鶏肉', '大豆', '豚肉', '牛肉'], icon: '🍖' },
      '豚肉のムース（しょうが焼き風）': { category: 'ムース', price: 480, allergens: ['小麦', '卵', '乳成分', '大豆', '豚肉'], icon: '🍖' },
      'スティックバウムクーヘン（プレーン）': { category: '甘味', price: 350, allergens: ['小麦', '卵', '乳成分', '大豆'], icon: '🍰' },
      'スティックバウムクーヘン（ココア）': { category: '甘味', price: 350, allergens: ['小麦', '卵', '乳成分', '大豆'], icon: '🍰' },
      'さつま芋のレモン煮': { category: '副菜', price: 400, allergens: [], icon: '🍠' },
      'ソフト金時豆': { category: '副菜', price: 380, allergens: [], icon: '🫘' },
      'かぼちゃ煮（アレルゲン不使用）': { category: '副菜', price: 420, allergens: [], icon: '🎃', allergenFree: true }
    };

    // 最安基本セット
    const baseSetPrice = 1990;
    const baseSet = ['白粥', '梅粥', '鮭粥', 'スティックバウムクーヘン（プレーン）', 'スティックバウムクーヘン（ココア）', 'ソフト金時豆'];
    
    // 人数分のボックス生成
    const boxes = [];
    
    for (let i = 0; i < personCount; i++) {
      const person = formData.persons[i];
      
      // アレルギーチェック関数（全28品目対応）
      const allergyList = person.allergies.filter(a => a !== '特になし');
      
      const canEat = (foodName) => {
        const food = foodDatabase[foodName];
        if (!food) return false;
        
        // アレルゲンフリー商品は常にOK
        if (food.allergenFree) return true;
        
        // 選択されたアレルギーと商品のアレルゲンを照合
        for (const allergy of allergyList) {
          if (food.allergens.includes(allergy)) return false;
        }
        
        // その他のアレルギーもチェック
        if (person.allergyOther) {
          const otherAllergies = person.allergyOther.split(/[、,]/).map(a => a.trim()).filter(Boolean);
          for (const allergy of otherAllergies) {
            if (food.allergens.some(a => a.includes(allergy))) return false;
          }
        }
        
        return true;
      };
      
      // 好みに応じた商品グループ
      const tasteGroups = {
        'しょっぱいもの好き': ['牛丼の具', 'ポークカレー', 'しょうゆラーメン味', 'さばの味噌煮', 'ハンバーグ煮込み'],
        'あっさり・和食系': ['白粥', '梅粥', '鮭粥', 'うどん味', 'いわしの煮付', '筑前煮', '豚汁', 'けんちん汁'],
        '辛いもの好き': ['ポークカレー', 'しょうゆラーメン味', 'ハンバーグ煮込みトマトソース', '鶏と野菜のトマト煮'],
        '甘いもの好き': ['さつま芋のレモン煮', 'スティックバウムクーヘン（プレーン）', 'スティックバウムクーヘン（ココア）', 'ソフト金時豆']
      };
      
      // 選定ロジック
      let selectedFoods = [];
      let personalizations = [];
      
      // 好みの商品から選定
      const pref1Foods = tasteGroups[person.tastePreference] || [];
      const pref2Foods = person.tastePreference2 ? (tasteGroups[person.tastePreference2] || []) : [];
      
      // アレルギー対応商品を優先的に選ぶ
      const availablePref1 = pref1Foods.filter(canEat);
      const availablePref2 = pref2Foods.filter(canEat).filter(f => !availablePref1.includes(f));
      
      // 第一希望から3品、第二希望から2品を選定
      selectedFoods = [
        ...availablePref1.slice(0, 3),
        ...availablePref2.slice(0, 2)
      ];
      
      // 不足分を最安商品で埋める
      if (selectedFoods.length < 6) {
        const cheapSafe = baseSet.filter(canEat).filter(f => !selectedFoods.includes(f));
        selectedFoods = [...selectedFoods, ...cheapSafe].slice(0, 6);
      }
      
      // まだ6品に満たない場合、全商品から選ぶ
      if (selectedFoods.length < 6) {
        const allAvailable = Object.keys(foodDatabase).filter(canEat).filter(f => !selectedFoods.includes(f));
        selectedFoods = [...selectedFoods, ...allAvailable].slice(0, 6);
      }
      
      // 価格計算
      const totalPrice = selectedFoods.reduce((sum, name) => sum + (foodDatabase[name]?.price || 0), 0);
      const additionalCost = Math.max(0, totalPrice - baseSetPrice);
      
      // パーソナライズ理由
      if (person.tastePreference && person.tastePreference2) {
        personalizations.push({ 
          reason: `${person.tastePreference}と${person.tastePreference2}をバランスよく`, 
          detail: '第一希望から3品、第二希望から2品を選定してバラエティ豊かに構成' 
        });
      } else if (person.tastePreference) {
        personalizations.push({ 
          reason: `${person.tastePreference}に対応`, 
          detail: 'お好みに合わせた食品を選定' 
        });
      }
      
      if (allergyList.length > 0) {
        personalizations.push({ 
          reason: `${allergyList.join('、')}アレルギー対応`, 
          detail: 'アレルゲンを含まない食品のみを厳選' 
        });
      }
      
      personalizations.push({
        reason: `${person.age}向けに最適化`,
        detail: '15L収納ボックスに効率よく収まる、3日分の備蓄を想定'
      });
      
      // ベースアイテム
      const baseItems = [
        { name: '保存水 500ml (2本)', img: '💧' },
        { name: '防災用品 (アルミブランケット、マスク、軍手、ホイッスル、除菌シート)', img: '🎒' },
        { name: '簡易トイレ (10個)', img: '🚽' }
      ];
      
      if (formData.livingEnvironment === 'mansion') {
        baseItems.push({ name: 'BOS防臭袋（10枚）', img: '🛍️' });
      }
      
      if (person.gender === '女性') {
        baseItems.push({ name: '生理用品・衛生セット', img: '🧴' });
      }
      
      // 選定食品を整形
      const personalizedFoods = selectedFoods.map(name => ({
        name,
        img: foodDatabase[name]?.icon || '🍱',
        price: foodDatabase[name]?.price || 0
      }));
      
      boxes.push({
        personIndex: i,
        personLabel: personCount === 1 ? '' : `${i + 1}人目`,
        baseItems,
        personalizedFoods,
        personalizations,
        foodTotalPrice: totalPrice,
        additionalCost
      });
    }
    
    // 全体の合計
    const totalAdditionalCost = boxes.reduce((sum, box) => sum + box.additionalCost, 0);
    const initialCost = 9980 * personCount + totalAdditionalCost;
    const annualCost = 6000 * personCount;
    
    return {
      disasterType: generateDisasterType(),
      boxes,
      personCount,
      initialCost,
      annualCost,
      baseSetPrice,
      totalAdditionalCost
    };
  };

  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => handleStepChange(4), 3000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const submitToGoogleForm = async () => {
    try {
      const rec = generateRecommendations();
      const scriptURL = 'https://script.google.com/macros/s/AKfycbyqItT0HJx62mAGgIo4RtPPhLgX8zHTM-FsrifVmwn1ZXTIG4J21PrKr5gZAUkehp_I/exec';
      
      // 交換日（3年後）
      const exchangeDate = new Date();
      exchangeDate.setFullYear(exchangeDate.getFullYear() + 3);
      const exchangeDateStr = exchangeDate.toLocaleDateString('ja-JP');
      
      // 各人詳細
      const personDetails = rec.boxes.map((box, idx) => {
        const person = formData.persons[idx];
        return `【${box.personLabel || '本人'}】年齢:${person.age} 性別:${person.gender} アレルギー:${person.allergies.join('、') || '特になし'} 食の好み:${person.foodPreference} 味:${person.tastePreference}${person.tastePreference2 ? '/' + person.tastePreference2 : ''}`;
      }).join(' | ');
      
      // ベースアイテム
      const baseItems = rec.boxes.map((box, idx) => {
        return `[${box.personLabel || '本人'}]${box.baseItems.map(item => item.name).join('、')}`;
      }).join(' | ');
      
      // 個別食品
      const personalizedFoods = rec.boxes.map((box, idx) => {
        return `[${box.personLabel || '本人'}]${box.personalizedFoods.map(item => item.name).join('、')}`;
      }).join(' | ');
      
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('phone', formData.phone);
      formDataToSubmit.append('disasterType', rec.disasterType.type);
      formDataToSubmit.append('livingEnvironment', formData.livingEnvironment);
      formDataToSubmit.append('currentPreparation', formData.currentPreparation);
      formDataToSubmit.append('initialCost', rec.initialCost);
      formDataToSubmit.append('annualCost', rec.annualCost);
      formDataToSubmit.append('exchangeDate', exchangeDateStr);
      formDataToSubmit.append('personDetails', personDetails);
      formDataToSubmit.append('baseItems', baseItems);
      formDataToSubmit.append('personalizedFoods', personalizedFoods);
      
      await fetch(scriptURL, { method: 'POST', body: formDataToSubmit });
      alert('お申し込みありがとうございます！\n担当者より3営業日以内にご連絡いたします。');
    } catch (error) {
      console.error('Error!', error.message);
      alert('送信に失敗しました。お手数ですが、もう一度お試しください。');
    }
  };

  const rec = step === 4 ? generateRecommendations() : { boxes: [], initialCost: 9980, annualCost: 6000, disasterType: {}, personCount: 1 };

  if (showPolicy) {
    return <PolicyPage onBack={() => setShowPolicy(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-slate-800">護己 -Shuki-</h1>
              <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">日常に溶け込む、あなただけの防災。</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs sm:text-sm text-slate-600">
            <span className="hidden sm:inline">ステップ</span> {step}/4
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {step === 1 && (
          <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-12 mb-8">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
                  <span className="text-orange-500">3分で完了</span><br className="sm:hidden" />
                  <span className="sm:inline"> </span>あなた専用の<br className="sm:hidden" />防災プラン診断
                </h2>
                <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
                  日常に溶け込む、<br className="sm:hidden" />あなただけの防災。<br />
                  アレルギーや好みに合わせて、<br className="sm:hidden" />最適な備蓄をご提案します。
                </p>
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

                <div>
                  <label className="block text-base sm:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    何人分の防災セットが必要ですか？ <span className="text-orange-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    {[1, 2, 3].map(num => (
                      <button key={num} onClick={() => setPersonCount(num)} className={`px-4 py-3 rounded-xl font-medium transition-all min-h-[48px] ${personCount === num ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        {num}人
                      </button>
                    ))}
                    <button onClick={addPerson} disabled={personCount >= 10} className={`px-4 py-3 rounded-xl font-medium transition-all min-h-[48px] ${personCount >= 10 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                      + 人を追加
                    </button>
                  </div>
                  {personCount >= 4 && (
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                      <span className="text-sm text-slate-700">現在<span className="font-bold text-orange-500">{personCount}人分</span>選択中</span>
                      <button onClick={removePerson} className="px-3 py-1 text-sm bg-white border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-all min-h-[36px]">
                        - 人を減らす
                      </button>
                    </div>
                  )}
                </div>

                <div><label className="block text-base sm:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2"><Package className="w-5 h-5 text-orange-500" />現在の備え <span className="text-orange-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'none', label: '全くない', emoji: '❌' },
                      { value: 'some', label: '少しある', emoji: '📦' },
                      { value: 'full', label: '十分ある', emoji: '✅' }
                    ].map(opt => (
                      <button key={opt.value} onClick={() => setFormData({...formData, currentPreparation: opt.value})} className={`flex flex-col sm:flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all min-h-[80px] ${formData.currentPreparation === opt.value ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        <span className="text-2xl">{opt.emoji}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 sm:mt-10 flex justify-end">
                <button onClick={() => handleStepChange(2)} disabled={!formData.name || !formData.email || !formData.phone || !formData.livingEnvironment || personCount === 0 || !formData.currentPreparation} className="px-8 sm:px-10 py-3 sm:py-4 bg-orange-500 text-white text-base sm:text-lg font-bold rounded-xl hover:bg-orange-600 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-lg min-h-[48px]">
                  次へ<ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-4">
                  <User className="inline w-8 h-8 text-orange-500 mr-2" />
                  詳細情報の入力
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  各人の情報を入力してください
                </p>
              </div>

              <div className="space-y-8">
                {Array.from({ length: personCount }, (_, personIndex) => (
                  <div key={personIndex} className="bg-slate-50 rounded-xl p-4 sm:p-6 space-y-6">
                    <h3 className="text-lg sm:text-xl font-bold text-orange-500 border-b-2 border-orange-200 pb-2">
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

                    <div>
                      <label className="block text-base font-semibold text-slate-700 mb-3">
                        <AlertTriangle className="inline w-5 h-5 text-orange-500 mr-1" />
                        アレルギー（複数選択可）
                      </label>
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-slate-600 mb-2">特定原材料（8品目）</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {['特になし', '卵', '乳成分', '小麦', 'そば', '落花生', 'えび', 'かに'].map(o => (
                            <button key={o} onClick={() => handleMultiSelect(personIndex, 'allergies', o)} className={`px-3 py-2 rounded-xl font-medium transition-all text-sm ${formData.persons[personIndex].allergies.includes(o) ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{o}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-600 mb-2">準特定原材料（20品目）</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {['アーモンド', 'あわび', 'いか', 'いくら', 'オレンジ', 'カシューナッツ', 'キウイ', '牛肉', 'くるみ', 'ごま', 'さけ', 'さば', '大豆', '鶏肉', 'バナナ', '豚肉', 'まつたけ', 'もも', 'やまいも', 'りんご'].map(o => (
                            <button key={o} onClick={() => handleMultiSelect(personIndex, 'allergies', o)} className={`px-2 py-2 rounded-lg font-medium transition-all text-xs ${formData.persons[personIndex].allergies.includes(o) ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{o}</button>
                          ))}
                        </div>
                      </div>
                      <input type="text" value={formData.persons[personIndex].allergyOther} onChange={(e) => updatePerson(personIndex, 'allergyOther', e.target.value)} className="w-full mt-3 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none" placeholder="その他のアレルギーがあれば記入してください" />
                    </div>

                    <div><label className="block text-base font-semibold text-slate-700 mb-3">
                      <Utensils className="inline w-5 h-5 text-orange-500 mr-1" />
                      食の好み <span className="text-orange-500">*</span>
                    </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['ご飯派', 'パン派'].map(o => (
                          <button key={o} onClick={() => updatePerson(personIndex, 'foodPreference', o)} className={`px-4 py-3 rounded-xl font-medium transition-all ${formData.persons[personIndex].foodPreference === o ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{o}</button>
                        ))}
                      </div>
                    </div>

                    <div><label className="block text-base font-semibold text-slate-700 mb-3">味の好み（第一希望） <span className="text-orange-500">*</span></label>
                      <div className="grid grid-cols-2 gap-3">
                        {['しょっぱいもの好き', 'あっさり・和食系', '辛いもの好き', '甘いもの好き'].map(o => (
                          <button key={o} onClick={() => updatePerson(personIndex, 'tastePreference', o)} className={`px-4 py-3 rounded-xl font-medium transition-all text-sm ${formData.persons[personIndex].tastePreference === o ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{o}</button>
                        ))}
                      </div>
                    </div>

                    <div><label className="block text-base font-semibold text-slate-700 mb-3">味の好み（第二希望）</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['しょっぱいもの好き', 'あっさり・和食系', '辛いもの好き', '甘いもの好き'].filter(o => o !== formData.persons[personIndex].tastePreference).map(o => (
                          <button key={o} onClick={() => updatePerson(personIndex, 'tastePreference2', o)} className={`px-4 py-3 rounded-xl font-medium transition-all text-sm ${formData.persons[personIndex].tastePreference2 === o ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{o}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                <button 
                  onClick={() => handleStepChange(3)} 
                  disabled={!formData.name || !formData.email || !formData.phone || !formData.livingEnvironment || personCount === 0 || !formData.currentPreparation || 
                    formData.persons.slice(0, getPersonCount()).some(p => 
                      !p.age || !p.gender || !p.foodPreference || !p.tastePreference || !p.tastePreference2
                    )
                  } 
                  className="px-10 py-4 bg-orange-500 text-white text-lg font-bold rounded-xl hover:bg-orange-600 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-lg">
                  AI診断結果を見る<Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-6" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">AIが最適なプランを作成中...</h2>
              <p className="text-slate-600">あなたに最適な防災セットを選定しています</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">{rec.disasterType.icon}</div>
                  <h2 className="text-3xl font-bold mb-2">あなたは</h2>
                  <div className="text-4xl font-bold mb-6">{rec.disasterType.type}</div>
                  <p className="text-lg leading-relaxed opacity-90">{rec.disasterType.advice}</p>
                </div>
              </div>

              {rec.boxes.map((box, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  {box.personLabel && (
                    <h3 className="text-2xl font-bold text-orange-500 mb-6 flex items-center gap-2">
                      <User className="w-6 h-6" />{box.personLabel}
                    </h3>
                  )}

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-50 rounded-2xl shadow-lg p-6">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-200"><Package className="w-6 h-6 text-slate-600" /><h5 className="text-xl font-bold text-slate-800">必須アイテム</h5></div>
                      <div className="space-y-3">
                        {box.baseItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"><div className="text-4xl">{item.img}</div><span className="text-slate-700 font-medium">{item.name}</span></div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-orange-200">
                        <div className="flex items-center gap-2">
                          <Package className="w-6 h-6 text-orange-500" />
                          <h5 className="text-xl font-bold text-slate-800">パーソナライズ食品</h5>
                        </div>
                        {box.additionalCost > 0 && (
                          <span className="text-sm text-orange-600 font-semibold">+¥{box.additionalCost}</span>
                        )}
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {box.personalizedFoods.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                            <div className="text-4xl">{item.img}</div>
                            <span className="text-slate-700 font-medium">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-4 sm:p-6">
                    <h5 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-orange-500" />パーソナライズされた理由</h5>
                    <div className="space-y-2">
                      {box.personalizations.map((p, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-semibold text-orange-600">✓ {p.reason}</span>
                          <p className="text-slate-600 ml-4">{p.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* サブスクリプション情報 */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">💳 年間サブスクリプション</h3>
                  <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
                    3年ごとに新鮮な保存食をお届け
                    {rec.personCount > 1 ? ` (${rec.personCount}人分)` : ''}
                  </p>
                  <div className="bg-orange-500 rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
                    <div className="text-white">
                      <div className="text-4xl sm:text-5xl font-bold mb-2">¥{rec.annualCost.toLocaleString()}</div>
                      <div className="text-lg sm:text-xl mb-4">/年</div>
                      {rec.personCount > 1 && (
                        <div className="text-xs sm:text-sm opacity-75 mb-4">
                          1人あたり ¥6,000/年
                        </div>
                      )}
                      <div className="text-xs sm:text-sm opacity-90 border-t border-white border-opacity-30 pt-4 space-y-2 text-left">
                        <p>✓ 3年ごとに新しい保存食をお届け</p>
                        <p>✓ 古い食品の回収サービス付き</p>
                        <p>✓ 常に新鮮な備蓄をキープ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 sm:p-8 mb-8 border-2 border-orange-200">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-orange-300 gap-2">
                    <span className="text-base sm:text-lg font-bold text-slate-800">💰 初期コスト（初回のみ）</span>
                    <span className="text-2xl sm:text-3xl font-bold text-orange-500">¥{rec.initialCost.toLocaleString()}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>基本セット（{rec.personCount}人分）</span>
                      <span>¥{(9980 * rec.personCount).toLocaleString()}</span>
                    </div>
                    {rec.totalAdditionalCost > 0 && (
                      <div className="flex justify-between text-orange-600 font-semibold">
                        <span>カスタマイズ追加料金</span>
                        <span>+¥{rec.totalAdditionalCost.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-orange-200 font-bold text-base">
                      <span>合計</span>
                      <span>¥{rec.initialCost.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-xl sm:text-2xl font-bold text-slate-800">年間サブスク料金</span>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        3年ごとに新鮮な保存食をお届け
                      </p>
                    </div>
                    <span className="text-3xl sm:text-4xl font-bold text-orange-500">¥{rec.annualCost.toLocaleString()}</span>
                  </div>
                  {rec.personCount > 1 && (
                    <div className="text-sm text-slate-600 pt-2">
                      1人分 ¥6,000 × {rec.personCount}人 = ¥{rec.annualCost.toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="mt-6 bg-white bg-opacity-50 rounded-lg p-4">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <strong>📦 サービス内容:</strong><br /> 
                    3年ごとに新しい保存食をお届けし、<br />
                    古い食品を回収します。<br />
                    常に新鮮な備蓄をキープできます。
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* 利用規約同意チェックボックス */}
                <div className="bg-white rounded-xl p-4 border-2 border-orange-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 text-orange-500 border-2 border-slate-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-slate-700">
                      <button 
                        onClick={() => setShowPolicy(true)}
                        className="text-orange-500 hover:text-orange-600 font-semibold underline"
                      >
                        利用規約・プライバシーポリシー
                      </button>
                      に同意します
                    </span>
                  </label>
                </div>

                <button 
                  onClick={submitToGoogleForm} 
                  disabled={!agreedToTerms}
                  className={`w-full px-8 py-5 text-white text-xl font-bold rounded-xl transition-all shadow-lg inline-flex items-center justify-center gap-3 ${
                    agreedToTerms 
                      ? 'bg-orange-500 hover:bg-orange-600 transform hover:scale-105 cursor-pointer' 
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  <Mail className="w-6 h-6" />このプランで申し込む
                </button>

                <button onClick={() => handleStepChange(1)} className="w-full px-8 py-4 bg-slate-100 text-slate-700 text-lg font-semibold rounded-xl hover:bg-slate-200 transition-all">
                  最初に戻る
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield className="w-6 h-6 text-orange-500" />護己 -Shuki-</h3>
              <p className="text-slate-300 text-sm">
                日常に溶け込む、<br />
                あなただけの防災。
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">各種ポリシー</h4>
              <button onClick={() => setShowPolicy(true)} className="text-slate-300 hover:text-white transition-colors text-sm">
                利用規約・プライバシーポリシー
              </button>
            </div>
            <div>
              <h4 className="font-bold mb-4">お問い合わせ</h4>
              <p className="text-slate-300 text-sm">公式LINE: <a href="https://lin.ee/v0KcwPS" className="text-orange-400 hover:text-orange-300">@shuki</a></p>
              <p className="text-slate-300 text-sm">メール: shukipanibo@gmail.com</p>
              <p className="text-slate-300 text-sm">電話: 080-4249-1240</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center text-slate-400 text-sm">
            © 2024 合同会社護己 All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShukiApp;
