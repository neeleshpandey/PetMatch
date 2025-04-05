# Pet Match Debugging Guide

## Common Issues

### No Pets Found / Empty Matches

If you're experiencing issues where no pets are being displayed or you see a "No matches found" message:

1. **Visit the Debug Page**: Navigate to `/debug` in your browser to check the system status
2. **Check Pet Count**: The debug page will show you how many pets are currently in the system
3. **Reload Data**: If pet count is 0, use the "Reload Sample Data" button to force initialization
4. **Try the Form Again**: After reloading data, go back to the Find Pet form

## Technical Details

Pet Match uses an in-memory data store to keep pets, users, and matches. The sample pet data should be loaded automatically on application startup, but in some cases this might not happen correctly.

### How Data Is Initialized

1. The `/app/lib/init.ts` module is responsible for initializing sample data
2. It's imported in the app layout and API routes for redundancy
3. The `addSampleData()` function in `store.ts` creates the sample pets

### Manual Debug Steps

If you're a developer working on this project, you can also:

1. Check the console logs to see if the initialization was successful
2. Make a GET request to `/api/debug` to see the system status
3. Make a GET request to `/api/debug?reload=true` to force reload sample data

## Contact

If you continue to experience issues, please contact the development team. 