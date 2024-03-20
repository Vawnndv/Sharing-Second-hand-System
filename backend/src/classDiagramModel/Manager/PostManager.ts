import { Post } from '../Post';

export class PostManager {
  public constructor() {

  }

  public viewPost(): Post[] {
    // code here
    return [];
  }

  public viewPostDetails(postID: string): Post {
    // code here
    return new Post('');
  }

  public viewPostsOfUser(userID: string): Post[] {
    // code here
    return [];
  }

  public searchPost(stringSearch: string): Post[] {
    // code here
    return [];
  }

  public addPost(): boolean {
    // code here
    return true;
  }

  public editPost(): boolean {
    // code here
    return true;
  }

  public confirmReceive(postID: string): boolean {
    // code here
    return true;
  }

  public likePost(): void {
    // code here
  }
}