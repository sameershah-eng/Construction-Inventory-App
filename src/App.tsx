/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from './store/useAppStore';
import { PhoneFrame } from './components/PhoneFrame';
import { TabBar } from './components/TabBar';
import { SiteSwitcherSheet } from './components/SiteSwitcherSheet';
import { UserMenuSheet } from './components/UserMenuSheet';

// Screens
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { ScanScreen } from './screens/ScanScreen';
import { ServiceScreen } from './screens/ServiceScreen';
import { AssetsScreen } from './screens/AssetsScreen';
import { ItemDetailScreen } from './screens/ItemDetailScreen';
import { ItemEditScreen } from './screens/ItemEditScreen';
import { AssetDetailScreen } from './screens/AssetDetailScreen';
import { TaskCreateScreen } from './screens/TaskCreateScreen';
import { TaskCloseoutScreen } from './screens/TaskCloseoutScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { CompanySettingsScreen } from './screens/CompanySettingsScreen';

import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const authStatus = useAppStore((s) => s.authStatus);
  const currentTab = useAppStore((s) => s.currentTab);
  const screenStack = useAppStore((s) => s.screenStack);

  const isAuth = authStatus === 'authenticated';
  const currentPushedScreen = screenStack.length > 0 ? screenStack[screenStack.length - 1] : null;

  return (
    <PhoneFrame>
      {!isAuth ? (
        <AuthScreen />
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Base Tabs Layer */}
            <div
              className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ${
                currentPushedScreen ? 'opacity-0 pointer-events-none scale-[0.98]' : 'opacity-100 scale-100'
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  {currentTab === 'home' && <HomeScreen />}
                  {currentTab === 'inventory' && <InventoryScreen />}
                  {currentTab === 'scan' && <ScanScreen />}
                  {currentTab === 'service' && <ServiceScreen />}
                  {currentTab === 'assets' && <AssetsScreen />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pushed Screen Stack Layer */}
            <AnimatePresence>
              {currentPushedScreen && (
                <div className="absolute inset-0 z-40 flex flex-col overflow-hidden bg-[#F4F2EE]">
                  {currentPushedScreen.type === 'item_detail' && (
                    <ItemDetailScreen itemId={currentPushedScreen.itemId} />
                  )}
                  {currentPushedScreen.type === 'item_edit' && (
                    <ItemEditScreen itemId={currentPushedScreen.itemId} />
                  )}
                  {currentPushedScreen.type === 'asset_detail' && (
                    <AssetDetailScreen assetId={currentPushedScreen.assetId} />
                  )}
                  {currentPushedScreen.type === 'task_create' && (
                    <TaskCreateScreen assetId={currentPushedScreen.assetId} />
                  )}
                  {currentPushedScreen.type === 'task_closeout' && (
                    <TaskCloseoutScreen taskId={currentPushedScreen.taskId} />
                  )}
                  {currentPushedScreen.type === 'notifications' && (
                    <NotificationsScreen />
                  )}
                  {currentPushedScreen.type === 'company_settings' && (
                    <CompanySettingsScreen />
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Tab Bar (anchored above home indicator when on root screens) */}
          <TabBar />

          {/* Global Modal Sheets */}
          <SiteSwitcherSheet />
          <UserMenuSheet />
        </div>
      )}
    </PhoneFrame>
  );
}
