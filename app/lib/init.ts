import { addSampleData, getAllPets } from './store';

// Flag to track if initialization has been run
let initialized = false;
let initRetries = 0;
const MAX_RETRIES = 3;

/**
 * Initialize the application data
 * This should be called early in the app lifecycle
 */
export function initializeApp(force = false) {
  if (initialized && !force) {
    console.log('App already initialized, skipping.');
    return true;
  }
  
  console.log('Initializing application data...');
  
  // Add sample data
  addSampleData(force);
  
  // Verify we have data
  const pets = getAllPets();
  
  if (pets.length === 0) {
    initRetries++;
    console.error(`WARNING: No pets available after initialization! (Attempt ${initRetries}/${MAX_RETRIES})`);
    
    if (initRetries < MAX_RETRIES) {
      console.log('Attempting retry with force=true');
      // Add a small delay before retrying
      setTimeout(() => {
        addSampleData(true);
        const petsRetry = getAllPets();
        if (petsRetry.length === 0) {
          console.error(`Still no pets after retry ${initRetries}. Will try again later.`);
        } else {
          console.log(`Successfully loaded ${petsRetry.length} pets on retry ${initRetries}.`);
          initialized = true;
          initRetries = 0;
        }
      }, 100);
      return false;
    } else {
      console.error('CRITICAL ERROR: Max retries reached. Still no pets after forced initialization!');
      // Reset retry counter but keep initialized as false
      initRetries = 0;
      return false;
    }
  } else {
    console.log(`Application initialized with ${pets.length} pets.`);
    initialized = true;
    initRetries = 0;
    return true;
  }
}

/**
 * Verify data is properly initialized
 * @returns True if data is properly initialized
 */
export function verifyInitialization() {
  const pets = getAllPets();
  if (pets.length === 0) {
    console.warn('Data verification failed: No pets found');
    return false;
  }
  return true;
}

// Auto-initialize on import
const success = initializeApp();
if (!success) {
  console.warn('Initial initialization attempt failed, will retry when needed');
}

export default initializeApp; 