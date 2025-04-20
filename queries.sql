/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users
SET nickname = "test"
WHERE id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT *
FROM products
WHERE authorId = 1
ORDER BY createdAt DESC
LIMIT 10
OFFSET (10 * 2);

/*
  3. 내가 생성한 상품의 총 개수
*/
SELECT COUNT(*) AS totalCount
FROM products
GROUP BY authorId
HAVING authorId = 1;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT p.*
FROM products p JOIN likedProducts l ON l.productId =  p.id
WHERE l.userId = 1
ORDER BY l.createdAt DESC
LIMIT 10
OFFSET (10 * 2);

/*
  5. 내가 좋아요 누른 상품의 총 개수
*/
SELECT COUNT(*) AS totalCount
FROM likedProducts
WHERE userId = 1;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products (name,description, price, tags, images, authorId)
VALUES ('최고급 맥북', '거의 새거이지만 반값으로 팝니다!', 100000, '{"노트북"}', '{"example.com"}', 1);

/*
  7. 상품 목록 조회
  - "test" 로 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT p.*, COUNT(l.productId) AS like_count
FROM products p LEFT OUTER JOIN likedProducts l ON p.id = l.productId
WHERE p.name LIKE '%test%'
GROUP BY p.id
ORDER BY p.createdAt DESC
LIMIT 10;



/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT * 
FROM products
WHERE id = 1;

/*
  9. 상품 수정
  - 1번 상품 수정
*/
UPDATE products
SET name = '최고의 티셔츠'
WHERE id = 1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products
WHERE id = 1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO likedProducts (userId, productId)
VALUES (1, 2);

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM likedProducts
WHERE userId = 1 AND productId = 2;

/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO comments (authorId, productId, content)
VALUES (1, 2, '사고싶어요');

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준으로 커서 페이지네이션
  - 10개씩 페이지네이션
*/
SELECT *
FROM comments
WHERE productId = 1 AND createdAt < '2025-03-25'
ORDER BY createdAt DESC
LIMIT 10;

