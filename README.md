# gorl1004.cloud

게임 클라이언트 개발자 홍혁기의 포트폴리오 사이트입니다.

## 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 페이지 본문 |
| `style.css` | 스타일 (색·여백 값은 `:root`에 모아둠) |
| `script.js` | 프로젝트 카드 생성, 연락하기 모달 |
| `projects.json` | 프로젝트 데이터 |
| `assets/` | 프로필 사진, 이력서 PDF |

## 프로젝트 추가

`projects.json`에 객체를 하나 추가하면 됩니다. HTML은 수정하지 않습니다.

```json
{
  "order": 7,
  "title": "프로젝트 이름",
  "stack": "Unity · C# · 개인",
  "videoId": "유튜브영상ID",
  "videoUrl": "https://youtu.be/유튜브영상ID",
  "playUrl": null,
  "descriptions": ["첫 줄", "둘째 줄"]
}
```

- `playUrl`에 주소를 넣으면 플레이 버튼이 생기고, `null`이면 생기지 않습니다.
- 썸네일은 `videoId`로 유튜브에서 자동으로 가져옵니다.
- `descriptions`는 카드에 앞 2개만 노출됩니다. 노출 개수는 `script.js`의 `VISIBLE_DESC_COUNT`로 조절합니다.
