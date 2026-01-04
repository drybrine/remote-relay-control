import { database } from '@/lib/firebase';
import { ref, onValue, set, update, get } from 'firebase/database';

export interface RelayStatus {
  status: boolean;
  lastControl: number;
  lastUpdate: string;
  deviceOnline: boolean;
  deviceIP?: string;
  device?: {
    deviceOnline: boolean;
    deviceIP: string;
    rssi: number;
    uptime: number;
    freeHeap: number;
  };
}

/**
 * Subscribe to relay status changes
 * @param callback Function to call when relay status changes
 * @returns Unsubscribe function
 */
export const subscribeToRelayStatus = (callback: (status: boolean, data: RelayStatus) => void) => {
  const relayRef = ref(database, '/relay');
  
  const unsubscribe = onValue(relayRef, (snapshot) => {
    const data = snapshot.val() as RelayStatus;
    if (data) {
      callback(data.status, data);
    }
  });

  return unsubscribe;
};

/**
 * Set relay status (ON/OFF)
 * @param status true for ON, false for OFF
 */
export const setRelayStatus = async (status: boolean): Promise<void> => {
  const relayRef = ref(database, '/relay');
  
  try {
    await update(relayRef, {
      status: status,
      lastControl: Date.now(),
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error setting relay status:', error);
    throw error;
  }
};

/**
 * Get current relay status
 * @returns Current relay status
 */
export const getRelayStatus = async (): Promise<RelayStatus | null> => {
  const relayRef = ref(database, '/relay');
  
  try {
    const snapshot = await get(relayRef);
    if (snapshot.exists()) {
      return snapshot.val() as RelayStatus;
    }
    return null;
  } catch (error) {
    console.error('Error getting relay status:', error);
    throw error;
  }
};

/**
 * Initialize relay data if not exists
 */
export const initializeRelayData = async (): Promise<void> => {
  const relayRef = ref(database, '/relay');
  
  try {
    const snapshot = await get(relayRef);
    if (!snapshot.exists()) {
      await set(relayRef, {
        status: false,
        lastControl: 0,
        lastUpdate: '',
        deviceOnline: false,
        deviceIP: '',
      });
    }
  } catch (error) {
    console.error('Error initializing relay data:', error);
    throw error;
  }
};
