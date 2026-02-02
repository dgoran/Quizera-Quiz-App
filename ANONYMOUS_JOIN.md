# Anonymous Quiz Join Feature

Allow users to participate in quizzes without creating an account!

## What's New

Users can now join quiz sessions anonymously from the landing page, without needing to sign up or log in.

## How It Works

### For Quiz Participants (Anonymous Users)

1. **Visit the Landing Page**
   - Go to http://192.168.68.53:5173 (or http://localhost:5173)

2. **Click "Join Quiz Anonymously"**
   - New green button on the main page

3. **Enter Your Details**
   - Name: Any name you want to use
   - Room Code: The code provided by the quiz host

4. **Join the Quiz**
   - You'll be taken directly to the quiz room
   - Participate just like registered users
   - Compete on the leaderboard with your chosen name

### For Quiz Hosts (ADMIN Users)

Nothing changes for you! Anonymous users will:
- Appear in your participant list with their chosen names
- Their user IDs will show as `anon_[timestamp]`
- Compete and answer questions normally
- Show up on leaderboards

## User Flow

```
Landing Page
    ↓
[Join Quiz Anonymously] button
    ↓
Enter Name + Room Code
    ↓
Join Quiz Room
    ↓
Participate & Compete!
```

## Files Modified

### New Files
- **[quiz-app/src/pages/AnonymousJoin.jsx](quiz-app/src/pages/AnonymousJoin.jsx)** - Anonymous join page with name and room code inputs

### Modified Files
- **[quiz-app/src/App.jsx](quiz-app/src/App.jsx)** - Added `/anonymous-join` route and removed ProtectedRoute from `/room/:roomCode`
- **[quiz-app/src/pages/LandingPage.jsx](quiz-app/src/pages/LandingPage.jsx)** - Added "Join Quiz Anonymously" button

## Features

### Anonymous User Experience
- ✅ No account required
- ✅ No email needed
- ✅ No password to remember
- ✅ Full quiz participation
- ✅ Compete on leaderboard
- ✅ Real-time WebSocket connection
- ✅ Same features as registered users

### Data Handling
- Anonymous user data stored in localStorage:
  - `name`: User's chosen display name
  - `userId`: Auto-generated `anon_[timestamp]`
  - `isAnonymous`: Flag set to `"true"`

- Data persists only during browser session
- Cleared when browser/tab is closed
- No database record created

## Technical Details

### Route Configuration

**Public Route (No Authentication):**
```javascript
<Route path="/anonymous-join" element={<AnonymousJoin />} />
```

**Quiz Room (Now Allows Anonymous):**
```javascript
<Route path="/room/:roomCode" element={<UserRoom />} />
// Removed ProtectedRoute wrapper to allow anonymous access
```

### User ID Format

- **Registered Users:** UUID from database (e.g., `"550e8400-e29b-41d4-a716-446655440000"`)
- **Anonymous Users:** Timestamped ID (e.g., `"anon_1706789234567"`)

### WebSocket Connection

Anonymous users connect to WebSocket the same way as registered users:
- Name from localStorage
- User ID from localStorage
- All real-time features work identically

## Security Considerations

### What's Safe
- ✅ Anonymous users can only participate, not create quizzes
- ✅ No database pollution with temporary accounts
- ✅ User data cleared after session
- ✅ Room codes still required for access

### Potential Issues
- ⚠️ No rate limiting on anonymous joins
- ⚠️ Users can impersonate others by using same name
- ⚠️ No persistent history for anonymous users
- ⚠️ Anonymous users can rejoin with different names

### Recommendations for Production

1. **Add Rate Limiting**
   ```javascript
   // Limit anonymous joins per IP
   - Max 10 joins per hour per IP
   - Prevent spam/abuse
   ```

2. **Add Name Validation**
   ```javascript
   // Prevent offensive names
   - Profanity filter
   - Minimum length: 2 characters
   - Maximum length: 20 characters
   ```

3. **Track Anonymous Users**
   ```javascript
   // Optional: Log anonymous participation
   - Track by session ID
   - Analytics purposes only
   - Don't store personally identifiable info
   ```

4. **Room Access Control**
   ```javascript
   // Optional: Let hosts restrict anonymous users
   - Toggle "Allow anonymous participants"
   - Per-quiz setting
   ```

## Testing

### Test Anonymous Join

1. **Start the app:**
   ```bash
   docker-compose up
   ```

2. **Open two browsers:**
   - **Browser 1** (Chrome): Log in as ADMIN, create quiz, start session
   - **Browser 2** (Firefox/Incognito): Go to landing page

3. **Test anonymous join:**
   - Click "Join Quiz Anonymously"
   - Enter name: "TestUser"
   - Enter room code from Browser 1
   - Click "Join Quiz"

4. **Verify:**
   - TestUser appears in participant list (Browser 1)
   - TestUser can answer questions (Browser 2)
   - TestUser appears on leaderboard (both browsers)

### Test Edge Cases

- [ ] Join with empty name (should show error)
- [ ] Join with empty room code (should show error)
- [ ] Join with invalid room code (should handle gracefully)
- [ ] Join same room twice with different names (should work)
- [ ] Close browser and rejoin (should ask for name again)

## User Experience Improvements

### Current Flow
```
Landing → Anonymous Join → Enter Details → Quiz Room
```

### Future Enhancements

1. **Quick Join from Landing**
   - Room code input directly on landing page
   - Skip intermediate page for faster access

2. **Remember Name**
   - Optional: "Remember my name for next time"
   - Store in localStorage (not database)

3. **Guest Mode Badge**
   - Show "Guest" badge on leaderboard
   - Differentiate from registered users
   - Add "Sign up to save your scores!"

4. **Post-Quiz Conversion**
   - After quiz: "Sign up to see your history!"
   - Convert anonymous users to registered
   - Transfer session scores to account

## Comparison: Anonymous vs Registered Users

| Feature | Anonymous | Registered |
|---------|-----------|------------|
| **Join Quiz** | ✅ Yes | ✅ Yes |
| **Answer Questions** | ✅ Yes | ✅ Yes |
| **Leaderboard** | ✅ Yes | ✅ Yes |
| **Create Quiz** | ❌ No | ✅ Yes (ADMIN) |
| **Edit Quiz** | ❌ No | ✅ Yes (ADMIN) |
| **View History** | ❌ No | ✅ Yes |
| **Profile Page** | ❌ No | ✅ Yes |
| **Persistent Data** | ❌ No | ✅ Yes |
| **Email Required** | ❌ No | ✅ Yes |
| **Password Required** | ❌ No | ✅ Yes |

## Analytics & Tracking

### What to Track (Optional)

```javascript
// Anonymous user analytics
{
  userId: "anon_1706789234567",
  name: "TestUser",
  joinedAt: "2026-02-02T12:00:00Z",
  roomCode: "ABC123",
  questionsAnswered: 5,
  correctAnswers: 3,
  score: 150,
  sessionDuration: "00:05:32"
}
```

Use for:
- Understanding user engagement
- Conversion rate (anonymous → registered)
- Popular quiz topics
- Average participation time

## FAQ

**Q: Do anonymous users need to remember anything?**
A: No! Just enter a name and room code each time.

**Q: Can anonymous users create quizzes?**
A: No, only registered ADMIN users can create quizzes.

**Q: Is their data saved?**
A: No, anonymous user data is session-only and not stored in the database.

**Q: Can they access their quiz history?**
A: No, history is only available for registered users.

**Q: What happens if they close the browser?**
A: All data is lost. They'll need to rejoin with a new name if they want to continue.

**Q: Can two people use the same name?**
A: Yes, but they'll have different user IDs, so the system can tell them apart.

---

**Status:** ✅ Live and ready to use!

**Quick Start:** Open http://192.168.68.53:5173 → Click "Join Quiz Anonymously"
