# 🎁 Combo & Voucher Feature - Hướng dẫn sử dụng

## ✅ Đã hoàn thành Phase 1

### **Tính năng đã implement:**

1. ✅ **Menu 3 options** khi bấm nút +

   - 📦 Thêm sản phẩm mới
   - 🎁 Tạo Combo
   - 🎟️ Tạo Voucher

2. ✅ **AddCombo Form** - Tạo combo sản phẩm

   - Chọn nhiều sản phẩm từ kệ (checkbox)
   - Tự động tính tổng giá gốc
   - Nhập giá combo → tự động tính % giảm
   - Upload ảnh combo
   - Số lượng và thời gian áp dụng
   - Preview trước khi lưu

3. ✅ **AddVoucher Form** - Tạo mã giảm giá

   - Tự động gen mã ngẫu nhiên (🎲)
   - 2 loại giảm: % hoặc số tiền cố định
   - Điều kiện: Đơn tối thiểu, giảm tối đa
   - Số lượng voucher giới hạn
   - Thời gian hiệu lực
   - Preview voucher card

4. ✅ **Type Definitions** - Product, Combo, Voucher
5. ✅ **Mock Data** - 2 combos, 3 vouchers mẫu

---

## 🎯 Cách sử dụng

### **1. Tạo Combo mới:**

```
1. Bấm nút + ở góc dưới bên phải
2. Chọn "🎁 Tạo Combo"
3. Nhập tên: VD "Combo Rau Củ Tươi"
4. Chọn ít nhất 2 sản phẩm từ danh sách
5. Nhập giá combo: VD 75000
   → App tự động tính % giảm
6. Nhập số lượng: VD 30
7. (Tuỳ chọn) Chọn ảnh, thời gian áp dụng
8. Bấm "Lưu"
```

**Ví dụ:**

- Tên: "Combo Rau Củ Tươi"
- Chọn: Cà chua bi (45k) + Xà lách (15k) + Táo (35k)
- Tổng gốc: 95,000đ
- Giá combo: 75,000đ
- Tiết kiệm: 20,000đ (21%)

### **2. Tạo Voucher mới:**

```
1. Bấm nút + ở góc dưới bên phải
2. Chọn "🎟️ Tạo Voucher"
3. Nhập mã hoặc bấm 🎲 để gen ngẫu nhiên
4. Nhập mô tả: VD "Giảm 50k cho đơn từ 200k"
5. Chọn loại giảm:
   - % (phần trăm)
   - đ (số tiền cố định)
6. Nhập giá trị giảm: VD 50000
7. (Tuỳ chọn) Đơn tối thiểu, giảm tối đa
8. Nhập số lượng: VD 100
9. Chọn thời gian hiệu lực
10. Bấm "Lưu"
```

**Ví dụ:**

- Mã: FRESH50
- Loại: Số tiền cố định
- Giảm: 50,000đ
- Đơn tối thiểu: 200,000đ
- Số lượng: 100 voucher

---

## 📊 Mock Data có sẵn

### **Combos:**

1. **Combo Rau Củ Tươi** (75k, giảm 21%)
   - Cà chua bi + Xà lách + Táo
2. **Combo Thịt & Hải Sản** (630k, giảm 10%)
   - Thịt bò Úc + Cá hồi Na Uy

### **Vouchers:**

1. **FRESH50** - Giảm 50k cho đơn từ 200k
2. **NEWYEAR2025** - Giảm 20% tối đa 100k cho đơn từ 300k
3. **FREESHIP** - Miễn phí ship (30k) cho đơn từ 150k

---

## 🎨 UI/UX Highlights

### **AddOptionMenu:**

- ✅ Modal overlay với background mờ
- ✅ 3 options với icon và mô tả rõ ràng
- ✅ Màu sắc phân biệt (xanh dương, cam, xanh lá)
- ✅ Animation fade

### **AddCombo:**

- ✅ Checkbox list sản phẩm
- ✅ Real-time tính giá & % giảm
- ✅ Preview box màu vàng hiển thị tính toán
- ✅ Image picker với preview
- ✅ Validation đầy đủ

### **AddVoucher:**

- ✅ Random code generator (🎲)
- ✅ Toggle loại giảm (% vs đ)
- ✅ Conditional fields (maxDiscount chỉ cho %)
- ✅ Preview voucher card màu xanh
- ✅ Auto uppercase cho mã voucher

---

## 🚀 Phase 2 - Tính năng tiếp theo (Chưa implement)

### **1. Hiển thị Combo & Voucher trong ProductsScreen:**

- [ ] Badge "COMBO" màu cam trên combo cards
- [ ] Tab filters: [Tất cả | Sản phẩm | 🎁 Combo | 🎟️ Voucher]
- [ ] Combo detail modal (hiển thị SP trong combo)
- [ ] Voucher management list

### **2. Analytics & Tracking:**

- [ ] Dashboard stats:
  - Top 5 combo bán chạy
  - Voucher được dùng nhiều nhất
  - Doanh thu từ khuyến mãi
- [ ] Voucher usage history
- [ ] Combo performance chart

### **3. Advanced Features:**

- [ ] Flash Sale (giảm giá trong thời gian ngắn)
- [ ] Quick Combo Templates
- [ ] Combo động (chọn N trong M sản phẩm)
- [ ] QR code cho voucher
- [ ] Push notification khi có voucher mới

---

## 📁 File Structure

```
src/
├── shared/
│   ├── types/index.ts          # Product, Combo, Voucher interfaces
│   └── data/mockData.ts        # mockCombos[], mockVouchers[]
├── features/
│   └── products/
│       ├── ProductsScreen.tsx  # Main screen với menu integration
│       └── components/
│           ├── AddOptionMenu.tsx   # Menu 3 options
│           ├── AddCombo.tsx        # Form tạo combo
│           └── AddVoucher.tsx      # Form tạo voucher
```

---

## 💡 Tips & Best Practices

### **Tạo Combo hiệu quả:**

1. Chọn sản phẩm liên quan (VD: rau củ, thịt hải sản)
2. Giảm giá 15-25% để hấp dẫn
3. Giới hạn thời gian để tạo urgency
4. Chọn ảnh đẹp, bắt mắt

### **Tạo Voucher hấp dẫn:**

1. Mã ngắn gọn, dễ nhớ (VD: FRESH50, SALE20)
2. Điều kiện rõ ràng
3. Không set số lượng quá ít
4. Thời gian dài hợp lý (7-30 ngày)

### **Quản lý hiệu quả:**

1. Review combo/voucher định kỳ
2. Deactivate voucher hết hạn
3. Track usage để tối ưu
4. Test combo trước khi release

---

## 🐛 Troubleshooting

**Q: Không tạo được combo?**
A: Kiểm tra:

- Đã chọn ít nhất 2 sản phẩm?
- Giá combo < tổng giá gốc?
- Đã nhập đầy đủ: tên, giá, số lượng?

**Q: Voucher không lưu?**
A: Kiểm tra:

- Mã voucher chưa trùng?
- Đã chọn thời gian hiệu lực?
- Giá trị giảm hợp lý?

**Q: Làm sao xem danh sách combo/voucher đã tạo?**
A: Phase 2 sẽ có tab riêng. Hiện tại data lưu trong state.

---

## 🎯 Next Steps

Để tiếp tục phát triển, cần implement:

1. **Display Layer** - Hiển thị combo/voucher
2. **Edit/Delete** - Sửa xoá combo/voucher
3. **Apply Logic** - Áp dụng voucher vào đơn hàng
4. **Statistics** - Thống kê hiệu quả

Bạn muốn tôi implement phase nào tiếp theo? 🚀
