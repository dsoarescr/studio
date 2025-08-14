import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Mock Firebase Admin for development
export const adminAuth = {
  verifyIdToken: async (token: string) => ({ uid: 'mock-user' }),
  getUser: async (uid: string) => ({ 
    uid, 
    email: 'user@example.com', 
    displayName: 'Mock User' 
  })
};

export const adminDb = {
  collection: (path: string) => ({
    doc: (id: string) => ({
      get: async () => ({ exists: false, data: () => null }),
      set: async (data: any, options?: any) => {},
      update: async (data: any) => {},
      collection: (subPath: string) => ({
        add: async (data: any) => ({ id: 'mock-doc-id' })
      })
    }),
    where: (field: string, op: string, value: any) => ({
      limit: (n: number) => ({
        get: async () => ({ empty: true, docs: [] })
      })
    })
  })
};