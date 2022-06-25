const $ = document.querySelector.bind(document);
const progress = document.getElementById("loan");
const output = document.querySelector(".loan-percent-item");
const progressRate = document.querySelector(".progress-rate");
const progressTime = document.querySelector(".progress-time");
const inputPrice = document.querySelector(".loan-price");
const inputMoney = document.querySelector(".loan-money");
const rate = document.getElementById("rate");
const time = document.getElementById("time");
// ____________________________________________________
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
     let inputMoneyFormat = parseInt(loanAPercent * progress.value);
     inputMoney.value = inputMoneyFormat
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, "$&,")
          .replaceAll(".000", "");
};
inputMoney.oninput = () => {
     inputMoney.value = formatNumber(inputMoney.value);
     let a = (
          ((inputMoney.value.replaceAll(",", "") * 1) /
               inputPrice.value.replaceAll(",", "")) *
          1 *
          100
     ).toFixed(1);
     if (a <= 50) {
          progress.value = a;
          output.innerText = a.replace(".0", "") + "%";
     } else {
          inputMoney.value = inputPrice.value;
          output.innerText = 50 + "%";
          progress.value = 50;
     }
};
rate.oninput = () => {
     progressRate.value = rate.value;
};
time.oninput = () => {
     progressTime.value = time.value;
};
function formatNumber(n) {
     // format number 1000000 to 1,234,567
     return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(".loan-btn").addEventListener("click", () => {
     const rateN = progressRate.value / 12;
     const inputMoneyN = inputMoney.value.replaceAll(",", "") * 1;
     const timeN = progressTime.value.replaceAll(",", "") * 1;
     const inputPriceN = inputPrice.value.replaceAll(",", "") * 1;
     const prepay = inputPriceN - inputMoneyN;
     const handleFormat = (a) => {
          return a
               .toFixed()
               .replace(/\D/g, "")
               .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
               .replace(".00", "");
     };
     const firstMonth =
          inputMoneyN / timeN +
          (inputMoneyN - (inputMoneyN / timeN) * 0) * (rateN / 100);
     const lastMonth =
          inputMoneyN / timeN +
          (inputMoneyN - (inputMoneyN / timeN) * (timeN - 1)) * (rateN / 100);
     if (rateN > 0 && inputMoneyN > 0 && timeN > 0 && inputPriceN > 0) {
          $(".loan-table").style.display = "block";
          $(".loan-information").style.display = "flex";
          const tbody = document.querySelector("tbody");
          tbody.innerHTML = "";
          let sumRate = 0;
          let loanAll = 0;
          for (let index = 1; index < timeN + 1; index++) {
               let goc = inputMoneyN - (inputMoneyN / timeN) * index;
               let lai =
                    (inputMoneyN - (inputMoneyN / timeN) * (index - 1)) *
                    (rateN / 100);
               let gop = inputMoneyN / timeN + lai;
               sumRate += lai;
               loanAll += gop;
               let tbodyHTML = `<tr>
               <th>Tháng thứ ${index}</th>
               <th>${handleFormat(goc)}</th>
               <th>${handleFormat(inputMoneyN / timeN)}</th>
               <th>${handleFormat(lai)}</th>
               <th>${handleFormat(gop)}</th>
          </tr>`;
               if (timeN < 1) return;
               tbody.innerHTML += tbodyHTML;
          }
          /*Tổng lãi */ $(".loan-rate-sum").innerHTML = handleFormat(sumRate) + " đ";
          $(".loan-rateall").innerHTML = $(".loan-rate-sum").innerHTML;
          /* Tổng trả */ $(".loan-all").innerHTML = handleFormat(loanAll) + " đ";
          /* Trả trước */ $(".loan-prepay").innerHTML =
               ` (${100 - progress.value * 1})%       ` +
               handleFormat(prepay) +
               " đ";
          $(".loan-pay").innerHTML = handleFormat(loanAll + prepay) + " đ";
          $(".loan-firstmonth").innerHTML = handleFormat(firstMonth) + " đ";
          $(".loan-lastmonth").innerHTML = handleFormat(lastMonth) + " đ";
     } else {
          alert("Vui lòng nhập đủ thông tin dự toán");
     }
});
