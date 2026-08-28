// ChatbotX WhatsApp Gateway - Multi-Account Dashboard Engine
const API_BASE = '';
let activeSession = 'default';
let allSessions = [];
let pollingTimer = null;

function getAuthHeaders(extra = {}) {
  const headers = { ...extra };
  const key = localStorage.getItem('WAHA_API_KEY');
  if (key) {
    headers['X-Api-Key'] = key;
  }
  return headers;
}

// Poll sessions and active status with adaptive interval
let currentPollingInterval = 5000;
let lastKnownOnlineState = {};

function setAdaptivePolling(intervalMs) {
  if (currentPollingInterval === intervalMs && pollingTimer) return;
  currentPollingInterval = intervalMs;
  if (pollingTimer) clearInterval(pollingTimer);
  pollingTimer = setInterval(async () => {
    if (activeSession) {
      await fetchSessionStatus(activeSession, true);
      await fetchSessionsList(true);
    }
  }, currentPollingInterval);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initDomainDisplays();
  fetchLocalVersion();
  refreshAllData();

  // Auto check for updates once after load
  setTimeout(() => {
    checkForWahaUpdates(true);
  }, 1000);

  // Start polling
  setAdaptivePolling(1500);
});

function initDomainDisplays() {
  const host = window.location.host;
  const domainEl = document.getElementById('domainHostDisplay');
  if (domainEl) domainEl.textContent = host;
}

function updateContextDisplays() {
  const currentOrigin = window.location.origin;

  // Active Session Badges & Titles
  const nameBadge = document.getElementById('activeSessionNameBadge');
  if (nameBadge) nameBadge.textContent = activeSession;

  const headerSession = document.getElementById('qrSessionNameHeader');
  if (headerSession) headerSession.textContent = activeSession;

  const footerSession = document.getElementById('activeSessionFooterDisplay');
  if (footerSession) footerSession.textContent = activeSession;

  const inlineNames = document.querySelectorAll('.activeSessionInlineName');
  inlineNames.forEach((el) => (el.textContent = activeSession));

  const webhookPath = activeSession === 'default' ? '/webhooks/chatbotx' : `/webhooks/chatbotx/${activeSession}`;

  const routeDisplay = document.getElementById('activeOutboundRouteDisplay');
  if (routeDisplay) routeDisplay.textContent = webhookPath;

  const callbackInput = document.getElementById('suggestedCallbackUrlInput');
  if (callbackInput) {
    callbackInput.value = `${currentOrigin}${webhookPath}`;
  }

  const mediaUrlInput = document.getElementById('cbxMediaUrlInput');
  if (mediaUrlInput && !mediaUrlInput.value) {
    mediaUrlInput.placeholder = currentOrigin;
  }
}

async function refreshAllData() {
  const refreshIcon = document.getElementById('refreshIcon');
  if (refreshIcon) refreshIcon.classList.add('animate-spin');

  await fetchSessionsList();
  updateContextDisplays();

  if (activeSession) {
    await Promise.all([
      fetchSessionStatus(activeSession),
      loadChatbotxConfig()
    ]);
  } else {
    updateStatusUI('NO_ACCOUNT', null);
  }

  setTimeout(() => {
    if (refreshIcon) refreshIcon.classList.remove('animate-spin');
  }, 600);
}

// 1. Fetch & Render All WhatsApp Sessions
async function fetchSessionsList(silent = false) {
  try {
    const res = await fetch(`${API_BASE}/api/sessions?all=true`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const sessions = await res.json();
    allSessions = Array.isArray(sessions) ? sessions : [];

    if (allSessions.length > 0) {
      if (!activeSession || !allSessions.find((s) => s.name === activeSession)) {
        activeSession = allSessions[0].name;
      }
    } else {
      activeSession = null;
    }

    renderSessionsGrid(allSessions);
  } catch (err) {
    if (!silent) console.error('Error fetching sessions list:', err);
  }
}

function renderSessionsGrid(sessions) {
  const grid = document.getElementById('sessionsListGrid');
  const countBadge = document.getElementById('sessionCountBadge');
  if (countBadge) countBadge.textContent = sessions.length;
  if (!grid) return;

  grid.innerHTML = '';

  if (sessions.length === 0) {
    const emptyDesc = typeof getTranslation === 'function' ? getTranslation('empty_no_accounts_desc', 'Click the "+ Add Account" button at the top to create your first WhatsApp connection.') : 'Click the "+ Add Account" button at the top to create your first WhatsApp connection.';
    grid.innerHTML = `
      <div class="col-span-full py-5 px-4 rounded-2xl bg-[#0F172A] border border-dashed border-white/10 text-center space-y-1">
        <p class="text-xs text-gray-400 font-medium">${emptyDesc}</p>
      </div>
    `;
    return;
  }

  sessions.forEach((s) => {
    const isActive = s.name === activeSession;
    const isOnline = s.status === 'WORKING' || s.status === 'CONNECTED' || (s.engine && s.engine.state === 'CONNECTED');
    const isScanQr = s.status === 'SCAN_QR_CODE';
    const isStarting = s.status === 'STARTING';
    
    let statusDotBg = 'bg-red-400';
    let statusText = typeof getTranslation === 'function' ? getTranslation('session_status_stopped', s.status || 'Offline') : (s.status || 'Offline');
    let statusBadgeClass = 'bg-red-500/10 text-red-400 border border-red-500/20';

    if (isOnline) {
      statusDotBg = 'bg-emerald-400';
      statusText = typeof getTranslation === 'function' ? getTranslation('session_status_working', 'Online') : 'Online';
      statusBadgeClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    } else if (isScanQr) {
      statusDotBg = 'bg-amber-400';
      statusText = typeof getTranslation === 'function' ? getTranslation('session_status_scan_qr', 'Scan QR') : 'Scan QR';
      statusBadgeClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    } else if (isStarting) {
      statusDotBg = 'bg-blue-400';
      statusText = typeof getTranslation === 'function' ? getTranslation('session_status_starting', 'Starting...') : 'Starting...';
      statusBadgeClass = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }

    const unlinkedText = typeof getTranslation === 'function' ? getTranslation('step3_status_inactive', 'Not Linked') : 'Not Linked';
    const phone = s.me?.id ? `+${s.me.id.split('@')[0]}` : unlinkedText;
    const pushName = s.me?.pushName || (isActive ? 'WhatsApp' : s.name);

    const card = document.createElement('div');
    card.onclick = () => switchActiveSession(s.name);
    card.className = `p-3.5 rounded-2xl cursor-pointer transition-all duration-150 border text-left relative group ${
      isActive
        ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10'
        : 'bg-[#0F172A] hover:bg-[#1E293B] border-white/5 hover:border-white/15'
    }`;

    card.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center space-x-2.5 overflow-hidden">
          <div class="w-9 h-9 rounded-xl ${
            isOnline ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-800 border border-white/5'
          } flex items-center justify-center p-1.5 flex-shrink-0">
            <img src="https://chatbotx.io/wp-content/themes/chatbotx-theme/assets/images/WhatsApp.svg" alt="WhatsApp" class="w-5 h-5 object-contain">
          </div>
          <div class="overflow-hidden">
            <div class="flex items-center space-x-1.5">
              <h4 class="font-bold text-xs text-white truncate max-w-[105px]">${pushName}</h4>
              ${isActive ? '<span class="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>' : ''}
            </div>
            <p class="text-[11px] text-gray-400 font-mono truncate max-w-[115px]">${phone}</p>
          </div>
        </div>
        <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBadgeClass} flex-shrink-0 mt-0.5">
          <span class="w-1.5 h-1.5 rounded-full ${statusDotBg}"></span>
          <span>${statusText}</span>
        </span>
      </div>
      <div class="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
        <span class="text-gray-500 font-mono">#${s.name}</span>
        ${
          !isOnline
            ? `<button onclick="deleteSessionDirect(event, '${s.name}')" title="Delete Account" class="p-1 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer flex items-center justify-center">
                <i class="ph-bold ph-trash text-xs"></i>
              </button>`
            : `<span class="text-[10px] text-emerald-400/80 font-mono flex items-center space-x-1" title="Connected Online">
                <i class="ph ph-shield-check text-xs text-emerald-400"></i>
                <span>Active</span>
              </span>`
        }
      </div>
    `;

    grid.appendChild(card);
  });
}

function switchActiveSession(name) {
  if (activeSession === name) return;
  activeSession = name;
  lastLoadedQrSession = null;
  switchPairTab('qr');
  const switchedMsg = typeof getTranslation === 'function' ? getTranslation('toast_switched_session', 'Switched to session: ') : 'Switched to session: ';
  showToast(`${switchedMsg} ${name}`, 'info');
  refreshAllData();
  fetchQrCode(true);
}

// 2. Fetch Active Session Status & Auto-Sync Name
async function fetchSessionStatus(sessionName, silent = false) {
  if (!sessionName) {
    updateStatusUI('NO_ACCOUNT', null);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/sessions/${sessionName}`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      if (res.status === 404) {
        updateStatusUI('STOPPED', null);
        return;
      }
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    updateStatusUI(data.status, data);

    if (data.status === 'SCAN_QR_CODE') {
      fetchQrCode();
    }
  } catch (err) {
    if (!silent) console.error(`Error fetching status for ${sessionName}:`, err);
    updateStatusUI('DISCONNECTED', null);
  }
}

function updateStatusUI(status, data) {
  const nameEl = document.getElementById('sessionNameDisplay');
  const phoneEl = document.getElementById('sessionPhoneDisplay');
  const statePill = document.getElementById('sessionStatePill');
  const engineEl = document.getElementById('engineDisplay');
  const suggestedNameInput = document.getElementById('suggestedChannelNameInput');
  const headerSessionId = document.getElementById('qrSessionNameHeader');
  const footerSessionId = document.getElementById('activeSessionFooterDisplay');

  const tabsEl = document.getElementById('pairMethodTabs');
  const qrView = document.getElementById('tabQrView');
  const codeView = document.getElementById('tabCodeView');
  const connectedView = document.getElementById('deviceConnectedView');
  const noAccountsView = document.getElementById('noAccountsSelectedView');
  const connectedNameEl = document.getElementById('connectedNameDisplay');
  const connectedPhoneEl = document.getElementById('connectedPhoneDisplay');

  const btnRestart = document.getElementById('btnRestartSession');
  const btnDisconnect = document.getElementById('btnDisconnectSession');
  const btnDelete = document.getElementById('btnDeleteSession');
  const testSection = document.getElementById('testMessageSection');

  // Handle EMPTY / NO ACCOUNTS STATE
  if (!activeSession || allSessions.length === 0) {
    if (nameEl) nameEl.textContent = typeof getTranslation === 'function' ? getTranslation('empty_no_accounts_title', 'No WhatsApp Accounts Yet') : 'No Accounts';
    if (phoneEl) phoneEl.textContent = '--';
    if (statePill) {
      statePill.textContent = 'NO_ACCOUNT';
      statePill.className = 'px-2.5 py-0.5 rounded-full bg-slate-800 text-gray-500 font-semibold';
    }
    if (headerSessionId) headerSessionId.textContent = '--';
    if (footerSessionId) footerSessionId.textContent = '--';

    if (noAccountsView) noAccountsView.classList.remove('hidden');
    if (connectedView) connectedView.classList.add('hidden');
    if (qrView) qrView.classList.add('hidden');
    if (codeView) codeView.classList.add('hidden');
    if (tabsEl) tabsEl.classList.add('hidden');

    if (btnRestart) btnRestart.classList.add('hidden');
    if (btnDisconnect) btnDisconnect.classList.add('hidden');
    if (btnDelete) btnDelete.classList.add('hidden');
    if (testSection) testSection.classList.add('hidden');
    return;
  }

  // Active Session Exists
  if (noAccountsView) noAccountsView.classList.add('hidden');
  if (headerSessionId) headerSessionId.textContent = activeSession;
  if (footerSessionId) footerSessionId.textContent = activeSession;

  const phone = data?.me?.id ? `+${data.me.id.split('@')[0]}` : '';
  const pushName = data?.me?.pushName || '';
  const isOnline = status === 'WORKING' || status === 'CONNECTED' || (data?.engine && data.engine.state === 'CONNECTED');

  if (isOnline) {
    // If just transitioned from offline/QR to online -> Celebrate & Auto-Refresh
    if (!lastKnownOnlineState[activeSession]) {
      lastKnownOnlineState[activeSession] = true;
      const connectedMsg = typeof getTranslation === 'function' ? getTranslation('toast_connected_success', 'WhatsApp account connected successfully!') : 'WhatsApp account connected successfully!';
      showToast(`🎉 ${connectedMsg} ${pushName || phone ? `(${pushName || phone})` : ''}`, 'success');
      loadChatbotxConfig();
      fetchSessionsList(true);
    }

    // Normal polling (4s) when already online
    setAdaptivePolling(4000);

    if (nameEl) nameEl.textContent = pushName || 'WhatsApp Connected';
    if (phoneEl) phoneEl.textContent = phone || '--';
    
    if (statePill) {
      statePill.textContent = typeof getTranslation === 'function' ? getTranslation('common_online', 'ONLINE') : 'ONLINE';
      statePill.className = 'px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold';
    }

    if (engineEl) engineEl.textContent = data?.engine?.engine || 'WEBJS';

    if (suggestedNameInput) {
      suggestedNameInput.value = pushName && phone ? `${pushName} (${phone})` : (pushName || phone || `WhatsApp ${activeSession}`);
    }

    if (connectedView) {
      connectedView.classList.remove('hidden');
      if (connectedNameEl) connectedNameEl.textContent = pushName || 'WhatsApp Account';
      if (connectedPhoneEl) connectedPhoneEl.textContent = phone || '--';
    }
    if (qrView) qrView.classList.add('hidden');
    if (codeView) codeView.classList.add('hidden');
    if (tabsEl) tabsEl.classList.add('hidden');

    // Button Visibility for CONNECTED state:
    // Show Restart & Disconnect; HIDE Delete; SHOW Test Message Section
    if (btnRestart) btnRestart.classList.remove('hidden');
    if (btnDisconnect) btnDisconnect.classList.remove('hidden');
    if (btnDelete) btnDelete.classList.add('hidden');
    if (testSection) testSection.classList.remove('hidden');

  } else {
    lastKnownOnlineState[activeSession] = false;

    // Fast polling (1.2s) while waiting for user to scan QR or connect!
    setAdaptivePolling(1200);

    if (status === 'SCAN_QR_CODE') {
      if (nameEl) nameEl.textContent = typeof getTranslation === 'function' ? getTranslation('session_status_scan_qr', 'Scan QR Code') : 'Scan QR Code';
      if (phoneEl) phoneEl.textContent = typeof getTranslation === 'function' ? getTranslation('step3_desc', 'Scan QR or use Pairing Code') : 'Scan QR or use Pairing Code';
      
      if (statePill) {
        statePill.textContent = 'SCAN_QR';
        statePill.className = 'px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold';
      }
    } else {
      if (nameEl) nameEl.textContent = typeof getTranslation === 'function' ? getTranslation('step2_status_inactive', 'Unlinked') : 'Unlinked';
      if (phoneEl) phoneEl.textContent = '--';
      
      if (statePill) {
        statePill.textContent = status || 'STOPPED';
        statePill.className = 'px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold';
      }
    }

    if (suggestedNameInput) suggestedNameInput.value = `WhatsApp ${activeSession}`;

    if (connectedView) connectedView.classList.add('hidden');
    if (tabsEl) tabsEl.classList.remove('hidden');
    if (currentPairTab === 'qr') {
      if (qrView) qrView.classList.remove('hidden');
      if (codeView) codeView.classList.add('hidden');
    } else {
      if (qrView) qrView.classList.add('hidden');
      if (codeView) codeView.classList.remove('hidden');
    }

    // Button Visibility for STOPPED / SCAN_QR state:
    if (btnDisconnect) btnDisconnect.classList.add('hidden');
    if (btnRestart) btnRestart.classList.remove('hidden');
    if (btnDelete) btnDelete.classList.remove('hidden');
    if (testSection) testSection.classList.add('hidden');
  }
}

// 3. Copy Helper
function copyElementText(inputId, label = 'Information') {
  const el = document.getElementById(inputId);
  if (!el) return;
  
  navigator.clipboard.writeText(el.value).then(() => {
    showToast(typeof getTranslation === 'function' ? getTranslation('toast_copy_success', 'Copied!') : 'Copied!', 'success');
  }).catch(() => {
    el.select();
    document.execCommand('copy');
    showToast(typeof getTranslation === 'function' ? getTranslation('toast_copy_success', 'Copied!') : 'Copied!', 'success');
  });
}

// 4. QR Code Fetching for Active Session
let lastLoadedQrSession = null;

async function fetchQrCode(forceShowSpinner = false) {
  const qrImg = document.getElementById('qrImageElement');
  const qrSpinner = document.getElementById('qrLoadingSpinner');
  if (!activeSession) return;

  const isSessionChanged = lastLoadedQrSession !== activeSession;
  if (isSessionChanged || forceShowSpinner || !qrImg?.src || qrImg.classList.contains('hidden')) {
    if (qrImg && (isSessionChanged || forceShowSpinner)) qrImg.classList.add('hidden');
    if (qrSpinner && (isSessionChanged || forceShowSpinner || !qrImg?.src)) qrSpinner.classList.remove('hidden');
  }

  try {
    const res = await fetch(`${API_BASE}/api/${activeSession}/auth/qr?format=image&t=${Date.now()}`, {
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const blob = await res.blob();
      const imgUrl = URL.createObjectURL(blob);
      if (qrImg) {
        qrImg.src = imgUrl;
        qrImg.classList.remove('hidden');
      }
      if (qrSpinner) qrSpinner.classList.add('hidden');
      lastLoadedQrSession = activeSession;
    } else {
      // If QR not ready yet (e.g. WhatsApp engine is starting up), fast retry in 1.5s
      if (currentPairTab === 'qr') {
        setTimeout(() => {
          if (activeSession) fetchQrCode(false);
        }, 1500);
      }
    }
  } catch (err) {
    console.warn('Failed to load QR code:', err);
  }
}

// 5. Tab Switching (QR vs Pairing Code)
let currentPairTab = 'qr';

function switchPairTab(tab) {
  currentPairTab = tab;
  const qrView = document.getElementById('tabQrView');
  const codeView = document.getElementById('tabCodeView');
  const qrBtn = document.getElementById('tabQrBtn');
  const codeBtn = document.getElementById('tabCodeBtn');

  if (tab === 'qr') {
    if (qrView) qrView.classList.remove('hidden');
    if (codeView) codeView.classList.add('hidden');

    if (qrBtn) qrBtn.className = 'px-4 py-1.5 text-xs font-semibold rounded-full bg-blue-600 text-white transition cursor-pointer whitespace-nowrap';
    if (codeBtn) codeBtn.className = 'px-4 py-1.5 text-xs font-semibold rounded-full text-gray-400 hover:text-white transition cursor-pointer whitespace-nowrap';
    fetchQrCode();
  } else {
    if (qrView) qrView.classList.add('hidden');
    if (codeView) codeView.classList.remove('hidden');

    if (codeBtn) codeBtn.className = 'px-4 py-1.5 text-xs font-semibold rounded-full bg-blue-600 text-white transition cursor-pointer whitespace-nowrap';
    if (qrBtn) qrBtn.className = 'px-4 py-1.5 text-xs font-semibold rounded-full text-gray-400 hover:text-white transition cursor-pointer whitespace-nowrap';
  }
}

// 6. Request Pairing Code for Active Session
async function requestPairingCode() {
  const phoneInput = document.getElementById('pairingPhoneInput');
  const phone = phoneInput.value.trim().replace(/[^0-9]/g, '');

  if (!phone || phone.length < 9) {
    const invalidMsg = typeof getTranslation === 'function' ? getTranslation('toast_phone_invalid', 'Please enter a valid phone number (e.g. 14155552671)') : 'Please enter a valid phone number (e.g. 14155552671)';
    showToast(invalidMsg, 'error');
    return;
  }

  const reqMsg = typeof getTranslation === 'function' ? getTranslation('toast_requesting_code', 'Requesting pairing code for ') : 'Requesting pairing code for ';
  showToast(`${reqMsg} ${activeSession}...`, 'info');

  try {
    const res = await fetch(`${API_BASE}/api/${activeSession}/auth/request-code`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        phoneNumber: phone,
        method: 'sms'
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const resultBox = document.getElementById('pairingCodeResultBox');
    const display = document.getElementById('pairingCodeDisplay');

    if (display && data.code) {
      display.textContent = data.code;
      if (resultBox) resultBox.classList.remove('hidden');
      const codeSuccess = typeof getTranslation === 'function' ? getTranslation('toast_code_success', 'Pairing code received successfully!') : 'Pairing code received successfully!';
      showToast(codeSuccess, 'success');
    }
  } catch (err) {
    const codeErr = typeof getTranslation === 'function' ? getTranslation('toast_code_error', 'Unable to get code: ') : 'Unable to get code: ';
    showToast(`${codeErr} ${err.message}`, 'error');
  }
}

// 7. ChatbotX App Configuration Management
function getAppIdForSession(sessionName) {
  return sessionName === 'default' ? 'chatbotx' : `chatbotx_${sessionName}`;
}

async function loadChatbotxConfig() {
  const appId = getAppIdForSession(activeSession);
  const statusBadge = document.getElementById('step2StatusBadge');
  const saveBtn = document.getElementById('saveConfigBtn');

  try {
    const res = await fetch(`${API_BASE}/api/apps/${appId}`, {
      headers: getAuthHeaders()
    });

    if (res.ok) {
      const app = await res.json();
      if (app && app.config && app.config.apiToken) {
        document.getElementById('cbxApiTokenInput').value = app.config.apiToken || '';
        document.getElementById('cbxApiUrlInput').value = app.config.apiUrl || 'https://app.chatbotx.io/api';
        document.getElementById('cbxMediaUrlInput').value = app.config.mediaBaseUrl || window.location.origin;
        document.getElementById('cbxIncludeGroupsInput').checked = !!app.config.includeGroups;

        if (statusBadge) {
          if (app.enabled) {
            statusBadge.className = 'px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1.5 flex-shrink-0 animate-fade-in';
            statusBadge.innerHTML = '<i class="ph-bold ph-check-circle text-xs text-emerald-400"></i><span data-i18n="step2_status_active">Linked & Active</span>';
          } else {
            statusBadge.className = 'px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center space-x-1.5 flex-shrink-0';
            statusBadge.innerHTML = '<i class="ph-bold ph-pause-circle text-xs text-amber-400"></i><span>Paused</span>';
          }
        }

        if (saveBtn) {
          saveBtn.className = 'w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-sm font-bold text-white flex items-center justify-center space-x-2 cursor-pointer shadow-lg transition';
          saveBtn.innerHTML = '<i class="ph-bold ph-check-circle text-base"></i><span data-i18n="step2_btn_saved">Channel Linked (Click to Update)</span>';
        }
        return;
      }
    }

    // Default values if not yet configured
    document.getElementById('cbxApiTokenInput').value = '';
    document.getElementById('cbxApiUrlInput').value = 'https://app.chatbotx.io/api';
    document.getElementById('cbxMediaUrlInput').value = window.location.origin;
    document.getElementById('cbxIncludeGroupsInput').checked = false;

    if (statusBadge) {
      statusBadge.className = 'px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0B1120] text-gray-400 border border-white/10 flex items-center space-x-1.5 flex-shrink-0';
      statusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-gray-500"></span><span data-i18n="step2_status_inactive">Not Linked</span>';
    }

    if (saveBtn) {
      saveBtn.className = 'w-full py-3 rounded-full brand-btn-gradient text-sm font-bold text-white flex items-center justify-center space-x-2 cursor-pointer shadow-lg transition';
      saveBtn.innerHTML = '<i class="ph-bold ph-floppy-disk"></i><span data-i18n="step2_btn_save">Save & Activate Channel</span>';
    }
  } catch (err) {
    console.error(`Error loading ChatbotX config for ${appId}:`, err);
  }
}

async function saveChatbotxConfig(event) {
  event.preventDefault();
  const token = document.getElementById('cbxApiTokenInput').value.trim();
  const apiUrl = document.getElementById('cbxApiUrlInput').value.trim();
  const mediaUrl = document.getElementById('cbxMediaUrlInput').value.trim() || window.location.origin;
  const includeGroups = document.getElementById('cbxIncludeGroupsInput').checked;

  const btn = document.getElementById('saveConfigBtn');
  btn.disabled = true;
  const savingText = typeof getTranslation === 'function' ? getTranslation('step3_saving', 'Saving...') : 'Saving...';
  btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin"></i><span>${savingText}</span>`;

  const appId = getAppIdForSession(activeSession);
  const payload = {
    id: appId,
    session: activeSession,
    app: 'chatbotx',
    enabled: true,
    config: {
      apiUrl: apiUrl,
      apiToken: token,
      mediaBaseUrl: mediaUrl,
      includeGroups: includeGroups
    }
  };

  try {
    let res = await fetch(`${API_BASE}/api/apps/${appId}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    });

    if (!res.ok && res.status === 404) {
      res = await fetch(`${API_BASE}/api/apps`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const savedSuccess = typeof getTranslation === 'function' ? getTranslation('toast_saved_success', 'ChatbotX channel linked successfully!') : 'ChatbotX channel linked successfully!';
    showToast(savedSuccess, 'success');
    await loadChatbotxConfig();
  } catch (err) {
    const saveErr = typeof getTranslation === 'function' ? getTranslation('toast_save_error', 'Error saving configuration: ') : 'Error saving configuration: ';
    showToast(`${saveErr} ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
  }
}

// 8. Test Outbound Message from Active Session
async function sendTestMessage() {
  let recipient = document.getElementById('testRecipientInput').value.trim().replace(/[^0-9]/g, '');
  const message = document.getElementById('testMessageInput').value.trim();

  // Auto-normalize Vietnamese numbers if started with 0
  if (recipient.startsWith('0') && recipient.length >= 10) {
    recipient = '84' + recipient.substring(1);
  }

  if (!recipient || recipient.length < 9) {
    const invalidMsg = typeof getTranslation === 'function' ? getTranslation('toast_phone_invalid', 'Please enter a valid phone number (e.g. 14155552671)') : 'Please enter a valid phone number (e.g. 14155552671)';
    showToast(invalidMsg, 'error');
    return;
  }

  const chatId = `${recipient}@c.us`;
  const sendingMsg = typeof getTranslation === 'function' ? getTranslation('toast_sending_test', 'Sending test message to ') : 'Sending test message to ';
  showToast(`${sendingMsg} ${recipient}...`, 'info');

  try {
    const res = await fetch(`${API_BASE}/api/sendText`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        session: activeSession,
        chatId: chatId,
        text: message
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP ${res.status}`);
    }

    const successMsg = typeof getTranslation === 'function' ? getTranslation('toast_test_success', 'Test message sent successfully to ') : 'Test message sent successfully to ';
    showToast(`${successMsg} ${recipient}!`, 'success');
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

// 9. Session Management (Create New, Restart, Logout, Delete)
function openNewSessionModal() {
  const modal = document.getElementById('newSessionModal');
  const input = document.getElementById('newSessionNameInput');
  if (input) {
    const nextIdx = allSessions.length + 1;
    input.value = `account_${nextIdx}`;
  }
  if (modal) modal.classList.remove('hidden');
}

function closeNewSessionModal() {
  const modal = document.getElementById('newSessionModal');
  if (modal) modal.classList.add('hidden');
}

async function submitNewSession(event) {
  event.preventDefault();
  const input = document.getElementById('newSessionNameInput');
  let name = input.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

  if (!name) {
    name = `account_${allSessions.length + 1}`;
  }

  const btn = document.getElementById('createSessionBtn');
  btn.disabled = true;
  const loadingText = typeof getTranslation === 'function' ? getTranslation('common_loading', 'Loading...') : 'Loading...';
  btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin"></i><span>${loadingText}</span>`;

  try {
    const res = await fetch(`${API_BASE}/api/sessions`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        name: name,
        start: true
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP ${res.status}`);
    }

    closeNewSessionModal();
    const initMsg = typeof getTranslation === 'function' ? getTranslation('toast_session_initialized', 'Account initialized successfully: ') : 'Account initialized successfully: ';
    showToast(`${initMsg} '${name}'`, 'success');
    activeSession = name;
    lastLoadedQrSession = null;
    switchPairTab('qr');
    await refreshAllData();
    fetchQrCode(true);
  } catch (err) {
    showToast(`Error creating account: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    const createText = typeof getTranslation === 'function' ? getTranslation('modal_add_btn_create', 'Create & Connect') : 'Create & Connect';
    btn.innerHTML = `<i class="ph-bold ph-check"></i><span>${createText}</span>`;
  }
}

async function restartSession() {
  const confirmMsg = typeof getTranslation === 'function' ? getTranslation('confirm_restart', `Restart session '${activeSession}'?`) : `Restart session '${activeSession}'?`;
  if (!confirm(confirmMsg)) return;
  const restartMsg = typeof getTranslation === 'function' ? getTranslation('toast_restarting', 'Restarting session: ') : 'Restarting session: ';
  showToast(`${restartMsg} ${activeSession}...`, 'info');
  try {
    await fetch(`${API_BASE}/api/sessions/${activeSession}/restart`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const restartOk = typeof getTranslation === 'function' ? getTranslation('toast_restart_success', 'Restart signal sent for session: ') : 'Restart signal sent for session: ';
    showToast(`${restartOk} '${activeSession}'!`, 'success');
    setTimeout(refreshAllData, 3000);
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

async function logoutSession() {
  const confirmMsg = typeof getTranslation === 'function' ? getTranslation('confirm_disconnect', 'Disconnect this session?') : 'Disconnect this session?';
  if (!confirm(confirmMsg)) return;
  const discMsg = typeof getTranslation === 'function' ? getTranslation('toast_disconnecting', 'Disconnecting session: ') : 'Disconnecting session: ';
  showToast(`${discMsg} ${activeSession}...`, 'warning');
  try {
    // 1. Logout WhatsApp session
    await fetch(`${API_BASE}/api/sessions/${activeSession}/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    // 2. Also reset ChatbotX app configuration for this session so Step 3 is synchronized
    const appId = getAppIdForSession(activeSession);
    try {
      await fetch(`${API_BASE}/api/apps/${appId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {
      console.warn('App link cleanup on disconnect:', e);
    }

    const discOk = typeof getTranslation === 'function' ? getTranslation('toast_disconnected', 'Session disconnected: ') : 'Session disconnected: ';
    showToast(`${discOk} '${activeSession}'`, 'info');
    
    // 3. Immediately switch to QR tab and refresh UI & Step 3 token state
    lastLoadedQrSession = null;
    switchPairTab('qr');
    await refreshAllData();
    fetchQrCode(true);
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

async function deleteSessionDirect(event, sessionNameToDelete) {
  if (event) event.stopPropagation();
  if (!sessionNameToDelete) return;

  const targetSession = allSessions.find((s) => s.name === sessionNameToDelete);
  const isOnline = targetSession && (targetSession.status === 'WORKING' || targetSession.status === 'CONNECTED' || (targetSession.engine && targetSession.engine.state === 'CONNECTED'));
  if (isOnline) {
    const cannotDel = typeof getTranslation === 'function' ? getTranslation('toast_cannot_delete_online', 'Cannot delete account while Online. Please disconnect first.') : 'Cannot delete account while Online. Please disconnect first.';
    showToast(cannotDel, 'warning');
    return;
  }

  const confirmMsg = typeof getTranslation === 'function' 
    ? getTranslation('confirm_delete', 'Are you sure you want to delete this account?') 
    : `Are you sure you want to delete account '${sessionNameToDelete}'?`;
  if (!confirm(confirmMsg)) return;

  const delMsg = typeof getTranslation === 'function' ? getTranslation('toast_deleting', 'Deleting account: ') : 'Deleting account: ';
  showToast(`${delMsg} '${sessionNameToDelete}'...`, 'warning');
  try {
    const res = await fetch(`${API_BASE}/api/sessions/${sessionNameToDelete}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP ${res.status}`);
    }

    const delOk = typeof getTranslation === 'function' ? getTranslation('toast_deleted_success', 'Account deleted successfully: ') : 'Account deleted successfully: ';
    showToast(`${delOk} '${sessionNameToDelete}'`, 'success');
    if (activeSession === sessionNameToDelete) {
      activeSession = null;
    }
    await refreshAllData();
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

async function deleteActiveSession() {
  if (!activeSession) return;
  await deleteSessionDirect(null, activeSession);
}

// 10. Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-emerald-900 border-emerald-500/30 text-emerald-200',
    error: 'bg-red-900 border-red-500/30 text-red-200',
    warning: 'bg-amber-900 border-amber-500/30 text-amber-200',
    info: 'bg-blue-900 border-blue-500/30 text-blue-200'
  };

  const icons = {
    success: 'ph-check-circle',
    error: 'ph-warning-circle',
    warning: 'ph-warning',
    info: 'ph-info'
  };

  toast.className = `flex items-center space-x-2.5 px-4 py-3 rounded-2xl border text-xs font-medium pointer-events-auto transition-all transform duration-200 animate-fade-in ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `
    <i class="ph-fill ${icons[type] || icons.info} text-base flex-shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px)';
    setTimeout(() => toast.remove(), 200);
  }, 4000);
}

// 11. Core WAHA Version & GitHub Auto-Update Check
const GITHUB_FORK_REPO = 'craybull/waha-chatbotx-dashboard';

let currentWahaVersion = '2026.8.4';

async function fetchLocalVersion() {
  const verDisplay = document.getElementById('currentVersionDisplay');
  if (verDisplay) {
    verDisplay.textContent = `v${currentWahaVersion.replace(/^v/, '')}`;
  }
}

let pendingUpdateTag = '';
let pendingReleaseData = null;

function openUpdateModal(tag, releaseData) {
  pendingUpdateTag = tag;
  pendingReleaseData = releaseData;

  const modal = document.getElementById('updateModal');
  const currentVerEl = document.getElementById('modalCurrentVer');
  const targetVerEl = document.getElementById('modalTargetVer');
  const notesEl = document.getElementById('modalReleaseNotes');

  if (currentVerEl) currentVerEl.textContent = `v${currentWahaVersion.replace(/^v/, '')}`;
  if (targetVerEl) targetVerEl.textContent = `v${tag.replace(/^v/, '')}`;

  if (notesEl) {
    if (releaseData && releaseData.body) {
      let bodyText = releaseData.body.replace(/%0A/g, '\n');
      notesEl.textContent = bodyText;
    } else {
      notesEl.textContent = `• Nâng cấp giao diện và tối ưu hóa hệ thống v${tag}.\n• Khắc phục các lỗi hiển thị và cải tiến trải nghiệm.`;
    }
  }

  if (modal) modal.classList.remove('hidden');
}

function closeUpdateModal() {
  const modal = document.getElementById('updateModal');
  if (modal) modal.classList.add('hidden');
}

async function performDashboardUpdate() {
  const btn = document.getElementById('btnPerformUpdate');
  const icon = document.getElementById('performUpdateIcon');
  const text = document.getElementById('btnPerformUpdateText');
  if (!btn) return;

  btn.disabled = true;
  if (icon) icon.className = 'ph-bold ph-spinner animate-spin';
  if (text) text.textContent = typeof getTranslation === 'function' ? getTranslation('common_loading', 'Updating...') : 'Updating...';

  const downMsg = typeof getTranslation === 'function' ? getTranslation('toast_downloading_update', 'Downloading and installing update package from GitHub...') : 'Downloading and installing update package from GitHub...';
  showToast(downMsg, 'info');

  try {
    const res = await fetch(`${API_BASE}/api/server/update-dashboard`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ tag: pendingUpdateTag || 'main' })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP ${res.status}`);
    }

    const upOk = typeof getTranslation === 'function' ? getTranslation('toast_update_success', 'Dashboard updated successfully! Refreshing page...') : 'Dashboard updated successfully! Refreshing page...';
    showToast(upOk, 'success');
    closeUpdateModal();

    setTimeout(() => {
      window.location.href = window.location.pathname + '?_t=' + Date.now();
    }, 1500);

  } catch (err) {
    const upErr = typeof getTranslation === 'function' ? getTranslation('toast_update_error', 'Update error: ') : 'Update error: ';
    showToast(`${upErr} ${err.message}`, 'error');
    btn.disabled = false;
    if (icon) icon.className = 'ph-bold ph-rocket-launch';
    if (text) text.textContent = '🚀 ' + (typeof getTranslation === 'function' ? getTranslation('common_retry', 'Retry') : 'Retry');
  }
}

async function checkForWahaUpdates(silent = false) {
  const btn = document.getElementById('btnCheckUpdate');
  const icon = document.getElementById('updateCheckIcon');
  const text = document.getElementById('updateCheckText');
  if (!btn) return;

  btn.disabled = true;
  if (icon) {
    icon.className = 'ph-bold ph-spinner animate-spin text-xs text-blue-400';
  }
  if (text) text.textContent = typeof getTranslation === 'function' ? getTranslation('footer_checking_update', 'Checking...') : 'Checking...';

  try {
    let latestTag = '';
    let latestReleaseData = null;

    // 1. Try fetching latest release from user's fork
    try {
      const relRes = await fetch(`https://api.github.com/repos/${GITHUB_FORK_REPO}/releases/latest?t=${Date.now()}`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      if (relRes.ok) {
        const relData = await relRes.json();
        if (relData && relData.tag_name) {
          latestTag = relData.tag_name.replace(/^v/, '');
          latestReleaseData = relData;
        }
      }
    } catch (e) {
      console.warn('Release fetch error:', e);
    }

    // 2. If no GitHub release, check repository tags
    if (!latestTag) {
      try {
        const tagRes = await fetch(`https://api.github.com/repos/${GITHUB_FORK_REPO}/tags?t=${Date.now()}`);
        if (tagRes.ok) {
          const tags = await tagRes.json();
          if (Array.isArray(tags) && tags.length > 0 && tags[0].name) {
            latestTag = tags[0].name.replace(/^v/, '');
          }
        }
      } catch (e) {
        console.warn('Tags fetch error:', e);
      }
    }

    // 3. Fallback to upstream if fork has no tags/releases
    if (!latestTag) {
      const upRes = await fetch(`https://api.github.com/repos/devlikeapro/waha/releases/latest?t=${Date.now()}`);
      if (upRes.ok) {
        const upData = await upRes.json();
        latestTag = upData.tag_name ? upData.tag_name.replace(/^v/, '') : '';
        latestReleaseData = upData;
      }
    }

    const cleanCurrent = currentWahaVersion.replace(/^v/, '');

    if (latestTag && latestTag !== cleanCurrent) {
      // New version available -> Open Update Confirmation Modal!
      if (text) text.textContent = `New: v${latestTag} 🎉`;
      if (icon) icon.className = 'ph-bold ph-arrow-circle-up text-xs text-amber-400';
      btn.className = 'flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-xs font-semibold text-amber-300 border border-amber-500/30 transition cursor-pointer shadow-sm';
      btn.onclick = () => openUpdateModal(latestTag, latestReleaseData);
      if (!silent) {
        showToast(typeof getTranslation === 'function' ? getTranslation('toast_update_available', `New version v${latestTag} is available on GitHub!`) : `New version v${latestTag} is available on GitHub!`, 'info');
      }
    } else {
      // Up to date
      if (text) text.textContent = typeof getTranslation === 'function' ? getTranslation('footer_up_to_date', 'Up to date ✓') : 'Up to date ✓';
      if (icon) icon.className = 'ph-bold ph-check text-xs text-emerald-400';
      btn.className = 'flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-400 border border-emerald-500/20 cursor-default';
      if (!silent) {
        showToast(typeof getTranslation === 'function' ? getTranslation('toast_up_to_date', 'WAHA is up to date!') : 'WAHA is up to date!', 'success');
      }
    }
  } catch (err) {
    if (text) text.textContent = typeof getTranslation === 'function' ? getTranslation('footer_check_update', 'Check Update') : 'Check Update';
    if (icon) icon.className = 'ph-bold ph-git-pull-request text-xs text-gray-400';
    if (!silent) {
      showToast(`GitHub check: ${err.message}`, 'warning');
    }
  } finally {
    btn.disabled = false;
  }
}
