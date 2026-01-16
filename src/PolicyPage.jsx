import React, { useState } from 'react';
import { ArrowLeft, FileText, Shield, RefreshCw, Scale } from 'lucide-react';

const PolicyPage = ({ onBack, defaultTab = 'terms' }) => {
  const [activePolicy, setActivePolicy] = useState(defaultTab);

  const policies = {
    terms: {
      title: '利用規約',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">利用規約</h3>
            <p className="text-sm text-slate-500">最終更新日：2025年12月27日</p>
          </div>

          <p className="leading-relaxed">
            本利用規約（以下「本規約」といいます）は、合同会社護己（以下「当社」といいます）が提供する「護己-Shuki-」（以下「本サービス」といいます）の利用条件を定めるものです。
          </p>

          <div>
            <h4 className="font-semibold text-base mb-2">第1条（適用）</h4>
            <p className="leading-relaxed mb-2">
              本規約は、本サービスの提供条件及び本サービスの利用に関する当社とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">第2条（サービス内容）</h4>
            <p className="leading-relaxed mb-2">
              本サービスは、ユーザーの生活環境や家族構成などの診断結果に基づき、最適な防災備蓄プランを提案し、防災用品・食料品等をセットで販売するサービスです。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">第3条（料金及び支払方法）</h4>
            <ul className="list-disc list-inside space-y-1 leading-relaxed">
              <li>初回セット料金：9,980円（税込）〜</li>
              <li>年額サブスクリプション：年額5,000円（税込）/1人あたり</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">第4条（運営会社情報）</h4>
            <div className="space-y-1 leading-relaxed">
              <p>• サービス名：護己-Shuki-</p>
              <p>• 運営者：合同会社護己</p>
              <p>• 代表者：竹内啓介</p>
              <p>• 所在地：〒573-0121 大阪府枚方市津田西町3-23-10</p>
              <p>• 公式LINE：<a href="https://lin.ee/v0KcwPS" className="text-orange-500 underline" target="_blank" rel="noopener noreferrer">https://lin.ee/v0KcwPS</a></p>
              <p>• メールアドレス：shukipanibo@gmail.com</p>
              <p>• 電話番号：080-4249-1240</p>
            </div>
          </div>
        </div>
      )
    },
    privacy: {
      title: 'プライバシーポリシー',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">プライバシーポリシー</h3>
            <p className="text-sm text-slate-500">最終更新日：2025年12月27日</p>
          </div>

          <p className="leading-relaxed">
            合同会社護己は、「護己-Shuki-」における個人情報の取扱いについて、以下のとおり定めます。
          </p>

          <div>
            <h4 className="font-semibold text-base mb-2">第1条（収集する個人情報）</h4>
            <div className="space-y-2 leading-relaxed">
              <p>1. 基本情報</p>
              <p className="ml-4">お名前、メールアドレス、電話番号、配送先住所</p>
              
              <p>2. 診断情報</p>
              <p className="ml-4">家族構成、年齢層、性別、食物アレルギー情報、食の好み</p>
              
              <p>3. 決済情報</p>
              <p className="ml-4">クレジットカード情報（決済代行会社を通じて処理）</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">第2条（利用目的）</h4>
            <ul className="list-disc list-inside space-y-1 leading-relaxed">
              <li>本サービスの提供・運営のため</li>
              <li>商品の配送のため</li>
              <li>決済処理のため</li>
              <li>お問い合わせへの回答のため</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">第3条（第三者提供）</h4>
            <p className="leading-relaxed mb-2">以下の業務委託先に必要な範囲で個人情報を提供します：</p>
            <ul className="list-disc list-inside space-y-1 leading-relaxed ml-4">
              <li>決済代行会社（決済処理のため）</li>
              <li>配送業者（商品配送のため）</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">第4条（お問い合わせ窓口）</h4>
            <div className="space-y-1 leading-relaxed">
              <p>• 運営者：合同会社護己</p>
              <p>• 代表者：竹内啓介</p>
              <p>• 公式LINE：<a href="https://lin.ee/v0KcwPS" className="text-orange-500 underline" target="_blank" rel="noopener noreferrer">https://lin.ee/v0KcwPS</a></p>
              <p>• メールアドレス：shukipanibo@gmail.com</p>
              <p>• 電話番号：080-4249-1240</p>
            </div>
          </div>
        </div>
      )
    },
    cancellation: {
      title: 'キャンセルポリシー',
      icon: RefreshCw,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">キャンセルポリシー・返品規定</h3>
            <p className="text-sm text-slate-500">最終更新日：2025年12月27日</p>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">第1条（発送前のキャンセル）</h4>
            <p className="leading-relaxed mb-2">
              発送完了通知前までであれば、全額返金にて対応いたします。
            </p>
            <div className="space-y-1 leading-relaxed ml-4">
              <p>• 公式LINE：<a href="https://lin.ee/v0KcwPS" className="text-orange-500 underline" target="_blank" rel="noopener noreferrer">https://lin.ee/v0KcwPS</a></p>
              <p>• メール：shukipanibo@gmail.com</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">第2条（発送後の返品）</h4>
            <p className="leading-relaxed">
              発送完了後のお客様都合による返品・交換・キャンセルは、未開封であっても一切お受けできません。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">第3条（不良品・誤配送）</h4>
            <p className="leading-relaxed">
              商品到着後7日以内にご連絡ください。<br />
              送料当社負担にて交換または返金いたします。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">第4条（サブスクリプションの解約）</h4>
            <p className="leading-relaxed mb-2">
              次回更新日の前日までにお手続きいただければ、次回請求は発生しません。
            </p>
            <p className="leading-relaxed">
              自動更新後の途中解約による返金は原則としてお受けできません。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">第5条（連絡先）</h4>
            <div className="space-y-1 leading-relaxed">
              <p>• 合同会社護己</p>
              <p>• 代表者：竹内啓介</p>
              <p>• 公式LINE：<a href="https://lin.ee/v0KcwPS" className="text-orange-500 underline" target="_blank" rel="noopener noreferrer">https://lin.ee/v0KcwPS</a></p>
              <p>• メール：shukipanibo@gmail.com</p>
              <p>• 電話：080-4249-1240</p>
            </div>
          </div>
        </div>
      )
    },
    tokushoho: {
      title: '特定商取引法',
      icon: Scale,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">特定商取引法に基づく表記</h3>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">販売業者</h4>
            <p className="leading-relaxed">合同会社護己</p>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">運営責任者</h4>
            <p className="leading-relaxed">代表社員 竹内啓介</p>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">所在地</h4>
            <p className="leading-relaxed">〒573-0121 大阪府枚方市津田西町3-23-10</p>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">お問い合わせ</h4>
            <div className="space-y-1 leading-relaxed">
              <p>• 公式LINE：<a href="https://lin.ee/v0KcwPS" className="text-orange-500 underline" target="_blank" rel="noopener noreferrer">https://lin.ee/v0KcwPS</a></p>
              <p>• メール：shukipanibo@gmail.com</p>
              <p>• 電話：080-4249-1240</p>
              <p>• 受付時間：平日10:00〜17:00</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">販売価格</h4>
            <ul className="list-disc list-inside space-y-1 leading-relaxed">
              <li>初回セット：9,980円（税込）〜</li>
              <li>年額サブスクリプション：5,000円（税込）/1人あたり</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">支払方法</h4>
            <ul className="list-disc list-inside space-y-1 leading-relaxed">
              <li>クレジットカード</li>
              <li>銀行振込</li>
              <li>PayPay</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">商品引渡時期</h4>
            <p className="leading-relaxed">
              ご注文確認後（銀行振込の場合は入金確認後）、7〜10営業日以内に発送
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-2">返品・交換</h4>
            <ul className="list-disc list-inside space-y-1 leading-relaxed">
              <li>発送前のキャンセル：全額返金</li>
              <li>発送後のお客様都合：返品不可</li>
              <li>不良品・誤配送：商品到着後7日以内にご連絡</li>
            </ul>
          </div>
        </div>
      )
    }
  };

  const PolicyIcon = policies[activePolicy].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-orange-500 transition-colors min-h-[48px]"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="font-medium text-base sm:text-lg">診断に戻る</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">各種ポリシー</h1>
          <p className="text-sm sm:text-base text-slate-600">
            サービス利用に関する重要事項をご確認ください
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {Object.entries(policies).map(([key, policy]) => {
            const Icon = policy.icon;
            return (
              <button
                key={key}
                onClick={() => setActivePolicy(key)}
                className={`p-3 sm:p-4 rounded-xl font-medium transition-all min-h-[64px] sm:min-h-auto ${
                  activePolicy === key
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-orange-50'
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1 sm:mb-2" />
                <div className="text-xs sm:text-sm leading-tight">{policy.title}</div>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <PolicyIcon className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              {policies[activePolicy].title}
            </h2>
          </div>
          <div className="prose prose-slate max-w-none text-sm sm:text-base">
            {policies[activePolicy].content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
