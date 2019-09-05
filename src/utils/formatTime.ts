const formatConfig = function (dateObj: Date)
{
  return {
    "M+": dateObj.getMonth() + 1,                 // 月份 
    "d+": dateObj.getDate(),                    // 日 
    "h+": dateObj.getHours(),                   // 小时 
    "m+": dateObj.getMinutes(),                 // 分 
    "s+": dateObj.getSeconds(),                 // 秒 
    "q+": Math.floor((dateObj.getMonth() + 3) / 3), // 季度 
    "S": dateObj.getMilliseconds()             // 毫秒 
  }
};

export const format = function (fmt: string, dateNumber: string, locale: string)
{

  const dateTimer = formatUnixTime(dateNumber.toString());
  const dateObj = new Date(dateTimer);
  // 如果是英文
  if (locale === 'en')
  {
    const monthArray = new Array
      ("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    const month = dateObj.getUTCMonth();
    let day = dateObj.getUTCDate().toString();
    if (day.length === 1)
    {
      day = "0" + day;
    }
    let hour = dateObj.getUTCHours().toString();
    if (hour.length === 1)
    {
      hour = '0' + hour;
    }
    let minute = dateObj.getUTCMinutes().toString();
    if (minute.length === 1)
    {
      minute = '0' + minute;
    }
    let second = dateObj.getUTCSeconds().toString();
    if (second.length === 1)
    {
      second = '0' + second;
    }
    return day + " " + monthArray[month] + " " + dateObj.getUTCFullYear() + " " + hour + ":" + minute + ":" + second + " GMT";
  }

  const o = formatConfig(dateObj);
  if (/(y+)/.test(fmt))
  {
    fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (const k in o)
  {
    if (new RegExp("(" + k + ")").test(fmt))
    {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

export const formatUnixTime = (dateNumber: string | number) =>
{
  return dateNumber.toString().length === 10 ? parseInt(dateNumber.toString(), 10) * 1000 : parseInt(dateNumber.toString(), 10);
}
// 倒计时
export const onCountDown = () =>
{
  const date = new Date();
  const now = date.getTime();
  // 当天
  const today = new Date(date.setHours(0, 0, 0, 0));
  // 明天
  const tomorrow = today.setDate(today.getDate() + 1);
  const leftTime = tomorrow - now;

  let h = 0;
  let m = 0;
  let s = 0;
  if (leftTime >= 0)
  {
    // d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
    h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
    m = Math.floor(leftTime / 1000 / 60 % 60);
    s = Math.floor(leftTime / 1000 % 60);
  } else
  {
    return false ;
  }
  let hour = h.toString();
  if (hour.length === 1)
  {
    hour = '0' + hour;
  }
  let minute = m.toString();
  if (minute.length === 1)
  {
    minute = '0' + minute;
  }
  let second = s.toString();
  if (second.length === 1)
  {
    second = '0' + second;
  }  
  setTimeout(onCountDown, 1000);
  const str = hour+':'+minute+':'+second;
  return str;
}