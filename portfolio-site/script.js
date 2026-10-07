/* ============================================================
   홍혁기 포트폴리오 — 프로젝트 카드 생성 + 연락하기 모달

   프로젝트 내용은 projects.json에만 있습니다.
   프로젝트를 추가할 때는 이 파일이 아니라 projects.json에
   객체를 하나 더 넣으면 됩니다.
   ============================================================ */

(function () {
  'use strict';

  /* ------------------------------------------------------------
     1. 프로젝트 카드
     ------------------------------------------------------------ */

  // 카드에 보여줄 설명 줄 수. 데이터는 더 들고 있어도 여기까지만 노출합니다.
  var VISIBLE_DESC_COUNT = 2;

  var listEl = document.getElementById('projectList');

  // 유튜브 썸네일 주소. maxresdefault는 영상에 따라 없을 수 있어
  // 실패하면 항상 존재하는 hqdefault로 교체합니다. (아래 onerror)
  function thumbnailUrl(videoId) {
    return 'https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg';
  }

  function fallbackThumbnailUrl(videoId) {
    return 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg';
  }

  // 번호를 01, 02 형태로 맞춥니다.
  function padOrder(n) {
    return String(n).padStart(2, '0');
  }

  // 사용자가 입력한 값이 그대로 HTML로 해석되지 않도록 막습니다.
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 프로젝트 데이터 하나를 받아 완성된 카드 요소를 돌려줍니다.
   * 호출하는 쪽은 카드 내부 구조를 몰라도 됩니다. (Factory 패턴)
   */
  function createProjectCard(project) {
    var card = document.createElement('article');
    card.className = 'project-card';

    var descriptions = project.descriptions
      .slice(0, VISIBLE_DESC_COUNT)
      .map(function (line) { return '<li>' + escapeHtml(line) + '</li>'; })
      .join('');

    // 카드 전체를 덮는 투명 링크 → 영상으로 이동
    var html =
      '<a class="card-link" href="' + project.videoUrl + '"' +
      ' target="_blank" rel="noopener noreferrer"' +
      ' aria-label="' + escapeHtml(project.title) + ' 영상 보기"></a>' +

      '<img class="thumb" src="' + thumbnailUrl(project.videoId) + '"' +
      ' alt="' + escapeHtml(project.title) + ' 썸네일"' +
      ' width="280" height="158" loading="lazy"' +
      ' data-fallback="' + fallbackThumbnailUrl(project.videoId) + '">' +

      '<div class="project-body">' +
        '<div class="project-head">' +
          '<span class="project-no">' + padOrder(project.order) + '</span>' +
          '<h3 class="project-title">' + escapeHtml(project.title) + '</h3>' +
        '</div>' +
        '<p class="project-stack">' + escapeHtml(project.stack) + '</p>' +
        '<ul class="project-desc">' + descriptions + '</ul>' +
        '<div class="watch">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<circle cx="12" cy="12" r="9"></circle><path d="M10 8.5l6 3.5-6 3.5z"></path>' +
          '</svg>' +
          '<span>영상 보기</span>' +
        '</div>' +
      '</div>';

    // 플레이 가능한 프로젝트에만 버튼을 답니다.
    if (project.playUrl) {
      html +=
        '<div class="play-slot">' +
          '<a class="btn btn-accent" href="' + project.playUrl + '"' +
          ' target="_blank" rel="noopener noreferrer">' +
            '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<path d="M7 4.5l12 7.5-12 7.5z"></path>' +
            '</svg>' +
            '<span>플레이하기</span>' +
          '</a>' +
        '</div>';
    }

    card.innerHTML = html;

    // 큰 썸네일(maxresdefault)이 없는 영상이면 작은 쪽으로 바꿔 끼웁니다.
    // 둘 다 실패하면 깨진 이미지 아이콘 대신 빈 회색 박스만 남깁니다.
    var img = card.querySelector('.thumb');
    var triedFallback = false;

    img.addEventListener('error', function () {
      if (!triedFallback) {
        triedFallback = true;
        img.src = img.dataset.fallback;
        return;
      }
      img.removeAttribute('src');
      img.alt = '';
    });

    return card;
  }

  function renderProjects(projects) {
    listEl.innerHTML = '';
    projects
      .slice()
      .sort(function (a, b) { return a.order - b.order; })
      .forEach(function (project) {
        listEl.appendChild(createProjectCard(project));
      });
  }

  fetch('projects.json')
    .then(function (response) {
      if (!response.ok) { throw new Error('HTTP ' + response.status); }
      return response.json();
    })
    .then(renderProjects)
    .catch(function (error) {
      console.error('프로젝트 데이터를 불러오지 못했습니다:', error);
      listEl.innerHTML =
        '<p class="loading">프로젝트를 불러오지 못했습니다. 새로고침해 주세요.</p>';
    });

  /* ------------------------------------------------------------
     2. 연락하기 모달
     X 버튼 · 바깥 영역 클릭 · ESC 키로 닫힙니다.
     ------------------------------------------------------------ */

  var modal = document.getElementById('contactModal');
  var openBtn = document.getElementById('contactOpen');
  var closeBtn = document.getElementById('contactClose');
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';  // 뒤쪽 스크롤 잠금
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) { lastFocused.focus(); }
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  // 모달 바깥(어두운 배경)을 눌렀을 때만 닫습니다.
  // 모달 내부 클릭은 여기까지 올라오지 않도록 아래에서 막습니다.
  modal.addEventListener('click', function (event) {
    if (event.target === modal) { closeModal(); }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !modal.hidden) { closeModal(); }
  });
})();
