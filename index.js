const $ = document.querySelector.bind(document);
const progress = document.getElementById("loan");
const output = document.querySelector(".loan-percent-item");
const progressRate = document.querySelector(".progress-rate");
const progressTime = document.querySelector(".progress-time");
const inputPrice = document.querySelector(".loan-price");
const inputMoney = document.querySelector(".loan-money");
const rate = document.getElementById("rate");
const time = document.getElementById("time");
// __________________________Format Input Value_________________________
let loanAPercent = 0;
inputPrice.oninput = () => {
     inputPrice.value = formatNumber(inputPrice.value);
     inputMoney.value = 0;
     loanAPercent = +inputPrice.value.replaceAll(",", "") / 100;
     return loanAPercent;
};
progressRate.oninput = () => {
     if (progressRate.value.replaceAll(",", "") * 1 > 100) {
          return (progressRate.value = 0);
     }
     rate.value = progressRate.value;
};
progressTime.oninput = () => {
     time.value = progressTime.value;
     if (progressTime.value.replaceAll(",", "") * 1 > 500) {
          return (progressTime.value = 0);
     }
};
output.innerText = loan.value + "%";
progress.oninput = () => {
     output.innerText = progress.value + "%";
     inputMoney.value = handleFormat(loanAPercent * progress.value);
};
inputMoney.oninput = () => {
     inputMoney.value = formatNumber(inputMoney.value);
     let a = (
          ((inputMoney.value.replaceAll(",", "") * 1) /
               inputPrice.value.replaceAll(",", "")) *
          1 *
          100
     ).toFixed(1);
     if (a <= 100) {
          progress.value = a;
          output.innerText = a.replace(".0", "") + "%";
     } else {
          inputMoney.value = inputPrice.value;
          output.innerText = 100 + "%";
          progress.value = 100;
     }
};
progressRate.value = rate.value;
rate.oninput = () => {
     progressRate.value = rate.value;
};
time.oninput = () => {
     progressTime.value = time.value;
};
const handleFormat = (a) => {
     return a
          .toFixed()
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const formatNumber = (n) => {
     return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
// __________________________Math On CLICK _________________________
$(".loan-btn").addEventListener("click", () => {
     const rateN = progressRate.value / 12;
     const inputMoneyN = inputMoney.value.replaceAll(",", "") * 1;
     const timeN = progressTime.value.replaceAll(",", "") * 1;
     const inputPriceN = inputPrice.value.replaceAll(",", "") * 1;
     const prepay = inputPriceN - inputMoneyN;
     const firstMonth =
          inputMoneyN / timeN +
          (inputMoneyN - (inputMoneyN / timeN) * 0) * (rateN / 100);
     const lastMonth =
          inputMoneyN / timeN +
          (inputMoneyN - (inputMoneyN / timeN) * (timeN - 1)) * (rateN / 100);
     if (rateN > 0 && inputMoneyN > 0 && timeN > 0 && inputPriceN > 0) {
          let tableResults = "";
          $(".loan-table").style.display = "block";
          $(".loan-information").style.display = "flex";
          const tbody = document.querySelector("tbody");
          tbody.innerHTML = "";
          let sumRate = (gop = loanAll = goc = lai = 0);
          let tbodyHTML = "";
          for (let index = 1; index < timeN + 1; index++) {
               goc = inputMoneyN - (inputMoneyN / timeN) * index;
               lai =
                    (inputMoneyN - (inputMoneyN / timeN) * (index - 1)) *
                    (rateN / 100);
               gop = inputMoneyN / timeN + lai;
               sumRate += lai;
               loanAll += gop;
               tbodyHTML = `<tr>
               <th>Tháng thứ ${index}</th>
               <th>${handleFormat(goc)}</th>
               <th>${handleFormat(inputMoneyN / timeN)}</th>
               <th>${handleFormat(lai)}</th>
               <th>${handleFormat(gop)}</th>
                      </tr>`;
               tableResults += tbodyHTML;
          }
          tbody.innerHTML = tableResults;
          /*Tổng lãi */ $(".loan-rateall").innerHTML = $(
               ".loan-rate-sum",
          ).innerHTML = handleFormat(sumRate) + " đ̲";
          /* Tổng trả */ $(".loan-all").innerHTML = handleFormat(loanAll) + " đ̲";
          /* Trả trước */ $(".loan-prepay").innerHTML =
               ` (${100 - progress.value * 1}%)       ` +
               handleFormat(prepay) +
               " đ̲";
          $(".loan-pay").innerHTML = handleFormat(loanAll + prepay) + " đ̲";
          $(".loan-firstmonth").innerHTML = handleFormat(firstMonth) + " đ̲";
          $(".loan-lastmonth").innerHTML = handleFormat(lastMonth) + " đ̲";
     } else {
          alert("Vui lòng nhập đủ thông tin dự toán");
     }
});
