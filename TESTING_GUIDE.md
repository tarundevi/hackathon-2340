# Testing Guide - All Features

## Quick Start Testing

### 1. Panel Toggle Feature (NEW)
**What to test:** Hide/show left and right panels

**Steps:**
```
1. Load the app at /
2. Click room creation or join existing room
3. In the canvas view, look at the header
   - Left panel toggle: ◀ (shows) or ▶ (hidden)
   - Right panel toggle: ▶ (shows) or ◀ (hidden)
4. Click ◀ to hide left panel (Scenarios & Collaborators)
   - Canvas should expand to fill the space
   - Animation should be smooth (300ms)
5. Click ▶ to show left panel again
6. Repeat with right panel (AI Assistant & Traceability)
7. Refresh the page
   - Panels should remember their state
   - If hidden, they should stay hidden
```

**Expected Behavior:**
- ✅ Panels smoothly fade in/out
- ✅ Canvas expands when panels hidden
- ✅ State persists across page refresh
- ✅ No console errors
- ✅ Buttons have hover effect (darker color)

**Common Issues:**
- If panel doesn't animate: Check if Tailwind CSS compiled
- If state doesn't persist: Check browser localStorage (DevTools > Application)
- If buttons unresponsive: Check browser console for errors

---

### 2. Arrow Drawing - No Disappearing Classes (FIXED)

**What to test:** Classes stay visible when drawing arrows

**Steps for DCD (Class Diagram):**
```
1. Create a new room
2. Switch to "Class Diagram" tab
3. Click "+ Add Class" button 3 times
   - Creates 3 class nodes on the canvas
4. Click "🔗 Connect" button in toolbar
   - Button should turn gold/yellow to show connect mode ON
5. Draw an arrow:
   - Click and drag from handle on Class A
   - Drag to handle on Class B
   - Release to create connection
6. Verify:
   - Arrow appears between classes
   - Both classes still visible
   - Classes have not moved
7. Draw 2-3 more arrows between different pairs
8. Verify all classes still visible
```

**Expected Behavior:**
- ✅ Arrows draw smoothly
- ✅ All classes remain visible after drawing
- ✅ Multiple arrows don't cause issues
- ✅ No console errors about "classes disappearing"
- ✅ Arrows properly connect nodes

**What Would Be Wrong (BUG):**
- ❌ Classes fade out or disappear when arrow drawn
- ❌ Classes move unexpectedly
- ❌ Arrow doesn't connect properly
- ❌ Browser console shows errors

---

### 3. Export Diagram to PNG (FIXED)

**What to test:** Diagrams export with all content

**Steps:**
```
1. Create a Class Diagram with 3-4 classes
2. Draw 2-3 arrows between them
3. Click "⬇ Export" button in toolbar
   - File download should start
4. Check Downloads folder for "diagram-YYYY-MM-DD.png"
5. Open the PNG file
6. Verify:
   - All classes visible in the image
   - All arrows visible in the image
   - Background is white
   - Image quality is good (scale: 2)
```

**Expected Behavior:**
- ✅ Download starts immediately
- ✅ PNG file is created
- ✅ File size is reasonable (50KB-500KB for typical diagram)
- ✅ All content captured
- ✅ No console errors

**What Would Be Wrong (BUG):**
- ❌ PNG is completely blank/white
- ❌ Only partial content visible
- ❌ Classes missing but arrows showing
- ❌ Distorted or blurry image
- ❌ Download never starts

---

### 4. Entity Deletion - No Data Loss (FIXED)

**What to test:** Deleting entities only removes connected arrows

**Steps:**
```
1. Create Class Diagram
2. Add 4 classes: A, B, C, D
3. Draw arrows:
   - A → B
   - B → C
   - C → D
   - A → D (direct)
4. Right-click on Class B (or use delete key)
5. Verify after deletion:
   - Class B is gone
   - Arrow A → B is gone
   - Arrow B → C is gone
   - Arrows A → D and C → D still present
   - Classes A, C, D still visible
```

**Expected Behavior:**
- ✅ Only arrows connected to deleted entity are removed
- ✅ Other relationships preserved
- ✅ No console errors
- ✅ State is consistent in Y.js

**What Would Be Wrong (BUG):**
- ❌ All arrows deleted (not just connected ones)
- ❌ Unrelated entities deleted
- ❌ Data corruption or inconsistency

---

### 5. Full Integration Test

**What to test:** Everything working together

**Scenario:**
```
1. Create a new room (generates random ID)
2. Switch to Class Diagram
3. Add 3 classes: User, Order, Product
4. Enable Connect Mode (🔗 button)
5. Create arrows:
   - User → Order (contains)
   - Order → Product (includes)
6. Hide left panel (Scenarios)
7. Export as PNG
8. Show left panel again
9. Verify state persists after refresh
10. In new diagram (Use Case):
    - Add 2 actors and 1 use case
    - Draw connections
    - Export that too
```

**Success Criteria:**
- ✅ All operations complete without errors
- ✅ Each export captures correct diagram
- ✅ Panel state toggles smoothly
- ✅ No data loss or corruption
- ✅ Browser console shows no errors

---

## Browser DevTools Checks

### Console (F12 → Console)
- ✅ No red errors
- ✅ No "undefined" references
- ✅ No "Cannot read property" errors
- ✅ Export logs should show: "Export successful" (not errors)

### Network Tab
- ✅ WebSocket connects (for Y.js sync)
- ✅ No 404 errors
- ✅ HTML2Canvas library loads

### Application → LocalStorage
- ✅ "panelVisibility" key exists
- ✅ Value is valid JSON: `{"left":true/false,"right":true/false}`

### Performance (React DevTools)
- ✅ No unnecessary re-renders
- ✅ Animations smooth (60 FPS ideally)
- ✅ No memory leaks on repeated toggles

---

## Edge Cases to Test

### Panel Toggle
- [ ] Toggle panel 10+ times quickly → State should remain consistent
- [ ] Open DevTools and check localStorage → Value should match UI
- [ ] Clear localStorage manually → Panels should show (defaults)
- [ ] Modify localStorage JSON → App should handle gracefully

### Arrow Drawing
- [ ] Try to draw arrow from Class A to itself → Should be rejected
- [ ] Delete Class A while drawing to it → Should be rejected
- [ ] Draw arrow to non-existent node → Should not create edge
- [ ] Rapid fire multiple arrows → All should be valid

### Export
- [ ] Export empty diagram → Creates blank white PNG
- [ ] Export with 50+ nodes → Should still work
- [ ] Export, then add node, export again → Second export shows new node
- [ ] Export on slow browser → Should complete without timeout

---

## Performance Benchmarks

**Target Performance:**
- Panel toggle: < 50ms
- Arrow draw: < 100ms
- Export: < 2 seconds
- Refresh page: < 3 seconds
- Add node: < 50ms

**How to Measure:**
```javascript
// In browser console
performance.mark('start');
// ... do action ...
performance.mark('end');
performance.measure('action', 'start', 'end');
console.log(performance.getEntriesByName('action')[0].duration);
```

---

## Troubleshooting

### Issue: Panels don't toggle
**Solution:**
1. Check browser console (F12)
2. Verify React is loaded (should see React DevTools icon)
3. Try hard refresh (Ctrl+Shift+R)
4. Clear localStorage: `localStorage.clear()` in console

### Issue: Export creates blank PNG
**Solution:**
1. Make sure nodes are visible in canvas
2. Check that canvas has content (not zoomed out)
3. Try exporting again (first one sometimes fails)
4. Check browser console for html2canvas errors

### Issue: Classes disappear when drawing arrows
**Solution:**
1. Clear browser cache
2. Ensure latest code is deployed
3. Check that both source and target nodes exist
4. Restart browser completely

### Issue: localStorage not persisting
**Solution:**
1. Check if localStorage is enabled (not in private/incognito mode)
2. Check browser quota (Settings → Privacy)
3. Try different browser to rule out browser-specific issue
4. Check DevTools → Application → LocalStorage

---

## Sign-Off Checklist

Before declaring "testing complete", verify:

- [ ] Panel toggle works left and right
- [ ] Panel state persists after refresh
- [ ] Can draw arrows without classes disappearing
- [ ] Multiple arrows work together
- [ ] Deleting entity only removes connected arrows
- [ ] Export captures all diagram content
- [ ] No console errors throughout
- [ ] Smooth animations (no jankiness)
- [ ] Mobile view works (if testing responsive)
- [ ] localStorage properly stores state

**Once all checked:** ✅ READY FOR PRODUCTION

---

**Last Updated:** 2026-03-15
**Tested By:** [Your Name]
**Status:** Ready for user testing
