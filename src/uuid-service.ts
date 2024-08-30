import { IdGenerator } from './types';
import { v4 as uuidv4 } from 'uuid';

export class UUIDService implements IdGenerator {
  createId(): string {
    return uuidv4();
  }
}
