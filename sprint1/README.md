# sprint-mission-1 (박정은)

## 개요
  이 프로젝트는 **코드잇 Node js 스프린트의 첫번째 미션**으로 진행한 프로젝트입니다.   
  [panda market API](https://panda-market-api-crud.vercel.app/)의 api를 활용하여 **Product와 Article를 Create, Read, Update, Delete** 할 수 있습니다. 

## 구성
| 파일명               | 설명                           |
|----------------------|------------------------------|
| `Article.js`        | Article 클래스 정의           |
| `Product.js`        | Product 클래스 정의           |
| `ArticleService.js` | Article 관련  함수  |
| `ProductService.js` | Product 관련 함수   |
| `main.js`           | 테스트 코드                   |
| `README.md`        | 프로젝트 설명                 |
## 함수의 기능
###  ArticleService.js (게시글 관련 기능)
| 함수명 | 기능 설명 |
|--------|-------------------------------------------|
| `getArticleList(page, pageSize, keyword)` | 페이지네이션과 키워드를 활용하여 게시글 리스트 조회 |
| `getArticle(id)` | 특정 게시글 조회 |
| `createArticle(title, content, image)` | 게시글 생성 후 ID 반환 |
| `patchArticle(id, data)` | 특정 게시글 부분 수정 후 ID 반환 |
| `deleteArticle(id)` | 특정 게시글 삭제 후 ID 반환 |

###  ProductService.js (상품 관련 기능)
| 함수명 | 기능 설명 |
|--------|-------------------------------------------|
| `getProductList(name, description, price, tags, images)` | 조건에 맞는 상품 리스트 조회 |
| `getProduct(id)` | 특정 상품 조회 |
| `createProduct(name, description, price, tags, images)` | 상품 생성 후 ID 반환 |
| `patchProduct(id, data)` | 특정 상품 부분 수정 후 ID 반환 |
| `deleteProduct(id)` | 특정 상품 삭제 후 ID 반환 |

##  실행 방법
1. **저장소 클론**
   ```bash
   git clone <해당 저장소 url>
   cd sprint-mission-1
   ```
2. **의존성 설치**
   ```bash
   npm install
   ```
3. **테스트 실행**
  ```bash
  node main.js
  ```
