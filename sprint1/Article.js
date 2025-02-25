export default class Article {
  constructor(title, content, image, writer = "unknown", likeCount = 0) {
    this.title = title;
    this.content = content;
    this.image = image;
    this.writer = writer;
    this._likeCount = likeCount;
    this.createdAt = new Date();
  }

  set likeCount(value) {
    console.log("좋아요를 통해서만 변경할 수 있습니다.");
  }

  get likeCount() {
    return this._likeCount;
  }

  like() {
    this._likeCount++;
  }
}
