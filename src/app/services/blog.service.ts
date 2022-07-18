import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BlogData} from '../interfaces/blog.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private http: HttpClient) { }

  getBlogPosts(userId: string) {
    return this.http.get<BlogData>(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${userId}`);
  }



}
