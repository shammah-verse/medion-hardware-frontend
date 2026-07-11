import { useState, useEffect } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Clock, DollarSign, Download, Building2, CreditCard, CheckCircle2 } from 'lucide-react';
import { walletApi } from '../../api/wallet';
import type { WalletBalance, Transaction } from '../../api/wallet';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function Wallet() {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'MPESA' | 'BANK' | 'STRIPE'>('MPESA');
  const [accountDetails, setAccountDetails] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      // Fetch both in parallel
      const [balData, txData] = await Promise.all([
        walletApi.getBalance().catch(() => ({
          currentBalance: 0, pendingBalance: 0, withdrawableBalance: 0, totalEarnings: 0
        })),
        walletApi.getTransactions().catch(() => [])
      ]);
      setBalance(balData);
      setTransactions(txData);
    } catch (error) {
      console.error('Failed to load wallet data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) return;
    
    setWithdrawing(true);
    try {
      await walletApi.requestWithdrawal({
        amount: Number(withdrawAmount),
        method: withdrawMethod,
        accountDetails
      });
      setWithdrawSuccess(true);
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawSuccess(false);
        setWithdrawAmount('');
        setAccountDetails('');
        fetchWalletData(); // refresh data
      }, 2000);
    } catch (error) {
      console.error('Withdrawal failed', error);
      alert('Withdrawal request failed. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Wallet & Earnings</h1>
          <p className="text-slate-500">Manage your finances, view transactions, and request withdrawals.</p>
        </div>
        <Button 
          onClick={() => setShowWithdrawModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 px-6 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
        >
          <ArrowUpRight className="w-5 h-5" /> Withdraw Funds
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
          <div className="flex items-center gap-3 text-slate-300 mb-6 relative z-10">
            <WalletIcon className="w-5 h-5" />
            <span className="font-medium">Withdrawable Balance</span>
          </div>
          <div className="text-5xl font-bold mb-2 relative z-10">
            ${balance?.withdrawableBalance.toFixed(2) || '0.00'}
          </div>
          <p className="text-slate-400 text-sm relative z-10">Available for immediate withdrawal</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 text-slate-500 mb-6">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Pending Clearing</span>
          </div>
          <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            ${balance?.pendingBalance.toFixed(2) || '0.00'}
          </div>
          <p className="text-slate-500 text-sm">Funds clearing from recent sales</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 text-slate-500 mb-6">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Total Lifetime Earnings</span>
          </div>
          <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            ${balance?.totalEarnings.toFixed(2) || '0.00'}
          </div>
          <p className="text-slate-500 text-sm">All time revenue generated</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
          <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No transactions found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <th className="px-8 py-4 text-sm font-semibold text-slate-500">Reference</th>
                  <th className="px-8 py-4 text-sm font-semibold text-slate-500">Type</th>
                  <th className="px-8 py-4 text-sm font-semibold text-slate-500">Date</th>
                  <th className="px-8 py-4 text-sm font-semibold text-slate-500">Amount</th>
                  <th className="px-8 py-4 text-sm font-semibold text-slate-500 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-medium text-slate-900 dark:text-white">{tx.reference}</div>
                      <div className="text-xs text-slate-500">{tx.description}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        tx.type === 'EARNING' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' :
                        tx.type === 'WITHDRAWAL' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800'
                      }`}>
                        {tx.type === 'EARNING' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {tx.type}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">
                      {tx.type === 'WITHDRAWAL' ? '-' : '+'}${tx.amount.toFixed(2)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                        tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              {withdrawSuccess ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Withdrawal Requested</h3>
                  <p className="text-slate-500">Your funds will be processed shortly.</p>
                </div>
              ) : (
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Request Withdrawal</h3>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 flex justify-between items-center">
                    <span className="text-slate-500">Available</span>
                    <span className="font-bold text-lg">${balance?.withdrawableBalance.toFixed(2)}</span>
                  </div>

                  <form onSubmit={handleWithdraw} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Amount ($)</label>
                      <input 
                        type="number" 
                        required
                        max={balance?.withdrawableBalance}
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Withdrawal Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          type="button"
                          onClick={() => setWithdrawMethod('MPESA')}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${withdrawMethod === 'MPESA' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 transition-colors'}`}
                        >
                          <span className="font-bold text-sm">M-PESA</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => setWithdrawMethod('BANK')}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${withdrawMethod === 'BANK' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 transition-colors'}`}
                        >
                          <Building2 className="w-5 h-5" />
                          <span className="font-bold text-sm">Bank</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => setWithdrawMethod('STRIPE')}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${withdrawMethod === 'STRIPE' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 transition-colors'}`}
                        >
                          <CreditCard className="w-5 h-5" />
                          <span className="font-bold text-sm">Stripe</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Account Details</label>
                      <input 
                        type="text" 
                        required
                        value={accountDetails}
                        onChange={e => setAccountDetails(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder={withdrawMethod === 'MPESA' ? 'Phone Number (e.g. 254...)' : 'Account / Email'}
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1 rounded-xl h-12"
                        onClick={() => setShowWithdrawModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 shadow-lg shadow-emerald-500/25"
                        disabled={withdrawing}
                      >
                        {withdrawing ? 'Processing...' : 'Confirm'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
