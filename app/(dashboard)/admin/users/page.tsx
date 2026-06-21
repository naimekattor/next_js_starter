'use client';

import React, { useState, useEffect } from 'react';
import { userService } from '@/lib/api/user.service';
import { User } from '@/types/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/notificationSlice';
import { 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Mail, 
  Clock 
} from 'lucide-react';

/**
 * Admin User Directory Page Component
 * 
 * WHO SHOULD USE IT: Authenticated Admin users.
 * WHEN TO MODIFY: Integrating real user deletions/status modifications, adding server pagination, or adding column filters.
 */
export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load user records on mount
  useEffect(() => {
    async function loadUsers() {
      try {
        const list = await userService.listUsers();
        setUsers(list);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Could not fetch user directories.';
        dispatch(
          addToast({
            type: 'error',
            title: 'Directory Load Failed',
            description: errMsg,
          })
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, [dispatch]);

  // Client-side search matching
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatusSimulated = (userName: string) => {
    dispatch(
      addToast({
        type: 'success',
        title: 'Status Update',
        description: `Simulated status update for user ${userName}.`,
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">User Directory</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage system users, view registration dates, and inspect authorization roles.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <CardTitle>System Accounts</CardTitle>
            <CardDescription>Total accounts: {users.length}</CardDescription>
          </div>
          
          {/* Search box toolbar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <div className="text-sm text-slate-400">Fetching directories...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              No matching user accounts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80">
                    <th className="p-4 pl-6">Profile</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Authorization</th>
                    <th className="p-4">Registered Date</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredUsers.map((user) => {
                    const initials = user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .substring(0, 2);

                    return (
                      <tr 
                        key={user.id}
                        className="hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition-colors"
                      >
                        <td className="p-4 pl-6 flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                            {initials}
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {user.name}
                          </span>
                        </td>
                        <td className="p-4 text-slate-555 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-4 w-4 text-slate-400" />
                            {user.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            user.role === 'admin'
                              ? 'bg-primary/10 text-primary dark:bg-primary/5 dark:text-primary'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {user.role === 'admin' ? (
                              <>
                                <ShieldCheck className="h-3.5 w-3.5" /> Admin
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3.5 w-3.5" /> Standard
                              </>
                            )}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 dark:text-slate-455">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStatusSimulated(user.name)}
                            className="cursor-pointer"
                          >
                            Block Status
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
