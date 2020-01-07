export function ascii2hex(str: string) {
  let hex = '';
  for (let char of str) {
    let res = char.charCodeAt(0).toString(16);
    hex += res == '0' ? '00' : res;
  }
  return hex.toUpperCase();
}

export function hex2ascii(hex: string) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

export function hex2dec(hex:string) {
  return parseInt(hex, 16);
}

export function dec2hex(dec: number) {
  let hex = dec.toString(16).toUpperCase();
  if (hex.length % 2 == 1) return '0' + hex;
  else return hex;
}

export function lenPad(len: number) {
  return len % 2 == 0 ? '00' : '0000';
}

export function replaceAt(str: string, rep: string, index: number) {
  let arr = str.split('');
  for (let i = 0; i < rep.length; i++) {
    arr[index + i] = rep[i];
  }
  return arr.join('');
}