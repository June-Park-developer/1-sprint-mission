export default class Product {
  constructor(name, description, price, tags = [], images, favoriteCount = 0) {
    this.name = name;
    this.description = description;
    this._price = price;
    this.tags = tags;
    this.images = images;
    this._favoriteCount = favoriteCount;
  }

  set price(value) {
    if (value >= 0) {
      this._price = value;
    } else {
      console.log("가격은 음수일 수 없습니다.");
    }
  }

  get price() {
    return this._price;
  }

  set favoriteCount(value) {
    console.log("찜하기를 통해서만 변경 가능합니다.");
  }

  get favoriteCount() {
    return this._favoriteCount;
  }

  favorite() {
    this._favoriteCount++;
  }
}
