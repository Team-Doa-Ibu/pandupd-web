# Canvas Drawing Troubleshooting Guide

## 🚨 **Masalah: Garis Tidak Muncul**

### **Kemungkinan Penyebab:**

1. **Canvas tidak ter-initialize dengan benar**
2. **Event handling tidak berfungsi**
3. **Coordinate mapping salah**
4. **Background image tidak load**
5. **Canvas context hilang**

### **Solusi yang Telah Diterapkan:**

#### **1. Canvas Initialization**

```typescript
useEffect(() => {
  if (canvasRef.current && drawingMode) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = FIXED_CANVAS_SIZE; // 600
      canvas.height = FIXED_CANVAS_SIZE; // 600

      // Set white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, FIXED_CANVAS_SIZE, FIXED_CANVAS_SIZE);
    }
  }
}, [drawingMode]);
```

#### **2. Fallback Background**

```typescript
bgImage.onerror = () => {
  // Draw dots manually if image fails
  ctx.fillStyle = "#000000";
  for (let i = 0; i < FIXED_CANVAS_SIZE; i += 20) {
    for (let j = 0; j < FIXED_CANVAS_SIZE; j += 20) {
      ctx.beginPath();
      ctx.arc(i, j, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
};
```

#### **3. Real-time Drawing**

```typescript
const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
  if (!isDrawing || !drawingMode || isConfirmed) return;

  const pos = getMousePos(e);
  setCurrentPath((prev) => [...prev, pos]);

  // Draw immediately
  if (canvasRef.current) {
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  }
};
```

#### **4. Coordinate Clamping**

```typescript
const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
  // ... coordinate calculation ...

  return {
    x: Math.max(0, Math.min(FIXED_CANVAS_SIZE, x)),
    y: Math.max(0, Math.min(FIXED_CANVAS_SIZE, y)),
  };
};
```

### **Debugging Steps:**

1. **Buka Console Browser** (F12)
2. **Cek Log Messages:**
   - "Canvas initialized with size: 600"
   - "Mouse down at: [coordinates]"
   - "Canvas position: [coordinates]"
   - "Started drawing at: [coordinates]"
   - "Drawing line to: [coordinates]"

3. **Test dengan File HTML Sederhana:**
   - Buka `test-canvas.html` di browser
   - Verifikasi drawing berfungsi
   - Test fullscreen mode

### **Jika Masih Tidak Berfungsi:**

#### **Check 1: Canvas Element**

```typescript
console.log("Canvas ref:", canvasRef.current);
console.log(
  "Canvas size:",
  canvasRef.current?.width,
  canvasRef.current?.height,
);
```

#### **Check 2: Context**

```typescript
const ctx = canvasRef.current?.getContext("2d");
console.log("Canvas context:", ctx);
```

#### **Check 3: Event Handling**

```typescript
console.log("Drawing mode:", drawingMode);
console.log("Is drawing:", isDrawing);
console.log("Is confirmed:", isConfirmed);
```

#### **Check 4: Mouse Coordinates**

```typescript
console.log("Mouse event:", e.clientX, e.clientY);
console.log("Canvas rect:", canvas.getBoundingClientRect());
console.log("Calculated pos:", pos);
```

### **Fallback Solution:**

Jika semua gagal, gunakan pendekatan sederhana:

1. **Clear canvas** dan redraw background
2. **Force redraw** setiap 100ms
3. **Use simpler drawing logic** tanpa complex state management

### **Expected Behavior:**

✅ Canvas muncul dengan background putih dan dots hitam
✅ Mouse cursor berubah menjadi crosshair saat drawing mode
✅ Garis muncul saat drag mouse
✅ Console menampilkan debug messages
✅ Drawing tersimpan dan bisa di-redraw

### **Common Issues & Fixes:**

| Issue              | Symptom                    | Fix                                 |
| ------------------ | -------------------------- | ----------------------------------- |
| Canvas kosong      | Tidak ada background       | Check image loading, add fallback   |
| Garis tidak muncul | Mouse events tidak trigger | Check event listeners, drawing mode |
| Koordinat salah    | Garis di tempat yang salah | Fix coordinate mapping              |
| Performance issues | Lag saat drawing           | Optimize redraw logic               |

### **Next Steps:**

1. **Test dengan file HTML sederhana** untuk verifikasi
2. **Check console logs** untuk debugging info
3. **Verify canvas initialization** berhasil
4. **Test mouse events** berfungsi
5. **Check coordinate mapping** akurat

Jika masih ada masalah, berikan screenshot console dan error messages untuk analisis lebih lanjut. 🔍
