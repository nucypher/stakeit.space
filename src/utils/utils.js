export const hexToBytes = hex => {
  hex = hex.toString(16)
  hex = hex.replace(/^0x/i, "")
  hex = hex.length % 2 ? "0" + hex : hex

  let bytes = []
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16))
  }
  return bytes
}

export const convertMS = milliseconds => {
  var day, hour, minute, seconds
  seconds = Math.floor(milliseconds / 1000)
  minute = Math.floor(seconds / 60)
  seconds = seconds % 60
  hour = Math.floor(minute / 60)
  minute = minute % 60
  day = Math.floor(hour / 24)
  hour = hour % 24
  return {
    day: day,
    hour: hour,
    minute: minute,
    seconds: seconds,
  }
}

export const convertMSMod = milliseconds => {
  var day, hour, minute, seconds
  seconds = Math.floor(milliseconds / 1000)
  minute = Math.floor(seconds / 60)
  seconds = seconds % 60
  hour = Math.floor(minute / 60)
  minute = minute % 60
  day = Math.floor(hour / 24)
  hour = hour % 24
  let res = {
    day: day ? `${day} days ` : '',
    hour: `${hour} hrs `,

    minute: day ? '' : `${minute} mins`,
  }
  return res.day + res.hour + res.minute
}

export const substakeObjectCreator = object => {
  let currentDate = Date.now();
  let endDate = new Date(object.lastPeriod * 86400000);
  return {
    value: (object.lockedValue / 10 ** 18).toLocaleString("en-Us"),
    startDay: new Date(object.firstPeriod * 86400000).toUTCString().slice(0, 11),
    startYear: new Date(object.firstPeriod * 86400000).toDateString().slice(-4),
    currentDate: currentDate / 86400000,
    endDay: endDate < currentDate ? "Unlocked": endDate.toUTCString().slice(0, 11),
    endYear: new Date(object.lastPeriod * 86400000).toDateString().slice(-4),
    isActive: endDate > currentDate
  }
}
