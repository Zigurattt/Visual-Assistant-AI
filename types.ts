export const AppState = {
  IDLE: 0,
  AWAITING_PERMISSION: 1,
  CAM_READY: 2,
  READY_TO_SCAN: 3, // Ready for the user to initiate a scan
  SCANNING: 4,      // User is holding the scan button
  ANALYZING: 5,     // Gemini is working
  SHOWING_RESULT: 6,// Result is displayed, ready for follow-up
  ERROR: 7,
};
