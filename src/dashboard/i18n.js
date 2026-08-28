// ChatbotX Dashboard Internationalization (i18n) System
// 100% Comprehensive Translations for: English (default), Vietnamese, Indonesian, Portuguese (Brazil)

const I18N_LANGUAGES = {
  en: {
    code: 'en',
    label: 'English',
    shortLabel: 'EN',
    flag: 'https://flagcdn.com/w40/us.png'
  },
  vi: {
    code: 'vi',
    label: 'Vietnamese',
    shortLabel: 'VI',
    flag: 'https://flagcdn.com/w40/vn.png'
  },
  id: {
    code: 'id',
    label: 'Indonesian',
    shortLabel: 'ID',
    flag: 'https://flagcdn.com/w40/id.png'
  },
  pt: {
    code: 'pt',
    label: 'Portuguese (Brazil)',
    shortLabel: 'PT',
    flag: 'https://flagcdn.com/w40/br.png'
  }
};

const TRANSLATIONS = {
  // ================= ENGLISH (DEFAULT) =================
  en: {
    // Top Bar & Navbar
    badge_multi_account: "Multi-Account Gateway",
    nav_title: "ChatbotX WhatsApp Gateway",
    nav_docs: "Docs",
    nav_refresh: "Refresh Data",
    nav_app_link: "Open ChatbotX",

    // Common & Loading
    common_loading: "Loading...",
    common_offline: "Offline",
    common_online: "Online",

    // Sessions Bar
    sessions_title: "WhatsApp Accounts",
    sessions_btn_add: "Add Account",
    sessions_all: "All Accounts",
    sessions_desc: "Click on an account to view QR code or configure Channel",
    session_status_working: "Connected",
    session_status_scan_qr: "Scan QR",
    session_status_stopped: "Stopped",
    session_status_starting: "Starting...",
    session_status_failed: "Failed",

    // Overview Cards
    card_whatsapp_account: "WhatsApp Account",
    card_conn_status: "Connection Status:",
    card_chatbotx_channel: "ChatbotX Channel",
    card_webhook_routing: "Webhook Routing:",
    card_gateway_infra: "Gateway Infrastructure",
    card_waha_core: "WAHA Cloud Core",
    card_whatsapp_engine: "WhatsApp Engine:",

    // Step 1: Connect WhatsApp Account
    step1_title: "Step 1: Connect WhatsApp Account",
    step1_desc: "Scan QR code or use Phone Pairing Code",
    step1_tab_qr: "QR Code",
    step1_tab_pairing: "Phone Pairing Code",
    step1_qr_instructions: "Open WhatsApp on your phone > Settings > Linked Devices > Link a Device > Scan QR",
    step1_qr_auto_refresh: "QR code refreshes automatically when unlinked",
    step1_qr_loading: "Loading QR Code...",
    step1_pairing_subheader: "Link with Phone Number",
    step1_phone_label: "WhatsApp Phone Number:",
    step1_phone_placeholder: "e.g. 14155552671",
    step1_phone_hint: "Country Code + Phone without leading 0 (e.g. 14155552671).",
    step1_btn_request_code: "Get Code",
    step1_pairing_code_label: "Enter this 8-digit code into WhatsApp on your phone:",
    step1_pairing_step_instructions: "Open WhatsApp > Linked Devices > Link with phone number > Enter the code above.",

    // Step 2: Create Channel on ChatbotX
    step2_title: "Step 2: Create Channel on ChatbotX",
    step2_desc: "Paste this URL into Callback URL field on ChatbotX",
    step2_label: "Callback URL for session:",
    step2_channel_name_label: "Channel Name (Name):",
    step2_auto_detect: "Auto-detected from WhatsApp",
    step2_callback_url_label: "Callback URL (This Channel):",
    step2_dedicated_route: "Dedicated route for this number",
    step2_btn_copy: "Copy",
    step2_copied: "Copied!",
    step2_note: "Receives messages from ChatbotX and routes directly to this WhatsApp number.",

    // Step 3: Link ChatbotX Channel
    step3_title: "Step 3: Link ChatbotX Channel",
    step3_subtitle: "Paste Channel API Token generated from ChatbotX",
    step3_desc: "Synchronize incoming WhatsApp messages to your ChatbotX Inbox & Automation bot.",
    step3_token_label: "ChatbotX API Token:",
    step3_token_sub: "Obtain after clicking Create",
    step3_token_placeholder: "Paste Channel Token from ChatbotX here...",
    step3_token_hint: "Paste Channel API Token generated from ChatbotX",
    step3_api_url_label: "ChatbotX API URL:",
    step3_media_url_label: "Media & Webhook Base URL:",
    step3_media_url_sub: "Your Domain",
    step3_include_groups: "Forward WhatsApp group messages to ChatbotX",
    step3_btn_save: "Save & Activate Channel",
    step3_saving: "Saving...",
    step3_status_active: "Linked & Active ✓",
    step3_status_inactive: "Not Linked",
    step3_status_disabled: "Disabled",
    step3_btn_saved: "Channel Linked (Click to Update)",

    // Connected Card
    connected_title: "WhatsApp Connected Successfully",
    connected_online: "Connected Online",
    connected_desc: "Account is active and ready to send & receive messages with ChatbotX.",
    connected_phone_label: "Phone Number:",
    connected_name_label: "Account Name:",
    connected_session_label: "Session ID:",
    connected_btn_disconnect: "Disconnect",
    connected_btn_restart: "Restart Session",
    connected_btn_delete: "Delete Account",

    // Test Message
    test_title: "Test Outbound Message",
    test_desc: "Send direct message from WhatsApp account",
    test_recipient_label: "Recipient Phone Number:",
    test_recipient_sub: "Country code + Phone",
    test_recipient_placeholder: "e.g. 14155552671",
    test_recipient_hint: "Standard format: Country code + Phone without leading 0 (e.g. 14155552671).",
    test_message_label: "Message Content:",
    test_message_default: "Hello! This is a test message from ChatbotX WhatsApp Gateway.",
    test_btn_send: "Send Test Message",
    test_sending: "Sending...",

    // Modal: Add Account
    modal_add_title: "Add New WhatsApp Account",
    modal_add_subtitle: "System will automatically detect account name upon pairing",
    modal_add_label: "Account Name (Alphanumeric, no spaces):",
    modal_add_placeholder: "e.g. account_2, sales_hn, support_02",
    modal_add_hint: "Leave blank to auto-generate sequentially (account_2, account_3...).",
    modal_add_btn_create: "Create & Connect",
    modal_add_btn_cancel: "Cancel",

    // Modal: Update Dashboard
    modal_update_title: "Update Dashboard",
    modal_update_subtitle: "A new version is ready to install",
    modal_update_current: "Current Version",
    modal_update_target: "New Version",
    modal_update_notes_title: "Release Notes:",
    modal_update_hint: "Update completes in ~2 seconds. Existing WhatsApp accounts and session data remain untouched.",
    modal_update_btn_apply: "🚀 Update Now",

    // Empty State
    empty_no_accounts_title: "No WhatsApp Accounts Yet",
    empty_no_accounts_desc: "Click the '+ Add Account' button at the top to create your first WhatsApp connection.",

    // Footer
    footer_text: "Multi-Account Enterprise Edition",
    footer_version: "Version:",
    footer_check_update: "Check Update",
    footer_checking_update: "Checking...",
    footer_up_to_date: "Up to date ✓",

    // Alerts / Dynamic Toasts
    confirm_delete: "Are you sure you want to delete this WhatsApp account? This action cannot be undone.",
    confirm_disconnect: "Are you sure you want to disconnect this WhatsApp session?",
    toast_copy_success: "Copied to clipboard!",
    toast_saved_success: "ChatbotX channel linked successfully!",
    toast_test_success: "Test message sent successfully to ",
    toast_err_fill_token: "Please enter the ChatbotX Channel API Token",
    toast_switched_session: "Switched to session: ",
    toast_requesting_code: "Requesting pairing code for ",
    toast_code_success: "Pairing code received successfully!",
    toast_code_error: "Unable to get code: ",
    toast_phone_invalid: "Please enter a valid phone number (e.g. 14155552671)",
    toast_sending_test: "Sending test message to ",
    toast_save_error: "Error saving configuration: ",
    toast_up_to_date: "WAHA is up to date!",
    toast_update_available: "A new version of WAHA is available on GitHub!"
  },

  // ================= VIETNAMESE =================
  vi: {
    // Top Bar & Navbar
    badge_multi_account: "Cổng Kết Nối Đa Tài Khoản",
    nav_title: "Cổng Kết Nối ChatbotX WhatsApp",
    nav_docs: "Tài liệu",
    nav_refresh: "Làm mới dữ liệu",
    nav_app_link: "Mở ChatbotX",

    // Common & Loading
    common_loading: "Đang tải...",
    common_offline: "Ngoại tuyến",
    common_online: "Trực tuyến",

    // Sessions Bar
    sessions_title: "Danh sách Tài khoản WhatsApp",
    sessions_btn_add: "Thêm số WhatsApp",
    sessions_all: "Tất cả tài khoản",
    sessions_desc: "Click vào tài khoản để xem mã QR hoặc cấu hình Kênh",
    session_status_working: "Đã kết nối",
    session_status_scan_qr: "Chờ quét QR",
    session_status_stopped: "Đã dừng",
    session_status_starting: "Đang khởi động...",
    session_status_failed: "Lỗi kết nối",

    // Overview Cards
    card_whatsapp_account: "Số WhatsApp",
    card_conn_status: "Trạng thái kết nối:",
    card_chatbotx_channel: "Kênh ChatbotX",
    card_webhook_routing: "Webhook định tuyến:",
    card_gateway_infra: "Hạ tầng Cổng Gateway",
    card_waha_core: "WAHA Cloud Core",
    card_whatsapp_engine: "Engine WhatsApp:",

    // Step 1: Connect WhatsApp Account
    step1_title: "Bước 1: Kết nối tài khoản WhatsApp",
    step1_desc: "Quét mã QR hoặc dùng mã ghép nối số điện thoại",
    step1_tab_qr: "Mã QR",
    step1_tab_pairing: "Mã số (Phone)",
    step1_qr_instructions: "Mở WhatsApp trên điện thoại > Cài đặt > Thiết bị liên kết > Liên kết thiết bị > Quét mã QR",
    step1_qr_auto_refresh: "Mã QR tự động làm mới mỗi 20 giây khi chưa quét",
    step1_qr_loading: "Đang tải mã QR...",
    step1_pairing_subheader: "Liên kết bằng Số điện thoại",
    step1_phone_label: "Số điện thoại WhatsApp:",
    step1_phone_placeholder: "ví dụ: 84384524243",
    step1_phone_hint: "Mã quốc gia + SĐT bỏ số 0 đầu (ví dụ: 84384524243).",
    step1_btn_request_code: "Lấy mã",
    step1_pairing_code_label: "Mã ghép nối của bạn (nhập vào WhatsApp trong 60 giây):",
    step1_pairing_step_instructions: "Mở WhatsApp > Thiết bị liên kết > Liên kết bằng số điện thoại > Nhập mã trên.",

    // Step 2: Create Channel on ChatbotX
    step2_title: "Bước 2: Tạo kênh trên ChatbotX",
    step2_desc: "Dán URL này vào ô Callback URL khi tạo kênh trên ChatbotX",
    step2_label: "Callback URL cho tài khoản:",
    step2_channel_name_label: "Tên Kênh (Name):",
    step2_auto_detect: "Tự động nhận diện từ WhatsApp",
    step2_callback_url_label: "Callback URL (Kênh này):",
    step2_dedicated_route: "Định tuyến riêng cho số này",
    step2_btn_copy: "Sao chép",
    step2_copied: "Đã chép!",
    step2_note: "Nhận tin nhắn phản hồi từ ChatbotX và gửi trực tiếp qua số WhatsApp này.",

    // Step 3: Link ChatbotX Channel
    step3_title: "Bước 3: Kích hoạt liên kết ChatbotX",
    step3_subtitle: "Dán mã API Token sinh ra từ ChatbotX",
    step3_desc: "Đồng bộ tin nhắn WhatsApp đến vào Hộp thư & Kịch bản AI ChatbotX của bạn.",
    step3_token_label: "ChatbotX API Token:",
    step3_token_sub: "Lấy sau khi bấm Create",
    step3_token_placeholder: "Dán mã Token vào đây...",
    step3_token_hint: "Lấy Token: Mở ChatbotX > Kênh > Chọn / Tạo Kênh > Sao chép API Token",
    step3_api_url_label: "ChatbotX API URL:",
    step3_media_url_label: "Media & Webhook Base URL:",
    step3_media_url_sub: "Domain của bạn",
    step3_include_groups: "Bao gồm tin nhắn từ Nhóm WhatsApp (Groups)",
    step3_btn_save: "Lưu & Kích hoạt Kênh",
    step3_saving: "Đang lưu...",
    step3_status_active: "Đã liên kết thành công ✓",
    step3_status_inactive: "Chưa liên kết",
    step3_status_disabled: "Tạm tắt",
    step3_btn_saved: "Đã liên kết kênh (Bấm để cập nhật lại)",

    // Connected Card
    connected_title: "WhatsApp Đã Kết Nối Thành Công",
    connected_online: "Đã kết nối Online",
    connected_desc: "Tài khoản đang hoạt động ổn định và sẵn sàng gửi/nhận tin nhắn với ChatbotX.",
    connected_phone_label: "Số điện thoại:",
    connected_name_label: "Tên tài khoản:",
    connected_session_label: "ID Phiên:",
    connected_btn_disconnect: "Hủy liên kết (Logout)",
    connected_btn_restart: "Khởi động lại",
    connected_btn_delete: "Xóa số này",

    // Test Message
    test_title: "Kiểm tra Gửi Tin Nhắn Thử",
    test_desc: "Gửi trực tiếp tin nhắn từ số WhatsApp",
    test_recipient_label: "Số điện thoại nhận:",
    test_recipient_sub: "Mã QG + SĐT",
    test_recipient_placeholder: "ví dụ: 84384524243",
    test_recipient_hint: "Định dạng chuẩn: 84xxxxxxxxx (bỏ số 0 đầu, ví dụ VN: 84384524243 hoặc 84901234567).",
    test_message_label: "Nội dung tin nhắn:",
    test_message_default: "Xin chào, đây là tin nhắn thử nghiệm từ ChatbotX Gateway!",
    test_btn_send: "Gửi tin nhắn test",
    test_sending: "Đang gửi...",

    // Modal: Add Account
    modal_add_title: "Thêm Số WhatsApp Mới",
    modal_add_subtitle: "Hệ thống sẽ tự động nhận diện tên khi bạn kết nối",
    modal_add_label: "Mã định danh (hoặc để mặc định tự sinh):",
    modal_add_placeholder: "ví dụ: so_02, hotline_hcm, cskh",
    modal_add_hint: "Để trống để tự động tạo theo thứ tự (account_2, account_3...).",
    modal_add_btn_create: "Tạo & Kết nối",
    modal_add_btn_cancel: "Hủy",

    // Modal: Update Dashboard
    modal_update_title: "Cập nhật Dashboard",
    modal_update_subtitle: "Phiên bản mới đã sẵn sàng để nâng cấp",
    modal_update_current: "Phiên bản hiện tại",
    modal_update_target: "Phiên bản mới",
    modal_update_notes_title: "Nội dung cập nhật:",
    modal_update_hint: "Quá trình cập nhật hoàn tất trong ~2 giây. Dữ liệu tài khoản WhatsApp và kênh liên kết được giữ nguyên 100%.",
    modal_update_btn_apply: "🚀 Cập nhật ngay",

    // Empty State
    empty_no_accounts_title: "Chưa có tài khoản WhatsApp nào",
    empty_no_accounts_desc: "Nhấn nút '+ Add Account' ở trên cùng để thêm tài khoản WhatsApp đầu tiên của bạn.",

    // Footer
    footer_text: "Phiên bản Doanh nghiệp Đa Tài khoản",
    footer_version: "Phiên bản:",
    footer_check_update: "Kiểm tra Cập nhật",
    footer_checking_update: "Đang kiểm tra...",
    footer_up_to_date: "Mới nhất ✓",

    // Alerts / Dynamic Toasts
    confirm_delete: "Bạn có chắc chắn muốn xóa tài khoản WhatsApp này? Hành động này không thể hoàn tác.",
    confirm_disconnect: "Bạn có chắc chắn muốn ngắt kết nối phiên WhatsApp này?",
    toast_copy_success: "Đã sao chép vào bộ nhớ tạm!",
    toast_saved_success: "Đã liên kết kênh ChatbotX thành công!",
    toast_test_success: "Tin nhắn đã gửi thành công tới ",
    toast_err_fill_token: "Vui lòng nhập API Token Kênh ChatbotX",
    toast_switched_session: "Đã chuyển sang quản lý: ",
    toast_requesting_code: "Đang yêu cầu mã ghép nối cho ",
    toast_code_success: "Đã nhận mã ghép nối thành công!",
    toast_code_error: "Không thể lấy mã: ",
    toast_phone_invalid: "Vui lòng nhập số điện thoại hợp lệ (ví dụ: 84384524243)",
    toast_sending_test: "Đang gửi tin nhắn thử nghiệm tới ",
    toast_save_error: "Lỗi khi lưu cấu hình: ",
    toast_up_to_date: "WAHA đang ở phiên bản mới nhất!",
    toast_update_available: "Đã có phiên bản WAHA mới trên GitHub!"
  },

  // ================= INDONESIAN =================
  id: {
    // Top Bar & Navbar
    badge_multi_account: "Gateway Multi-Akun",
    nav_title: "ChatbotX WhatsApp Gateway",
    nav_docs: "Dokumentasi",
    nav_refresh: "Segarkan Data",
    nav_app_link: "Buka ChatbotX",

    // Common & Loading
    common_loading: "Memuat...",
    common_offline: "Offline",
    common_online: "Online",

    // Sessions Bar
    sessions_title: "Daftar Akun WhatsApp",
    sessions_btn_add: "Tambah Nomor Baru",
    sessions_all: "Semua Akun",
    sessions_desc: "Klik akun untuk melihat kode QR atau mengatur Saluran",
    session_status_working: "Terhubung",
    session_status_scan_qr: "Pindai QR",
    session_status_stopped: "Berhenti",
    session_status_starting: "Memulai...",
    session_status_failed: "Gagal",

    // Overview Cards
    card_whatsapp_account: "Nomor WhatsApp",
    card_conn_status: "Status Koneksi:",
    card_chatbotx_channel: "Saluran ChatbotX",
    card_webhook_routing: "Rute Webhook:",
    card_gateway_infra: "Infrastruktur Gateway",
    card_waha_core: "WAHA Cloud Core",
    card_whatsapp_engine: "Mesin WhatsApp:",

    // Step 1: Connect WhatsApp Account
    step1_title: "Langkah 1: Hubungkan Akun WhatsApp",
    step1_desc: "Pindai kode QR atau gunakan kode penyandingan nomor telepon",
    step1_tab_qr: "Kode QR",
    step1_tab_pairing: "Kode Nomor (Telepon)",
    step1_qr_instructions: "Buka WhatsApp di ponsel Anda > Pengaturan > Perangkat Tertaut > Tautkan Perangkat > Pindai QR",
    step1_qr_auto_refresh: "Kode QR otomatis disegarkan setiap 20 detik jika belum dipindai",
    step1_qr_loading: "Memuat kode QR...",
    step1_pairing_subheader: "Tautkan dengan Nomor Telepon",
    step1_phone_label: "Nomor Telepon WhatsApp:",
    step1_phone_placeholder: "contoh: 6281234567890",
    step1_phone_hint: "Kode Negara + Nomor Telepon tanpa angka 0 di depan (contoh: 6281234567890).",
    step1_btn_request_code: "Minta Kode",
    step1_pairing_code_label: "Masukkan kode 8 digit ini ke aplikasi WhatsApp di ponsel Anda:",
    step1_pairing_step_instructions: "Buka WhatsApp > Perangkat Tertaut > Tautkan dengan nomor telepon > Masukkan kode di atas.",

    // Step 2: Create Channel on ChatbotX
    step2_title: "Langkah 2: Buat Saluran di ChatbotX",
    step2_desc: "Salin data ini ke formulir Saluran ChatbotX",
    step2_label: "Callback URL untuk akun:",
    step2_channel_name_label: "Nama Saluran (Name):",
    step2_auto_detect: "Otomatis terdeteksi dari WhatsApp",
    step2_callback_url_label: "Callback URL (Saluran ini):",
    step2_dedicated_route: "Rute khusus untuk nomor ini",
    step2_btn_copy: "Salin",
    step2_copied: "Tersalin!",
    step2_note: "Menerima pesan balasan dari ChatbotX dan mengirimkannya langsung melalui nomor WhatsApp ini.",

    // Step 3: Link ChatbotX Channel
    step3_title: "Langkah 3: Tautkan Saluran ChatbotX",
    step3_subtitle: "Tempel API Token Saluran dari ChatbotX di sini",
    step3_desc: "Sinkronkan pesan WhatsApp masuk ke Kotak Masuk & Otomatisasi AI ChatbotX Anda.",
    step3_token_label: "API Token ChatbotX:",
    step3_token_sub: "Dapatkan setelah klik Create",
    step3_token_placeholder: "Tempel API Token Saluran từ ChatbotX di sini...",
    step3_token_hint: "Dapatkan Token: Buka ChatbotX > Saluran > Pilih / Buat Saluran > Salin API Token",
    step3_api_url_label: "URL API ChatbotX:",
    step3_media_url_label: "Media & Webhook Base URL:",
    step3_media_url_sub: "Domain Anda",
    step3_include_groups: "Teruskan pesan grup WhatsApp ke ChatbotX",
    step3_btn_save: "Simpan & Aktifkan Saluran",
    step3_saving: "Menyimpan...",
    step3_status_active: "Tertaut & Aktif ✓",
    step3_status_inactive: "Belum Tertaut",
    step3_status_disabled: "Dinonaktifkan",
    step3_btn_saved: "Saluran Terhubung (Klik untuk Perbarui)",

    // Connected Card
    connected_title: "WhatsApp Berhasil Terhubung",
    connected_online: "Terhubung Online",
    connected_desc: "Akun aktif dan siap mengirim & menerima pesan dengan ChatbotX.",
    connected_phone_label: "Nomor Telepon:",
    connected_name_label: "Nama Akun:",
    connected_session_label: "ID Sesi:",
    connected_btn_disconnect: "Putuskan Sambungan",
    connected_btn_restart: "Mulai Ulang Sesi",
    connected_btn_delete: "Hapus Akun",

    // Test Message
    test_title: "Uji Kirim Pesan",
    test_desc: "Kirim pesan langsung dari nomor WhatsApp",
    test_recipient_label: "Nomor Telepon Penerima:",
    test_recipient_sub: "Kode Negara + No. HP",
    test_recipient_placeholder: "contoh: 6281234567890",
    test_recipient_hint: "Format standar: Kode Negara + Nomor tanpa awalan 0 (contoh: 6281234567890).",
    test_message_label: "Isi Pesan:",
    test_message_default: "Halo! Ini adalah pesan uji coba dari ChatbotX WhatsApp Gateway.",
    test_btn_send: "Kirim Pesan Uji",
    test_sending: "Mengirim...",

    // Modal: Add Account
    modal_add_title: "Tambah Nomor WhatsApp Baru",
    modal_add_subtitle: "Sistem akan otomatis mendeteksi nama saat terhubung",
    modal_add_label: "Nama Akun (Huruf & angka tanpa spasi):",
    modal_add_placeholder: "contoh: sales_jkt, support_02",
    modal_add_hint: "Kosongkan untuk penamaan otomatis berurutan (account_2, account_3...).",
    modal_add_btn_create: "Buat & Sambungkan",
    modal_add_btn_cancel: "Batal",

    // Footer
    footer_text: "Edisi Perusahaan Multi-Akun",
    footer_version: "Versi:",
    footer_check_update: "Periksa Pembaruan",
    footer_checking_update: "Memeriksa...",
    footer_up_to_date: "Terbaru ✓",

    // Alerts / Dynamic Toasts
    confirm_delete: "Apakah Anda yakin ingin menghapus akun WhatsApp ini? Tindakan ini không thể hoàn tác.",
    confirm_disconnect: "Apakah Anda yakin ingin memutuskan sambungan sesi WhatsApp ini?",
    toast_copy_success: "Disalin ke papan klip!",
    toast_saved_success: "Saluran ChatbotX berhasil ditautkan!",
    toast_test_success: "Pesan uji berhasil dikirim ke ",
    toast_err_fill_token: "Silakan masukkan API Token Saluran ChatbotX",
    toast_switched_session: "Beralih ke sesi: ",
    toast_requesting_code: "Meminta kode penyandingan untuk ",
    toast_code_success: "Kode penyandingan berhasil diterima!",
    toast_code_error: "Gagal mendapatkan kode: ",
    toast_phone_invalid: "Harap masukkan nomor telepon yang valid (contoh: 6281234567890)",
    toast_sending_test: "Mengirim pesan uji ke ",
    toast_save_error: "Terjadi kesalahan saat menyimpan: ",
    toast_up_to_date: "WAHA sudah versi terbaru!",
    toast_update_available: "Versi baru WAHA tersedia di GitHub!"
  },

  // ================= PORTUGUESE (BRAZIL) =================
  pt: {
    // Top Bar & Navbar
    badge_multi_account: "Gateway Multi-Contas",
    nav_title: "ChatbotX WhatsApp Gateway",
    nav_docs: "Documentação",
    nav_refresh: "Atualizar Dados",
    nav_app_link: "Abrir ChatbotX",

    // Common & Loading
    common_loading: "Carregando...",
    common_offline: "Desconectado",
    common_online: "Conectado",

    // Sessions Bar
    sessions_title: "Contas WhatsApp",
    sessions_btn_add: "Adicionar Nova Conta",
    sessions_all: "Todas as Contas",
    sessions_desc: "Clique em uma conta para ver o QR code ou configurar o Canal",
    session_status_working: "Conectado",
    session_status_scan_qr: "Escanear QR",
    session_status_stopped: "Parado",
    session_status_starting: "Iniciando...",
    session_status_failed: "Falhou",

    // Overview Cards
    card_whatsapp_account: "Número do WhatsApp",
    card_conn_status: "Status da Conexão:",
    card_chatbotx_channel: "Canal ChatbotX",
    card_webhook_routing: "Roteamento de Webhook:",
    card_gateway_infra: "Infraestrutura Gateway",
    card_waha_core: "WAHA Cloud Core",
    card_whatsapp_engine: "Motor WhatsApp:",

    // Step 1: Connect WhatsApp Account
    step1_title: "Passo 1: Conectar Conta WhatsApp",
    step1_desc: "Escaneie o código QR ou utilize o código de pareamento por telefone",
    step1_tab_qr: "Código QR",
    step1_tab_pairing: "Código de Pareamento",
    step1_qr_instructions: "Abra o WhatsApp no celular > Configurações > Dispositivos Conectados > Conectar Dispositivo > Escanear QR",
    step1_qr_auto_refresh: "O código QR é atualizado automaticamente a cada 20 segundos se não for escaneado",
    step1_qr_loading: "Carregando código QR...",
    step1_pairing_subheader: "Vincular com Número de Telefone",
    step1_phone_label: "Número de Telefone do WhatsApp:",
    step1_phone_placeholder: "ex: 5511999999999",
    step1_phone_hint: "Código do País + DDD + Número sem o 0 inicial (ex: 5511999999999).",
    step1_btn_request_code: "Solicitar Código",
    step1_pairing_code_label: "Digite este código de 8 dígitos no WhatsApp em seu celular:",
    step1_pairing_step_instructions: "Abra o WhatsApp > Dispositivos Conectados > Conectar com número de telefone > Digite o código acima.",

    // Step 2: Create Channel on ChatbotX
    step2_title: "Passo 2: Criar Canal no ChatbotX",
    step2_desc: "Copie estas informações para o ChatbotX",
    step2_label: "Callback URL para a conta:",
    step2_channel_name_label: "Nome do Canal (Name):",
    step2_auto_detect: "Detectado automaticamente pelo WhatsApp",
    step2_callback_url_label: "Callback URL (Deste Canal):",
    step2_dedicated_route: "Rota dedicada para este número",
    step2_btn_copy: "Copiar",
    step2_copied: "Copiado!",
    step2_note: "Recebe mensagens do ChatbotX e encaminha diretamente por este número do WhatsApp.",

    // Step 3: Link ChatbotX Channel
    step3_title: "Passo 3: Vincular Canal ChatbotX",
    step3_subtitle: "Cole o Token de API do ChatbotX aqui",
    step3_desc: "Sincronize mensagens do WhatsApp com a Caixa de Entrada e fluxos de IA do ChatbotX.",
    step3_token_label: "Token de API ChatbotX:",
    step3_token_sub: "Obtenha após clicar em Create",
    step3_token_placeholder: "Cole o Token de API do ChatbotX aqui...",
    step3_token_hint: "Obter Token: Abra o ChatbotX > Canais > Selecionar / Criar Canal > Copiar Token de API",
    step3_api_url_label: "URL da API ChatbotX:",
    step3_media_url_label: "Media & Webhook Base URL:",
    step3_media_url_sub: "Seu Domínio",
    step3_include_groups: "Encaminhar mensagens de grupos do WhatsApp para o ChatbotX",
    step3_btn_save: "Salvar e Ativar Canal",
    step3_saving: "Salvando...",
    step3_status_active: "Vinculado & Ativo ✓",
    step3_status_inactive: "Não Vinculado",
    step3_status_disabled: "Desativado",
    step3_btn_saved: "Canal Vinculado (Clique para Atualizar)",

    // Connected Card
    connected_title: "WhatsApp Conectado com Sucesso",
    connected_online: "Conectado Online",
    connected_desc: "A conta está ativa e pronta para enviar e receber mensagens com o ChatbotX.",
    connected_phone_label: "Número de Telefone:",
    connected_name_label: "Nome da Conta:",
    connected_session_label: "ID da Sessão:",
    connected_btn_disconnect: "Desconectar",
    connected_btn_restart: "Reiniciar Sessão",
    connected_btn_delete: "Excluir Conta",

    // Test Message
    test_title: "Testar Envio de Mensagem",
    test_desc: "Envie uma mensagem direta a partir da conta do WhatsApp",
    test_recipient_label: "Número do Destinatário:",
    test_recipient_sub: "Cód. País + DDD + Número",
    test_recipient_placeholder: "ex: 5511999999999",
    test_recipient_hint: "Formato padrão: Código do país + DDD + Número sem o 0 inicial (ex: 5511999999999).",
    test_message_label: "Conteúdo da Mensagem:",
    test_message_default: "Olá! Esta é uma mensagem de teste enviada pelo ChatbotX WhatsApp Gateway.",
    test_btn_send: "Enviar Mensagem de Teste",
    test_sending: "Enviando...",

    // Modal: Add Account
    modal_add_title: "Adicionar Nova Conta WhatsApp",
    modal_add_subtitle: "O sistema detectará automaticamente o nome ao conectar",
    modal_add_label: "Nome da Conta (Alfanumérico, sem espaços):",
    modal_add_placeholder: "ex: vendas_sp, suporte_02",
    modal_add_hint: "Deixe em branco para gerar sequencialmente (account_2, account_3...).",
    modal_add_btn_create: "Criar e Conectar",
    modal_add_btn_cancel: "Cancelar",

    // Footer
    footer_text: "Edição Empresarial Multi-Contas",
    footer_version: "Versão:",
    footer_check_update: "Verificar Atualização",
    footer_checking_update: "Verificando...",
    footer_up_to_date: "Atualizado ✓",

    // Alerts / Dynamic Toasts
    confirm_delete: "Tem certeza de que deseja excluir esta conta do WhatsApp? Esta ação não pode ser desfeita.",
    confirm_disconnect: "Tem certeza de que deseja desconectar esta sessão do WhatsApp?",
    toast_copy_success: "Copiado para a área de transferência!",
    toast_saved_success: "Canal ChatbotX vinculado com sucesso!",
    toast_test_success: "Mensagem de teste enviada com sucesso para ",
    toast_err_fill_token: "Por favor, insira o Token de API do Canal ChatbotX",
    toast_switched_session: "Alternado para a sessão: ",
    toast_requesting_code: "Solicitando código de pareamento para ",
    toast_code_success: "Código de pareamento recebido com sucesso!",
    toast_code_error: "Não foi possível obter o código: ",
    toast_phone_invalid: "Por favor, insira um número de telefone válido (ex: 5511999999999)",
    toast_sending_test: "Enviando mensagem de teste para ",
    toast_save_error: "Erro ao salvar as configurações: ",
    toast_up_to_date: "O WAHA está atualizado!",
    toast_update_available: "Uma nova versão do WAHA está disponível no GitHub!"
  }
};

let currentLang = localStorage.getItem('dashboard_lang') || 'en';

function getTranslation(key, defaultVal = '') {
  const langDict = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
  return langDict[key] !== undefined ? langDict[key] : (TRANSLATIONS['en'][key] || defaultVal);
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) lang = 'en';
  currentLang = lang;
  localStorage.setItem('dashboard_lang', lang);
  updateLanguageUI();
  applyTranslations();

  // Re-render dynamic sessions list if available in app.js
  if (typeof window.reRenderCurrentSessionView === 'function') {
    window.reRenderCurrentSessionView();
  }

  // Close language dropdown
  const dropdown = document.getElementById('langDropdownMenu');
  const caret = document.getElementById('langCaretIcon');
  if (dropdown) dropdown.classList.add('hidden');
  if (caret) {
    caret.classList.remove('ph-caret-up');
    caret.classList.add('ph-caret-down');
  }
}

function toggleLanguageDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('langDropdownMenu');
  const caret = document.getElementById('langCaretIcon');
  if (!dropdown) return;

  const isHidden = dropdown.classList.contains('hidden');
  if (isHidden) {
    dropdown.classList.remove('hidden');
    if (caret) {
      caret.classList.remove('ph-caret-down');
      caret.classList.add('ph-caret-up');
    }
  } else {
    dropdown.classList.add('hidden');
    if (caret) {
      caret.classList.remove('ph-caret-up');
      caret.classList.add('ph-caret-down');
    }
  }
}

// Close language dropdown when clicking outside
document.addEventListener('click', (e) => {
  const container = document.getElementById('langSelectorContainer');
  const dropdown = document.getElementById('langDropdownMenu');
  const caret = document.getElementById('langCaretIcon');
  if (container && dropdown && !container.contains(e.target)) {
    dropdown.classList.add('hidden');
    if (caret) {
      caret.classList.remove('ph-caret-up');
      caret.classList.add('ph-caret-down');
    }
  }
});

function updateLanguageUI() {
  const langObj = I18N_LANGUAGES[currentLang] || I18N_LANGUAGES['en'];
  const flagImg = document.getElementById('currentLangFlag');
  const labelText = document.getElementById('currentLangLabel');

  if (flagImg) flagImg.src = langObj.flag;
  if (labelText) labelText.textContent = langObj.shortLabel;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const text = getTranslation(key);
    if (text) {
      el.textContent = text;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = getTranslation(key);
    if (text) {
      el.setAttribute('placeholder', text);
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    const text = getTranslation(key);
    if (text) {
      el.setAttribute('title', text);
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateLanguageUI();
  applyTranslations();
});
