import React, { useState } from 'react';
import { ArrowLeft, FileText, Shield, RefreshCw, Scale } from 'lucide-react';

const PolicyPage = ({ onBack }) => {
  const [activePolicy, setActivePolicy] = useState('terms');

  const policies = {
    terms: {
      title: '利用規約',
      icon: FileText,
      content: `利用規約

最終更新日：2024年12月27日

本利用規約（以下「本規約」といいます）は、合同会社護己（以下「当社」といいます）が提供する「護己-Shuki-」（以下「本サービス」といいます）の利用条件を定めるものです。

第1条（適用）
1. 本規約は、本サービスの提供条件及び本サービスの利用に関する当社とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。

第2条（サービス内容）
本サービスは、ユーザーの生活環境や家族構成などの診断結果に基づき、最適な防災備蓄プランを提案し、防災用品・食料品等をセットで販売するサービスです。

第3条（料金及び支払方法）
1. 初回セット料金：9,980円（税込）〜
2. 年額サブスクリプション：年額5,000円（税込）/1人あたり

第4条（運営会社情報）
- サービス名：護己-Shuki-
- 運営者：合同会社護己
- 代表者：竹内啓介
- 所在地：〒573-0121 大阪府枚方市津田西町3-23-10
- 公式LINE：https://lin.ee/v0KcwPS
- メールアドレス：shukipanibo@gmail.com
- 電話番号：080-4249-1240`
    },
    privacy: {
      title: 'プライバシーポリシー',
      icon: Shield,
      content: `プライバシーポリシー

最終更新日：2024年12月27日

合同会社護己は、「護己-Shuki-」における個人情報の取扱いについて、以下のとおり定めます。

第1条（収集する個人情報）
1. 基本情報：お名前、メールアドレス、電話番号、配送先住所
2. 診断情報：家族構成、年齢層、性別、食物アレルギー情報、食の好み
3. 決済情報：クレジットカード情報（決済代行会社を通じて処理）

第2条（利用目的）
- 本サービスの提供・運営のため
- 商品の配送のため
- 決済処理のため
- お問い合わせへの回答のため

第3条（第三者提供）
以下の業務委託先に必要な範囲で個人情報を提供します：
- 決済代行会社（決済処理のため）
- 配送業者（商品配送のため）

第4条（お問い合わせ窓口）
- 運営者：合同会社護己
- 代表者：竹内啓介
- 公式LINE：https://lin.ee/v0KcwPS
- メールアドレス：shukipanibo@gmail.com
- 電話番号：080-4249-1240`
    },
    cancellation: {
      title: 'キャンセルポリシー',
      icon: RefreshCw,
      content: `キャンセルポリシー・返品規定

最終更新日：2024年12月27日

第1条（発送前のキャンセル）
発送完了通知前までであれば、全額返金にて対応いたします。
- 公式LINE：https://lin.ee/v0KcwPS
- メール：shukipanibo@gmail.com

第2条（発送後の返品）
発送完了後のお客様都合による返品・交換・キャンセルは、未開封であっても一切お受けできません。

第3条（不良品・誤配送）
商品到着後7日以内にご連絡ください。送料当社負担にて交換または返金いたします。

第4条（サブスクリプションの解約）
次回更新日の前日までにお手続きいただければ、次回請求は発生しません。
自動更新後の途中解約による返金は原則としてお受けできません。

第5条（連絡先）
- 合同会社護己
- 代表者：竹内啓介
- 公式LINE：https://lin.ee/v0KcwPS
- メール：shukipanibo@gmail.com
- 電話：080-4249-1240`
    },
    tokushoho: {
      title: '特定商取引法に基づく表記',
      icon: Scale,
      content: `特定商取引法に基づく表記

販売業者：合同会社護己
運営責任者：代表社員 竹内啓介
所在地：〒573-0121 大阪府枚方市津田西町3-23-10

お問い合わせ：
- 公式LINE：https://lin.ee/v0KcwPS
- メール：shukipanibo@gmail.com
- 電話：080-4249-1240
- 受付時間：平日10:00〜17:00

販売価格：
- 初回セット：9,980円（税込）〜
- 年額サブスクリプション：5,000円（税込）/1人あたり

支払方法：
- クレジットカード
- 銀行振込
- PayPay

商品引渡時期：
ご注文確認後（銀行振込の場合は入金確認後）、7〜10営業日以内に発送

返品・交換：
- 発送前のキャンセル：全額返金
- 発送後のお客様都合：返品不可
- 不良品・誤配送：商品到着後7日以内にご連絡`
    }
  };

  const PolicyIcon = policies[activePolicy].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">診断に戻る</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">各種ポリシー</h1>
          <p className="text-slate-600">サービス利用に関する重要事項をご確認ください</p>
        </div>

        {/* タブ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {Object.entries(policies).map(([key, policy]) => {
            const Icon = policy.icon;
            return (
              <button
                key={key}
                onClick={() => setActivePolicy(key)}
                className={`p-4 rounded-xl font-medium transition-all ${
                  activePolicy === key
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-orange-50'
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-2" />
                <div className="text-sm">{policy.title}</div>
              </button>
            );
          })}
        </div>

        {/* コンテンツ */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <PolicyIcon className="w-8 h-8 text-orange-500" />
            <h2 className="text-2xl font-bold text-slate-800">
              {policies[activePolicy].title}
            </h2>
          </div>
          <div className="prose prose-slate max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
              {policies[activePolicy].content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
