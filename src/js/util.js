function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, (c) => {
      // eslint-disable-next-line one-var
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function LOG(msg) {
  window.devtools 
    ? window.devtools.isOpen 
      ? console.log(msg) 
      : null
    : null
}

module.exports = {
  uid: () => uuidv4().slice(32),
  LOG,
};
