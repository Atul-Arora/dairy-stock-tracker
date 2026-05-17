import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { StockEntry } from './stock';

const COLLECTION = 'stockEntries';

export async function loadCloudEntries(): Promise<StockEntry[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((item) => item.data() as StockEntry);
}

export async function saveDayToCloud(dayEntries: StockEntry[]): Promise<void> {
  await Promise.all(dayEntries.map((entry) => setDoc(doc(db, COLLECTION, entryId(entry)), entry)));
}

function entryId(entry: StockEntry): string {
  return `${entry.date}_${entry.product}`;
}
