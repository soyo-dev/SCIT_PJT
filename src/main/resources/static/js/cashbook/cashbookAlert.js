$(document).ready(function() {
  getPilsuAlert();
});


//////////////////////////////////////////////////////////

/** 필수알림 */
function getPilsuAlert() {
  let curYear = $('#curYear').val();
  let curMonth = $('#curMonth').val();
  let curDate = $('#curDate').val();
  let curDateTime = $('#curDateTime').val();
  let budgetExist = 0;

  // 예산 있없? 확인
  $.ajax({
      url: '/secretary/cashbook/budgetExist',
      type: 'GET',
      data: { curYear: curYear, curMonth: curMonth },
      dataType: 'text',
      success: (result) => {
          if(result == 1) {
              budgetExist = 1;
          }
      },
      error: (e) => {
          alert('알림 출력 직전 예산 있없 조회 실패');
          console.log(JSON.stringify(e));
      }
  });

  // 목록 가져오기
  $.ajax({
    url: '/secretary/cashbook/alert/getPilsuAlert',
    type: 'POST',
    data: { curDateTime: curDateTime, curYear: curYear, curMonth: curMonth, curDate: curDate },
    dataType: 'JSON',
    success: function(data) {
    console.log("data: " + JSON.stringify(data));

    let html = "";
    
    // 예산 없을 때 알림
    if(budgetExist == 0) {
      html += `<br><small class="text-light fw-semibold">${curYear}-${curMonth}-${curDate}</small>`;
      html += `
          <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
              <a href="javascript:openSetBudgetModal()">
                <div>
                  ${curMonth}월 예산이 설정되지 않았습니다. 여기를 클릭하면 예산을 설정할 수 있어요.
                </div>
              </a>
          </div>
          `;
    }

    // 알림을 alertDateYmd 기준으로 그룹화
    let groupedByDate = {};
    // 자동이체 
    data.forEach(alert => {
      if (!groupedByDate[alert.alertDateYmd]) {
          groupedByDate[alert.alertDateYmd] = [];
      }
      groupedByDate[alert.alertDateYmd].push(alert);
    });


    console.log("groupedByDate: " + JSON.stringify(groupedByDate));

    // 그룹별 키워드
    // 지출
    // 정기결제
    let keywords1 = ["카드", "구독", "정기", "결제", "납부"];
    // 명절
    let keywords2 = ["명절", "설날", "추석"];
    // 경사
    let keywords3 = ["생일", "생신", "결혼", "백일", "돌잔치", "환갑", "칠순", "팔순", "구순", "파티"]
    // 조사 
    let keywords4 = ["기일", "장례"];
    
    // 수입
    let keywords5 = ["월급", "급여", "주급"];

    // 그룹화된 데이터를 기반으로 HTML 생성
    for (let date in groupedByDate) {
      html += `<br><small class="text-light fw-semibold">${date}</small>`;
      // 가져온 데이터 분기
      groupedByDate[date].forEach(alert => {
        html += `
        <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
        <a href="javascript:openDetailModal(${alert.alertId});">
          <div>
        `;

          // 정기결제
          if (keywords1.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
              ${alert.alertDateMonth}월 ${alert.alertDateDay}일은 ${alert.alertContent}입니다. 연결된 계좌의 잔고를 확인하세요.
            `;
          } 
          // 명절
          else if (keywords2.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
            ${alert.alertDateMonth}월 ${alert.alertDateDay}일은 ${alert.alertContent}입니다. 예산을 확인하세요.
            `;
          } 
          // 경사
          else if (keywords3.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
            ${alert.alertDateMonth}월 ${alert.alertDateDay}일은 대망의 ${alert.alertContent}입니다. 선물을 준비할 예산을 챙겨두세요.
            `;
          } 
          // 조사
          else if (keywords4.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
            ${alert.alertDateMonth}월 ${alert.alertDateDay}일은 ${alert.alertContent}입니다. 성의 표현을 위해 예산을 확인하세요.
          `;
          }
          // 월급
          else if (keywords5.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
            ${alert.alertDateMonth}월 ${alert.alertDateDay}일은 기다리던 ${alert.alertContent}입니다! 야호! 이번 달은 알차게 써보자고요.
          `;
          }

          html += `
          </div>
            </a>
            <i class="bx bx-x" style="cursor: pointer;" onclick="deleteAlert(${alert.alertId});"></i>
          </div>
          `; 

          console.log("이 알림의 번호는 " + alert.alertId);
        });

      }

      $('#AlertListDiv').html(html);
    },
    error: (e) => {
        alert('가계부 필수알림 목록 전송 실패');
    }
  });
}


////////////////////////////////////////////////////////////////////////////////////////////////

/** 알림 삭제 */
function deleteAlert(alertId) {
  console.log("삭제할 알림 번호:" + alertId);

  $.ajax({
    url: '/secretary/cashbook/alert/deleteAlert',
    type: 'POST',
    data: { alertId: alertId },
    success: () => {
      getPilsuAlert();
    },
    error: (e) => {
      alert("알림 삭제 서버 전송 실패");
      console.log(JSON.stringify(e));
    }
  });
}