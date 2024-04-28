# NestJS WebService

## 문제1

- 두 수를 입력하면, 다음과 같은 결과가 나오는 `GET` API 구현
- path: `/api/v1/calc`
- query parameter: num1, num2

```text
{
  "add":덧셈결과,
  "minus":뺄셈결과,
  "multiply":곱셈결과 
}
```

### 예시

GET /api/v1/calc?num1=10&num2=5

```json
{
  "add": 15,
  "minus": 5,
  "multiply": 50
}
```

### 📈 풀이

- Query Parameter가 많아지면 어떻게 할까?
- DTO 등장(요청, 응답분리)
- API 결과 확인하기: Browser / POST MAN / Test

## 문제2

- 날짜를 입력하면, 어떤 요일인지 알려주는 `GET` API 구현
- path, query parameter는 임의로 구성한다.

### 예시

GET /api/v1/day-of-the-week?date=2023-01-01

```text
{
  "dayOfWeek": "MON"
}
```

## 문제3

- 여러 수를 받아 총 합을 반환하는 `POST` API 구현
- API에서 받는 Body는 다음과 같은 형태를 가진다.
- **HINT**: 요청을 받는 DTO에서 `List`를 갖고 있으면 JSON의 배열을 받을 수 있다.

```text
{
  "numbers": [1, 2, 3, 4, 5];
}
```

### 예시

```text
15
```

- **주의**: 반환결과는 JSON이 아니다. 함수에서 String, Integer를 반환하면, API의 결과가 JSON으로 나가지 않고, 단순한 값으로 반환된다.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
