# sprint-mission-3 (박정은)

## 개요
  이 프로젝트는 **코드잇 Node js 스프린트의 세번째 미션**으로 진행한 프로젝트입니다.   
  중고마켓 (Product)와 자유게시판 (Article), 그리고 댓글 (Comment) 에 대한 **CRUD api** 를 다루고 있습니다. 

## 구성

```
sprint1
 ┗ sprint1에 대한 리뷰 반영
src
 ┣ middlewares
 ┃ ┣ errorHandler.js
 ┃ ┗ validation.js
 ┣ routes
 ┃ ┣ article.js
 ┃ ┣ articleComment.js
 ┃ ┣ comment.js
 ┃ ┣ product.js
 ┃ ┗ productComment.js
 ┣ utils
 ┃ ┣ asyncHandler.js
 ┃ ┣ prismaClient.js
 ┃ ┗ struct.js
 ┗ app.js
prisma
 ┣ migrations
 ┣ mock.js
 ┣ schema.prisma
 ┗ seed.js

ERD.md

```


## API 
###  /products
| Method | 기능 설명 |
|--------|-------------------------------------------|
| `GET` | offset-based pagination을 이용한 상품 리스트 반환 |
| `POST` | 상품 게시 |

###  /products/:productId
| Method | 기능 설명 |
|--------|-------------------------------------------|
| `GET` | 해당 Id의 상품 정보 반환 |
| `PATCH` | 해당 Id의 상품 정보 수정 |
| `DELETE` | 해당 Id의 상품 정보 삭제 |


###  /articles
| Method | 기능 설명 |
|--------|-------------------------------------------|
| `GET` | offset-based pagination을 이용한 게시글 리스트 반환 |
| `POST` | 게시글 게시 |

###  /articles/:articleId
| Method | 기능 설명 |
|--------|-------------------------------------------|
| `GET` | 해당 Id의 게시글 정보 반환 |
| `PATCH` | 해당 Id의 게시글 정보 수정 |
| `DELETE` | 해당 Id의 게시글 정보 삭제 |

###  /products/comments
| Method | 기능 설명 |
|--------|-------------------------------------------|
| `GET` | cursor-based Pagination을 이용한 상품에 대한 댓글 리스트 반환 |

###  /products/comments/:productId
| Method | 기능 설명 |
|--------|-------------------------------------------|
| `GET` | cursor-based Pagination을 이용한 해당 Id의 상품에 대한 댓글 리스트 반환 |
| `POST` |해당 Id의 상품에 대한 댓글 게시 |

###  /articles/comments
| Method | 기능 설명 |
|--------|-------------------------------------------|
| `GET` | cursor-based Pagination을 이용한 게시글에 대한 댓글 리스트 반환 |

###  /articles/comments/:articleId
| Method | 기능 설명 |
|--------|-------------------------------------------|
| `GET` | cursor-based Pagination을 이용한 해당 Id의 게시글에 대한 댓글 리스트 반환 |
| `POST` |해당 Id의 게시글에 대한 댓글 게시 |

###  /comments/:commentId
| Method | 기능 설명 |
|--------|-------------------------------------------|
| `GET` | 해당 Id의 댓글 정보 반환 |
| `PATCH` | 해당 Id의 댓글 정보 수정 |
| `DELETE` | 해당 Id의 댓글 정보 삭제 |


## 배포 링크
https://sprint3-edd5.onrender.com
