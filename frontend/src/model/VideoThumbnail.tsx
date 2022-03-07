import { Subject } from './Subject';

export type VideoThumbnail = {
  id: string;
  name: string;
  url?: string;
  imageUrl: string;
  subject: Subject;
};
