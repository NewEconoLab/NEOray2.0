// 引入出index.js之外的全部文件
declare var require: any
const context:any = require.context('./', false, /\.ts$/);
const keys:any = context.keys().filter((item:any) => item !== './index.ts');

const store = {};

keys.map((item:any) => {
  const attr = item.match(/([^\/]+)\.ts$/)[1];
  store[attr.toLocaleLowerCase()] = context(item).default;
});


// 各个子模块
const moduleContext = require.context('../containers', true, /\.store.ts$/);

const moduleKeys = moduleContext.keys();

moduleKeys.map((item:any) => {
  const attr = item.match(/([^\/]+)\.store\.ts$/)[1];
  store[attr.toLocaleLowerCase()] = moduleContext(item).default;
});
export default store;
