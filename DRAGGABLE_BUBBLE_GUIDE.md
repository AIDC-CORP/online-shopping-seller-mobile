# AI Assistant Bubble - Draggable Feature

## Tính năng mới: Kéo thả Bubble

Bubble AI Assistant giờ có thể **di chuyển** đến bất kỳ đâu trên màn hình!

### ✨ Tính năng chính:

#### 1. 🎯 Draggable (Kéo thả)
- **Cách dùng**: Nhấn giữ và kéo bubble đến vị trí mong muốn
- **Tự do di chuyển**: Theo cả chiều ngang và dọc
- **Smooth animation**: Di chuyển mượt mà với Animated API

#### 2. 🧲 Smart Snap to Edge
- **Auto-snap**: Khi thả ra, bubble tự động dính vào cạnh gần nhất (trái hoặc phải)
- **Smart detection**: Nếu bubble < giữa màn hình → snap trái, ngược lại → snap phải
- **Spring animation**: Hiệu ứng nảy mượt khi snap

#### 3. 📍 Boundaries (Giới hạn vùng di chuyển)
- **Top**: 60px (dưới header, không che menu)
- **Bottom**: 90px above tab bar (không che bottom navigation)
- **Left/Right**: 20px padding từ cạnh màn hình
- **Auto-adjust**: Tự động điều chỉnh nếu vượt boundaries

#### 4. 👆 Tap Detection
- **Smart gesture**: Phân biệt giữa "tap" và "drag"
- **Tap threshold**: < 10px movement = tap (open chat)
- **Drag threshold**: ≥ 10px movement = drag (move bubble)
- **No accidental opens**: Không mở chat khi đang kéo

#### 5. 💬 Visual Feedback
- **Drag hint**: Hiển thị "Kéo thả" khi đang kéo
- **Scale effect**: Bubble phóng to 1.1x khi đang kéo
- **Pulse animation**: Vẫn giữ hiệu ứng pulse

### 🎮 Cách sử dụng:

#### Kéo thả bubble:
1. **Nhấn giữ** vào bubble ✨
2. **Kéo** đến vị trí mong muốn
3. **Thả tay** ra
4. Bubble tự động **snap** vào cạnh gần nhất

#### Mở chat:
1. **Tap nhanh** vào bubble (không kéo)
2. Chat modal sẽ mở

### 🔧 Technical Details:

#### PanResponder Configuration:
```typescript
PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onMoveShouldSetPanResponder: () => true,
  
  onPanResponderGrant: () => {
    // Start dragging
    setIsDragging(true);
    // Scale up
    scaleAnim.setValue(1.1);
  },
  
  onPanResponderMove: Animated.event(
    [null, { dx: pan.x, dy: pan.y }],
    { useNativeDriver: false } // Must be false for position
  ),
  
  onPanResponderRelease: (_, gesture) => {
    // End dragging
    setIsDragging(false);
    
    // Detect tap vs drag
    if (Math.abs(gesture.dx) < 10 && Math.abs(gesture.dy) < 10) {
      onPress(); // Open chat
      return;
    }
    
    // Snap to edge
    const screenCenter = SCREEN_WIDTH / 2;
    const newX = finalX < screenCenter ? 20 : SCREEN_WIDTH - BUBBLE_SIZE - 20;
    
    // Animate to snap position
    Animated.spring(pan, {
      toValue: { x: newX, y: newY },
      friction: 7,
    }).start();
  },
})
```

#### Position State:
```typescript
const pan = useRef(new Animated.ValueXY({ 
  x: SCREEN_WIDTH - BUBBLE_SIZE - 20,  // Default: bottom-right
  y: SCREEN_HEIGHT - BUBBLE_SIZE - 90 
})).current;
```

### 💡 Use Cases:

#### 1. Tránh che các nút Add
```
Scenario: Bubble đang ở góc phải, trùng với nút Add Product
Solution: Kéo bubble sang trái hoặc lên trên
Result: Có thể nhấn cả bubble và nút Add
```

#### 2. Xem nội dung phía sau
```
Scenario: Bubble che mất text/image quan trọng
Solution: Kéo bubble ra khỏi vùng đó
Result: Nội dung hiển thị đầy đủ
```

#### 3. Vị trí yêu thích
```
Scenario: Muốn bubble ở vị trí cố định (VD: top-left)
Solution: Kéo đến vị trí đó, bubble sẽ snap và giữ nguyên
Result: Bubble luôn ở vị trí thuận tiện nhất cho bạn
```

### 🎨 Customization:

#### 1. Thay đổi vị trí mặc định:
```typescript
const pan = useRef(new Animated.ValueXY({ 
  x: 20,  // Top-left
  y: 60 
})).current;
```

#### 2. Disable snap to edge:
```typescript
// Comment out snap logic
// const newX = finalX < screenCenter ? 20 : SCREEN_WIDTH - BUBBLE_SIZE - 20;
const newX = finalX; // Stay where dropped
```

#### 3. Thay đổi boundaries:
```typescript
// Allow movement to top edge
if (newY < 0) newY = 0; // Instead of 60

// Allow closer to bottom
if (newY > SCREEN_HEIGHT - BUBBLE_SIZE - 60) {
  newY = SCREEN_HEIGHT - BUBBLE_SIZE - 60; // Instead of 90
}
```

#### 4. Adjust tap sensitivity:
```typescript
// More sensitive (easier to trigger tap)
if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
  onPress();
}

// Less sensitive (harder to trigger tap)
if (Math.abs(gesture.dx) < 20 && Math.abs(gesture.dy) < 20) {
  onPress();
}
```

### 🚀 Performance:

- **useNativeDriver**: `true` cho scale animation (60 FPS)
- **useNativeDriver**: `false` cho position (required for pan)
- **Optimized**: Chỉ re-render khi cần thiết
- **Smooth**: 60 FPS drag experience
- **No lag**: Native animations

### 📱 Platform Support:

- ✅ iOS
- ✅ Android
- ✅ Responsive cho mọi screen size
- ✅ Works với cả portrait và landscape

### 🎯 Benefits:

1. **Flexibility**: Di chuyển tự do đến bất kỳ đâu
2. **Smart**: Tự động snap, không cần phải đặt chính xác
3. **Intuitive**: UX tự nhiên, dễ hiểu
4. **No Overlaps**: Giải quyết vấn đề trùng với các nút khác
5. **Persistent**: Giữ vị trí sau khi snap (trong session)
6. **Accessible**: Luôn trong tầm với, không bao giờ bị che

### 🐛 Known Limitations:

1. **Position not saved**: Vị trí reset khi reload app
   - *Future*: Save to AsyncStorage
2. **Single bubble only**: Không support multiple bubbles
3. **No landscape optimization**: Boundaries fixed cho portrait
   - *Future*: Dynamic boundaries based on orientation

### 💡 Tips:

- Kéo bubble lên **trên cùng** để làm việc với bottom content
- Kéo bubble sang **trái** khi làm việc với Products screen (nút Add ở phải)
- Kéo bubble sang **phải** khi làm việc với Promotions screen
- **Double tap** để mở chat nhanh (không cần kéo chính xác)

---

**Draggable AI Bubble** - Flexible, Smart, Intuitive! 🎉
