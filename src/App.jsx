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
    // 人数分の個別情報（最大10人まで対応）
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

  const updatePerson = (personIndex, field, value) => {
    setFormData(prev => {
      const newPersons = [...prev.persons];
      newPersons[personIndex] = { ...newPersons[personIndex], [field]: value };
      return { ...prev, persons: newPersons };
    });
  };

  const addPerson = () => {
    if (personCount < 10) {
      setPersonCount(personCount + 1);
    }
  };

  const removePerson = (index) => {
    if (personCount > 1) {
      setPersonCount(personCount - 1);
      // Reset the last person's data
      const newPersons = [...formData.persons];
      newPersons[personCount - 1] = { age: '', gender: '', allergies: [], allergyOther: '', foodPreference: '', tastePreference: '', tastePreference2: '' };
      setFormData({...formData, persons: newPersons});
    }
  };

  const getPersonCount = () => {
    return personCount;
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
    
    // 完全な商品データベース
    const foodDatabase = {
      'さばの味噌煮': { category: 'おかず', price: 440, allergens: ['小麦', 'さば', '大豆'], icon: '🐟' },
      'いわしの煮付': { category: 'おかず', price: 440, allergens: ['小麦', '大豆'], icon: '🐟' },
      '赤魚の煮付': { category: 'おかず', price: 480, allergens: ['小麦', '大豆'], icon: '🐟' },
      'ハンバーグ煮込み': { category: 'おかず', price: 480, allergens: ['小麦', '卵', '乳製品'], icon: '🍖' },
      'ハンバーグ煮込みトマトソース': { category: 'おかず', price: 480, allergens: ['小麦', '卵', '乳製品'], icon: '🍖' },
      '中華風ミートボール': { category: 'おかず', price: 440, allergens: ['小麦', '卵', '乳製品'], icon: '🥢' },
      '肉じゃが': { category: 'おかず', price: 430, allergens: ['小麦'], icon: '🥔' },
      '筑前煮': { category: 'おかず', price: 430, allergens: ['小麦'], icon: '🥕' },
      '豚汁': { category: 'おかず', price: 420, allergens: [], icon: '🍲' },
      'きんぴらごぼう': { category: 'おかず', price: 400, allergens: ['小麦'], icon: '🥕' },
      '鶏と野菜のトマト煮': { category: 'おかず', price: 480, allergens: ['小麦', '乳製品'], icon: '🍗' },
      '根菜のやわらか煮': { category: 'おかず', price: 430, allergens: ['小麦'], icon: '🥕' },
      '里芋の鶏そぼろ煮': { category: 'おかず', price: 430, allergens: ['小麦'], icon: '🍲' },
      'おでん': { category: 'おかず', price: 450, allergens: ['小麦'], icon: '🍢' },
      'けんちん汁': { category: 'おかず', price: 420, allergens: [], icon: '🍲' },
      '牛丼の具': { category: '主食', price: 550, allergens: ['小麦'], icon: '🍖' },
      'ポークカレー': { category: '主食', price: 480, allergens: ['小麦', '乳製品'], icon: '🍛' },
      '鮭粥': { category: '主食', price: 350, allergens: [], icon: '🍚' },
      '白粥': { category: '主食', price: 280, allergens: [], icon: '🍚' },
      '梅粥': { category: '主食', price: 280, allergens: [], icon: '🍚' },
      '塩ラーメン味': { category: '麺類', price: 580, allergens: ['小麦', '卵'], icon: '🍜' },
      'しょうゆラーメン味': { category: '麺類', price: 580, allergens: ['小麦', '卵'], icon: '🍜' },
      'うどん味': { category: '麺類', price: 580, allergens: ['小麦'], icon: '🍜' },
      'カルボナーラ': { category: '麺類', price: 450, allergens: ['小麦', '乳製品'], icon: '🍝' },
      'ペペロンチーノ': { category: '麺類', price: 450, allergens: [], icon: '🍝' },
      'きのこのパスタ': { category: '麺類', price: 450, allergens: ['小麦', '乳製品'], icon: '🍝' },
      '米粉でつくった山菜うどん': { category: '麺類', price: 450, allergens: [], icon: '🍜', allergenFree: true },
      '米粉でつくったカレーうどん': { category: '麺類', price: 450, allergens: [], icon: '🍜', allergenFree: true },
      'あじのムース（にんじん付）': { category: 'ムース', price: 450, allergens: ['小麦', '卵'], icon: '🐟' },
      'いかのムース（ごぼう付）': { category: 'ムース', price: 450, allergens: ['小麦', '卵'], icon: '🦑' },
      '牛肉のムース（すき焼き風）': { category: 'ムース', price: 480, allergens: ['小麦', '卵', '乳製品'], icon: '🍖' },
      '豚肉のムース（しょうが焼き風）': { category: 'ムース', price: 480, allergens: ['小麦', '卵', '乳製品'], icon: '🍖' },
      'スティックバウムクーヘン（プレーン）': { category: 'パン・甘味', price: 350, allergens: ['小麦', '卵', '乳成分', '大豆'], icon: '🍰' },
      'スティックバウムクーヘン（ココア）': { category: 'パン・甘味', price: 350, allergens: ['小麦', '卵', '乳成分', '大豆'], icon: '🍰' },
      'パンですよ!5年保存 チョコチップ味': { category: 'パン・甘味', price: 500, allergens: ['小麦', '卵', '乳成分'], icon: '🍞' },
      'パンですよ!5年保存 レーズン味': { category: 'パン・甘味', price: 500, allergens: ['小麦', '卵', '乳成分'], icon: '🍞' },
      'パンですよ!5年保存 コーヒーナッツ味': { category: 'パン・甘味', price: 500, allergens: ['小麦', '卵', '乳成分'], icon: '🍞' },
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
      
      // アレルギーチェック関数
      const allergyList = person.allergies.filter(a => a !== '特になし');
      const hasWheat = allergyList.includes('小麦');
      const hasEgg = allergyList.includes('卵');
      const hasMilk = allergyList.includes('乳製品');
      
      const canEat = (foodName) => {
        const food = foodDatabase[foodName];
        if (!food) return false;
        if (hasWheat && food.allergens.includes('小麦')) return false;
        if (hasEgg && food.allergens.includes('卵')) return false;
        if (hasMilk && food.allergens.includes('乳製品')) return false;
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
      
      // 食の好みによる優先商品選定
      if (person.foodPreference === '麺派') {
        const noodleItems = ['カルボナーラ', 'ペペロンチーノ', 'きのこのパスタ', '米粉でつくった山菜うどん', '米粉でつくったカレーうどん', 'しょうゆラーメン味', '塩ラーメン味', 'うどん味'];
        const availableNoodles = noodleItems.filter(canEat);
        selectedFoods = [...availableNoodles.slice(0, 4)]; // 麺類から4品
        
        // 残り2品を味の好みから
        const pref1Foods = tasteGroups[person.tastePreference] || [];
        const availablePref1 = pref1Foods.filter(canEat).filter(f => !selectedFoods.includes(f));
        selectedFoods = [...selectedFoods, ...availablePref1.slice(0, 2)];
      } else if (person.foodPreference === 'パン派') {
        const breadItems = ['パンですよ!5年保存 チョコチップ味', 'パンですよ!5年保存 レーズン味', 'パンですよ!5年保存 コーヒーナッツ味', 'スティックバウムクーヘン（プレーン）', 'スティックバウムクーヘン（ココア）'];
        const availableBreads = breadItems.filter(canEat);
        
        // 小麦または卵アレルギーの場合、パン商品が選べない
        if (availableBreads.length === 0) {
          // パンが食べられない場合は通常の選定
          const pref1Foods = tasteGroups[person.tastePreference] || [];
          const pref2Foods = person.tastePreference2 ? (tasteGroups[person.tastePreference2] || []) : [];
          const availablePref1 = pref1Foods.filter(canEat);
          const availablePref2 = pref2Foods.filter(canEat).filter(f => !availablePref1.includes(f));
          selectedFoods = [
            ...availablePref1.slice(0, 3),
            ...availablePref2.slice(0, 2)
          ];
        } else {
          // パン商品から3品
          selectedFoods = [...availableBreads.slice(0, 3)];
          
          // 残り3品を味の好みから
          const pref1Foods = tasteGroups[person.tastePreference] || [];
          const availablePref1 = pref1Foods.filter(canEat).filter(f => !selectedFoods.includes(f));
          selectedFoods = [...selectedFoods, ...availablePref1.slice(0, 3)];
        }
      } else {
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
      }
      
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
      if (person.foodPreference === '麺派') {
        personalizations.push({ 
          reason: `麺派に特化した選定`, 
          detail: 'アレルギー対応の麺類を中心に、バラエティ豊かな麺料理を4品選定' 
        });
      } else if (person.foodPreference === 'パン派') {
        const allergyList = person.allergies.filter(a => a !== '特になし');
        if (allergyList.includes('小麦') || allergyList.includes('卵')) {
          personalizations.push({ 
            reason: `パン派（アレルギー対応）`, 
            detail: '小麦・卵アレルギーのため、パン商品は提供できません。代わりに食べやすい商品を選定しました' 
          });
        } else {
          personalizations.push({ 
            reason: `パン派に特化した選定`, 
            detail: '5年保存可能なパンとバウムクーヘンを中心に、お好みの味付けの商品を3品選定' 
          });
        }
      }
      
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
    const annualCost = 5000 * personCount;
    
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

                <div>
                  <label className="block text-base sm:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    何人分の防災セットが必要ですか？ <span className="text-orange-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    {[1, 2, 3].map(num => (
                      <button 
                        key={num} 
                        onClick={() => setPersonCount(num)} 
                        className={`px-6 py-4 rounded-xl font-medium transition-all ${personCount === num ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                      >
                        {num}人
                      </button>
                    ))}
                    <button 
                      onClick={addPerson}
                      disabled={personCount >= 10}
                      className={`px-4 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${personCount >= 10 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                    >
                      <span className="text-xl">+</span> 人を追加
                    </button>
                  </div>
                  {personCount > 3 && (
                    <div className="text-sm text-slate-600 bg-orange-50 rounded-lg p-3">
                      現在 <strong className="text-orange-600">{personCount}人分</strong> 選択中（最大10人まで）
                    </div>
                  )}
                </div>

                {personCount > 0 && (
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
                      { value: 'none', label: '全くない', emoji: '❌' },
                      { value: 'water', label: '水はある', emoji: '💧' },
                      { value: 'expired', label: '期限切れが心配', emoji: '📅' }
                    ].map(opt => (
                      <button key={opt.value} onClick={() => setFormData({...formData, currentPreparation: opt.value})} className={`px-4 py-4 sm:py-3 rounded-xl font-medium transition-all min-h-[80px] sm:min-h-0 flex flex-col sm:flex-row items-center justify-center gap-2 ${formData.currentPreparation === opt.value ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        <span className="text-2xl sm:text-xl">{opt.emoji}</span>
                        <span className="text-sm sm:text-base leading-tight text-center sm:text-left">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
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
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">AIが最適な防災セットを構成中...</h2>
              <p className="text-lg text-slate-600">あなたの生活スタイルと防災ニーズを分析しています</p>
              <div className="max-w-md mx-auto h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="min-h-screen py-12 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 leading-tight">
                  あなたに最適な<br className="sm:hidden" />
                  『護己セット』はこちら
                </h2>
                <p className="text-base sm:text-lg text-slate-600">
                  {formData.name || 'あなた'}様のライフスタイルに<br className="sm:hidden" />合わせて厳選
                </p>
                {rec.personCount > 1 && (
                  <p className="text-orange-600 font-bold mt-2 text-base sm:text-lg">
                    🎁 {rec.personCount}人分の防災BOXを<br className="sm:hidden" />ご用意しました
                  </p>
                )}
              </div>

              {/* 防災タイプ表示 */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl shadow-xl p-8 md:p-12 text-white mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                  <span className="text-lg font-medium opacity-90">あなたの防災タイプ</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{rec.disasterType.icon}</span>
                  <h2 className="text-4xl md:text-5xl font-bold">{rec.disasterType.type}</h2>
                </div>
                <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed">
                  {rec.disasterType.advice.split('。')[0]}。<br className="hidden sm:inline" />
                  {rec.disasterType.advice.split('。')[1] && `${rec.disasterType.advice.split('。')[1]}。`}
                </p>
              </div>

              {/* 人数分のBOX表示 */}
              {rec.boxes.map((box, boxIndex) => (
                <div key={boxIndex} className="mb-8">
                  {rec.personCount > 1 && (
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Package className="w-6 h-6 text-orange-500" />
                      {box.personLabel}の防災BOX
                    </h3>
                  )}
                  
                  <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                      <User className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
                      <h4 className="text-lg sm:text-xl font-bold text-slate-800">✨ パーソナライズポイント</h4>
                    </div>
                    <div className="grid gap-4">
                      {box.personalizations.map((item, i) => (
                        <div key={i} className="bg-orange-50 rounded-xl p-4 sm:p-5 border-l-4 border-orange-500">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h5 className="font-bold text-slate-800 mb-1 text-sm sm:text-base leading-relaxed">{item.reason}</h5>
                              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-200"><Shield className="w-6 h-6 text-slate-700" /><h5 className="text-xl font-bold text-slate-800">ベースセット（必須）</h5></div>
                      <div className="space-y-3">
                        {box.baseItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"><div className="text-4xl">{item.img}</div><span className="text-slate-700 font-medium">{item.name}</span></div>
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
                </div>
              ))}

              {/* サブスクリプション情報 */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">💳 年間サブスクリプション</h3>
                  <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
                    3年周期で新鮮な保存食を<br className="sm:hidden" />お届け
                    {rec.personCount > 1 ? ` (${rec.personCount}人分)` : ''}
                  </p>
                  <div className="bg-orange-500 rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
                    <div className="text-white">
                      <div className="text-4xl sm:text-5xl font-bold mb-2">¥{rec.annualCost.toLocaleString()}</div>
                      <div className="text-lg sm:text-xl mb-4">/年</div>
                      {rec.personCount > 1 && (
                        <div className="text-xs sm:text-sm opacity-75 mb-4">
                          1人あたり ¥5,000/年
                        </div>
                      )}
                      <div className="text-xs sm:text-sm opacity-90 border-t border-white border-opacity-30 pt-4 space-y-2 text-left">
                        <p>✓ 3年ごとに新しい保存食を<br className="sm:hidden" />お届け</p>
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
                        3年ごとに新鮮な保存食を<br className="sm:hidden" />お届け
                      </p>
                    </div>
                    <span className="text-3xl sm:text-4xl font-bold text-orange-500">¥{rec.annualCost.toLocaleString()}</span>
                  </div>
                  {rec.personCount > 1 && (
                    <div className="text-sm text-slate-600 pt-2">
                      1人分 ¥5,000 × {rec.personCount}人 = ¥{rec.annualCost.toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="mt-6 bg-white bg-opacity-50 rounded-lg p-4">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <strong>📦 サービス内容:</strong><br className="sm:hidden" /> 
                    3年ごとに新しい保存食をお届けし、<br />
                    古い食品を回収します。<br />
                    常に新鮮な備蓄をキープできます。
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* 利用規約同意チェックボックス */}
                <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-slate-700">
                      <button
                        onClick={() => setShowPolicy(true)}
                        className="text-orange-500 hover:text-orange-600 underline font-medium"
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
                {copied && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                    <p className="text-green-800 font-medium">✓ 送信しました！</p>
                    <p className="text-sm text-green-700 mt-1">お申し込みを受け付けました。ご登録いただいたメールアドレスに確認のご連絡をさせていただきます。</p>
                  </div>
                )}
                <button onClick={() => handleStepChange(1)} className="w-full px-8 py-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all">最初に戻る</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* フッター */}
      <footer className="bg-slate-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6">
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-400" />
                護己 -Shuki-
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                日常に溶け込む、<br />
                あなただけの防災。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">各種ポリシー</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => setShowPolicy(true)} className="text-slate-300 hover:text-orange-400 transition-colors">
                    利用規約・プライバシーポリシー
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">お問い合わせ</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>公式LINE: <a href="https://lin.ee/v0KcwPS" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">@shuki</a></li>
                <li>メール: shukipanibo@gmail.com</li>
                <li>電話: 080-4249-1240</li>
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

export default ShukiApp;