# End-to-End Verification Checklist

Use this checklist to verify all features of the CS 2340 UML Collaboration Tool are working correctly.

## Prerequisites

- [ ] Development environment set up (Node.js 18+, npm)
- [ ] WebSocket server running (`npm run ws-server` or Railway deployed)
- [ ] Gemini API key obtained and set in `.env.local`
- [ ] Application running locally or deployed to Vercel

---

## 1. Lobby & Room Selection

### Room Creation
- [ ] Navigate to the application
- [ ] "Create New Room" button generates a random room code
- [ ] Room code is displayed in the header (e.g., "ABC1234")
- [ ] URL updates with `?room=ABC1234` parameter

### Room Joining
- [ ] Enter existing room code → "Join" button enables
- [ ] Joining connects to the same diagram as original creator
- [ ] Multiple users in same room see each other's cursors and changes

### Custom Room Creation
- [ ] Enter custom room name → "Create" button enables
- [ ] Custom room name is preserved in URL
- [ ] Can rejoin custom room with same name

### Exit Room
- [ ] "Exit Room" button returns to lobby
- [ ] Room is cleared from URL
- [ ] WebSocket connection is properly closed

---

## 2. Diagram Editing - DCD (Detailed Class Diagram)

### Adding Classes
- [ ] Click "UCD" tab to switch to UCD
- [ ] Click "DCD" tab to switch to DCD
- [ ] In DCD, "+ Add Class" button appears
- [ ] Click "+ Add Class" creates a new class box on canvas
- [ ] Class has 3 sections: name (bold), attributes, methods

### Class Properties
- [ ] Class name appears in top section (bold, centered)
- [ ] Attributes display with visibility (-, +, #)
- [ ] Methods display with visibility and return types
- [ ] Example: `-id: String`, `+getName(): String`

### Editing Classes
- [ ] Double-click class name to edit inline
- [ ] Double-click attributes section to edit
- [ ] Double-click methods section to edit
- [ ] Press Enter to save, Escape to cancel

### Class Visibility
- [ ] `-` prefix = private (darkened)
- [ ] `+` prefix = public (normal)
- [ ] `#` prefix = protected (different color)

### Relationships (DCD)
- [ ] Drag from one class to another creates connection
- [ ] Relationship shows arrow with appropriate marker
- [ ] Can edit relationship label (multiplicity)
- [ ] Examples: `1..1`, `0..*`, `1..*`

---

## 3. Diagram Editing - UCD (Use Case Diagram)

### Actor & Use Case Addition
- [ ] Switch to UCD tab
- [ ] "+ Add Actor" button creates stick figure
- [ ] "+ Add Use Case" button creates oval
- [ ] Actor and UseCase appear on canvas

### UCD Relationships
- [ ] Draw connection between actor and usecase
- [ ] Connection shows as solid line with arrow
- [ ] Can add "extends" and "includes" relationships
- [ ] Relationships are labeled appropriately

---

## 4. Diagram Editing - SD (Sequence Diagram)

### Lifeline Creation
- [ ] Switch to SD tab
- [ ] "+ Add Lifeline" button creates vertical dashed line
- [ ] Lifeline shows object name at top
- [ ] Multiple lifelines can be arranged horizontally

### Messages
- [ ] Draw connection between lifelines = message
- [ ] Messages show as arrows with labels
- [ ] Message order tracked by sequence index
- [ ] Messages appear in order from top to bottom

### Playback Slider
- [ ] Playback slider appears only in SD tab
- [ ] Slider ranges from 0 to number of messages
- [ ] Dragging slider highlights messages up to that index
- [ ] "Play" button auto-advances every 1.5s
- [ ] "Pause" button stops auto-advance

---

## 5. Real-Time Collaboration

### Two-Tab Test
- [ ] Open application in two browser tabs with same room
- [ ] In Tab A: Add a class in DCD
- [ ] In Tab B: Within 1-2 seconds, class appears (without refresh)
- [ ] In Tab B: Edit class name
- [ ] In Tab A: Within 1-2 seconds, change appears

### Multi-User Presence
- [ ] Two users in same room
- [ ] Left panel shows "Collaborators" with names
- [ ] Each collaborator has different colored dot
- [ ] Collaborator count matches number of active users

### Cursor Tracking (Optional)
- [ ] Move mouse in Tab A
- [ ] Tab B shows remote cursor position with user name
- [ ] Cursor follows in real-time

---

## 6. Scenario Loading

### Pre-loaded Scenarios
- [ ] Left panel shows scenario buttons:
  - [ ] Jordan - Event Management
  - [ ] Daniel - RSVP
  - [ ] Priya - Capacity
  - [ ] Blank Canvas

### Loading Scenario
- [ ] Click "Jordan - Event Management"
- [ ] Confirmation dialog appears
- [ ] After confirmation, canvas loads with pre-made entities
- [ ] DCD shows: Event, Student, Organization classes
- [ ] Relationships between classes are visible

### Switching Scenarios
- [ ] Load Jordan scenario
- [ ] Switch to Daniel scenario
- [ ] Canvas is replaced with Daniel's entities
- [ ] Previous scenario data is cleared

---

## 7. AI Validation

### Run AI Check
- [ ] Switch to "AI TA Check" tab in right panel
- [ ] Click "Run AI Validation Check" button
- [ ] Button shows spinner while running
- [ ] Results appear within 2-5 seconds

### Validation Results
- [ ] Red badges show errors (severity: error)
- [ ] Yellow badges show warnings (severity: warning)
- [ ] Each flag shows message and affected entity
- [ ] Examples:
  - "Method 'rsvp()' called in SD but not defined in DCD"
  - "Missing visibility modifier on attribute 'name'"

### Gemini Integration
- [ ] AI check calls `/api/validate` endpoint
- [ ] Endpoint sends request to Gemini API
- [ ] Response is parsed and displayed as flags
- [ ] Check browser console for API latency

### Error Handling
- [ ] If API key is invalid: error message appears
- [ ] If network fails: "Validation error" message
- [ ] Application continues to work despite validation error

---

## 8. Undo/Redo

### Undo Button
- [ ] Toolbar has "Undo" button
- [ ] Click "Undo" after adding class → class is removed
- [ ] Can undo multiple times in sequence
- [ ] Undo applies across all browser tabs with same room

### Redo Button
- [ ] After undo, "Redo" button becomes available
- [ ] Click "Redo" → undone action is restored
- [ ] Works in sequence

---

## 9. Export to PNG

### Export Functionality
- [ ] Toolbar has "Export" or export icon
- [ ] Click export → downloads PNG file
- [ ] File named like `diagram-2026-03-15.png`
- [ ] PNG shows current canvas content
- [ ] All entities and relationships visible in export

---

## 10. Traceability

### Traceability Tab
- [ ] Click "Traceability" tab in right panel
- [ ] Shows list of all entities with diagram membership
- [ ] Each entity shows which diagrams it appears in:
  - [ ] DCD: class entities
  - [ ] UCD: actor and usecase entities
  - [ ] SD: lifeline entities

### Filtering
- [ ] Traceability helps identify cross-diagram references
- [ ] Can verify entity consistency across diagrams

---

## 11. Responsive Design

### Layout on Different Screens
- [ ] **Desktop (1920x1080)**:
  - [ ] Left panel (scenarios) visible
  - [ ] Canvas area takes most space
  - [ ] Right panel (AI/traceability) visible
  - [ ] All elements properly aligned

- [ ] **Tablet (1024x768)**:
  - [ ] Layout may reflow
  - [ ] All functionality remains accessible
  - [ ] Panels may collapse to tabs

- [ ] **Mobile (375x667)**:
  - [ ] Canvas readable (may require horizontal scroll)
  - [ ] Touch interactions work (double-tap for editing)

---

## 12. Browser Compatibility

- [ ] Chrome/Edge (Chromium-based)
  - [ ] All features working
  - [ ] WebSocket connection stable
  - [ ] No console errors

- [ ] Firefox
  - [ ] All features working
  - [ ] No visual glitches
  - [ ] Performance acceptable

- [ ] Safari
  - [ ] All features working
  - [ ] WebSocket connection works
  - [ ] Styling preserved

---

## 13. Performance

### Load Time
- [ ] App loads in < 3 seconds on standard network
- [ ] Scenario loads in < 1 second
- [ ] AI validation completes in < 5 seconds

### Real-Time Sync
- [ ] Changes sync within 1-2 seconds
- [ ] No lag when multiple users editing
- [ ] Smooth typing in edit mode

### Memory
- [ ] No memory leaks after 1 hour usage
- [ ] App remains responsive with 100+ entities

---

## 14. Production Deployment (Vercel + Railway)

### Vercel Deployment
- [ ] App deployed and accessible at Vercel URL
- [ ] Environment variables set correctly
- [ ] HTTPS enabled automatically
- [ ] Page loads successfully from production URL

### Railway Deployment
- [ ] WebSocket server deployed to Railway
- [ ] Server is publicly accessible at Railway URL
- [ ] WebSocket connections work from Vercel frontend

### End-to-End Test
- [ ] Open production Vercel URL
- [ ] Create new room
- [ ] Verify WebSocket URL in network tab is Railway URL
- [ ] Perform collaboration test with 2 users
- [ ] Run AI validation (uses production Gemini API)

---

## 15. Error Handling

### Network Errors
- [ ] Disconnect network while using app
- [ ] App shows "Connection lost" or similar message
- [ ] Reconnect network → app recovers
- [ ] Pending changes are synced when reconnected

### API Errors
- [ ] Set invalid Gemini API key
- [ ] Click "Run AI Check"
- [ ] Error message displays (no crash)
- [ ] Can still use app without AI validation

### Storage Errors
- [ ] Clear browser storage
- [ ] App still loads (uses Yjs sync from server)
- [ ] No console errors

---

## 16. Security

### Input Validation
- [ ] Try entering malicious characters in entity names
- [ ] App sanitizes or rejects appropriately
- [ ] No XSS vulnerabilities in rendered output

### API Security
- [ ] API key not exposed in client-side code
- [ ] Only server can call Gemini API
- [ ] API calls include proper headers

### WebSocket Security
- [ ] WSS (WebSocket Secure) used in production
- [ ] No sensitive data transmitted in clear
- [ ] CORS headers set correctly

---

## Final Checklist

Before declaring the project complete:

- [ ] All tests above pass
- [ ] No console errors or warnings
- [ ] Code is properly committed and pushed
- [ ] Documentation is complete (README.md, DEPLOYMENT.md, etc.)
- [ ] Team members can deploy and run locally
- [ ] Production deployment is stable (no crashes for 1 hour)

---

## Sign-off

**Verification Date**: _______________

**Verified By**: _______________

**Issues Found**: _______________

**Notes**: _______________

---

If all items are checked, the CS 2340 UML Collaboration Tool is ready for production use!
