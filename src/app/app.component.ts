import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Post, BlogData } from './interfaces/blog.interface';
import { BlogService } from './services/blog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoplayer?: ElementRef<HTMLVideoElement>;
  @ViewChild('homeVideo') homevideo?: ElementRef<HTMLVideoElement>;

  userId = '@onenet';
  title = 'onenet-web';
  yourAddress = '';
  amount: any;
  nft: any;
  currentQuarter = 0;
  currentFaq = 0;
  posts: Post[] = [];
  

  constructor(private window: Window, private blog: BlogService) {
    this.blog.getBlogPosts(this.userId).subscribe((pubs: BlogData) => {
      this.posts = pubs.items.map((item, index) => {
        let shortenedDesc = item.description.substring(
          item.description.indexOf('</strong></p>\n<p>') + 17,
          500
        );
        item.description = shortenedDesc;
        return item;
      });
      this.posts.splice(4);
    });
  }

  ngAfterViewInit(): void {
    // this.homevideo?.nativeElement.play();
    (this.homevideo as any).nativeElement.muted = true;
  }

  setQuarter(quarter: number) {
    this.currentQuarter = quarter;
  }

  setFaq(faq: number) {
    this.currentFaq = faq;
  }

  toggleVideo(event: any) {
    console.log(event);
  }
}
