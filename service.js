const request = require('superagent');

module.exports = {
  getDinners: async () => {
    const url = 'http://www.amica.fi/modules/json/json/Index?costNumber=0812&language=fi';

    const req = request.get(url);

    try {
      const res = await req;
      const menus = res.body.MenusForDays[0].SetMenus[0];

      console.log(menus);
      return menus;
    } catch (err) {
      console.error(err);
    }
  },
};
