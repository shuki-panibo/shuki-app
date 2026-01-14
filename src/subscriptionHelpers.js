// subscriptionHelpers.js
// Firestore上でサブスクリプション情報を管理するためのヘルパー関数

import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * サブスクリプション状態を更新（管理者用）
 * @param {string} diagnosisId - 診断ID
 * @param {object} subscriptionData - 更新するサブスク情報
 */
export const updateSubscriptionStatus = async (diagnosisId, subscriptionData) => {
  try {
    const docRef = doc(db, 'diagnoses', diagnosisId);
    await updateDoc(docRef, {
      ...subscriptionData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('サブスク状態の更新に失敗:', error);
    return { success: false, error };
  }
};

/**
 * Stripe Customer IDを登録（決済完了後に呼ぶ）
 * @param {string} diagnosisId - 診断ID
 * @param {string} customerId - Stripe Customer ID
 */
export const registerStripeCustomer = async (diagnosisId, customerId) => {
  try {
    const docRef = doc(db, 'diagnoses', diagnosisId);
    await updateDoc(docRef, {
      stripeCustomerId: customerId,
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date(),
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Stripe Customer IDの登録に失敗:', error);
    return { success: false, error };
  }
};

/**
 * 次回請求日を設定（2年目のサブスク作成時）
 * @param {string} diagnosisId - 診断ID
 * @param {Date} nextBillingDate - 次回請求日
 */
export const setNextBillingDate = async (diagnosisId, nextBillingDate) => {
  try {
    const docRef = doc(db, 'diagnoses', diagnosisId);
    await updateDoc(docRef, {
      nextBillingDate: nextBillingDate,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('次回請求日の設定に失敗:', error);
    return { success: false, error };
  }
};

/**
 * サブスクリプションIDを登録（Stripe Dashboardで作成後）
 * @param {string} diagnosisId - 診断ID
 * @param {string} subscriptionId - Stripe Subscription ID
 */
export const registerSubscriptionId = async (diagnosisId, subscriptionId) => {
  try {
    const docRef = doc(db, 'diagnoses', diagnosisId);
    await updateDoc(docRef, {
      stripeSubscriptionId: subscriptionId,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Subscription IDの登録に失敗:', error);
    return { success: false, error };
  }
};

/**
 * ユーザーのメールアドレスから診断IDを検索
 * @param {string} email - ユーザーのメールアドレス
 * @returns {Array} 診断IDのリスト
 */
export const findDiagnosisByEmail = async (email) => {
  try {
    const q = query(
      collection(db, 'diagnoses'),
      where('userEmail', '==', email)
    );
    const querySnapshot = await getDocs(q);
    const diagnoses = [];
    querySnapshot.forEach((doc) => {
      diagnoses.push({ id: doc.id, ...doc.data() });
    });
    return diagnoses;
  } catch (error) {
    console.error('診断の検索に失敗:', error);
    return [];
  }
};

/**
 * 解約処理（管理者確認後に実行）
 * @param {string} diagnosisId - 診断ID
 */
export const confirmCancellation = async (diagnosisId) => {
  try {
    const docRef = doc(db, 'diagnoses', diagnosisId);
    await updateDoc(docRef, {
      subscriptionStatus: 'cancelled',
      cancelledAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('解約処理に失敗:', error);
    return { success: false, error };
  }
};

/**
 * 管理者用: すべての契約中サブスクを取得
 * @returns {Array} 契約中のサブスクリプションリスト
 */
export const getActiveSubscriptions = async () => {
  try {
    const q = query(
      collection(db, 'diagnoses'),
      where('subscriptionStatus', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    const subscriptions = [];
    querySnapshot.forEach((doc) => {
      subscriptions.push({ id: doc.id, ...doc.data() });
    });
    return subscriptions;
  } catch (error) {
    console.error('契約中サブスクの取得に失敗:', error);
    return [];
  }
};

/**
 * 管理者用: 解約申請中のサブスクを取得
 * @returns {Array} 解約申請中のサブスクリプションリスト
 */
export const getCancellationRequests = async () => {
  try {
    const q = query(
      collection(db, 'diagnoses'),
      where('subscriptionStatus', '==', 'cancelled'),
      where('cancelledBy', '!=', null)
    );
    const querySnapshot = await getDocs(q);
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    return requests;
  } catch (error) {
    console.error('解約申請の取得に失敗:', error);
    return [];
  }
};