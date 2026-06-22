import { connectDatabase } from '@config/database';

/** Loader wrapper so app bootstrapping reads as a list of composable steps. */
export async function loadMongoose(): Promise<void> {
  await connectDatabase();
}
