import React, { useState, useEffect } from 'react';

import { auth, db } from './firebase';import { Shield, ArrowRight, Loader2, Package, Mail, CheckCircle2, User, Home, Users, Utensils, AlertTriangle, Sparkles, LogOut, UserCircle, MapPin, CreditCard } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import AuthModal from './AuthModal';
import PolicyPage from './PolicyPage';
import MyPage from './MyPage';

const ShukiApp = () => {
  const [step, setStep] = useState(1);
  const [fadeIn, setFadeIn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPolicy, setShowPolicy] = useState(null); // false → null に変更
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [personCount, setPersonCount] = useState(0);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [showMyPage, setShowMyPage] = useState(false);
  const [userDiagnoses, setUserDiagnoses] = useState([]);
  const [userSelections, setUserSelections] = useState([]); 
  const [paymentMethod, setPaymentMethod] = useState(null); // 'card' または 'bank'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    residents: '',
    livingEnvironment: '',
    currentPreparation: '',
    notes: '',
    shippingAddress: {
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: ''
  },
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
      'かぼちゃ煮（アレルゲン不使用）': { category: '副菜', price: 420, allergens: [], icon: '🎃', allergenFree: true },
      '尾西の五目ごはん': { category: '主食', price: 380, allergens: ['大豆', '小麦'], icon: '🍚' },
      '尾西の松茸ごはん': { category: '主食', price: 480, allergens: ['乳製品', '大豆', '小麦'], icon: '🍚' },
      '尾西のチキンライス': { category: '主食', price: 420, allergens: ['豚肉', '大豆', '鶏肉', '小麦'], icon: '🍚' },
      '尾西のえびピラフ': { category: '主食', price: 420, allergens: ['乳製品', 'かに', 'えび', '豚肉', '鶏肉', '小麦'], icon: '🍚' },
      '尾西の白飯': { category: '主食', price: 300, allergens: [], icon: '🍚', allergenFree: true },
      '尾西の赤飯': { category: '主食', price: 380, allergens: [], icon: '🍚', allergenFree: true },
      '尾西のわかめごはん': { category: '主食', price: 380, allergens: [], icon: '🍚', allergenFree: true },
      '尾西のきのこごはん': { category: '主食', price: 380, allergens: [], icon: '🍚', allergenFree: true },
      '尾西の山菜おこわ': { category: '主食', price: 380, allergens: [], icon: '🍚', allergenFree: true },
      '尾西のたけのこごはん': { category: '主食', price: 480, allergens: [], icon: '🍚', allergenFree: true },
      '尾西のアレルギー対応五目ごはん': { category: '主食', price: 400, allergens: [], icon: '🍚', allergenFree: true },
      '尾西のドライカレー': { category: '主食', price: 420, allergens: [], icon: '🍛', allergenFree: true },
      '白がゆ': { category: '主食', price: 280, allergens: [], icon: '🍚', allergenFree: true },
      '梅がゆ': { category: '主食', price: 300, allergens: [], icon: '🍚', allergenFree: true },
      '塩こんぶがゆ': { category: '主食', price: 320, allergens: [], icon: '🍚', allergenFree: true },
      '尾西のレンジ＋（プラス）五目ごはん': { category: '主食', price: 450, allergens: ['大豆', '小麦'], icon: '🍚' },
      '尾西のレンジ＋（プラス）チキンライス': { category: '主食', price: 450, allergens: ['豚肉', '大豆', '鶏肉', '小麦'], icon: '🍚' },
      '尾西のレンジ＋（プラス）赤飯': { category: '主食', price: 450, allergens: [], icon: '🍚', allergenFree: true },
      '尾西のレンジ＋（プラス）きのこごはん': { category: '主食', price: 450, allergens: [], icon: '🍚', allergenFree: true },
      '尾西のレンジ＋（プラス）山菜おこわ': { category: '主食', price: 450, allergens: [], icon: '🍚', allergenFree: true },
      '尾西のレンジ＋（プラス）たけのこごはん': { category: '主食', price: 480, allergens: [], icon: '🍚', allergenFree: true },
      '尾西のレンジ＋（プラス）ドライカレー': { category: '主食', price: 450, allergens: [], icon: '🍛', allergenFree: true },
      '携帯おにぎり 鮭': { category: '主食', price: 250, allergens: [], icon: '🍙', allergenFree: true },
      '携帯おにぎり わかめ': { category: '主食', price: 250, allergens: [], icon: '🍙', allergenFree: true },
      '携帯おにぎり 五目おこわ': { category: '主食', price: 250, allergens: [], icon: '🍙', allergenFree: true },
      '携帯おにぎり 昆布': { category: '主食', price: 250, allergens: [], icon: '🍙', allergenFree: true },
      '米粉でつくった山菜うどん': { category: '麺類', price: 500, allergens: [], icon: '🍜', allergenFree: true },
      '米粉でつくったカレーうどん': { category: '麺類', price: 550, allergens: [], icon: '🍜', allergenFree: true },
      '佐竹 白飯': { category: '主食', price: 330, allergens: ['小麦'], icon: '🍚' },
      '佐竹 五目ご飯': { category: '主食', price: 420, allergens: ['小麦'], icon: '🍚' },
      '佐竹 わかめご飯': { category: '主食', price: 390, allergens: ['小麦'], icon: '🍚' },
      '佐竹 青菜ご飯': { category: '主食', price: 390, allergens: ['小麦'], icon: '🍚' },
      '佐竹 梅昆布ご飯': { category: '主食', price: 440, allergens: ['小麦'], icon: '🍚' },
      '佐竹 鯛めし': { category: '主食', price: 440, allergens: ['小麦'], icon: '🍚' },
      '佐竹 梅じゃこご飯': { category: '主食', price: 390, allergens: ['小麦'], icon: '🍚' },
      '佐竹 根菜ご飯': { category: '主食', price: 420, allergens: ['小麦'], icon: '🍚' },
      '佐竹 ドライカレー': { category: '主食', price: 420, allergens: ['小麦'], icon: '🍛' },
      '佐竹 野菜ピラフ': { category: '主食', price: 420, allergens: ['小麦'], icon: '🍚' },
      '佐竹 チャーハン': { category: '主食', price: 420, allergens: ['小麦'], icon: '🍚' },
      '佐竹 白がゆ': { category: '主食', price: 310, allergens: ['小麦'], icon: '🍚' },
      '佐竹 梅がゆ': { category: '主食', price: 340, allergens: ['小麦'], icon: '🍚' },
      '佐竹 青菜がゆ': { category: '主食', price: 340, allergens: ['小麦'], icon: '🍚' },
      'カルボナーラ': { category: '麺類', price: 430, allergens: ['小麦', '乳製品', '大豆', '鶏肉', '豚肉'], icon: '🍝' },
      'ペペロンチーノ': { category: '麺類', price: 400, allergens: ['小麦'], icon: '🍝' },
      'きのこのパスタ': { category: '麺類', price: 400, allergens: ['小麦', '乳製品', '大豆', '鶏肉', '豚肉'], icon: '🍝' },
      '醤油だし風味ラーメン': { category: '麺類', price: 300, allergens: ['さば', '大豆', '鶏肉', '小麦'], icon: '🍜' },
      'チゲ風味ラーメン': { category: '麺類', price: 360, allergens: ['小麦', '乳製品', '大豆', '鶏肉', '豚肉'], icon: '🍜' },
      'シーフード風味ラーメン': { category: '麺類', price: 360, allergens: ['小麦', '乳製品', 'えび', 'かに', 'さば', '大豆', '鶏肉', '豚肉'], icon: '🍜' }
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
      
     // ★10品推奨ロジック（修正版）
      let recommendedFoods = [];
      let personalizations = [];
      
      // 食の好みによる優先商品選定
      if (person.foodPreference === '麺派') {
        const noodleItems = Object.keys(foodDatabase).filter(name => 
          foodDatabase[name].category === '麺類' && canEat(name)
        );
        recommendedFoods = [...noodleItems.slice(0, 6)]; // 麺類から6品
        personalizations.push({ 
          reason: `麺派に特化した選定`, 
          detail: 'アレルギー対応の麺類を中心に、バラエティ豊かな麺料理を選定' 
        });
      } else if (person.foodPreference === 'パン派') {
        const breadItems = Object.keys(foodDatabase).filter(name => 
          foodDatabase[name].category === 'パン・甘味' && canEat(name)
        );
        recommendedFoods = [...breadItems.slice(0, 4)]; // パン系から4品
        personalizations.push({ 
          reason: `パン派に特化した選定`, 
          detail: '5年保存可能なパンを中心に選定' 
        });
      } else {
        // 主食優先
        const mainDishes = Object.keys(foodDatabase).filter(name => 
          foodDatabase[name].category === '主食' && canEat(name)
        );
        recommendedFoods = [...mainDishes.slice(0, 5)]; // 主食から5品
      }
      
      // 残りを味の好みから追加
      const pref1Foods = tasteGroups[person.tastePreference] || [];
      const pref2Foods = person.tastePreference2 ? (tasteGroups[person.tastePreference2] || []) : [];
      const availablePref1 = pref1Foods.filter(canEat).filter(f => !recommendedFoods.includes(f));
      const availablePref2 = pref2Foods.filter(canEat).filter(f => !recommendedFoods.includes(f) && !availablePref1.includes(f));
      
      recommendedFoods = [
        ...recommendedFoods,
        ...availablePref1.slice(0, 3),
        ...availablePref2.slice(0, 2)
      ];
      
      // 10品に調整
      if (recommendedFoods.length < 10) {
        const allAvailable = Object.keys(foodDatabase).filter(canEat).filter(f => !recommendedFoods.includes(f));
        recommendedFoods = [...recommendedFoods, ...allAvailable].slice(0, 10);
      } else {
        recommendedFoods = recommendedFoods.slice(0, 10);
      }
      
      // パーソナライズ理由の追加（既存のコードを維持）
      if (person.tastePreference && person.tastePreference2) {
        personalizations.push({ 
          reason: `${person.tastePreference}と${person.tastePreference2}をバランスよく`, 
          detail: '第一希望から3品、第二希望から2品を選定してバラエティ豊かに構成' 
        });
      }
      
      if (allergyList.length > 0) {
        personalizations.push({ 
          reason: `${allergyList.join('、')}アレルギー対応`, 
          detail: 'アレルゲンを含まない食品のみを厳選' 
        });
      }
        
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
      
     // ★推奨食品を整形（10品）
      const recommendedItems = recommendedFoods.map(name => ({
        name,
        img: foodDatabase[name]?.icon || '🍱',
        price: foodDatabase[name]?.price || 0,
        category: foodDatabase[name]?.category || '主食'
      }));
      
      boxes.push({
        personIndex: i,
        personLabel: personCount === 1 ? '' : `${i + 1}人目`,
        baseItems,
        recommendedItems, // ★10品の推奨商品
        personalizations
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
    };  // ← この行を追加
  };  // ← generateRecommendations関数の終わり
  
// ★新機能1: 選択をトグル（修正版）
  const toggleSelection = (personIndex, itemName) => {
    setUserSelections(prev => {
      const newSelections = [...prev];
      
      // personIndex分の配列がない場合は初期化
      while (newSelections.length <= personIndex) {
        newSelections.push([]);
      }
      
      if (!Array.isArray(newSelections[personIndex])) {
        newSelections[personIndex] = [];
      }
      
      const currentSelection = [...newSelections[personIndex]];
      const index = currentSelection.indexOf(itemName);
      
      if (index > -1) {
        // 選択解除
        currentSelection.splice(index, 1);
      } else {
        // 選択追加（6品まで）
        if (currentSelection.length < 6) {
          currentSelection.push(itemName);
        }
      }
      
      newSelections[personIndex] = currentSelection;
      return newSelections;
    });
  };
// ★新機能2: 選択の検証（主食2品以上）- 5段階料金体系対応
  const validateSelection = (personIndex) => {
    const selected = userSelections[personIndex] || [];
    
    // 商品データベース（generateRecommendationsと同じ定義を使用）
    const foodDatabase = {
      '牛丼の具': { category: '主食', price: 550 },
      'ポークカレー': { category: '主食', price: 480 },
      '鮭粥': { category: '主食', price: 350 },
      '白粥': { category: '主食', price: 280 },
      '梅粥': { category: '主食', price: 280 },
      '塩ラーメン味': { category: '麺類', price: 580 },
      'しょうゆラーメン味': { category: '麺類', price: 580 },
      'うどん味': { category: '麺類', price: 580 },
      'カルボナーラ': { category: '麺類', price: 450 },
      'ペペロンチーノ': { category: '麺類', price: 450 },
      'きのこのパスタ': { category: '麺類', price: 450 },
      '米粉でつくった山菜うどん': { category: '麺類', price: 450, allergenFree: true },
      '米粉でつくったカレーうどん': { category: '麺類', price: 450, allergenFree: true },
      'パンですよ!5年保存 チョコチップ味': { category: 'パン・甘味', price: 500 },
      'パンですよ!5年保存 レーズン味': { category: 'パン・甘味', price: 500 },
      'パンですよ!5年保存 コーヒーナッツ味': { category: 'パン・甘味', price: 500 },
      'スティックバウムクーヘン（プレーン）': { category: 'パン・甘味', price: 350 },
      'スティックバウムクーヘン（ココア）': { category: 'パン・甘味', price: 350 },
      'さばの味噌煮': { category: 'おかず', price: 440 },
      'いわしの煮付': { category: 'おかず', price: 440 },
      '赤魚の煮付': { category: 'おかず', price: 480 },
      'ハンバーグ煮込み': { category: 'おかず', price: 480 },
      'ハンバーグ煮込みトマトソース': { category: 'おかず', price: 480 },
      '中華風ミートボール': { category: 'おかず', price: 440 },
      '肉じゃが': { category: 'おかず', price: 430 },
      '筑前煮': { category: 'おかず', price: 430 },
      '豚汁': { category: 'おかず', price: 420 },
      'きんぴらごぼう': { category: 'おかず', price: 400 },
      '鶏と野菜のトマト煮': { category: 'おかず', price: 480 },
      '根菜のやわらか煮': { category: 'おかず', price: 430 },
      '里芋の鶏そぼろ煮': { category: 'おかず', price: 430 },
      'おでん': { category: 'おかず', price: 450 },
      'けんちん汁': { category: 'おかず', price: 420 },
      'さつま芋のレモン煮': { category: '副菜', price: 400 },
      'ソフト金時豆': { category: '副菜', price: 380 },
      'かぼちゃ煮（アレルゲン不使用）': { category: '副菜', price: 420, allergenFree: true },
      '尾西の五目ごはん': { category: '主食', price: 380 },
      '尾西の松茸ごはん': { category: '主食', price: 480 },
      '尾西のチキンライス': { category: '主食', price: 420 },
      '尾西のえびピラフ': { category: '主食', price: 420 },
      '尾西の白飯': { category: '主食', price: 300, allergenFree: true },
      '尾西の赤飯': { category: '主食', price: 380, allergenFree: true },
      '尾西のわかめごはん': { category: '主食', price: 380, allergenFree: true },
      '尾西のきのこごはん': { category: '主食', price: 380, allergenFree: true },
      '尾西の山菜おこわ': { category: '主食', price: 380, allergenFree: true },
      '尾西のたけのこごはん': { category: '主食', price: 480, allergenFree: true },
      '尾西のアレルギー対応五目ごはん': { category: '主食', price: 400, allergenFree: true },
      '尾西のドライカレー': { category: '主食', price: 420, allergenFree: true },
      '白がゆ': { category: '主食', price: 280, allergenFree: true },
      '梅がゆ': { category: '主食', price: 300, allergenFree: true },
      '塩こんぶがゆ': { category: '主食', price: 320, allergenFree: true },
      '尾西のレンジ＋（プラス）五目ごはん': { category: '主食', price: 450 },
      '尾西のレンジ＋（プラス）チキンライス': { category: '主食', price: 450 },
      '尾西のレンジ＋（プラス）赤飯': { category: '主食', price: 450, allergenFree: true },
      '尾西のレンジ＋（プラス）きのこごはん': { category: '主食', price: 450, allergenFree: true },
      '尾西のレンジ＋（プラス）山菜おこわ': { category: '主食', price: 450, allergenFree: true },
      '尾西のレンジ＋（プラス）たけのこごはん': { category: '主食', price: 480, allergenFree: true },
      '尾西のレンジ＋（プラス）ドライカレー': { category: '主食', price: 450, allergenFree: true },
      '携帯おにぎり 鮭': { category: '主食', price: 250, allergenFree: true },
      '携帯おにぎり わかめ': { category: '主食', price: 250, allergenFree: true },
      '携帯おにぎり 五目おこわ': { category: '主食', price: 250, allergenFree: true },
      '携帯おにぎり 昆布': { category: '主食', price: 250, allergenFree: true },
      '佐竹 白飯': { category: '主食', price: 330 },
      '佐竹 五目ご飯': { category: '主食', price: 420 },
      '佐竹 わかめご飯': { category: '主食', price: 390 },
      '佐竹 青菜ご飯': { category: '主食', price: 390 },
      '佐竹 梅昆布ご飯': { category: '主食', price: 440 },
      '佐竹 鯛めし': { category: '主食', price: 440 },
      '佐竹 梅じゃこご飯': { category: '主食', price: 390 },
      '佐竹 根菜ご飯': { category: '主食', price: 420 },
      '佐竹 ドライカレー': { category: '主食', price: 420 },
      '佐竹 野菜ピラフ': { category: '主食', price: 420 },
      '佐竹 チャーハン': { category: '主食', price: 420 },
      '佐竹 白がゆ': { category: '主食', price: 310 },
      '佐竹 梅がゆ': { category: '主食', price: 340 },
      '佐竹 青菜がゆ': { category: '主食', price: 340 },
      '醤油だし風味ラーメン': { category: '麺類', price: 300 },
      'チゲ風味ラーメン': { category: '麺類', price: 360 },
      'シーフード風味ラーメン': { category: '麺類', price: 360 },
      'あじのムース（にんじん付）': { category: 'ムース', price: 450 },
      'いかのムース（ごぼう付）': { category: 'ムース', price: 450 },
      '牛肉のムース（すき焼き風）': { category: 'ムース', price: 480 },
      '豚肉のムース（しょうが焼き風）': { category: 'ムース', price: 480 }
    };
    
    if (selected.length === 0) {
      return { isValid: false, selectedCount: 0, mainDishCount: 0, totalPrice: 0, additionalCost: 0 };
    }
    
    // 選択された商品のカテゴリと価格をチェック
    const mainDishCount = selected.filter(name => {
      const food = foodDatabase[name];
      return food && food.category === '主食';
    }).length;
    
    // 価格計算
    const totalPrice = selected.reduce((sum, name) => {
      const food = foodDatabase[name];
      return sum + (food?.price || 0);
    }, 0);
    
    // ★5段階の料金体系で追加料金を計算
    let additionalCost = 0;
    if (totalPrice <= 2200) {
      additionalCost = 710;  // 基本セット¥1,990 + ¥710 = ¥2,700
    } else if (totalPrice <= 2500) {
      additionalCost = 1010; // = ¥3,000
    } else if (totalPrice <= 2800) {
      additionalCost = 1510; // = ¥3,500
    } else if (totalPrice <= 3100) {
      additionalCost = 2010; // = ¥4,000
    } else {
      additionalCost = 2510; // = ¥4,500
    }
    
    return {
      isValid: selected.length === 6 && mainDishCount >= 2,
      selectedCount: selected.length,
      mainDishCount,
      totalPrice,
      additionalCost
    };
  };
  
  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserDiagnoses(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);
  
  // 診断結果をFirestoreに保存
  const saveDiagnosisToFirestore = async (user, result) => {
    try {
      await addDoc(collection(db, 'diagnoses'), {
        userId: user.uid,
        userEmail: user.email,
        userName: formData.name,
        timestamp: new Date(),
        formData: formData,
        result: result,
        status: 'pending',
        initialCost: result.initialCost,
        annualCost: result.annualCost
      });
    } catch (error) {
      console.error('診断結果の保存に失敗しました:', error);
    }
  };
  
  // ユーザーの診断履歴を取得
  const loadUserDiagnoses = async (userId) => {
    try {
      const q = query(
        collection(db, 'diagnoses'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const diagnoses = [];
      querySnapshot.forEach((doc) => {
        diagnoses.push({ id: doc.id, ...doc.data() });
      });
      setUserDiagnoses(diagnoses);
    } catch (error) {
      console.error('診断履歴の取得に失敗しました:', error);
    }
  };
  // ログイン成功時の処理
  const handleAuthSuccess = async (authUser) => {
    setUser(authUser);
    const result = generateRecommendations();
    await saveDiagnosisToFirestore(authUser, result);
    setDiagnosisResult(result);
    setShowAuthModal(false);
    handleStepChange(4);
  };
  
  // ログアウト
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setShowMyPage(false);
      setUserDiagnoses([]);
      handleStepChange(1);
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };
  
  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => {
        // 常にログインモーダルを表示
        setShowAuthModal(true);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [step]);


 const submitToGoogleForm = async () => {
  try {
    console.log('🚀 申し込み処理開始');
    const rec = generateRecommendations();
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwTecuqsmXSRAyREVlfUE3V-V8DzX6RLgPh4FpTGdbnzukJ1oTkeMlc-39gxgPq0JNM/exec'
    
    const exchangeDate = new Date();
    exchangeDate.setFullYear(exchangeDate.getFullYear() + 3);
    const exchangeDateStr = exchangeDate.toLocaleDateString('ja-JP');
    
    const personDetails = rec.boxes.map((box, idx) => {
      const person = formData.persons[idx];
      return `【${box.personLabel || '本人'}】年齢:${person.age} 性別:${person.gender} アレルギー:${person.allergies.join('、') || '特になし'} 食の好み:${person.foodPreference} 味:${person.tastePreference}${person.tastePreference2 ? '/' + person.tastePreference2 : ''}`;
    }).join(' | ');
    
    const baseItems = rec.boxes.map((box, idx) => {
      return `[${box.personLabel || '本人'}]${box.baseItems.map(item => item.name).join('、')}`;
    }).join(' | ');
    
    const recommendedFoods = rec.boxes.map((box, idx) => {
      return `[${box.personLabel || '本人'}]${box.recommendedItems.map(item => item.name).join('、')}`;
    }).join(' | ');
    
    // ★ここで住所を整形（関数の中で定義）
    const shippingAddressText = `〒${formData.shippingAddress.postalCode} ${formData.shippingAddress.prefecture}${formData.shippingAddress.city}${formData.shippingAddress.address}${formData.shippingAddress.building ? ' ' + formData.shippingAddress.building : ''}`;
    
    const additionalCosts = rec.boxes.map((box, idx) => {
  const validation = validateSelection(idx);
  return validation.additionalCost;
});

    console.log('📦 データ準備完了:', {
  name: formData.name,
  email: formData.email,
  shippingAddress: shippingAddressText,
  initialCost: rec.initialCost,
  annualCost: rec.annualCost,
  additionalCosts: additionalCosts
});

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('phone', formData.phone);
    formDataToSubmit.append('disasterType', rec.disasterType.type);
    formDataToSubmit.append('livingEnvironment', formData.livingEnvironment);
    formDataToSubmit.append('currentPreparation', formData.currentPreparation);
    formDataToSubmit.append('initialCost', rec.initialCost.toString());
formDataToSubmit.append('annualCost', rec.annualCost.toString());
    formDataToSubmit.append('exchangeDate', exchangeDateStr);
    formDataToSubmit.append('personDetails', personDetails);
    formDataToSubmit.append('baseItems', baseItems);
    formDataToSubmit.append('recommendedFoods', recommendedFoods);
    formDataToSubmit.append('shippingAddress', shippingAddressText);
    formDataToSubmit.append('postalCode', formData.shippingAddress.postalCode);
    formDataToSubmit.append('prefecture', formData.shippingAddress.prefecture);
    formDataToSubmit.append('city', formData.shippingAddress.city);
    formDataToSubmit.append('address', formData.shippingAddress.address);
    formDataToSubmit.append('building', formData.shippingAddress.building || '');
    formDataToSubmit.append('additionalCosts', JSON.stringify(additionalCosts));
    formDataToSubmit.append('paymentMethod', paymentMethod);
    
    console.log('📡 Google Apps Scriptにリクエスト送信中...');
    
    await fetch(scriptURL, { method: 'POST', body: formDataToSubmit });
    
    console.log('✅ 送信完了');
    alert('お申し込みありがとうございます！\n担当者より3営業日以内にご連絡いたします。');
  } catch (error) {
    console.error('❌ Error!', error.message);
    alert('送信に失敗しました。お手数ですが、もう一度お試しください。');
  }
};
  const rec = diagnosisResult || (step === 4 ? generateRecommendations() : { boxes: [], initialCost: 9980, annualCost: 6000, disasterType: {}, personCount: 1 });

if (showPolicy) {
  return <PolicyPage onBack={() => setShowPolicy(null)} defaultTab={showPolicy} />;
}

if (showMyPage) {
  return (
    <MyPage 
      user={user} 
      userDiagnoses={userDiagnoses} 
      onLogout={handleLogout} 
      onViewDiagnosis={(diagnosis) => {
        setDiagnosisResult(diagnosis.result);
        setShowMyPage(false);
        handleStepChange(4);
      }}
      onBackToHome={() => {
        setShowMyPage(false);
        handleStepChange(1);
      }}
    />
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        
        {step === 1 && (
  <>
    {/* ヘッダー */}
    {user && (
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-slate-600" />
            <span className="text-sm text-slate-600">{user.email}</span>
          </div>
          <button
            onClick={() => setShowMyPage(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all text-sm"
          >
            マイページ
          </button>
        </div>
      </div>
    )}
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

    {/* サービス説明セクション - Stripe審査用 */}
    <div className="max-w-4xl mx-auto px-4 pb-16">
      {/* サービス概要 */}
      <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          護己-Shuki- とは？
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          護己-Shuki-は、あなたの生活環境や家族構成に合わせた
          <strong>防災備蓄食品をお届けするサブスクリプションサービス</strong>です。
          面倒な賞味期限管理もお任せください。
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">1. 診断</h3>
            <p className="text-sm text-gray-600">家族構成やアレルギーなど簡単な質問に回答</p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">2. 提案</h3>
            <p className="text-sm text-gray-600">AIがあなたに最適な備蓄プランを提案</p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">3. お届け</h3>
            <p className="text-sm text-gray-600">3年に一度ご自宅に防災食品をお届け</p>
          </div>
        </div>
      </section>

     {/* 料金プラン */}
<section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
    料金プラン
  </h2>
  <div className="max-w-2xl mx-auto">
    <div className="grid md:grid-cols-2 gap-6">
      {/* 初期費用 */}
      <div className="border-2 border-orange-400 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-2">初期費用（商品代）</p>
        <p className="text-4xl font-bold text-orange-500 mb-2">
          ¥9,980<span className="text-lg font-normal text-gray-500">〜</span>
        </p>
        <p className="text-sm text-gray-500 mb-4">（税込・送料込み）</p>
        <ul className="text-left text-sm text-gray-600 space-y-2">
          <li>✓ 3年分の防災備蓄食品セット</li>
          <li>✓ 家族人数に応じたカスタマイズ</li>
          <li>✓ アレルギー対応可能</li>
        </ul>
      </div>
      {/* 年会費 */}
      <div className="border-2 border-slate-300 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-2">年会費</p>
        <p className="text-4xl font-bold text-slate-700 mb-2">
          ¥6,000<span className="text-lg font-normal text-gray-500">/年</span>
        </p>
        <p className="text-sm text-gray-500 mb-4">（税込）</p>
        <ul className="text-left text-sm text-gray-600 space-y-2">
          <li>✓ 賞味期限管理サービス</li>
          <li>✓ 期限前の自動お知らせ</li>
          <li>✓ 入れ替え時期のご案内</li>
        </ul>
      </div>
    </div>
    <p className="text-xs text-gray-500 mt-6 text-center">
      ※ご家族の人数や選択オプションにより初期費用が変動します<br />
      ※商品は3年周期でお届け（今後2年・1年周期も導入予定）
    </p>
  </div>
</section>

      {/* 届く商品例 */}
      <section className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          お届けする商品例
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <span className="text-3xl mb-2 block">🍚</span>
            <p className="text-sm font-medium">アルファ米</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <span className="text-3xl mb-2 block">🥫</span>
            <p className="text-sm font-medium">缶詰・レトルト</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <span className="text-3xl mb-2 block">💧</span>
            <p className="text-sm font-medium">長期保存水</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <span className="text-3xl mb-2 block">🍪</span>
            <p className="text-sm font-medium">栄養補助食品</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-6 text-center">
          ※診断結果に基づき、最適な商品を組み合わせてお届けします
        </p>
      </section>
    </div>
  </>
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
<div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 space-y-6 mt-8">

  <div className="flex items-center gap-3 mb-4">
    <MapPin className="w-6 h-6 text-blue-600" />
    <h3 className="text-xl font-bold text-slate-800">配送先住所</h3>
  </div>

  {/* 郵便番号 */}
  <div>
    <label className="block text-base font-semibold text-slate-700 mb-3">
      郵便番号 <span className="text-orange-500">*</span>
    </label>
    <input
      type="text"
      value={formData.shippingAddress.postalCode}
      onChange={(e) => setFormData({
        ...formData, 
        shippingAddress: {...formData.shippingAddress, postalCode: e.target.value}
      })}
      className="w-full px-4 py-3 sm:py-4 text-base border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none min-h-[48px]"
      placeholder="123-4567"
    />
  </div>

  {/* 都道府県 */}
  <div>
    <label className="block text-base font-semibold text-slate-700 mb-3">
      都道府県 <span className="text-orange-500">*</span>
    </label>
    <input
      type="text"
      value={formData.shippingAddress.prefecture}
      onChange={(e) => setFormData({
        ...formData, 
        shippingAddress: {...formData.shippingAddress, prefecture: e.target.value}
      })}
      className="w-full px-4 py-3 sm:py-4 text-base border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none min-h-[48px]"
      placeholder="東京都"
    />
  </div>

  {/* 市区町村 */}
  <div>
    <label className="block text-base font-semibold text-slate-700 mb-3">
      市区町村 <span className="text-orange-500">*</span>
    </label>
    <input
      type="text"
      value={formData.shippingAddress.city}
      onChange={(e) => setFormData({
        ...formData, 
        shippingAddress: {...formData.shippingAddress, city: e.target.value}
      })}
      className="w-full px-4 py-3 sm:py-4 text-base border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none min-h-[48px]"
      placeholder="渋谷区"
    />
  </div>

  {/* 番地 */}
  <div>
    <label className="block text-base font-semibold text-slate-700 mb-3">
      番地 <span className="text-orange-500">*</span>
    </label>
    <input
      type="text"
      value={formData.shippingAddress.address}
      onChange={(e) => setFormData({
        ...formData, 
        shippingAddress: {...formData.shippingAddress, address: e.target.value}
      })}
      className="w-full px-4 py-3 sm:py-4 text-base border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none min-h-[48px]"
      placeholder="1-2-3"
    />
  </div>

  {/* 建物名・部屋番号 */}
  <div>
    <label className="block text-base font-semibold text-slate-700 mb-3">
      建物名・部屋番号
    </label>
    <input
      type="text"
      value={formData.shippingAddress.building}
      onChange={(e) => setFormData({
        ...formData, 
        shippingAddress: {...formData.shippingAddress, building: e.target.value}
      })}
      className="w-full px-4 py-3 sm:py-4 text-base border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none min-h-[48px]"
      placeholder="〇〇マンション101号室（任意）"
    />
  </div>
</div>

              <div className="mt-10 flex justify-end">
  <button 
    onClick={() => handleStepChange(3)} 
    disabled={
      !formData.name || 
      !formData.email || 
      !formData.phone || 
      !formData.livingEnvironment || 
      personCount === 0 || 
      !formData.currentPreparation ||
      !formData.shippingAddress.postalCode ||
      !formData.shippingAddress.prefecture ||
      !formData.shippingAddress.city ||
      !formData.shippingAddress.address ||
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
      {rec.boxes.map((box, boxIndex) => {
        const validation = validateSelection(boxIndex);
        const isSelected = (itemName) => (userSelections[boxIndex] || []).includes(itemName);

        return (
          <div key={boxIndex} className="mb-8">
            {rec.personCount > 1 && (
              <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-orange-500" />
                {box.personLabel}の防災BOX
              </h3>
            )}
            
            {/* パーソナライズポイント */}
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
              {/* ベースセット */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-200">
                  <Shield className="w-6 h-6 text-slate-700" />
                  <h5 className="text-xl font-bold text-slate-800">ベースセット（必須）</h5>
                </div>
                <div className="space-y-3">
                  {box.baseItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="text-4xl">{item.img}</div>
                      <span className="text-slate-700 font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ★新UI: 10品から6品選択 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="mb-4 pb-3 border-b-2 border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Package className="w-6 h-6 text-orange-500" />
                      <h5 className="text-xl font-bold text-slate-800">食品を選択</h5>
                    </div>
                    <span className={`text-sm font-semibold ${validation.selectedCount === 6 ? 'text-green-600' : 'text-orange-600'}`}>
                      選択中: {validation.selectedCount}/6品
                    </span>
                  </div>
                  
                  {/* バリデーションメッセージ */}
                  {validation.selectedCount < 6 && (
                    <p className="text-xs text-slate-600 mt-2">
                      あと{6 - validation.selectedCount}品選択してください
                    </p>
                  )}
                  {validation.selectedCount === 6 && validation.mainDishCount < 2 && (
                    <p className="text-xs text-red-600 mt-2 font-semibold">
                      ⚠️ 主食🍚は2品以上選んでください（現在{validation.mainDishCount}品）
                    </p>
                  )}
                  {validation.isValid && (
                    <p className="text-xs text-green-600 mt-2 font-semibold">
                      ✓ 選択完了！ 追加料金: +¥{validation.additionalCost}
                    </p>
                  )}
                </div>

                {/* 10品グリッド表示 */}
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {box.recommendedItems.map((item, i) => {
                    const selected = isSelected(item.name);
                    const isMainDish = item.category === '主食';
                    
                    return (
                      <button
                        key={i}
                        onClick={() => toggleSelection(boxIndex, item.name)}
                        disabled={!selected && validation.selectedCount >= 6}
                        className={`
                          relative p-3 rounded-lg border-2 transition-all text-left
                          ${selected 
                            ? 'bg-orange-500 border-orange-600 text-white shadow-md scale-105' 
                            : 'bg-slate-50 border-slate-200 hover:border-orange-300 hover:shadow-sm'
                          }
                          ${!selected && validation.selectedCount >= 6 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {/* 選択チェックマーク */}
                        {selected && (
                          <div className="absolute top-1 right-1 bg-white rounded-full p-0.5">
                            <CheckCircle2 className="w-4 h-4 text-orange-500" />
                          </div>
                        )}
                        
                        {/* 主食バッジ */}
                        {isMainDish && (
                          <div className="absolute top-1 left-1 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">
                            🍚主食
                          </div>
                        )}
                        
                        <div className="flex flex-col gap-1 mt-6">
  <div className="text-2xl">{item.img}</div>
  <span className={`text-xs font-medium leading-tight ${selected ? 'text-white' : 'text-slate-700'}`}>
    {item.name}
  </span>
</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}

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
                  1人あたり ¥6,000/年
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

      {/* 価格サマリー */}
     <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 sm:p-8 mb-8 border-2 border-orange-200">
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-orange-300 gap-2">
      <span className="text-base sm:text-lg font-bold text-slate-800">💰 初期コスト（初回のみ）</span>
      <span className="text-2xl sm:text-3xl font-bold text-orange-500">
        ¥{(9980 * rec.personCount + rec.boxes.reduce((sum, box, idx) => sum + validateSelection(idx).additionalCost, 0)).toLocaleString()}
      </span>
    </div>
    <div className="text-xs sm:text-sm text-slate-600 space-y-1">
      <div className="flex justify-between">
        <span>基本セット（{rec.personCount}人分）</span>
        <span>¥{(9980 * rec.personCount).toLocaleString()}</span>
      </div>
      {rec.boxes.map((box, idx) => {
        const validation = validateSelection(idx);
        if (validation.additionalCost > 0) {
          return (
            <div key={idx} className="flex justify-between text-orange-600 font-semibold">
              <span>{box.personLabel || '本人'}の追加料金</span>
              <span>+¥{validation.additionalCost.toLocaleString()}</span>
            </div>
          );
        }
        return null;
      })}
      <div className="flex justify-between pt-2 border-t border-orange-200 font-bold text-base">
        <span>小計（初期費用）</span>
        <span>¥{(9980 * rec.personCount + rec.boxes.reduce((sum, box, idx) => sum + validateSelection(idx).additionalCost, 0)).toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-slate-700">
        <span>年間サブスク（{rec.personCount}人分）</span>
        <span>¥{rec.annualCost.toLocaleString()}</span>
      </div>
      <div className="flex justify-between pt-2 border-t-2 border-orange-300 font-bold text-lg text-orange-600">
        <span>合計（初年度）</span>
        <span>¥{(9980 * rec.personCount + rec.boxes.reduce((sum, box, idx) => sum + validateSelection(idx).additionalCost, 0) + rec.annualCost).toLocaleString()}</span>
      </div>
    </div>
  </div>
</div>

      {/* 申し込みボタン */}
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
  onClick={() => setShowPolicy('terms')}
  className="text-orange-500 hover:text-orange-600 underline font-medium"
>
  利用規約・プライバシーポリシー
</button>
              に同意します
            </span>
          </label>
        </div>

        {/* 全員選択完了チェック */}
        {rec.boxes.some((box, idx) => !validateSelection(idx).isValid) && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-yellow-800 font-medium">⚠️ すべての人の食品を選択してください</p>
            <div className="text-sm text-yellow-700 mt-2 space-y-1">
              {rec.boxes.map((box, idx) => {
                const validation = validateSelection(idx);
                if (!validation.isValid) {
                  return (
                    <p key={idx}>
                      {box.personLabel || '本人'}: 
                      {validation.selectedCount < 6 && ` あと${6 - validation.selectedCount}品選択`}
                      {validation.selectedCount === 6 && validation.mainDishCount < 2 && ' 主食を2品以上選択'}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

       {/* 支払い方法選択ボタン */}
<div className="space-y-4">
  <p className="text-center text-lg font-bold text-slate-800 mb-4">
    💳 お支払い方法を選択してください
  </p>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* クレジットカード */}
    <button
      onClick={() => {
        setPaymentMethod('card');
        submitToGoogleForm();
      }}
      disabled={!agreedToTerms || rec.boxes.some((box, idx) => !validateSelection(idx).isValid)}
      className={`px-8 py-5 text-white text-lg font-bold rounded-xl transition-all shadow-lg flex flex-col items-center gap-3 ${
        agreedToTerms && rec.boxes.every((box, idx) => validateSelection(idx).isValid)
          ? 'bg-orange-500 hover:bg-orange-600 transform hover:scale-105 cursor-pointer'
          : 'bg-slate-300 cursor-not-allowed'
      }`}
    >
      <CreditCard className="w-8 h-8" />
      <span>クレジットカード決済</span>
      <span className="text-sm font-normal opacity-90">即時決済・すぐに発送手配</span>
    </button>

    {/* 銀行振込 */}
    <button
  onClick={async () => {
    setPaymentMethod('bank');
    // 少し待ってから送信
    await new Promise(resolve => setTimeout(resolve, 100));
    submitToGoogleForm();
  }}
      disabled={!agreedToTerms || rec.boxes.some((box, idx) => !validateSelection(idx).isValid)}
      className={`px-8 py-5 text-white text-lg font-bold rounded-xl transition-all shadow-lg flex flex-col items-center gap-3 ${
        agreedToTerms && rec.boxes.every((box, idx) => validateSelection(idx).isValid)
          ? 'bg-blue-500 hover:bg-blue-600 transform hover:scale-105 cursor-pointer'
          : 'bg-slate-300 cursor-not-allowed'
      }`}
    >
      <Mail className="w-8 h-8" />
      <span>銀行振込で申し込む</span>
      <span className="text-sm font-normal opacity-90">振込先をメールでご案内</span>
    </button>
  </div>
</div>
        
        {copied && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-800 font-medium">✓ 送信しました！</p>
            <p className="text-sm text-green-700 mt-1">お申し込みを受け付けました。ご登録いただいたメールアドレスに確認のご連絡をさせていただきます。</p>
          </div>
        )}
        
        <button onClick={() => handleStepChange(1)} className="w-full px-8 py-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all">
          最初に戻る
        </button>
      </div>
    </div>
  </div>
)}


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
      <button onClick={() => setShowPolicy('terms')} className="text-slate-300 hover:text-orange-400 transition-colors">
        利用規約
      </button>
    </li>
    <li>
      <button onClick={() => setShowPolicy('privacy')} className="text-slate-300 hover:text-orange-400 transition-colors">
        プライバシーポリシー
      </button>
    </li>
    <li>
      <button onClick={() => setShowPolicy('cancellation')} className="text-slate-300 hover:text-orange-400 transition-colors">
        キャンセルポリシー
      </button>
    </li>
    <li>
      <button onClick={() => setShowPolicy('tokushoho')} className="text-slate-300 hover:text-orange-400 transition-colors">
        特定商取引法に基づく表記
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
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess} 
      />
    </div>
    </div>
);
};
export default ShukiApp;