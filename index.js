//#region 모듈 초기화 부분 정의

// dom (html 문서)를 조작하는 부분.
// control들을 조작하고 animating?
// API 호출.
// API 객체 init? file load?
import APIHandler from "./api.js";
// 인스턴스 생성.
const API = new APIHandler();

//#endregion

//#region 카드 클래스 정의

class Card {
  constructor(cardElement, title, id, category) {
    this.cardElement = cardElement;
    this.title = title;
    this.id = id;
    this.category = category;
  }
}

//#endregion

//#region api.js CRUD

// delete를 제외하고 async를 적용하는 이유는.
// 삭제된 데이터는 따로 기다릴 필요없이 제거하면 되기 때문인가?

/**
 * 기존 카드들 불러오기.
 */
const getCards = async () => {
  // 카드 데이터를 가져오는 부분
  let cards = await API.getCards();
  // undefined가 아니고 cards 객체가 존재한다면.
  if (cards && cards.length > 0) {
    // 객체를 생성.
    let cardObj = new Card(null, card.title, card.id, card.category);
    // TODO : 실제로 html 문서의 엘리먼트에 변화를 준다. [ html 문서(dom)의 변화 ]
    cardFactory(cardObj);
  }
};

/**
 * 카드 등록.
 * @param {Card} cardObj
 */
const registerCard = async (cardObj) => {
  let cardId = await API.postCard(cardObj);
  cardObj.cardElement.id = "card-id-" + cardId;
};

/**
 * 카드 업데이트.
 * @param {Card} cardObj
 */
const updateCard = async (cardObj) => {
  await API.putCard(cardObj);
};

/**
 * 카드 삭제.
 * @param {*} event
 */
const deleteCard = (event) => {
  let cardElement = event.target.parentNode;
  let id = cardElement.id.replace("card-id-", "");
  API.deleteCard(id);
  cardElement.remove();
};

//#endregion

//#region Method

/**
 * 전체 카드 카테고리 요소 반환.
 */
const getCardContainers = () => {
  return document.querySelectorAll(".card-container");
};

/**
 * 카드 요소에서 카드 객체 반환.
 * @param {*} cardElement
 */
const getCardInfo = (cardElement) => {
  new Card(
    cardElement,
    cardElement.children[1].value,
    cardElement.id.replace("card-id-", ""),
    cardElement.parentNode.parentNode.getAttribute("data-card-category")
  );
};

/**
 * 카드 드래그 앤 드랍 시작 이벤트.
 * @param {*} event
 */
const ondragstart = (event) => {
  // 선택된 요소의 카테고리 타입.
  let currentColumnType = event.target.parentNode.parentNode.getAttribute(
    "data-card-category"
  );
  // 이동가능 영역을 표시하기 위해.
  getCardContainers().forEach((element) => {
    let cType = element.parentNode.getAttribute("data-card-category");
    if (cType !== currentColumnType) {
      element.classList.add("hoverable");
    }
  });
  // 카테고리 이름 & 카드 ID 저장.
  event.dataTransfer.setData("columnType", currentColumnType);
  event.dataTransfer.setDAta("cardID", event.target.id);
};

/**
 * 카드 온 드랍 이벤트. 카테고리 이동.
 * @param {*} event
 */
const cardOnDrop = (event) => {
  event.target.classList.remove("hover");
  let from = event.dataTransfer.getData("columnType");
  let to = event.target.parentNode.getAttribute("data-card-category");
  let id = event.dataTransfer.getData("cardID");
  let card = document.getElementById(id);
  if (from && to && card && from !== to) {
    event.target.appendChild(card);
    updateCard(getCardInfo(card));
  }
};

/**
 * 카드 드래그 앤 드랍 종료 이벤트.
 * 이동가능 영역 표시 CSS class 제거.
 * @param {*} evnet
 */
const ondragend = (evnet) => {
  getCardContainers().forEach((element) => {
    element.classList.remove("hoverable");
  });
};

/**
 * 카드 생성/업데이트.
 * @param {*} event
 */
const onChangeCard = (event) => {
  title = event.target.value.trim();
  let cardElement = event.target.parentNode;
  let cardObj = getCardInfo(cardElement);
  if (title.length > 0 && cardElement.id === "") {
    registerCard(cardObj);
  } else if (title.length > 0 && cardElement.id !== "") {
    updateCard(cardObj);
  } else {
    // 입력된 내용이 없으면 카드 생성 취소/
    card.remove();
  }
};

const createCard = (event) => {
  let category = event.target.parentNode.getAttribute("data-card-category");
  let cardObj = new Card(null, null, null, category);
  cardFactory(cardObj);
};

/**
 * 기존/신규 카드 요소 생성.
 * ondragstart - 카드 엘리먼트 드래그 시작.
 * ondragend - 카드 엘리먼트 드래그 종료.
 * onchange - 카드 내용 변경시 트리거
 * onclick - x 버튼 클릭시 삭제 트리거.
 * @param {Card} cardObj
 */
const cardFactory = (cardObj) => {
  let cardElement = document.createElement("div");
  cardElement.className = "card";
  // element eventListner 연결.
  cardElement.ondragstart = ondragstart;
  cardElement.ondragend = ondragend;
  cardElement.setAttribute("dragable", true);

  if (cardObj.id) {
    cardElement.id = "card-id-" + cardObj.id;
  }
  let title = document.createElement("textarea");
  title.setAttribute("rows", 3);
  title.setAttribute("cols", 1);
  title.setAttribute("name", "title");
  title.className = "card-title";
  // element eventListner 연결.
  title.onchange = onChangeCard;

  if (cardObj.title) {
    title.value = cardObj.title;
  }
  // 카드의 삭제 버튼.
  let del = document.createElement("div");
  del.innerHTML = "x";
  del.className = "card-delete";
  del.onclick = deleteCard;

  cardElement.appendChild(del);
  cardElement.appendChild(title);
  // 생성된 카드 엘리먼트를 추가할 카테고리 섹션.

  let cardContainer = document
    .querySelectorAll(`[data-card-category='${cardObj.category}']`)[0]
    .querySelector(".card-container");
  cardContainer.appendChild(cardElement);

  title.focus();
};

//#endregion

// Onload 무슨 함수의 약식인지.
(() => {
  window.createCard = createCard; // static func 생성?
  // 카테고리별 카드 컨테이너 이벤트 연결.
  getCardContainers().forEach((element) => {
    element.ondragenter = (event) => {
      event.target.classList.add("hover");
    };
    element.ondragleave = (event) => {
      event.target.classList.remove("hover");
    };
    element.ondragover = (event) => {
      event.preventDefault();
      element.ondrop = cardOnDrop;
    };
  });
  getCards();
})();
