import { PostManager } from './PostManager';

export class CollaboratPostManager extends PostManager {
  public constructor() {
    super();
  }

  public approvePost(postID: string) : boolean {
    // code here
    return true;
  }
}