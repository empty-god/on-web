export interface BlogData {
  feed: {
    author: string,
    description: string,
    image: string,
    link: string,
    title: string,
    url: string,
  },
  items: Post[],
  status: string
}

export interface Post {
  author: "onenet."
  categories: string[],
  content: string,
  description: string,
  enclosure: {}
  guid: string,
  link: string,
  pubDate: Date,
  thumbnail: string,
  title: string
}