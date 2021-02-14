// 카드의 data 정보를 데이터 베이스와 연동.
// CRUD 정의.
// Local json 서버와 연동.
// 서버리스 AWS와 연동.
export default class APIHandler {
  constructor() {}

  /**
   * 전체 카드 객체 리스트 반환. 없으면 NULL.
   * @return {null} null
   */
  async getCards() {
    return null;
  }

  /**
   * 카드 객체 생성/추가 후 ID 반환.
   * @param {Card} cardObj
   * @return {string} cardId
   */
  async postCard(cardObj) {
    return Math.round(Math.random() * 10000).toString();
  }

  /**
   * ID로 카드 검색 후 내용, 카테고리 수정.
   * @param {Card} cardObj
   */
  async putCard(cardObj) {}

  /**
   * ID로 카드 검색 후 삭제.
   * @param {string}} id
   */
  async deleteCard(id) {}
}
