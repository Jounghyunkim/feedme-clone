# 브랜드 아이덴티티 (LG 색상과 CI)

## Decisions

- 화면 색상은 LG 공식 팔레트로 만든다. 주 색상(`primary`, `ring`)은 Active Red `#FD312E`, 중립색은 Warm Gray 01–07(`#262626` `#4A4946` `#716F6A` `#CBC8C2` `#E6E1D6` `#F0ECE4` `#F6F3EB`), 배경은 흰색(다크 모드는 `#141414`)이다. 값은 `app/globals.css`의 semantic token에만 두고, 화면에서 hex를 직접 쓰지 않는다.
- 오류(`destructive`)는 Active Red와 구별되도록 Heritage Red `#A50034`를 쓴다. 다크 모드에서는 어두운 배경에서 읽히도록 `#FF6B66`을 쓴다.
- `primary` 위의 글자는 흰색이다.
- CI는 LG 공식 Brand Assets의 로고 파일을 그대로 쓴다. 밝은 화면은 `public/brand/LGE_Logo_HeritageRed_Grey_RGB.png`, 다크 모드는 `public/brand/LGE_Logo_HeritageRed_White_RGB.png`다. 로고를 다시 그리거나 색을 바꾸지 않는다.
- 앱 헤더는 왼쪽에 LG CI, 세로 구분선, 서비스 이름 순으로 놓는다.

## Boundaries

- 글꼴은 바꾸지 않는다. LG 전용 서체는 라이선스가 필요해서 Inter를 유지한다.
- LG 시그니처 그라데이션은 쓰지 않는다. 공식 페이지가 그라데이션을 라이트 모드 전용 브랜드 비주얼로 정해 두어서, 일반 UI 상태 표현과 맞지 않는다.

## Why

사용자가 2026-11-18에 LG전자 스타일과 Active Red, LG CI 적용을 요청했다. LG는 2023년 새 아이덴티티에서 디지털 접점에 Active Red를 쓰기로 했고, 로고 심볼에는 Heritage Red를 유지한다. 그래서 주 색상은 Active Red로, 로고는 Heritage Red 공식 파일로 나눈다.

빨간 주 색상과 빨간 오류 색이 같으면 "주요 버튼"과 "문제가 생김"을 구별할 수 없다. 더 어둡고 차분한 Heritage Red를 오류에 배정해서 구별한다.

흰 글자와 Active Red의 대비는 3.71:1로, 14px 일반 텍스트의 WCAG AA 기준(4.5:1)에 못 미치고 큰 글자 기준(3:1)만 넘는다. 검은 글자는 5.66:1로 기준을 넘지만 LG 디지털 화면의 관례(빨간 바탕에 흰 글자)와 어긋나서, 브랜드 일관성을 택했다.

## Reconsider when

- 접근성 AA 준수가 요구 사항이 되면 `primary-foreground`나 버튼 글자 크기·굵기를 다시 정한다.
- LG가 디지털 팔레트나 로고 파일을 바꾸면 값과 파일을 공식 자료에 맞춘다.
- 저장소를 외부에 배포하거나 공개 서비스로 운영하게 되면 LG 브랜드 사용 승인 여부를 확인한다. 공식 Brand Assets 페이지에는 사용 조건이 적혀 있지 않다.

## Still-rejected alternatives

- Heritage Red `#A50034`를 주 색상으로 쓰는 방식: 대비는 7.93:1로 좋지만, 사용자가 Active Red를 요청했고 LG가 디지털용으로 정한 색도 Active Red다.
- `primary` 위 글자를 검정으로 쓰는 방식: AA는 통과하지만 LG 화면 관례와 다르게 보인다. 위 접근성 조건이 생기면 다시 본다.
- 로고를 SVG나 CSS로 직접 그리는 방식: 공식 파일과 미세하게 달라질 수 있어 브랜드 자산으로 쓰기 어렵다.

## Evidence worth preserving

- 공식 색상 값: https://www.lg.com/global/our-identity/color/ (Active Red `#FD312E` PMS 2034C, Heritage Red `#A50034` PMS 207C, Warm Grey `#F0ECE4`). Warm Gray 01–07 값은 LG US의 브랜드 가이드 PDF(https://www.lg.com/us/wonderbox/Wonderbox-GuidelinesSpecs.pdf)에 있다.
- 공식 로고 파일: https://www.lg.com/global/our-identity/brand-assets/ 의 `1_lg_logo_heritagered_grey/LGE_Logo_HeritageRed_Grey_RGB.png`, `2_lg_logo_heritagered_white/LGE_Logo_HeritageRed_White_RGB.png` (둘 다 2081×1127 투명 PNG, 로고 둘레에 여백 포함).
- 대비 측정: 흰색/Active Red 3.71, 검정/Active Red 5.66, 흰색/Heritage Red 7.93, `#716F6A`/흰색 5.02, `#716F6A`/`#F6F3EB` 4.53, `#FF6B66`/`#121212` 6.73.
