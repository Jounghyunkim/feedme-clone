# 웹 페이지 본문 추출

## Decisions

- 본문 추출은 `defuddle` npm 라이브러리로 한다. Node용 진입점 `defuddle/node`에 DOM 구현으로 `linkedom`을 넘기고, `{ markdown: true }`로 Markdown을 받는다.
- 페이지를 가져오고 추출하는 일은 브라우저가 아닌 서버에서 한다.
- 추출 결과는 손보지 않고 그대로 보여 주고 내보낸다.
- 가져오기에 실패하면(연결 실패, 4xx/5xx) "불러오지 못함"으로, 가져왔지만 본문이 비면 "본문 없음"으로 구분해 알린다.

## Boundaries

- 로그인이 필요한 페이지나 브라우저 스크립트로 본문을 그리는 페이지(예: x.com)는 추출하지 않는다. "본문 없음" 안내로 끝낸다.
- `defuddle.md` 호스팅 API는 쓰지 않는다.

## Why

사용자가 `defuddle` 라이브러리를 필수 조건으로 정했다. 호스팅 API는 요청이 늘면 유료 키가 필요하고, 라이브러리만으로 충분하다.

브라우저에서 다른 사이트의 HTML을 직접 받으면 CORS로 막히기 때문에 서버에서 가져온다.

## Reconsider when

- `defuddle`이 메이저 버전을 올려 결과 형태(`title`, `author`, `site`, `domain`, `published`, `wordCount`, `content`)가 바뀌면 다시 본다.
- 스크립트로 그리는 페이지의 추출이 요구 사항이 되면 헤드리스 브라우저 렌더링을 검토한다.

## Evidence worth preserving

- 2026-11-18, `defuddle` 0.19.6과 `linkedom` 0.18.15로 실제 페이지를 확인했다.
  - `stephango.com/file-over-app`은 제목, 저자, 게시일이 모두 나왔다.
  - `react.dev/learn`은 저자와 게시일이 빈 값이었다.
  - `x.com`은 제목은 나왔지만 본문이 0자였다.
- `defuddle` 문서(https://defuddle.md/docs)는 `defuddle/node`에 ESM 환경이 필요하다고 적어 두었다. 이 프로젝트는 Next.js 서버 코드로 번들되어 별도 설정 없이 동작했다.
