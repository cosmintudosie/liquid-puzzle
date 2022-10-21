const nav = document.querySelector("nav");
const mainContainer = document.querySelector(".main-container");
const elements = document.querySelectorAll(".element");
const pass = document.querySelector(".password");
const confirmPass = document.querySelector(".confirmPassword");
const email = document.querySelector(".userMail");
const authenticateBtn = document.querySelector(".authenticate");
const userMail = document.querySelector(".userMail");
const userPassword = document.querySelector(".userPassword");
const announce = document.querySelector(".announce");
const passType = document.querySelectorAll(".passType");
const check = document.querySelectorAll(".check");
const game = document.querySelector(".game");
const userPlaying = document.querySelector(".user-playing");
const score = document.querySelector(".score");

/// LINKS ACTIVITY/////
const emptyField = () =>
  elements.forEach((el) => el.classList.remove("active"));

nav.addEventListener("click", (ev) => {
  emptyField();
  //  elements.forEach((el) => el.classList.remove("active"));
  document.querySelector(`.${ev.target.id}`).classList.add("active");
});
///////SHOW/HIDE PASSWORD
const showPassword = (ev) => {
  let passField = ev.target.previousElementSibling;
  passField.type === "password"
    ? (passField.type = "text")
    : (passField.type = "password");
  ev.target.classList.toggle("fa-eye-slash");
};
check.forEach((el) => el.addEventListener("click", showPassword));

//////// VERIFY PASS CONFIRM/////
confirmPass.addEventListener("change", () => {
  if (confirmPass.value !== pass.value) {
    alert("Parola si parola confirmata nu sunt identice ");
    confirmPass.value = "";
  }
});
/////////// VERIFY USER AND PASSWORD
const passValidator = function () {
  let userCredentials = {
    userMail: userMail.value,
    userPassword: userPassword.value,
  };

  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userCredentials),
  };
  fetch(`http://localhost:5001/passCompare`, requestOptions)
    .then((response) => response.json())

    .then((res) => {
      console.log(res.msg);
      if (res.msg === "no-user") {
        alert("Adresa de mail invalida");
        return;
      }
      if (res.msg) {
        emptyField();
        // announce.classList.add("active");
        // announce.textContent = "WELCOME ON OUR SITE";
        mainContainer.style.display = "none";
        game.style.display = "flex";
        userPlaying.innerHTML = res.user;
        score.innerHTML = +res.score;
        console.log(res.user);
      } else {
        alert("Wrong password");
      }
    });
};
authenticateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  passValidator();
});

///////////GAME

let colors = ["red", "blue", "yellow", "green", "pink", "brown"];
const shelves = document.querySelectorAll(".shelf");
const glass = document.querySelectorAll(".glass");
const activeGlass = document.querySelectorAll(".active-glass");
const win = document.querySelector(".win");
const lose = document.querySelector(".lose");
const btnOK = document.querySelectorAll(".btn-ok");
// const levels = document.querySelector(".levels");
btnOK.forEach((btn) =>
  btn.addEventListener("click", () => {
    glass.forEach((gl) => {
      gl.classList = "glass not-full";
      gl.innerHTML = "";
    });

    playGame();
  })
);
// let levelInputs = document.querySelectorAll(".levels input");
const moves = document.querySelector(".moves");
// const score = document.querySelector(".score");
let totalColors = [...colors, ...colors, ...colors, ...colors];
// levels.addEventListener("click", (e) => {
//   levelInputs.forEach((lev) => (lev.checked = false));
//   e.target.checked = true;
//   if (e.target.id === "easy")
//     colors = ["red", "blue", "yellow", "green", "pink", "brown"];
//   if (e.target.id === "medium")
//     colors = [
//       "red",
//       "blue",
//       "yellow",
//       "green",
//       "pink",
//       "brown",
//       "aquamarine",
//       "pink"
//     ];
//   if (e.target.id === "hard")
//     colors = [
//       "red",
//       "blue",
//       "yellow",
//       "green",
//       "pink",
//       "brown",
//       "aquamarine",
//       "pink",
//       "orange",
//       "DarkMagenta"
//     ];
//   console.log(colors);
//   shelves.forEach((shelf) => {
//     shelf.innerHTML = "";
//     let individualGlass = `<div class="glass-container">
//       <div class="glass not-full"></div>
//     </div>`;
//     for (let i = 0; i < (colors.length + 2) / 2; i++)
//       shelf.innerHTML += individualGlass;
//   });
//   console.log(levelInputs);
//   console.log(e.target);
// });
// let check = [];
function playGame() {
  totalColors.forEach((el) => {
    glass.forEach((elem) => {
      if (elem.childElementCount > 2) {
        elem.classList.remove("not-full");
      }
    });
    let portion = document.createElement("div");
    portion.style.background = `${el}`;
    portion.classList.add("pcs");
    portion.dataset.color = `${el}`;
    const glassNotFull = document.querySelectorAll(".not-full");
    let randGlass = Math.floor(Math.random() * glassNotFull.length);

    glassNotFull[`${randGlass}`].append(portion);
  });

  /////////----SELECT GLASS TO EMPTY
  glass.forEach((el) => {
    el.onclick = async () => {
      const activeGlass = document.querySelector(".active-glass");

      //////-----SELECT GLASS TO FILL
      if (!el.classList.contains("active-glass") && activeGlass) {
        el.classList.add("glass-to-fill");
        if (moves.innerHTML < 2) lose.style.display = "block";
        moves.innerHTML -= 1;
        const glassToFill = document.querySelector(".glass-to-fill");

        if (
          !glassToFill.lastElementChild ||
          (activeGlass.lastElementChild.dataset.color ===
            glassToFill.lastElementChild.dataset.color &&
            glassToFill.childElementCount < 4)
        ) {
          let posTop = glassToFill.getBoundingClientRect().top;
          let posLeft = glassToFill.getBoundingClientRect().left;
          activeGlass.style.cssText = `
                                            position: absolute;
                                            top: ${posTop - 100}px;
                                            left: ${posLeft + 80}px;
                                            transform: rotate(-90deg)  ;
                                           `;

          /////CREATE PORING DIV
          let poringDiv = [
            activeGlass.childNodes[activeGlass.childElementCount - 1],
          ];

          if (
            activeGlass.childElementCount > 1 &&
            activeGlass.childNodes[activeGlass.childElementCount - 1].dataset
              .color ===
              activeGlass.childNodes[activeGlass.childElementCount - 2].dataset
                .color
          ) {
            poringDiv.push(
              activeGlass.childNodes[activeGlass.childElementCount - 2]
            );

            if (
              activeGlass.childElementCount > 2 &&
              activeGlass.childNodes[activeGlass.childElementCount - 1].dataset
                .color ===
                activeGlass.childNodes[activeGlass.childElementCount - 3]
                  .dataset.color
            ) {
              poringDiv.push(
                activeGlass.childNodes[activeGlass.childElementCount - 3]
              );
            }
          }
          /////////////////
          poringDiv.forEach((div) => {
            div.style.animation = "empty 1s";
            if (glassToFill.lastElementChild)
              glassToFill.lastElementChild.style.animation = "full 0.84s";
            setTimeout(() => (div.style.animation = ""), 840);

            setTimeout(() => {
              glassToFill.append(div);

              /////////////  PROBE

              if (
                glassToFill.childElementCount > 3 &&
                glassToFill.children[0].dataset.color ===
                  glassToFill.children[1].dataset.color &&
                glassToFill.children[1].dataset.color ===
                  glassToFill.children[2].dataset.color &&
                glassToFill.children[2].dataset.color ===
                  glassToFill.children[3].dataset.color
              )
                glassToFill.classList.add("full-glass");
              if (
                document.querySelectorAll(".full-glass").length ===
                colors.length
              ) {
                win.style.display = "block";
                score.innerHTML = +score.innerHTML + moves.innerHTML * 10;
                ////UPDATE SCORE
                const updateScore = function () {
                  // let dailyCheck = document.getElementById(`${item}`).checked;
                  // console.log(dailyCheck);
                  let itemToUpdate = {
                    updateItem: userPlaying.innerHTML,
                    value: score.innerHTML,
                  };
                  let requestOptions = {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(itemToUpdate),
                  };
                  console.log(itemToUpdate);
                  fetch(`/updateScore`, requestOptions);
                  // .then((response) => response.json());
                };
                updateScore();
              }

              ///////////////////
              setTimeout(() => {
                activeGlass.style.cssText = "";

                // console.log(check);
              }, 800);

              glass.forEach((el) => {
                el.classList.remove("active-glass");
                el.classList.remove("glass-to-fill");
              });
            }, 850);
          });
        }
      }

      if (el.classList.contains("active-glass"))
        el.classList.remove("active-glass");

      if (!el.classList.contains("active-glass") && !activeGlass)
        el.classList.add("active-glass");
    };
  });
}
playGame();
