⚠️ MẪU pháp-lý (mục d) — cần chuyên-gia/luật-sư rà trước khi tự-tin 100% đúng luật. Phần kỹ-thuật (a, e, g, h) đã đối-chiếu trực-tiếp với code thật của `donthat.vercel.app`.

# 10-thực-thi — Checklist Go-Live Landing (donthat.vercel.app) trước khi bật ads

> **TL;DR:** 8 bước a→h bấm-được để landing "Kit Lên Đơn Đầu Tiên" (179.000đ) **thật-sự sẵn-sàng nhận khách + chạy ads** — điền pixel/email/domain, up 3 trang pháp-lý MẪU, đồng-bộ chữ "SePay", điền người-bán ở footer, rồi TEST 1 giao-dịch thật trước khi bơm tiền ads. **Rà code phát-hiện 2 lỗ-hổng chưa nằm trong yêu-cầu gốc nhưng BẮT-BUỘC vá trước khi chạy ads** (mục 0): (1) trang chưa bắn sự-kiện Purchase/CompletePayment nên Meta/TikTok không tối-ưu được cho mục-tiêu mua-hàng dù đã gắn pixel; (2) chưa rõ Vercel đã có biến-môi-trường `SEPAY_API_TOKEN` chưa — thiếu biến này thì khách chuyển tiền xong **KHÔNG nhận được file**. Mọi mục chi-tiền/pháp-lý được đánh dấu rõ 🔴; phần còn lại 🟢 làm ngay, không tốn tiền.

**Neo:** `00-Brain/products.md` (SP thật + hạ-tầng đã có) · `00-Brain/decisions-log.md` 2026-07-07 lượt 2 (refine beachhead theo SP thật) · `10-thuc-thi-compliance-1-eula.md` / `-3-privacy.md` / `-5-refund-sop.md` (nguồn nội-dung 3 trang pháp-lý ở Phụ-lục A) · code thật đối-chiếu từ file `index.html` + `api/order-status.js` + `api/sepay-webhook.js` do CEO gửi 2026-07-06 (zip `donthatlanding.zip`). Số dòng ghi trong tài-liệu này là **vị-trí tham-khảo** tại bản 2026-07-06 00:27 — nếu file đã đổi, dùng đoạn text trích-dẫn để tìm (Ctrl+F) thay vì chỉ tin số dòng.

**Việc tiếp-theo sau khi xong checklist này:** `10-thuc-thi-ads-launch-plan.md` (cùng thư-mục) — kế-hoạch bật ads có kỷ-luật.

---

## 0. Phát-hiện quan-trọng — vá TRƯỚC khi làm 8 bước a-h

### 0.1 Landing CHƯA bắn sự-kiện "mua-hàng thành-công" cho pixel nào
Đã soát toàn-bộ `index.html`: có 2 chỗ code sự-kiện pixel bị **comment sẵn** ở đầu trang (ViewContent lúc load, InitiateCheckout lúc bấm nút mua — sẽ bật ở bước (a) bên dưới), nhưng **không có bất-kỳ dòng nào bắn sự-kiện Purchase (Meta) hay CompletePayment (TikTok)** tại đúng chỗ modal thanh-toán báo "đã nhận tiền" (`function check()` trong khối `<script>` ở cuối file, đoạn `if(d && d.paid){ ... }`).

→ **Hệ-quả nếu không vá:** dù đã gắn đúng Pixel ID và chạy campaign mục-tiêu "Purchase/Conversions", Meta/TikTok **không có tín-hiệu nào để học** khách nào đã thật-sự mua — thuật-toán sẽ tối-ưu mù (dựa trên click chứ không phải mua), tốn tiền vô-ích và không đo được CAC/ROAS thật ở bước sau. Đây là lỗi hay gặp nhất khi tự dựng landing rồi chạy ads.

→ **Cách vá:** xem bước (a.5) bên dưới — chỉ cần thêm 2 dòng code vào đúng chỗ.

### 0.2 Chưa xác-nhận Vercel đã có biến-môi-trường `SEPAY_API_TOKEN`
Đọc `api/order-status.js`: hàm này gọi **SePay User API** (`my.sepay.vn/userapi/transactions/list`) bằng token lấy từ `process.env.SEPAY_API_TOKEN`. Nếu biến này **chưa được set trên Vercel** (không có cách nào AI kiểm-tra được từ xa vì đây là secret riêng của tài-khoản CEO), API trả lỗi `server_missing_SEPAY_API_TOKEN` → **trang thanh-toán sẽ đứng-yên mãi mãi ở trạng-thái "đang chờ chuyển khoản", khách chuyển tiền thật xong KHÔNG BAO GIỜ nhận được link tải.**

→ **Cách kiểm & vá:** xem bước (g.0) bên dưới — bắt-buộc làm TRƯỚC khi test giao-dịch thật, càng bắt-buộc hơn trước khi chạy ads (ads dẫn traffic vào một cổng thanh-toán hỏng = mất tiền ads + mất niềm-tin khách + rủi-ro khiếu-nại).

---

## Chú-giải nhãn

| Nhãn | Ý-nghĩa |
|---|---|
| 🟢 0đ — làm ngay | Không tốn tiền, không cần ai duyệt, chỉ cần thao-tác |
| 🟡 0đ — cần quyết-định nội-dung | Không tốn tiền nhưng cần CEO/founder chọn 1 phương-án (vd số ngày hoàn tiền) |
| 🔴 CHI TIỀN | Có phát-sinh chi-phí thật — ghi rõ số tiền, tuỳ-chọn hay bắt-buộc |
| ⚠️ PHÁP-LÝ MẪU | Nội-dung do AI soạn theo luật hiện-hành nhưng là MẪU — khuyến-nghị luật-sư rà trước khi mở-rộng quy-mô (đã được CEO duyệt tiến-hành ở mức MẪU theo `03-clarification.md` lượt 3) |

## Thứ-tự khuyến-nghị làm (không nhất-thiết theo a→h)

```
(b) email hỗ-trợ  →  (a) gắn 2 pixel + vá Purchase event  →  (e) đồng-bộ chữ "SePay"
   →  (f) điền người-bán  →  (d) 3 trang pháp-lý + banner hoàn-tiền  →  (c) domain (giữ nguyên, 0đ)
   →  DEPLOY lên Vercel  →  (g) kiểm ENV vars rồi TEST 1 giao-dịch thật 179k  →  (h) kiểm pixel bằng Pixel Helper
```
Lý-do: làm nội-dung/copy trước (b,a,e,f,d) rồi mới deploy 1 lần, tránh deploy nhiều lần vặt; (g) và (h) luôn làm SAU CÙNG vì cần bản đã deploy đầy-đủ.

---

## (a) 🟢 Lấy & gắn Meta Pixel ID + TikTok Pixel ID (0đ)

### a.1 — Lấy Meta Pixel ID
1. Vào **Meta Events Manager**: `business.facebook.com/events_manager2` (đăng-nhập bằng Facebook cá-nhân của founder — không bắt-buộc phải có Business Manager trước, Meta sẽ tự tạo khi cần).
2. Bấm nút xanh **"Kết nối nguồn dữ liệu"** (Connect Data Sources) → chọn **"Web"** → **"Kết nối"**.
3. Đặt tên dễ nhận, ví-dụ `DonThat-Landing`.
4. Meta cấp ngay 1 **Pixel ID** — chuỗi số dài 15-16 chữ số (vd `123456789012345`). Copy lại.
5. Xem lại sau này: Events Manager → chọn Pixel → góc trên-phải hiển ID.

*Nguồn: [Cách tạo Meta Pixel 2026 — seovietnam.vn](https://seovietnam.vn/cach-tao-meta-pixel/), [Events Manager là gì — seovietnam.vn](https://seovietnam.vn/events-manager-la-gi/)*

### a.2 — Lấy TikTok Pixel ID
1. Vào **TikTok Ads Manager**: `ads.tiktok.com` → đăng-nhập/tạo tài-khoản quảng-cáo (dùng chính tài-khoản TikTok của founder, không bắt-buộc pháp-nhân — xem thêm điều-kiện ở `10-thuc-thi-ads-launch-plan.md` mục (b)).
2. Menu trên cùng: **Assets → Events**.
3. Chọn **"Web Events"** → **"Create Pixel"**.
4. Đặt tên, vd `DonThat-Landing`.
5. Chọn cách cài **"Manual Install Pixel Code"**.
6. TikTok hiển đoạn JavaScript — phần `ttq.load('XXXXXXXXXXXXXXX')` chính là **Pixel ID**. Copy lại.

*Nguồn: [Cách tạo và truy cập ID TikTok Pixel — ads.tiktok.com](https://ads.tiktok.com/help/article/how-to-create-and-access-tiktok-pixel-id?lang=vi), [Get Started with Pixel — ads.tiktok.com](https://ads.tiktok.com/help/article/get-started-pixel?lang=vi)*

### a.3 — Bỏ comment + điền ID vào `index.html` (khoảng dòng 18-47)
Tìm khối này (đang bị bọc trong `<!-- ... -->` nên KHÔNG chạy):
```html
<!-- Meta Pixel — khoảng dòng 18-32 -->
<!--
<script>
  ...
  fbq('init','[META_PIXEL_ID]');
  fbq('track','PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=[META_PIXEL_ID]&ev=PageView&noscript=1"/></noscript>
-->
```
**Sửa:** xoá dòng `<!--` ngay trên `<script>` và dòng `-->` ngay dưới `</noscript>` (bỏ comment), rồi thay **cả 2 chỗ** `[META_PIXEL_ID]` bằng ID thật lấy ở a.1.

Làm tương-tự cho khối **TikTok Pixel** (khoảng dòng 34-47): xoá `<!--`/`-->` bọc ngoài, thay `[TIKTOK_PIXEL_ID]` ở dòng `ttq.load('[TIKTOK_PIXEL_ID]');ttq.page();` bằng ID thật lấy ở a.2.

### a.4 — Bật sự-kiện ViewContent + InitiateCheckout (khoảng dòng 993-1004)
Tìm:
```js
function trackPurchaseClick() {
  // if (typeof fbq !== 'undefined') fbq('track','InitiateCheckout');
  // if (typeof ttq !== 'undefined') ttq.track('InitiateCheckout');
}
window.addEventListener('load', function() {
  // if (typeof fbq !== 'undefined') fbq('track','ViewContent', {content_name:'Kit Len Don Dau Tien', value:179000, currency:'VND'});
  // if (typeof ttq !== 'undefined') ttq.track('ViewContent');
});
```
**Sửa:** xoá dấu `//` ở đầu 4 dòng có `fbq`/`ttq` (giữ nguyên phần còn lại). Chỉ làm bước này **SAU KHI** a.3 đã xong (2 pixel đã sống) — nếu bật trước, `fbq`/`ttq` chưa tồn-tại nhưng code đã có `typeof ... !== 'undefined'` nên **không lỗi**, chỉ đơn-giản là chưa bắn được gì.

### a.5 — 🔴 VÁ sự-kiện Purchase/CompletePayment (bắt-buộc — xem mục 0.1)
Tìm đoạn cuối file (`<script>` ngay sau khối HTML `#dt-checkout`, hàm `check()`), khối:
```js
      .then(function(d){
        if(d && d.paid){
          stopPoll();
          document.getElementById("dt-co-doneref").textContent = d.ref || currentCode;
          document.getElementById("dt-co-download").href = d.download || "#";
          stepPay.hidden = true; stepDone.hidden = false;
        }
      })
```
**Sửa:** thêm đúng 2 dòng này vào TRƯỚC dấu `}` đóng khối `if(d && d.paid){...}` (sau dòng `stepPay.hidden = true; stepDone.hidden = false;`):
```js
          if (typeof fbq !== 'undefined') fbq('track', 'Purchase', {value: 179000, currency: 'VND', content_name: 'Kit Len Don Dau Tien', content_type: 'product'});
          if (typeof ttq !== 'undefined') ttq.track('CompletePayment', {value: 179000, currency: 'VND', content_name: 'Kit Len Don Dau Tien', content_type: 'product', order_id: (d.ref || currentCode)});
```
Đây là 2 dòng đơn-giản, an-toàn (có kiểm `typeof ... !== 'undefined'` nên không lỗi nếu pixel chưa sống), bắn ĐÚNG lúc hệ-thống xác-nhận đã nhận tiền — đây là tín-hiệu "Purchase" chuẩn để Meta/TikTok tối-ưu ngân-sách ads sau này.

*Tham số `value`/`currency` chuẩn TikTok CompletePayment: [About Parameters — ads.tiktok.com](https://ads.tiktok.com/help/article/about-parameters) (hỗ-trợ `VND`).*

---

## (b) 🟢 Tạo email hỗ-trợ + điền `[EMAIL_HO_TRO]` (0đ)

1. Tạo 1 email riêng cho DN (khuyến-nghị, dù dùng Gmail free) — ví-dụ `hotro.donthat@gmail.com` hoặc theo tên thương-hiệu. Không bắt-buộc phải có domain riêng để tạo email — Gmail free là đủ cho giai-đoạn này.
2. Thay `[EMAIL_HO_TRO]` ở **3 chỗ** trong `index.html` (khoảng dòng **740**, **898**, **950**) bằng email thật vừa tạo.
3. Kiểm-tra email này **thường-xuyên** (ít nhất 2 lần/ngày) khi bắt đầu chạy ads — đây là kênh khách liên-hệ khi lỗi thanh-toán/không nhận được file.

---

## (c) 🟢 Điền `[DOMAIN]` (0đ để go-live, tuỳ-chọn 🔴 nếu mua domain riêng)

- **Khuyến-nghị go-live nhanh:** dùng luôn `donthat.vercel.app` (đang chạy thật, miễn-phí) — điền `donthat.vercel.app` vào chỗ `[DOMAIN]` (khoảng dòng **950**, footer). KHÔNG bắt-buộc phải mua domain riêng mới được chạy ads.
- **Tuỳ-chọn nâng-cấp sau (🔴 chi tiền, không bắt-buộc go-live):** mua domain `.com`/`.vn` riêng (vd `donthat.vn`) — ước ~200.000-350.000đ/năm `[chưa xác-minh giá cụ-thể tại nhà đăng-ký sẽ dùng — cần CEO tra khi mua, theo `10-thuc-thi-ha-tang-ban.md` mục 1a]`. Nên làm SAU khi đã có vài đơn thật (domain riêng giúp tin-cậy hơn khi scale ads, nhưng không phải điều-kiện để bắt đầu test).

---

## (d) ⚠️ Up 3 trang pháp-lý lên Vercel + thêm banner hoàn-tiền ngắn trước nút mua

### d.1 — 3 file cần tạo (nội-dung đầy-đủ ở **Phụ-lục A** cuối tài-liệu này, copy-paste được luôn)
| File mới (tạo cùng thư-mục với `index.html`) | Sẽ chạy tại |
|---|---|
| `chinh-sach-bao-mat.html` | `https://donthat.vercel.app/chinh-sach-bao-mat.html` |
| `dieu-khoan-su-dung.html` | `https://donthat.vercel.app/dieu-khoan-su-dung.html` |
| `chinh-sach-hoan-tien.html` | `https://donthat.vercel.app/chinh-sach-hoan-tien.html` |

Vì project hiện chỉ có `index.html` + thư-mục `api/` + `dl/` (không có `vercel.json`), Vercel **tự-động serve** mọi file `.html` đặt ở gốc project theo đúng tên file — không cần cấu-hình route gì thêm.

### d.2 — 🟡 Nội-dung: đã soạn sẵn MẪU ở Phụ-lục A, dựa trên `10-thuc-thi-compliance-1-eula.md` / `-3-privacy.md` / `-5-refund-sop.md` đã DONE trước đó, rút gọn vừa-đủ cho 1 trang landing bán 179k. **1 chỗ cần CEO tự quyết trước khi dùng:** số giờ hoàn-tiền ở trang hoàn-tiền (đề-xuất mặc-định: **24 giờ**, xem Phụ-lục A.3) — đổi số nếu muốn khác.

### d.3 — Deploy lên Vercel
- Nếu project đang **kết-nối GitHub**: thêm 3 file vào cùng thư-mục repo với `index.html`, `git add/commit/push` lên nhánh đang deploy (thường `main`) → Vercel tự build lại (~1 phút).
- Nếu deploy bằng **Vercel CLI**: chạy `vercel --prod` trong thư-mục project sau khi thêm 3 file.
- Nếu trước đây deploy bằng cách kéo-thả thư-mục trên `vercel.com`: vào lại project → **Deployments** → deploy lại theo đúng cách đã làm lần đầu, có thêm 3 file mới.

### d.4 — Trỏ URL thật vào `index.html` (sau khi deploy xong, biết chắc URL sống)
- `[PRIVACY_POLICY_URL]` (khoảng dòng **798, 809, 944**) → `chinh-sach-bao-mat.html` (dùng đường-dẫn tương-đối, không cần domain đầy-đủ — an-toàn nếu sau này đổi domain).
- `[TERMS_URL]` (khoảng dòng **946**) → `dieu-khoan-su-dung.html`.
- `[CHECKOUT_URL]` (khoảng dòng **544, 731, 928**): **không bắt-buộc trỏ đi đâu cả** — landing đã có sẵn 1 đoạn JS ở cuối file (`function wire()`, dòng ~1144) tự bắt sự-kiện click trên MỌI thẻ `a.btn-cta` (cả 3 nút mua đều có `class="btn-cta"`) và mở modal thanh-toán QR ngay tại chỗ, **không cần điều-hướng sang trang khác**. Có-thể để nguyên `[CHECKOUT_URL]` hoặc đổi thành `#` cho gọn — cả 2 cách đều hoạt-động đúng vì JS chặn hành-vi mặc-định của link trước khi trình-duyệt thật-sự điều-hướng.

### d.5 — Chèn banner hoàn-tiền NGẮN trước nút mua (khoảng dòng 738-742, trong `pricing-box`)
Tìm:
```html
<!-- [CẦN CEO xác minh]: Có chính sách refund không? ... -->
<p class="refund-note">
  Mọi thắc mắc sau mua, liên hệ [EMAIL_HO_TRO].
</p>
```
**Thay bằng:**
```html
<p class="refund-note">
  <strong>Giao file ngay qua email sau khi thanh toán.</strong> Hoàn 100% trong 24 giờ nếu bạn chưa
  bấm tải file hoặc file lỗi/thiếu so với mô tả — xem
  <a href="chinh-sach-hoan-tien.html" target="_blank" rel="noopener">Chính sách đổi trả &amp; hoàn tiền</a>.
  Thắc mắc liên hệ [EMAIL_HO_TRO].
</p>
```
(nhớ điền `[EMAIL_HO_TRO]` cùng lúc với bước (b)). Đây là bản RÚT-GỌN đặt ngay trước nút mua theo đúng nguyên-tắc "công-bố trước khi thu tiền" ở `10-thuc-thi-compliance-5-refund-sop.md` mục 1 — bản đầy-đủ nằm ở trang `chinh-sach-hoan-tien.html`.

---

## (e) 🟢 Sửa FAQ + đồng-bộ chữ "SePay" toàn trang (0đ)

Landing hiện có **2 chỗ nội-dung** nhắc cổng thanh-toán không khớp thực-tế (đang ghi "PayOS/Sepay" hoặc để trống), trong khi code thanh-toán thật (dòng 1007+) đã dùng **đúng 1 cổng duy-nhất: SePay/VietQR**. Sửa cả 2 để nhất-quán:

1. Khoảng dòng **735** (nút mua ở bảng giá):
   `Thanh toán an toàn qua PayOS / Sepay` → `Thanh toán an toàn qua SePay/VietQR (chuyển khoản ngân hàng)`
2. Khoảng dòng **897** (FAQ "Thanh toán bằng gì?"):
   `Thanh toán qua [CẦN: điền tên cổng thanh toán sau khi đăng ký] — chuyển khoản ngân hàng hoặc ví điện tử.`
   → `Thanh toán qua SePay (quét mã VietQR — chuyển khoản ngân hàng, hệ thống tự đối soát trong vài giây, không cần cài thêm ví điện tử).`

*(Tuỳ-chọn dọn thêm, không bắt-buộc vì không hiển-thị cho khách: các dòng comment HTML ở đầu file dòng 5-9, 543, 730, 927 vẫn ghi "PayOS/Sepay/Gumroad" — chỉ là ghi-chú cho người sửa code, không ảnh-hưởng khách xem trang.)*

---

## (f) 🟡 Điền thông-tin người-bán ở footer (0đ, liên-quan minh-bạch/pháp-lý nhẹ)

Landing hiện thiếu thông-tin về **ai là người chịu trách-nhiệm bán hàng** — theo Nghị-định 52/2013/NĐ-CP (sửa-đổi bởi NĐ 85/2021/NĐ-CP) về TMĐT, website bán hàng nên công-bố chủ-thể chịu trách-nhiệm nội-dung. Vì founder hiện là **cá-nhân, chưa đăng-ký hộ kinh-doanh** (theo `03-clarification.md` lượt 3), mức tối-thiểu hợp-lý là: họ tên đầy-đủ + kênh liên-hệ.

**Lợi-ích thêm ngoài pháp-lý:** tên hiển ở footer nên **khớp với tên chủ tài-khoản ngân-hàng** khách sẽ thấy lúc chuyển khoản (`DO XUAN DINH`) — giúp khách yên-tâm không nghĩ là lừa-đảo khi thấy tên lạ lúc quét QR.

Tìm khoảng dòng **948-951**:
```html
<p style="margin-top:8px;">
  [DOMAIN] · Liên hệ: [EMAIL_HO_TRO]
</p>
```
**Thêm 1 dòng ngay sau đó:**
```html
<p style="margin-top:8px;font-size:0.8rem;color:#888;">
  Chịu trách nhiệm nội dung: <strong>Đỗ Xuân Định</strong> (cá nhân kinh doanh, chưa đăng ký hộ kinh doanh)
  — <em>xác-nhận đúng chính-tả có dấu trước khi đăng công-khai, vì tên trên đây suy ra từ tên tài-khoản ngân-hàng viết KHÔNG dấu "DO XUAN DINH"</em>.
</p>
```
**CEO xác-nhận lại:** (1) đúng chính-tả có dấu của tên; (2) có muốn công-khai thêm số điện-thoại/tỉnh-thành hay không (không bắt-buộc theo luật với cá-nhân chưa có hộ KD, nhưng tăng tin-cậy). Khi sau này lập hộ kinh-doanh, bổ-sung thêm mã-số-thuế vào đúng dòng này (đã note tương-tự ở `10-thuc-thi-compliance-3-privacy.md` mục 1).

---

## (g) 🔴 TEST 1 giao-dịch thật 179.000đ end-to-end (HUMAN — founder tự làm, chi tiền thật)

> AI không thể chuyển khoản ngân-hàng hay truy-cập tài-khoản Vercel/SePay thay founder — toàn-bộ mục này founder tự bấm.

### g.0 — 🔴 BẮT-BUỘC kiểm ENV vars trên Vercel TRƯỚC KHI test (xem mục 0.2)
1. Đăng-nhập `my.sepay.vn`, xác-nhận tài-khoản VietinBank (STK `81908666`, chủ TK `DO XUAN DINH`) đã liên-kết SePay và đang hoạt-động.
2. Lấy **API Token**: trong `my.sepay.vn` → mục Cài-đặt/API (tên mục cụ-thể tuỳ giao-diện SePay hiện-hành `[cần founder tự xem, giao-diện SePay có-thể đã đổi từ lúc research]`) → tạo/copy token.
3. Vào **Vercel Dashboard** → project `donthat` → **Settings → Environment Variables** → thêm:
   - `SEPAY_API_TOKEN` = token vừa copy (bắt-buộc — thiếu là hỏng toàn-bộ luồng giao hàng tự-động).
   - `SEPAY_WEBHOOK_SECRET` (khuyến-nghị, không bắt-buộc theo code hiện-tại vì hàm xác-thực chữ-ký là *best-effort* — xem comment trong `api/sepay-webhook.js`) — nếu SePay cung-cấp secret khi cấu-hình webhook, điền vào đây.
   - `KIT_DOWNLOAD_URL` (tuỳ-chọn) — bỏ-qua nếu dùng đúng file mặc-định `dl/donthat-kit-9f4k2p7q.zip` đã có sẵn trong project.
4. Nếu dùng webhook: vào SePay dashboard, trỏ Webhook URL về `https://[DOMAIN]/api/sepay-webhook`.
5. **Redeploy project trên Vercel** (thêm/sửa biến-môi-trường KHÔNG tự áp-dụng cho bản đang chạy — phải deploy lại, hoặc bấm "Redeploy" thủ-công).
6. **Kiểm nhanh trước khi test tiền thật:** mở `https://[DOMAIN]/api/order-status?code=TEST&amount=179000&debug=1` trên trình-duyệt → phải trả về JSON có `"_debug": true` và danh-sách giao-dịch gần-nhất (KHÔNG được thấy lỗi `server_missing_SEPAY_API_TOKEN`). Nếu lỗi → quay lại bước 3, biến chưa vào đúng hoặc chưa redeploy.

### g.1-10 — Luồng test
1. Mở landing thật trên trình-duyệt, bấm nút **"Mua Ngay — 179.000đ"**.
2. Modal QR hiện ra, ghi rõ số tài-khoản/ngân-hàng/số-tiền/**nội-dung chuyển khoản bắt-buộc** (dạng `SEVQR <mã>`).
3. Dùng chính app ngân-hàng của founder (hoặc nhờ người thân) quét QR hoặc chuyển khoản thủ-công **ĐÚNG số tiền 179.000đ và ĐÚNG nội-dung** hiển-thị.
4. Giữ tab landing mở — hệ-thống tự hỏi lại API mỗi 5 giây, tối-đa ~6 phút (72 lần).
5. Khi SePay nhận được tiền, trạng-thái tự chuyển sang **"Đã nhận thanh toán"** + hiện nút **"Tải Kit ngay"**.
6. Bấm tải, mở file zip, kiểm tra đủ 5 phần đã liệt-kê ở bảng giá (Checklist khởi-động shop, Template listing, Script video, Checklist chốt đơn, Lịch content 30 ngày).
7. Nếu quá 6 phút mà chưa xác-nhận: bấm nút **"Tôi đã chuyển khoản — kiểm tra ngay"** để hỏi lại thủ-công.
8. Kiểm lại Pixel Helper (xem bước h) đúng lúc này để xác-nhận sự-kiện Purchase/CompletePayment đã bắn (nếu đã làm xong a.5).
9. Chụp/lưu bằng-chứng: ảnh sao-kê ngân-hàng đã chuyển 179.000đ, ảnh màn-hình landing lúc "đã nhận thanh toán", tên file đã tải + xác-nhận mở được.
10. Nếu THẤT-BẠI ở bất-kỳ bước nào (không chuyển sang "đã nhận thanh toán" dù đã chuyển khoản đúng) → **DỪNG, không chạy ads**, quay lại g.0 kiểm ENV vars, hoặc dùng `?debug=1` xem SePay có nhận được giao-dịch không, đối-chiếu nội-dung chuyển khoản có đúng định-dạng `SEVQR <mã>` không (bắt-buộc theo comment trong code `api/order-status.js`).

---

## (h) 🟢 Kiểm pixel bắn đúng bằng Pixel Helper (0đ)

1. Cài 2 extension Chrome (miễn-phí):
   - **Meta Pixel Helper**: [Chrome Web Store](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
   - **TikTok Pixel Helper**: [Chrome Web Store](https://chromewebstore.google.com/detail/tiktok-pixel-helper/aelgobmabdmlfmiblddjfnjodalhidnn)
   - (Tuỳ-chọn) có bản gộp cả 2: [Meta & TikTok Pixel Helper](https://chromewebstore.google.com/detail/meta-tiktok-pixel-helper/bepkbhfngffpongfijmkcjkpmfkbjenh)
2. Mở landing thật (sau khi đã xong a, và đã deploy) — icon 2 extension phải hiện **số xanh** (không phải xám/đỏ) = tìm thấy pixel đang hoạt-động.
3. Click icon Meta Pixel Helper → phải thấy sự-kiện **PageView** (và **ViewContent** nếu đã làm a.4). Click icon TikTok Pixel Helper → phải thấy Pixel ID đúng + sự-kiện **Page**.
4. Bấm nút "Mua Ngay" → cả 2 Pixel Helper phải hiện thêm sự-kiện **InitiateCheckout** (nếu đã làm a.4).
5. Làm lại 1 giao-dịch test (hoặc dùng lại kết-quả từ bước g) → phải thấy sự-kiện **Purchase** (Meta) và **CompletePayment** (TikTok) xuất-hiện đúng lúc modal chuyển sang "đã nhận thanh toán" (nếu đã vá a.5).
6. Đối-chiếu real-time trên chính nền-tảng: **Meta Events Manager → tab "Test Events"**, **TikTok Ads Manager → Assets → Events → Diagnostics** — cả 2 phải nhận được đúng các sự-kiện trên.
7. Chụp màn-hình lưu bằng-chứng (Pixel Helper xanh + Test Events có dữ-liệu) — đây là điều-kiện tiên-quyết bắt-buộc ở `10-thuc-thi-ads-launch-plan.md` mục (a).

*Nguồn: [Meta Pixel Helper — admanage.ai](https://admanage.ai/blog/meta-pixel-helper-chrome-extension), [TikTok Pixel Helper — admanage.ai](https://admanage.ai/blog/tiktok-pixel-helper)*

---

## Checklist tổng-kết — tick đủ trước khi coi landing "SẴN-SÀNG bật ads"

- [ ] (a) Meta Pixel ID + TikTok Pixel ID đã điền, 2 khối script đã bỏ comment
- [ ] (a.4) ViewContent + InitiateCheckout đã bật (bỏ `//`)
- [ ] (a.5) 🔴 Đã vá sự-kiện Purchase/CompletePayment trong `function check()`
- [ ] (b) Email hỗ-trợ thật đã tạo + điền đủ 3 chỗ
- [ ] (c) `[DOMAIN]` đã điền (giữ `donthat.vercel.app` là hợp-lệ)
- [ ] (d) 3 trang pháp-lý đã tạo + deploy + đã trỏ `[PRIVACY_POLICY_URL]`/`[TERMS_URL]`
- [ ] (d.5) Banner hoàn-tiền ngắn đã chèn trước nút mua (bảng giá)
- [ ] (e) FAQ + subtext nút mua đã đồng-bộ "SePay/VietQR" (không còn "PayOS"/chỗ trống)
- [ ] (f) Footer đã có tên người chịu trách-nhiệm (CEO đã xác-nhận đúng chính-tả)
- [ ] (g.0) 🔴 `SEPAY_API_TOKEN` đã set trên Vercel + đã redeploy + đã kiểm `?debug=1` không lỗi
- [ ] (g) 🔴 Đã test 1 giao-dịch thật 179.000đ THÀNH-CÔNG end-to-end (chuyển khoản → xác-nhận → tải file OK)
- [ ] (h) Pixel Helper xác-nhận cả 4 sự-kiện (PageView/Page, ViewContent, InitiateCheckout, Purchase/CompletePayment) đều bắn đúng

**Khi tick đủ 12 mục trên → chuyển sang `10-thuc-thi-ads-launch-plan.md` để bật ads có kỷ-luật.**

---

## Phụ-lục A — Nội-dung 3 trang pháp-lý (copy-paste được luôn)

> ⚠️ **MẪU — cần chuyên-gia/luật-sư rà trước khi mở-rộng quy-mô** (kế-thừa nguyên-tắc đã CEO duyệt ở `03-clarification.md` lượt 3, mục 0-04f). Bản dưới đây đã rút-gọn từ 3 văn-bản MẪU đầy-đủ (`10-thuc-thi-compliance-1-eula.md`, `-3-privacy.md`, `-5-refund-sop.md`) cho vừa 1 trang landing, điền sẵn thông-tin đã biết (tên SP, giá, brand "ĐơnThật"); còn `[EMAIL_HO_TRO]` cần thay bằng email thật đã tạo ở bước (b) — thay ĐỒNG-THỜI với lúc sửa `index.html` để nhất-quán.

### A.1 — `chinh-sach-bao-mat.html`
```html
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Chính sách Quyền riêng tư | ĐơnThật</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1a1a1a;line-height:1.6;max-width:760px;margin:0 auto;padding:32px 20px 80px}
  h1{color:#0e8e63;font-size:1.6rem} h2{font-size:1.15rem;margin-top:1.8em;color:#12201b}
  a{color:#0e8e63} .muted{color:#666;font-size:0.9rem}
  ul{padding-left:1.2em}
</style>
</head>
<body>
<p class="muted"><a href="/">&larr; Về trang chủ ĐơnThật</a></p>
<h1>Chính sách Quyền riêng tư &amp; bảo vệ dữ liệu cá nhân</h1>
<p class="muted">Cập nhật lần đầu: 07/2026. Áp dụng cho website ĐơnThật ([DOMAIN]) và sản phẩm "Kit Lên Đơn Đầu Tiên".</p>

<h2>1. Chúng tôi là ai</h2>
<p>ĐơnThật là thương hiệu cá nhân kinh doanh (chưa đăng ký hộ kinh doanh) do Đỗ Xuân Định vận hành, bán sản phẩm số qua website [DOMAIN]. Liên hệ về dữ liệu cá nhân: [EMAIL_HO_TRO].</p>

<h2>2. Dữ liệu nào được thu thập</h2>
<ul>
  <li><strong>Định danh cơ bản:</strong> họ tên, email, số điện thoại (nếu bạn điền form nhận template miễn phí).</li>
  <li><strong>Giao dịch:</strong> sản phẩm đã mua, số tiền, mã tham chiếu thanh toán (khi mua qua SePay/VietQR).</li>
  <li><strong>Hành vi trên web:</strong> trang đã xem, nguồn truy cập, thời gian trên trang (qua pixel Meta/TikTok, cookie).</li>
</ul>
<p>Chúng tôi <strong>không</strong> chủ động thu dữ liệu nhạy cảm (CCCD, tài khoản ngân hàng của bạn, sức khoẻ...).</p>

<h2>3. Mục đích sử dụng</h2>
<ul>
  <li>Giao sản phẩm số bạn đã mua (link tải qua email/trang thanh toán).</li>
  <li>Gửi email/Zalo chăm sóc, khuyến mãi — <strong>chỉ khi bạn đã đồng ý (tick consent)</strong>.</li>
  <li>Hỗ trợ sau bán, xử lý yêu cầu hoàn tiền.</li>
  <li>Đo hiệu quả quảng cáo (pixel Meta/TikTok) — trên cơ sở đồng ý cookie.</li>
</ul>

<h2>4. Chia sẻ với bên thứ ba</h2>
<p>Chỉ chia sẻ trong phạm vi cần thiết với: cổng thanh toán <strong>SePay</strong> (xử lý giao dịch VietQR), nền tảng quảng cáo <strong>Meta Ads / TikTok Ads</strong> (đo hiệu quả, dữ liệu dạng ẩn danh/đã băm theo chính sách riêng của họ), nền tảng hosting <strong>Vercel</strong>. Chúng tôi <strong>không bán</strong> dữ liệu của bạn cho bên thứ ba ngoài mục đích trên.</p>

<h2>5. Quyền của bạn</h2>
<p>Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, bạn có quyền: được biết, đồng ý/từ chối, truy cập/chỉnh sửa, rút lại đồng ý, yêu cầu xoá dữ liệu, hạn chế xử lý, khiếu nại theo pháp luật. Liên hệ [EMAIL_HO_TRO] để thực hiện các quyền này.</p>

<h2>6. Cơ chế đồng ý (Consent)</h2>
<p>Form nhận template miễn phí <strong>không tick sẵn</strong> ô đồng ý nhận email marketing — bạn tự tick. Việc mua hàng và việc đồng ý nhận email là <strong>2 lựa chọn độc lập</strong>. Bạn có thể huỷ đăng ký email bất kỳ lúc nào qua link cuối mỗi email.</p>

<h2>7. Liên hệ</h2>
<p>Câu hỏi về dữ liệu cá nhân: <a href="mailto:[EMAIL_HO_TRO]">[EMAIL_HO_TRO]</a>.</p>
<p class="muted">⚠️ Đây là văn bản mẫu, soạn theo Nghị định 13/2023/NĐ-CP hiện hành, chưa qua rà soát luật sư — sẽ cập nhật khi có xác nhận chuyên gia.</p>
</body>
</html>
```

### A.2 — `dieu-khoan-su-dung.html`
```html
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Điều khoản Sử dụng | ĐơnThật</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1a1a1a;line-height:1.6;max-width:760px;margin:0 auto;padding:32px 20px 80px}
  h1{color:#0e8e63;font-size:1.6rem} h2{font-size:1.15rem;margin-top:1.8em;color:#12201b}
  a{color:#0e8e63} .muted{color:#666;font-size:0.9rem}
  ul{padding-left:1.2em}
</style>
</head>
<body>
<p class="muted"><a href="/">&larr; Về trang chủ ĐơnThật</a></p>
<h1>Điều khoản Sử dụng (Giấy phép sản phẩm)</h1>
<p class="muted">Áp dụng khi bạn mua "Kit Lên Đơn Đầu Tiên — TikTok Shop &amp; Shopee" (179.000đ) tại [DOMAIN].</p>

<h2>1. Giấy phép được cấp</h2>
<p>Khi mua, bạn được cấp giấy phép <strong>không độc quyền, không chuyển nhượng</strong> để tải về và sử dụng sản phẩm cho <strong>mục đích cá nhân / hộ kinh doanh của chính bạn</strong> (1 người mua = 1 giấy phép). Bạn được tuỳ biến nội dung template cho công việc của mình.</p>

<h2>2. Không được phép (cấm tuyệt đối)</h2>
<ul>
  <li>Re-sell / bán lại / phân phối lại sản phẩm dưới bất kỳ hình thức nào.</li>
  <li>Chia sẻ file/link tải cho người không mua (đăng nhóm chia sẻ, forum, Zalo, Telegram...).</li>
  <li>Gỡ watermark, tải-lậu, crack.</li>
  <li>Dùng lại nội dung để đăng bán như "sản phẩm của mình".</li>
</ul>
<p>Vi phạm mục này → giấy phép chấm dứt ngay, chúng tôi có quyền ngừng cấp quyền truy cập và yêu cầu bồi thường theo Luật Sở hữu trí tuệ 07/2022/QH15.</p>

<h2>3. Quyền sở hữu trí tuệ</h2>
<p>Toàn bộ nội dung (checklist, template, script) thuộc quyền sở hữu của ĐơnThật. Việc mua sản phẩm <strong>không</strong> chuyển nhượng quyền sở hữu hay quyền thương mại hoá cho bạn ngoài giấy phép ở Mục 1.</p>

<h2>4. Nội dung có hỗ trợ từ AI</h2>
<p>Một phần nội dung sản phẩm được soạn thảo với sự hỗ trợ của công cụ AI, sau đó được biên tập bởi con người trước khi phát hành. Nếu bạn dùng lại các gợi ý/script trong kit để tự tạo nội dung bằng AI, bạn tự chịu trách nhiệm rà soát tính chính xác và hợp pháp khi công bố.</p>

<h2>5. Giới hạn trách nhiệm</h2>
<p>Sản phẩm cung cấp trên cơ sở "nguyên trạng". Chúng tôi nỗ lực đảm bảo nội dung hữu ích nhưng <strong>không cam kết kết quả kinh doanh/doanh số cụ thể</strong> — kết quả phụ thuộc vào nỗ lực và điều kiện thị trường của từng người dùng. Trách nhiệm bồi thường tối đa (nếu có) không vượt quá số tiền bạn đã thanh toán.</p>

<h2>6. Liên hệ</h2>
<p>Câu hỏi về giấy phép: <a href="mailto:[EMAIL_HO_TRO]">[EMAIL_HO_TRO]</a>.</p>
<p class="muted">⚠️ Đây là văn bản mẫu, chưa qua rà soát luật sư — sẽ cập nhật khi có xác nhận chuyên gia.</p>
</body>
</html>
```

### A.3 — `chinh-sach-hoan-tien.html`
```html
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Chính sách Đổi trả &amp; Hoàn tiền | ĐơnThật</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1a1a1a;line-height:1.6;max-width:760px;margin:0 auto;padding:32px 20px 80px}
  h1{color:#0e8e63;font-size:1.6rem} h2{font-size:1.15rem;margin-top:1.8em;color:#12201b}
  a{color:#0e8e63} .muted{color:#666;font-size:0.9rem}
  .box{background:#f0faf5;border:1px solid #cfeadd;border-radius:12px;padding:14px 16px;margin:16px 0}
</style>
</head>
<body>
<p class="muted"><a href="/">&larr; Về trang chủ ĐơnThật</a></p>
<h1>Chính sách Đổi trả &amp; Hoàn tiền</h1>

<div class="box">
  <strong>Tóm tắt:</strong> Kit Lên Đơn Đầu Tiên (179.000đ) được <strong>giao ngay qua email/link tải sau khi thanh toán thành công</strong> (thường trong vài phút). Nếu chưa tải file hoặc file lỗi, bạn được <strong>hoàn 100% trong 24 giờ</strong> kể từ lúc mua.
</div>

<h2>1. Sản phẩm giao dưới hình thức nào</h2>
<p>File nén (.zip) gồm PDF/Google Sheets/Word, tải trực tiếp qua link hiển thị ngay trên trang sau khi hệ thống xác nhận đã nhận thanh toán qua SePay/VietQR. Không có bước "vận chuyển" vật lý.</p>

<h2>2. Điều kiện hoàn tiền</h2>
<p><strong>Đề xuất (CEO xác nhận số giờ trước khi go-live nếu muốn đổi):</strong> hoàn 100% trong vòng <strong>24 giờ</strong> kể từ lúc mua nếu thuộc 1 trong 2 trường hợp:</p>
<ul>
  <li>Bạn <strong>chưa bấm tải file</strong> lần nào, hoặc</li>
  <li>File bị lỗi, thiếu nội dung so với mô tả trên trang bán.</li>
</ul>
<p>Vì đây là hàng hoá số (đã tải là đã dùng được ngay), sau khi đã tải file và quá 24 giờ, chúng tôi không hoàn tiền theo diện "đổi ý", trừ trường hợp lỗi kỹ thuật thuộc về sản phẩm.</p>

<h2>3. Cách yêu cầu hoàn tiền</h2>
<ol>
  <li>Gửi email tới <a href="mailto:[EMAIL_HO_TRO]">[EMAIL_HO_TRO]</a> kèm mã đơn hàng (mã bắt đầu bằng "SEVQR" hiện trên trang thanh toán lúc mua) và lý do.</li>
  <li>Chúng tôi xác nhận đã nhận yêu cầu trong 24-48 giờ làm việc.</li>
  <li>Đối chiếu điều kiện Mục 2, phản hồi kết quả trong 2-3 ngày làm việc.</li>
  <li>Nếu đồng ý hoàn: chuyển khoản lại đúng số tài khoản bạn đã dùng để thanh toán, trong 5-10 ngày làm việc.</li>
</ol>

<h2>4. Trường hợp không hoàn tiền</h2>
<p>Đã tải và sử dụng file quá 24 giờ mà không phải lỗi kỹ thuật; vi phạm Điều khoản Sử dụng (re-sell/chia sẻ trái phép) trước khi yêu cầu hoàn; lỗi do bạn nhập sai email lúc mua (chúng tôi hỗ trợ gửi lại link, không tính là lỗi giao hàng).</p>

<p class="muted">Căn cứ: Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15 (Điều 37-39), Nghị định 52/2013/NĐ-CP sửa đổi bởi NĐ 85/2021/NĐ-CP. ⚠️ Đây là văn bản mẫu, chưa qua rà soát luật sư — sẽ cập nhật khi có xác nhận chuyên gia. Xem bản đầy-đủ nội-bộ tại <code>10-thuc-thi-compliance-5-refund-sop.md</code>.</p>
</body>
</html>
```

---

## Nguồn tham-khảo
- [Cách tạo Meta Pixel 2026 — seovietnam.vn](https://seovietnam.vn/cach-tao-meta-pixel/)
- [Events Manager là gì — seovietnam.vn](https://seovietnam.vn/events-manager-la-gi/)
- [Cách tạo và truy cập ID TikTok Pixel — ads.tiktok.com](https://ads.tiktok.com/help/article/how-to-create-and-access-tiktok-pixel-id?lang=vi)
- [Get Started with Pixel — ads.tiktok.com](https://ads.tiktok.com/help/article/get-started-pixel?lang=vi)
- [About Parameters (CompletePayment value/currency) — ads.tiktok.com](https://ads.tiktok.com/help/article/about-parameters)
- [Meta Pixel Helper Chrome Extension — admanage.ai](https://admanage.ai/blog/meta-pixel-helper-chrome-extension)
- [TikTok Pixel Helper — admanage.ai](https://admanage.ai/blog/tiktok-pixel-helper)
- Code thật `index.html` / `api/order-status.js` / `api/sepay-webhook.js` (zip CEO gửi 2026-07-06) — đối-chiếu trực-tiếp, không phải benchmark ngoài.
